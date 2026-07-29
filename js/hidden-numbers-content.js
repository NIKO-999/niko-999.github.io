'use strict';

/**
 * Destiny Matrix — Hidden Passion, Subconscious Self / Karmic Lessons,
 * Cornerstone & Capstone
 * ─────────────────────────────────────────────────────────────
 * Name-based numerology, round 2 — still requires the same optional name
 * input as Expression/Soul Urge/Personality/Maturity (js/name-numbers-
 * content.js), but built from letter FREQUENCY and PRESENCE rather than
 * sums. See js/matrix-engine.js's hiddenPassionNumber()/
 * subconsciousSelfAndLessons()/cornerstoneNumber()/capstoneNumber().
 *
 *   Hidden Passion   — the digit whose letters repeat most often in the
 *                       full name (1-9). A natural talent, possibly
 *                       under-used precisely because it's so automatic.
 *   Subconscious Self — how many of the 9 digits are present at all in the
 *                       name (1-9 itself). Read as resourcefulness/
 *                       self-confidence under real pressure.
 *   Karmic Lessons    — the digits NOT present at all. Read as areas still
 *                       being developed, not natural strengths. A person
 *                       can have zero, one, or several — the card renders
 *                       whichever apply, live, from DestinyMatrix-v1.html.
 *   Cornerstone       — first letter of the first name (1-9). How you
 *                       approach new opportunities and beginnings.
 *   Capstone          — last letter of the last name (1-9). How you
 *                       follow through and finish what you start.
 *
 * All content originally composed, full depth (matching the Life Path/
 * Numerology-section density), rendered under this app's Numerology
 * subheading scheme (THE CORE VIBRATION / HOW IT LIVES IN YOU / THE
 * SHADOW SIDE / THE OPENING) — Karmic Lessons entries are shorter by
 * design since several can appear together in one card.
 *
 * Deliberately varied openings/metaphors per entry (not a repeated
 * template with the noun swapped) — see the 2026-07-29 revision note in
 * research/11-Research-Updates for why this file was rewritten once
 * already: the first pass leaned on the same sentence structure across
 * every entry within each set, which read as templated rather than
 * personalized on a close read.
 *
 * API:
 *   DHiddenPassionContent.get(num)   -> { heading, why, traits, shadow, path } or null
 *   DSubconsciousSelfContent.get(num)-> { heading, why, traits, shadow, path } or null
 *   DKarmicLessonContent.get(num)    -> { heading, text } or null (short, list-item form)
 *   DCornerstoneContent.get(num)     -> { heading, why, traits, shadow, path } or null
 *   DCapstoneContent.get(num)        -> { heading, why, traits, shadow, path } or null
 */

window.DHiddenPassionContent = (function () {
  const data = {
    1: {
      heading: `Hidden Passion 1 — A Leadership You Keep Underselling`,
      why: `Count every letter in your name against its number, and one digit outnumbers all the others — not a choice you made, just the shape your own name happens to take. For you, it's the leadership number, showing up again and again in the raw material of your identity. You go first. You have for as long as you can remember, so consistently that it stopped registering as a trait somewhere along the way and just became the water you swim in.`,
      traits: `You step into a leadership role before anyone's assigned it to you, often without noticing you've done it. Starting something new rarely triggers the hesitation it triggers in other people. Ask you to describe your strengths and this one probably won't make the list — not because it isn't real, but because it's never once felt like effort.`,
      shadow: `A gift this automatic tends to stop growing. You coast on raw instinct instead of sharpening it, because nothing has ever forced you to work at it — and a real talent left entirely untrained eventually plateaus below what it could have been.`,
      path: `Try naming one place this week where you led and quietly wrote it off as nothing. You are allowed to take credit for what comes easily. What has "it's just what I do" been talking you out of noticing?`,
    },
    2: {
      heading: `Hidden Passion 2 — A Diplomacy You Keep Underselling`,
      why: `Tally the letters in your name against their number values and one digit dominates the count, unchosen, simply the way your own name is built. Yours is the number of tact and sensitivity — the ability to feel the tension in a room before anyone's named it, and defuse it before it becomes a problem. It's been with you long enough that you've likely stopped clocking it as a skill at all.`,
      traits: `People say things to you they wouldn't say to anyone else in the room, and you rarely register why. Conflict between two other people tends to resolve faster when you're simply present for it. You'd probably rate your own perceptiveness as ordinary — everyone else would rate it as rare.`,
      shadow: `Something this instinctive is easy to leave undeveloped. You lean on raw sensitivity instead of sharpening it further, and a gift running purely on autopilot eventually stalls out below what deliberate practice could have made of it.`,
      path: `Try noticing this week one moment where your read on a room was the actual reason things went smoothly. You are allowed to call that a skill, not luck. Where has this sensitivity been doing real work with zero credit attached?`,
    },
    3: {
      heading: `Hidden Passion 3 — A Creative Voice You Keep Underselling`,
      why: `Add up your name's letters by number and one digit wins by a wide margin, not by design, just by the accident of how your own name is spelled. Yours belongs to expression — words, humor, the specific gift of making a moment more alive simply by being in it. Because it's arrived effortlessly your whole life, it's easy to file it under personality instead of talent.`,
      traits: `A room tends to loosen up once you start talking, and you rarely clock the shift as something you caused. Making people laugh or feel something happens for you without a run-up. What you'd call "just messing around" is, more often than you think, actual craft.`,
      shadow: `A talent this effortless rarely gets developed on purpose. It stays a party trick instead of becoming a real practice, because putting in structured work has never once felt necessary to make it work.`,
      path: `Try treating one piece of creative output this week like it actually matters, not like a throwaway. You are allowed to take something seriously precisely because it's easy for you. What have you been calling "just for fun" that's actually good enough to build on?`,
    },
    4: {
      heading: `Hidden Passion 4 — A Discipline You Keep Underselling`,
      why: `Sum the letters of your name against their number values and one digit clearly leads — an accident of spelling, not a decision. Yours is the number of structure: the ability to sustain unglamorous, patient effort for as long as it actually takes, in a way most people find genuinely difficult and you've never once had to fight for.`,
      traits: `Routines and commitments hold for you in a way they don't for most people around you. A long, tedious stretch of work rarely wears you down the way it wears down everyone else. You've probably never described yourself as disciplined, because discipline has never once felt like willpower to you — it's just default behavior.`,
      shadow: `A capability this automatic rarely gets aimed anywhere on purpose. It runs quietly in the background instead of being pointed at something that would actually reward this much sustained attention.`,
      path: `Try picking one goal this week that actually deserves the steadiness you already have. You are allowed to take your own reliability seriously enough to direct it. Where has this strength been running on nothing in particular?`,
    },
    5: {
      heading: `Hidden Passion 5 — An Adaptability You Keep Underselling`,
      why: `Count the letters in your name by number and one digit clearly wins — the by-product of how your name happens to be spelled, not a choice. Yours belongs to change: an ease with the unfamiliar that most people spend years trying to build, and that's simply been available to you since before you thought to name it.`,
      traits: `New situations rarely rattle you the way they rattle the people around you. Uncertainty registers as interesting more often than it registers as threatening. You'd probably chalk this up to luck or temperament — it's neither. It's a real, developable skill running quietly on autopilot.`,
      shadow: `Ease this consistent rarely gets refined further. It gets treated as personality rather than as something worth deliberately sharpening, and a skill left on autopilot stalls exactly where it started.`,
      path: `Try naming one recent moment where your own adaptability quietly saved a situation. You are allowed to call that skill, not chance. Where has this flexibility been going entirely unacknowledged?`,
    },
    6: {
      heading: `Hidden Passion 6 — A Devotion You Keep Underselling`,
      why: `Tally your name's letters against their numbers and one digit clearly dominates — not chosen, just how your name happens to be built. Yours is the number of care: an instinct for noticing what a person or a space actually needs, strong enough that it's been running in the background of your life for so long it barely registers as a gift anymore.`,
      traits: `You notice what needs tending before anyone's had to ask. Looking after people takes less conscious effort from you than it visibly takes from almost everyone else. You'd probably call this "just how I am" — it's rarer than that framing gives it credit for.`,
      shadow: `A gift this automatic tends to stay reactive instead of becoming something you consciously direct — real devotion, running on autopilot, doing good work that nobody, including you, is deliberately shaping.`,
      path: `Try naming one moment this week where your care for someone was quietly the actual reason things went well. You are allowed to take credit for something that feels effortless. Where has this devotion been invisible, even to you?`,
    },
    7: {
      heading: `Hidden Passion 7 — An Insight You Keep Underselling`,
      why: `Add the letters of your name by number and one digit clearly leads — an accident of spelling, not intention. Yours belongs to depth: a mind that keeps going past the point where most people accept the first plausible explanation, running so automatically you likely stopped noticing it as a skill a long time ago.`,
      traits: `You reach real understanding of complicated things faster than most people you know, and rarely register the speed as unusual. Surface-level answers leave you visibly unsatisfied in a way they don't for most people. You'd probably describe this as "just how your brain works" — which is exactly why it's easy to undersell.`,
      shadow: `Understanding this automatic tends to stay entirely private, kept to yourself rather than offered to anyone who could actually use it — real insight sitting unused because sharing it has never once felt necessary.`,
      path: `Try sharing one piece of understanding this week that you'd normally keep to yourself. You are allowed to treat this depth as worth offering, not just having. What have you figured out that's actually ready to be said out loud?`,
    },
    8: {
      heading: `Hidden Passion 8 — An Executive Capacity You Keep Underselling`,
      why: `Count your name's letters against their numbers and one digit clearly wins out — a fact of spelling, not intention. Yours is the number of execution: the ability to turn ambition into something real and finished, carried so automatically that you've likely never had to think of it as a skill at all.`,
      traits: `Responsibility lands on you and you handle it without the visible strain it costs most people. Following an ambitious plan all the way through rarely intimidates you the way it intimidates others. You'd probably describe this as "just getting things done" — which undersells exactly how rare it is.`,
      shadow: `A capability this automatic rarely gets pointed at anything that matches its actual scale. It gets spent on small, safe tasks instead of the genuinely ambitious ones it was actually built for.`,
      path: `Try aiming this capacity at one real, ambitious goal this week instead of a comfortable one. You are allowed to take your own competence seriously enough to use it fully. Where has this strength been quietly wasted on tasks too small for it?`,
    },
    9: {
      heading: `Hidden Passion 9 — A Compassion You Keep Underselling`,
      why: `Sum the letters in your name against their numbers and one digit clearly dominates — a fact of spelling, not a choice. Yours belongs to broad compassion: real feeling for people well outside your own immediate circle, running so naturally in the background that it likely reads to you as temperament rather than as the genuine gift it actually is.`,
      traits: `You feel for people you've never met more readily than most people manage. Causes larger than your own life tend to move you in a way that surprises people who don't know you well. You'd probably call this "just how you're wired" — which is precisely why it's easy to leave undeveloped.`,
      shadow: `Compassion this automatic tends to stay diffuse — felt widely, acted on rarely, because it's never been aimed at something specific enough to actually build.`,
      path: `Try directing this compassion at one concrete action this week instead of a general feeling. You are allowed to take this gift seriously enough to actually use it. What cause or person have you been feeling for without ever doing anything about it?`,
    },
  };
  function get(num) { return data[num] || null; }
  return { get };
})();

window.DSubconsciousSelfContent = (function () {
  const data = {
    1: {
      heading: `Subconscious Self 1 — A Narrow but Sharp Toolkit`,
      why: `This card measures something none of the others in this app do — not what you want or how you appear, but how many of the nine base numbers actually show up anywhere in your name at all. A low count like yours means the toolkit is small but real: a handful of instincts you can trust completely, and comparatively little backup once a situation steps outside them.`,
      traits: `In the territory you know, your decisiveness is genuinely striking — no hesitation, no second-guessing. Step outside that territory, though, and the confidence thins out fast, sometimes faster than you'd expect from yourself.`,
      shadow: `The danger of a small toolkit is being caught flat-footed the moment a situation asks for an instinct you simply never developed — composure that's real, but only within a fairly narrow radius.`,
      path: `Try naming, honestly, the specific kind of pressure that reliably catches you off guard. You are allowed to have a narrow kit and still build it out on purpose. Which instinct, added deliberately, would change the most for you?`,
    },
    2: {
      heading: `Subconscious Self 2 — A Compact but Real Toolkit`,
      why: `This card measures how many of the nine base numbers show up anywhere in your name at all — not what you want, not how you act, just what's actually present. Your count sits on the lower side, which leaves you with a compact set of instincts: enough to move through most ordinary days without trouble, thinner right at the edges of the unfamiliar.`,
      traits: `Routine pressure rarely throws you. It's the genuinely novel situation — the one with no precedent in your own experience — that finds the seams in your composure faster than it would for someone carrying a wider range.`,
      shadow: `A kit this size runs out of options exactly where the unfamiliar begins, and that edge tends to arrive sooner than a broader toolkit would allow.`,
      path: `Try identifying one specific situation this week where your usual approach fell short. You are allowed to have real gaps and still be resourceful inside them. What's the next instinct actually worth building?`,
    },
    3: {
      heading: `Subconscious Self 3 — A Capable Working Range`,
      why: `This card measures how many of the nine base numbers actually appear in your name — a raw count, not a judgment. Yours lands you a genuinely workable range: enough instincts on hand that most everyday situations don't require you to improvise from nothing, with real room still ahead before that range becomes comprehensive.`,
      traits: `You handle a fair spread of pressure without it costing you much. A few specific gaps are probably already known to you — places where your composure noticeably thins, and you likely already know exactly where they are.`,
      shadow: `The risk at this level is assuming the range is wider than it is, and being genuinely surprised the rare times it turns out not to be — solid mistaken, occasionally, for complete.`,
      path: `Try naming one gap you already know about, plainly, this week. You are allowed to have real range and real blind spots at once. What's the next instinct worth deliberately closing that gap with?`,
    },
    4: {
      heading: `Subconscious Self 4 — A Steady, Middle-Ground Toolkit`,
      why: `This card counts how many of the nine base numbers appear anywhere in your name — the raw material your composure is built from. Your count lands close to the middle: not narrow, not exhaustive, a genuinely dependable range that covers the situations that actually come up most often in an ordinary life.`,
      traits: `Most everyday pressure meets a steadiness in you that feels earned rather than accidental. The rare and extreme situations still test real edges — but those edges are further out than they'd be for a narrower set.`,
      shadow: `The comfort of a middle-ground kit is also its trap: assuming the current range is enough, and quietly stopping the deliberate growth that would have pushed it further.`,
      path: `Try naming one instinct this week you already know is weaker than the rest. You are allowed to be steady and still keep building. Where would continued development actually matter most right now?`,
    },
    5: {
      heading: `Subconscious Self 5 — A Genuinely Well-Rounded Toolkit`,
      why: `This card counts how many of the nine base numbers turn up anywhere in your name — not talent, not desire, just raw presence. Your count puts you solidly above the middle: a well-rounded set of instincts that covers most of what life is likely to throw at you, with confidence that doesn't depend on staying inside familiar ground.`,
      traits: `Both familiar and unfamiliar pressure tend to find you reasonably prepared. Genuine surprise happens to you less often than it happens to most people. What reads to others as composure is, in your case, mostly just accurate.`,
      shadow: `The risk at this level is quietly assuming the range covers everything, and being caught by the one specific gap that a wide toolkit still doesn't close.`,
      path: `Try naming, honestly, one situation this week that would still genuinely test you. You are allowed to be well-rounded and still have an edge somewhere. What's the last real gap worth closing?`,
    },
    6: {
      heading: `Subconscious Self 6 — A Broad and Dependable Toolkit`,
      why: `This card counts how many of the nine base numbers show up in your name at all — the actual raw material behind your composure. A count this high gives you a genuinely broad set of instincts, wide enough that very little catches you fully unprepared, familiar or not.`,
      traits: `People lean on your steadiness specifically in the moments that would rattle most of them. Very different kinds of pressure tend to meet the same reliable footing in you. That breadth is real, not performed.`,
      shadow: `The risk of a kit this wide is spreading it evenly across everything, rather than letting any one instinct run especially deep — competent everywhere, masterful nowhere in particular.`,
      path: `Try leaning fully into one specific instinct this week instead of trying to cover every angle equally. You are allowed to be broadly capable and still specialize. Where would real depth serve you better than more breadth?`,
    },
    7: {
      heading: `Subconscious Self 7 — A Rich, Nearly Complete Toolkit`,
      why: `This card counts how many of the nine base numbers appear anywhere in your name — the raw inventory behind your composure. A count this high leaves you with a toolkit that's rich and nearly complete: genuine surprise becomes a rare event, because there's very little territory you're entering without some kind of prior instinct to draw on.`,
      traits: `Almost any situation, familiar or not, meets real preparation in you. People notice how seldom you're caught with nothing to offer. The steadiness other people work hard to fake, you mostly just have.`,
      shadow: `Completeness this close to total invites its own quiet trap — an unspoken pressure to always have an answer, even in the rare moments you genuinely don't.`,
      path: `Try admitting, honestly, one thing this week you don't yet know how to handle. You are allowed to be this capable and still have a real edge left. What would closing that last piece actually require?`,
    },
    8: {
      heading: `Subconscious Self 8 — An Unusually Comprehensive Toolkit`,
      why: `This card counts how many of the nine base numbers appear anywhere in your name at all — and a count this high is genuinely rare. Almost every base instinct is present in you somewhere, leaving very little ground where you're operating with no reference point whatsoever.`,
      traits: `People come to you specifically because your composure holds when theirs doesn't. Genuine surprise is a rare event for you, not a common one. What looks like invulnerability from the outside is, mostly, just a very deep bench.`,
      shadow: `The risk of a toolkit this complete is that it can start to feel like actual invulnerability — which makes the rare moment it genuinely fails land far harder than it would for someone more used to hitting real limits.`,
      path: `Try naming, honestly, the last time this toolkit truly wasn't enough. You are allowed to be this resourceful and still occasionally get caught out. What did that moment actually teach you?`,
    },
    9: {
      heading: `Subconscious Self 9 — The Complete Toolkit`,
      why: `This card counts how many of the nine base numbers appear anywhere in your name — and a count of 9 is the maximum the system allows. Every one of the base digits shows up somewhere in you; there's no single instinct entirely absent from your makeup, only differences in how deeply each one has been developed.`,
      traits: `You rarely enter a situation with nothing at all to draw on. People notice how consistently you land on your feet, across genuinely different kinds of pressure. Composure, for you, isn't situational — it's closer to a constant.`,
      shadow: `The risk of having it all is relying on breadth instead of ever going properly deep anywhere — capable of a little of everything, masterful at nothing in particular.`,
      path: `Try going deliberately deeper into one instinct this week instead of spreading your attention evenly. You are allowed to have the full kit and still choose where to actually specialize. Which piece of it deserves the most investment right now?`,
    },
  };
  function get(num) { return data[num] || null; }
  return { get };
})();

// Karmic Lessons — short, list-item form (several can appear together in
// one card, unlike every other reading in this app). Each entry describes
// what developing that missing digit's quality would actually look like.
window.DKarmicLessonContent = (function () {
  const data = {
    1: {
      heading: `Karmic Lesson: 1 — Developing Independent Initiative`,
      text: `No letter value tied to this number appears anywhere in your name — in classical numerology, that absence marks a lesson still being built, not a flaw. Going first, without waiting for someone else to move, isn't automatic for you the way it is for some people. You are allowed to practice starting things before you feel ready, on purpose, as a skill rather than a personality trait you're missing.`,
    },
    2: {
      heading: `Karmic Lesson: 2 — Developing Patience and Partnership`,
      text: `This number never appears in your name at all — a genuine gap, not a character flaw. Slowing down enough for real cooperation, letting a partnership actually develop instead of rushing it, isn't an instinct you were handed. You are allowed to build the patience for that deliberately, treating it as a skill worth practicing rather than something you should already have.`,
    },
    3: {
      heading: `Karmic Lesson: 3 — Developing Self-Expression`,
      text: `Nowhere in your name does this number show up — classical numerology reads that as unfinished work, not a permanent limit. Comfort putting yourself forward, creatively or socially, isn't something that arrives on its own for you. You are allowed to practice being seen and heard more openly, treating visibility as a skill to build rather than a risk to avoid.`,
    },
    4: {
      heading: `Karmic Lesson: 4 — Developing Discipline and Structure`,
      text: `This number is absent from your name entirely — a genuine blind spot, not a moral failing. Steady, unglamorous follow-through past the point something stops being exciting isn't automatic for you. You are allowed to build that discipline on purpose, treating consistency as a muscle rather than a trait you either have or don't.`,
    },
    5: {
      heading: `Karmic Lesson: 5 — Developing Adaptability`,
      text: `No letter carrying this number appears in your name — a real gap, not a personal shortcoming. Meeting sudden change with curiosity instead of resistance isn't a reflex you were handed. You are allowed to practice flexibility deliberately, treating it as a skill still being built rather than proof of something missing in you.`,
    },
    6: {
      heading: `Karmic Lesson: 6 — Developing Responsibility to Others`,
      text: `This number is missing from your name entirely — an area still being formed, not evidence you don't care. Showing up consistently for the people and spaces closest to you isn't automatic for you the way it is for some. You are allowed to build that responsibility on purpose, without needing to feel naturally inclined toward it first.`,
    },
    7: {
      heading: `Karmic Lesson: 7 — Developing Depth and Reflection`,
      text: `Nowhere does this number appear in your name — classical numerology reads that as unfinished, not broken. Sitting with a question long enough to actually understand it, rather than moving on early, isn't second nature for you. You are allowed to practice that kind of patience deliberately, as a skill worth building rather than a trait you lack.`,
    },
    8: {
      heading: `Karmic Lesson: 8 — Developing a Healthy Relationship With Power`,
      text: `This number never shows up in your name — a genuine gap, not a character judgment. A steady, uncomplicated relationship with money, authority, and material responsibility isn't handed to you automatically. You are allowed to build that relationship on purpose, learning to hold real power without either grabbing for more of it or flinching away from it.`,
    },
    9: {
      heading: `Karmic Lesson: 9 — Developing Broad Compassion`,
      text: `No letter tied to this number appears anywhere in your name — an area still forming, not a verdict on your character. Caring instinctively about people and causes outside your own immediate circle isn't automatic for you. You are allowed to build that wider compassion deliberately, as something you practice rather than something you either have or don't.`,
    },
  };
  function get(num) { return data[num] || null; }
  return { get };
})();

window.DCornerstoneContent = (function () {
  const data = {
    1: {
      heading: `Cornerstone 1 — You Begin by Leading`,
      why: `Every version of your name opens on the same letter, and that letter never changes — the one part of your own introduction you don't get to revise. Numerology reads it as your instinctive first move into anything new, and yours is to lead: walk in, take the initiative, set the direction before anyone else has decided to.`,
      traits: `A new opportunity reads to you as an invitation, not a threat. You'd usually rather propose the plan than wait for someone else's version of it. Unfamiliar territory tends to bring out more confidence in you than caution.`,
      shadow: `Moving first can mean moving before you've actually gathered enough context — mistaking decisiveness for readiness, and finding out the difference later than you'd like.`,
      path: `Try gathering one extra piece of information before your next new start. You are allowed to lead and still pause to learn first. Where has moving first outpaced what you actually knew?`,
    },
    2: {
      heading: `Cornerstone 2 — You Begin by Listening`,
      why: `The letter that opens your name has been fixed since before you had any say in it — the one unchangeable part of your own introduction. Numerology reads it as your instinctive first move into anything new, and yours is to watch first: read the room, gather information, engage once you actually understand what you're stepping into.`,
      traits: `A new environment tends to get a quiet observation period from you before you fully join it. You'd rather understand the dynamics of a room than speak into it blind. Caution shows up early for you, even when the opportunity in front of you is genuinely good.`,
      shadow: `Observation mode can run past its usefulness, and a real opportunity can quietly close while you're still gathering information you already have enough of.`,
      path: `Try acting on your read of a situation sooner than usual this week. You are allowed to observe closely and still move at a reasonable pace. Where has caution at the start cost you something worth having?`,
    },
    3: {
      heading: `Cornerstone 3 — You Begin by Expressing`,
      why: `Your name has opened on this same letter every time it's been written — unchosen, unchangeable. Numerology reads it as your instinctive first move into anything new, and yours is to engage out loud: talk, connect, make an impression right at the start rather than hang back and observe.`,
      traits: `A new room tends to hear from you fairly quickly, rather than after a long silent stretch. Humor and warmth are your default tools for building rapport at the start of something. Sociability shows up early and easily for you.`,
      shadow: `Talking before you've fully thought something through can mean making an impression before you actually understand what you've stepped into.`,
      path: `Try pausing one extra beat before speaking at the start of something new this week. You are allowed to be expressive and still consider first. Where has the impression outpaced the understanding?`,
    },
    4: {
      heading: `Cornerstone 4 — You Begin by Planning`,
      why: `The letter your name opens on has never changed and never will — the one fixed piece of your own introduction. Numerology reads it as your instinctive first move into anything new, and yours is to build a framework first: structure the approach before committing real momentum to it.`,
      traits: `A new project tends to get organized before it gets exciting. You're generally more comfortable beginning once there's at least a rough plan in place. Deliberateness, more than eagerness, tends to define how you start things.`,
      shadow: `Planning can tip into stalling, with the plan itself quietly standing in for the actual start rather than preparing you for it.`,
      path: `Try beginning one thing this week with noticeably less planning than usual. You are allowed to be methodical and still start before everything's mapped. Where has the plan become the obstacle instead of the preparation?`,
    },
    5: {
      heading: `Cornerstone 5 — You Begin by Exploring`,
      why: `Your name has opened on the same letter every single time it's been written — a fact, not a choice. Numerology reads it as your instinctive first move into anything new, and yours is to try it directly: dive in, adjust based on what you find, rather than planning it out extensively beforehand.`,
      traits: `A new opportunity tends to get an eager, hands-on response from you before it gets a plan. You learn a situation faster by touching it than by studying it. Enthusiasm, more than caution, defines your early moves.`,
      shadow: `Jumping in without any real foundation can look like readiness when it's actually just eagerness — a distinction that tends to surface later than you'd want.`,
      path: `Try building in one moment of preparation before your next new start. You are allowed to explore and still ground yourself first. Where has eagerness outpaced any real foundation underneath it?`,
    },
    6: {
      heading: `Cornerstone 6 — You Begin by Considering Others`,
      why: `Your name has opened on this same letter for as long as it's existed — unchosen, unchangeable. Numerology reads it as your instinctive first move into anything new, and yours runs through the people it affects: who's involved, how a beginning will land on them, before you commit to it purely on your own terms.`,
      traits: `A new opportunity tends to get filtered through its impact on people close to you before you fully commit to it. Their needs often factor in earlier than your own do. Thoughtfulness, more than self-interest, shapes how you start things.`,
      shadow: `Consideration for others can quietly delay a beginning that was genuinely yours to make, deferring something good simply because it wasn't unanimously convenient.`,
      path: `Try starting one thing this week primarily because it's right for you, not because everyone's signed off on it. You are allowed to consider others and still claim a beginning as your own. Where has care for others' input become an excuse to stall?`,
    },
    7: {
      heading: `Cornerstone 7 — You Begin by Understanding`,
      why: `The letter your name opens on has never once changed — the one fixed note of your own introduction. Numerology reads it as your instinctive first move into anything new, and yours is to understand it first: resist committing until you've genuinely grasped what you're actually stepping into.`,
      traits: `A new opportunity gets real scrutiny from you before it gets your commitment. You ask more questions at the outset than most people think to ask. Thoughtfulness, more than speed, defines your early moves.`,
      shadow: `Analysis can run past the point of usefulness, and a genuinely good opportunity can pass you by while you're still working to fully understand it.`,
      path: `Try committing to one new thing this week with slightly less certainty than you'd normally require. You are allowed to want understanding and still act before it's complete. Where has needing full clarity kept you from something worth taking anyway?`,
    },
    8: {
      heading: `Cornerstone 8 — You Begin by Assessing the Stakes`,
      why: `Your name has opened on this exact letter every time it's been written — a fact you inherited, not one you chose. Numerology reads it as your instinctive first move into anything new, and yours runs through the stakes: what's actually at risk, materially and practically, before you commit real effort to it.`,
      traits: `A new opportunity gets weighed for tangible value before it gets your investment. You think in terms of return more than most people do at the outset. Seriousness, more than instinct, defines how you begin things.`,
      shadow: `A sharp eye for stakes can quietly filter out something genuinely meaningful, simply because its payoff wasn't immediately obvious in material terms.`,
      path: `Try beginning one thing this week purely because it matters to you, independent of any practical payoff. You are allowed to assess stakes and still start something with no guaranteed return. Where has your practical eye filtered out something worth taking anyway?`,
    },
    9: {
      heading: `Cornerstone 9 — You Begin by Considering the Bigger Picture`,
      why: `The letter opening your name has been fixed for as long as your name has existed — the one unchosen constant of your own introduction. Numerology reads it as your instinctive first move into anything new, and yours runs through scale: how a beginning connects to something larger than the immediate moment.`,
      traits: `A new opportunity gets weighed for its broader meaning before it gets your commitment. You ask how something fits a bigger picture more than most people think to at the start of a project. Idealism, more than pragmatism, shapes how you begin things.`,
      shadow: `A focus this wide can miss the practical, immediate details right in front of you — a beginning beautifully framed and poorly grounded.`,
      path: `Try attending to one small, practical detail before your next new start. You are allowed to think big and still handle the immediate logistics. Where has the wider picture distracted from what actually needed handling first?`,
    },
  };
  function get(num) { return data[num] || null; }
  return { get };
})();

window.DCapstoneContent = (function () {
  const data = {
    1: {
      heading: `Capstone 1 — You Finish by Claiming It as Yours`,
      why: `Every formal version of your name closes on the same letter — the last word your own name always gets, whether you notice it or not. Numerology reads it as how you actually follow through, and yours is decisive: an ending is real to you once it's unmistakably owned, not diffused across a group.`,
      traits: `Clear, individual credit or responsibility matters to you once something's actually done. A finished result satisfies you more when it's unmistakably yours. Decisiveness tends to show up strongest right at the close of something, not the start.`,
      shadow: `Owning the ending can tip into over-claiming a result that was genuinely shared, or resisting a needed late change simply because it wasn't your idea to begin with.`,
      path: `Try sharing credit for one finished thing this week, genuinely, out loud. You are allowed to finish decisively and still name who helped. Where has claiming an ending left out people who actually earned part of it?`,
    },
    2: {
      heading: `Capstone 2 — You Finish by Making Sure Everyone's Included`,
      why: `Your name closes on this exact letter every time it's written — fixed, not chosen. Numerology reads it as how you actually follow through, and yours is collaborative: something isn't truly finished for you until everyone involved genuinely agrees it is.`,
      traits: `Explicit agreement matters to you before you'll call something done. An ending feels incomplete if someone involved still seems uneasy about it. Thoroughness about other people's input tends to show up strongest right at the close.`,
      shadow: `Waiting for full agreement can mean never quite closing something out, because there's always one more approval left to gather before it counts as done.`,
      path: `Try declaring one thing finished this week without waiting for full unanimous buy-in. You are allowed to seek consensus and still set a real endpoint. Where has an ending stayed open longer than it needed to?`,
    },
    3: {
      heading: `Capstone 3 — You Finish With a Flourish`,
      why: `The final letter of your name has never changed — a fact your own name simply carries. Numerology reads it as how you actually follow through, and yours wants to be felt: an ending that's visible, sometimes celebrated, not quietly folded away without acknowledgment.`,
      traits: `Some form of recognition matters to you once something's finished, even a small one. A quiet, unremarked ending tends to feel slightly hollow. Showmanship shows up naturally right at the close of things.`,
      shadow: `Wanting the bigger, more visible finish can delay the actual ending, or leave you frustrated when a genuinely good ending doesn't get the recognition you feel it earned.`,
      path: `Try letting one thing this week end quietly, with no flourish attached. You are allowed to want recognition and still let some endings pass unremarked. Where has needing a visible finish been holding up a real one?`,
    },
    4: {
      heading: `Capstone 4 — You Finish by Making It Solid`,
      why: `Your name closes on this same letter every time it's written — a permanent fact of it. Numerology reads it as how you actually follow through, and yours is structural: something counts as finished only once it's genuinely durable, checked, and built to hold.`,
      traits: `Real assurance that something will hold up matters to you before you'll move on from it. Loose ends bother you more than they bother most people. Thoroughness tends to define your endings more than your beginnings.`,
      shadow: `The pursuit of durability can mean never quite reaching an actual finish, because there's always one more detail that could theoretically be made more solid.`,
      path: `Try calling one thing finished this week at "solid enough" instead of "perfectly certain." You are allowed to want durability and still accept a reasonable stopping point. Where has certainty-seeking kept something from ever being called done?`,
    },
    5: {
      heading: `Capstone 5 — You Finish by Moving On`,
      why: `The last letter of your name has stayed the same every time it's been written — a fixed fact, not a preference. Numerology reads it as how you actually follow through, and yours is fast: complete the essential work, then move, with little appetite for lingering.`,
      traits: `Restlessness tends to set in once a project's essentially wrapped. Lingering on something finished appeals to you less than starting the next thing. Momentum, more than closure, defines how your endings feel.`,
      shadow: `Moving fast can leave a project's less exciting final details unattended — technically done, but not actually finished.`,
      path: `Try staying with one finished thing this week slightly longer than your instinct wants. You are allowed to move quickly and still tie off the loose ends first. Where has your hurry left something less complete than it looked?`,
    },
    6: {
      heading: `Capstone 6 — You Finish by Making Sure Everyone's Cared For`,
      why: `Your name has closed on this exact letter every time it's been written — fixed, not chosen. Numerology reads it as how you actually follow through, and yours is relational: an ending isn't complete until the people affected by it are genuinely okay.`,
      traits: `Checking in on people matters to you once a situation is wrapping up, beyond the practical logistics. An ending feels incomplete if someone involved seems hurt or unsettled by it. Tenderness, more than efficiency, defines how you close things out.`,
      shadow: `Concern for how an ending lands can delay a needed one, prolonging something past its natural close just to soften the impact.`,
      path: `Try letting one ending be direct this week, even if it's not entirely comfortable for everyone. You are allowed to care about people and still close something out cleanly. Where has softening an ending actually just delayed it?`,
    },
    7: {
      heading: `Capstone 7 — You Finish by Fully Understanding It`,
      why: `Your name closes on the same letter every time it's written — a permanent fact, not a choice. Numerology reads it as how you actually follow through, and yours is reflective: an ending isn't complete until you genuinely understand what happened and why.`,
      traits: `Processing a finished project fully matters to you before you'll consider it truly over. Endings tend to prompt real reflection in you, more than they do for most people. Depth, more than speed, defines how you close things out.`,
      shadow: `Reflection can outlast the practical ending it was meant to process — analyzing something that's genuinely already done.`,
      path: `Try declaring one thing over this week before you've fully processed every part of it. You are allowed to want understanding and still let an ending actually end. Where has reflecting stood in for genuinely moving on?`,
    },
    8: {
      heading: `Capstone 8 — You Finish by Measuring the Result`,
      why: `The final letter of your name has never once changed — a fact it simply carries. Numerology reads it as how you actually follow through, and yours is results-oriented: something's genuinely finished once there's a clear, measurable outcome to point to.`,
      traits: `Concrete proof of success matters to you before you'll call a project complete. Ambiguous outcomes unsettle you more than they unsettle most people. Rigor, more than sentiment, defines how you close things out.`,
      shadow: `Needing a measurable result can mean discounting a genuinely meaningful ending simply because its value was harder to quantify.`,
      path: `Try calling one thing finished this week based on how it felt, not just what it measurably produced. You are allowed to want results and still count a soft success as real. Where has needing a measurable outcome discounted something that actually mattered?`,
    },
    9: {
      heading: `Capstone 9 — You Finish by Considering What It Leaves Behind`,
      why: `Your name has closed on this exact letter for as long as it's existed — a fact, not a preference. Numerology reads it as how you actually follow through, and yours is legacy-minded: an ending matters for what it leaves behind, not just for the immediate result.`,
      traits: `The broader impact of a finished project tends to occupy you as much as its immediate outcome. Endings prompt you to consider what comes next for everyone involved, not only for you. Generosity, more than urgency, defines how you close things out.`,
      shadow: `A focus this wide can miss the immediate, practical details right in front of you — an ending well-considered in theory, loose in the actual particulars.`,
      path: `Try attending to one immediate, practical detail this week before considering the bigger picture of an ending. You are allowed to think about legacy and still handle what's right in front of you first. Where has the wider view distracted from what needed closing out?`,
    },
  };
  function get(num) { return data[num] || null; }
  return { get };
})();
