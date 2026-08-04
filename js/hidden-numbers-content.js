'use strict';

/**
 * Destiny Matrix — Hidden Passion, Subconscious Self / Karmic Lessons,
 * Cornerstone & Capstone, Bridge
 * ─────────────────────────────────────────────────────────────
 * Name-based numerology, round 2 — still requires the same optional name
 * input as Expression/Soul Urge/Personality/Maturity (js/name-numbers-
 * content.js), but built from letter FREQUENCY and PRESENCE rather than
 * sums. See js/matrix-engine.js's hiddenPassionNumber()/
 * subconsciousSelfAndLessons()/cornerstoneNumber()/capstoneNumber().
 *
 *   Hidden Passion   — the digit whose letters repeat most often in the
 *                       first name (1-9). A natural talent, possibly
 *                       under-used precisely because it's so automatic.
 *   Subconscious Self — how many of the 9 digits are present at all in the
 *                       first name (1-9 itself). Read as resourcefulness/
 *                       self-confidence under real pressure.
 *   Karmic Lessons    — the digits NOT present at all. Read as areas still
 *                       being developed, not natural strengths. A person
 *                       can have zero, one, or several — the card renders
 *                       whichever apply, live, from DestinyMatrix-v1.html.
 *   Cornerstone       — first letter of the first name (1-9). How you
 *                       approach new opportunities and beginnings.
 *   Capstone          — last letter of the first name (1-9) — this app
 *                       computes every name-based number from the first
 *                       name only (see matrix-engine.js's _firstName()),
 *                       so this reads the same word Cornerstone opens on.
 *                       How you follow through and finish what you start.
 *   Bridge            — |Life Path - Expression|, reduced 0-8 (same
 *                       gap-number reduction as Challenges, no master
 *                       numbers preserved). How much conscious work it
 *                       takes to make what your life is fundamentally
 *                       about (Life Path) agree with how you naturally
 *                       act (Expression). Needs both a birthdate and a
 *                       name, same as Maturity.
 *
 * Golden Standard voice (Mastery/Shadow/Invitation) — see js/micro-
 * content.js's header comment for the canonical reference block. Karmic
 * Lessons keeps its own short, list-item shape by design (several can
 * render together in one card) — not converted to the 3-field pattern.
 *
 * API:
 *   DHiddenPassionContent.get(num)   -> { title, mastery, shadow, invitation } or null
 *   DSubconsciousSelfContent.get(num)-> { title, mastery, shadow, invitation } or null
 *   DKarmicLessonContent.get(num)    -> { heading, text } or null (short, list-item form)
 *   DCornerstoneContent.get(num)     -> { title, mastery, shadow, invitation } or null
 *   DBridgeContent.get(num)          -> { title, mastery, shadow, invitation } or null
 *   DCapstoneContent.get(num)        -> { title, mastery, shadow, invitation } or null
 */

window.DHiddenPassionContent = (function () {
  const data = {
    1: {
      title: `Hidden Passion 1 — A Leadership You Keep Underselling`,
      mastery: `One digit outnumbers every other letter in your name, unchosen, simply the shape your own name happens to take, and for you it's the leadership number. You go first, consistently enough that it stopped registering as a trait and became the water you swim in. You step into direction-setting before anyone's assigned it to you, often without noticing you've done it. Starting something new rarely triggers the hesitation it triggers in other people, and you'd probably leave this off a list of your own strengths precisely because it's never once felt like effort.`,
      shadow: `A gift this automatic tends to stop growing. You coast on raw instinct instead of sharpening it, because nothing has ever forced you to work at it. Left unclaimed, it can also curdle into a quiet resentment — leading again and again while telling yourself it isn't a skill, just a chore that fell to you. A real talent left entirely untrained eventually plateaus below what it could have been. And because leading has never cost you anything visible, it's easy to overlook how much of it you're actually doing.`,
      invitation: `Name one place this week where you led and quietly wrote it off as nothing. Say out loud, to one person, that it took something real. You are allowed to take credit for what comes easily. What has "it's just what I do" been talking you out of noticing?`,
    },
    2: {
      title: `Hidden Passion 2 — A Diplomacy You Keep Underselling`,
      mastery: `One digit dominates the letter count in your name, unchosen, simply how your own name is built, and yours is the number of tact and sensitivity. You feel the tension in a room before anyone's named it and defuse it before it becomes a problem. People say things to you they wouldn't say to anyone else, and you rarely register why. Conflict between two other people tends to resolve faster when you're simply present for it — a real, rare skill you'd likely rate as ordinary.`,
      shadow: `Something this instinctive is easy to leave undeveloped. You lean on raw sensitivity instead of sharpening it further, and a gift running purely on autopilot eventually stalls out below what deliberate practice could have made of it. It can also mean you absorb a room's tension as your job by default, without anyone asking, and quietly resent the position no one actually put you in. Over time, that unspoken duty can leave you drained in a way no one around you can quite see the source of, since none of it ever looked like effort from the outside.`,
      invitation: `Notice this week one moment where your read on a room was the actual reason things went smoothly. Name it as a skill, out loud, to yourself if no one else. You are allowed to call that a skill, not luck. Where has this sensitivity been doing real work with zero credit attached?`,
    },
    3: {
      title: `Hidden Passion 3 — A Creative Voice You Keep Underselling`,
      mastery: `One digit wins by a wide margin in your name's letters, an accident of spelling, and yours belongs to expression — words, humor, the specific gift of making a moment more alive simply by being in it. A room tends to loosen up once you start talking, and you rarely clock the shift as something you caused. Making people laugh or feel something happens without a run-up. What you'd call "just messing around" is, more often than you think, actual craft.`,
      shadow: `A talent this effortless rarely gets developed on purpose. It stays a party trick instead of becoming a real practice, because putting in structured work has never once felt necessary to make it work. Left unclaimed, it can also mean you never find out what this voice could do with real attention behind it, and quietly assume the ceiling is lower than it is. People may enjoy the performance without ever seeing the craft underneath it, which makes it easy for even you to forget the craft is there at all.`,
      invitation: `Treat one piece of creative output this week like it actually matters, not like a throwaway. Finish it and show it to someone. You are allowed to take something seriously precisely because it's easy for you. What have you been calling "just for fun" that's actually good enough to build on?`,
    },
    4: {
      title: `Hidden Passion 4 — A Discipline You Keep Underselling`,
      mastery: `One digit clearly leads in your name's letters, an accident of spelling, and yours is the number of structure: sustaining unglamorous, patient effort for as long as it actually takes. Routines and commitments hold for you the way they don't for most people around you. A long, tedious stretch of work rarely wears you down the way it wears down everyone else. You've probably never described yourself as disciplined, because discipline has never once felt like willpower to you — it's just default behavior.`,
      shadow: `A capability this automatic rarely gets aimed anywhere on purpose. It runs quietly in the background instead of being pointed at something that would actually reward this much sustained attention. It can also mean you tolerate a joyless routine far longer than you should, mistaking mere consistency for actual progress. The steadiness itself never fails, so nothing ever forces you to ask whether it's actually taking you somewhere worth going.`,
      invitation: `Pick one goal this week that actually deserves the steadiness you already have. Point today's effort at it specifically, not at whatever's simply in front of you. You are allowed to take your own reliability seriously enough to direct it. Where has this strength been running on nothing in particular?`,
    },
    5: {
      title: `Hidden Passion 5 — An Adaptability You Keep Underselling`,
      mastery: `One digit clearly wins in your name's letters, a by-product of spelling, not choice, and yours belongs to change: an ease with the unfamiliar most people spend years trying to build. New situations rarely rattle you the way they rattle the people around you. Uncertainty registers as interesting more often than it registers as threatening. You'd probably chalk this up to luck or temperament — it's neither. It's a real, developable skill running quietly on autopilot.`,
      shadow: `Ease this consistent rarely gets refined further. It gets treated as personality rather than something worth deliberately sharpening, and a skill left on autopilot stalls exactly where it started. It can also mean you undersell your own steadiness in a crisis, assuming everyone finds it this easy when almost no one does. That mismatch can leave you genuinely confused when other people describe change as frightening, and quietly impatient with a fear that never made sense to you.`,
      invitation: `Name one recent moment where your own adaptability quietly saved a situation. Tell someone what you actually did, in specific terms. You are allowed to call that skill, not chance. Where has this flexibility been going entirely unacknowledged?`,
    },
    6: {
      title: `Hidden Passion 6 — A Devotion You Keep Underselling`,
      mastery: `One digit clearly dominates in your name's letters, not chosen, just how your name happens to be built, and yours is the number of care: an instinct for noticing what a person or space actually needs. You notice what needs tending before anyone's had to ask. Looking after people takes less conscious effort from you than it visibly takes from almost everyone else. You'd probably call this "just how I am" — it's rarer than that framing gives it credit for.`,
      shadow: `A gift this automatic tends to stay reactive instead of becoming something you consciously direct — real devotion, running on autopilot, doing good work that nobody, including you, is deliberately shaping. It can also mean you extend this care to people who never reciprocate it, simply because giving it costs you so little that you stop noticing the imbalance. Left unaddressed, that one-way pattern can quietly hollow out the relationships it was meant to strengthen. You may not notice the imbalance until you're already resentful, since it never once felt like a sacrifice while you were making it.`,
      invitation: `Name one moment this week where your care for someone was quietly the actual reason things went well. Say it plainly, to yourself at least. You are allowed to take credit for something that feels effortless. Where has this devotion been invisible, even to you?`,
    },
    7: {
      title: `Hidden Passion 7 — An Insight You Keep Underselling`,
      mastery: `One digit clearly leads in your name's letters, an accident of spelling, and yours belongs to depth: a mind that keeps going past the point where most people accept the first plausible explanation. You reach real understanding of complicated things faster than most people you know, and rarely register the speed as unusual. Surface-level answers leave you visibly unsatisfied in a way they don't for most people. You'd probably describe this as "just how your brain works" — which is exactly why it's easy to undersell.`,
      shadow: `Understanding this automatic tends to stay entirely private, kept to yourself rather than offered to anyone who could actually use it — real insight sitting unused because sharing it has never once felt necessary. It can also isolate you, quietly, from people who never get to see how much thinking actually goes into what you say. Over time that gap can start to feel like being fundamentally misunderstood, when really you've just never volunteered the fuller picture. The habit of keeping conclusions to yourself can leave others assuming you have less to offer than you actually do.`,
      invitation: `Share one piece of understanding this week that you'd normally keep to yourself. Say the fuller version, not the summary. You are allowed to treat this depth as worth offering, not just having. What have you figured out that's actually ready to be said out loud?`,
    },
    8: {
      title: `Hidden Passion 8 — An Executive Capacity You Keep Underselling`,
      mastery: `One digit clearly wins out in your name's letters, a fact of spelling, and yours is the number of execution: turning ambition into something real and finished. Responsibility lands on you and you handle it without the visible strain it costs most people. Following an ambitious plan all the way through rarely intimidates you the way it intimidates others. You'd probably describe this as "just getting things done" — which undersells exactly how rare it is.`,
      shadow: `A capability this automatic rarely gets pointed at anything that matches its actual scale. It gets spent on small, safe tasks instead of the genuinely ambitious ones it was actually built for. It can also mean other people quietly lean on your competence without ever noticing what it costs you to keep producing it. Because you rarely visibly struggle, no one thinks to check whether you're actually being asked for too much, and you may not think to say so either.`,
      invitation: `Aim this capacity at one real, ambitious goal this week instead of a comfortable one. Name the goal out loud before you start. You are allowed to take your own competence seriously enough to use it fully. Where has this strength been quietly wasted on tasks too small for it?`,
    },
    9: {
      title: `Hidden Passion 9 — A Compassion You Keep Underselling`,
      mastery: `One digit clearly dominates in your name's letters, a fact of spelling, not choice, and yours belongs to broad compassion: real feeling for people well outside your own immediate circle. You feel for people you've never met more readily than most people manage. Causes larger than your own life tend to move you in a way that surprises people who don't know you well. You'd probably call this "just how you're wired" — which is precisely why it's easy to leave undeveloped.`,
      shadow: `Compassion this automatic tends to stay diffuse — felt widely, acted on rarely, because it's never been aimed at something specific enough to actually build. It can also spread you thin across every cause at once, leaving none of them the sustained attention that would actually move something. Feeling for everyone can, ironically, leave you closer to no one in particular. The sheer breadth of what moves you can quietly become an excuse for never committing anywhere in particular.`,
      invitation: `Direct this compassion at one concrete action this week instead of a general feeling. Pick a single person or cause and follow through. You are allowed to take this gift seriously enough to actually use it. What cause or person have you been feeling for without ever doing anything about it?`,
    },
  };
  function get(num) { return data[num] || null; }
  return { get };
})();

window.DSubconsciousSelfContent = (function () {
  const data = {
    1: {
      title: `Subconscious Self 1 — A Narrow but Sharp Toolkit`,
      mastery: `This card measures how many of the nine base numbers show up anywhere in your name at all — not what you want or how you appear, just what's present. A low count like yours means the toolkit is small but real: a handful of instincts you can trust completely. In the territory you know, your decisiveness is genuinely striking, no hesitation, no second-guessing. What you do have, you use fully rather than half-heartedly.`,
      shadow: `Step outside that familiar territory and the confidence thins out fast, sometimes faster than you'd expect from yourself. The danger of a small toolkit is being caught flat-footed the moment a situation asks for an instinct you simply never developed. It can read to others as inconsistency — decisive here, oddly lost there — when it's actually just the honest edge of a narrow set. Without noticing, you can also start steering your whole life toward the territory you already know, simply to avoid the edge.`,
      invitation: `Name, honestly, the specific kind of pressure that reliably catches you off guard. Pick one instinct from that gap and practice it deliberately this month, in a low-stakes setting first. You are allowed to have a narrow kit and still build it out on purpose. Which instinct, added deliberately, would change the most for you?`,
    },
    2: {
      title: `Subconscious Self 2 — A Compact but Real Toolkit`,
      mastery: `This card counts how many of the nine base numbers show up anywhere in your name — not talent or desire, just presence. Your count sits on the lower side, leaving a compact set of instincts: enough to move through most ordinary days without trouble. Routine pressure rarely throws you, and what you rely on, you rely on with real confidence. Inside that compact set, you tend to know exactly what you're capable of, without the second-guessing a wider, less-tested range can bring.`,
      shadow: `It's the genuinely novel situation, the one with no precedent in your own experience, that finds the seams in your composure faster than it would for someone carrying a wider range. A kit this size runs out of options exactly where the unfamiliar begins, and that edge tends to arrive sooner than a broader toolkit would allow. Left unaddressed, it can quietly narrow your world to only the situations you already know how to handle. The discomfort of that edge can feel like a character flaw rather than what it actually is, a simply undeveloped instinct.`,
      invitation: `Identify one specific situation this week where your usual approach fell short. Choose one new instinct to deliberately practice, even in a small way, over the coming month. You are allowed to have real gaps and still be resourceful inside them. What's the next instinct actually worth building?`,
    },
    3: {
      title: `Subconscious Self 3 — A Capable Working Range`,
      mastery: `This card is a raw count of how many of the nine base numbers actually appear in your name. Yours lands you a genuinely workable range: enough instincts on hand that most everyday situations don't require you to improvise from nothing. You handle a fair spread of pressure without it costing you much, and a few specific gaps are probably already known to you. Knowing where those gaps sit is itself a form of competence most people never develop.`,
      shadow: `The risk at this level is assuming the range is wider than it is, and being genuinely surprised the rare times it turns out not to be. Solid gets mistaken, occasionally, for complete. Because most days go fine, the gaps you do know about can sit unaddressed longer than they should, simply because nothing has forced the issue. That comfort can quietly turn a known, closeable gap into a permanent blind spot.`,
      invitation: `Name one gap you already know about, plainly, this week. Spend one deliberate session practicing exactly that instinct rather than waiting for a real situation to force it. You are allowed to have real range and real blind spots at once. What's the next instinct worth deliberately closing that gap with?`,
    },
    4: {
      title: `Subconscious Self 4 — A Steady, Middle-Ground Toolkit`,
      mastery: `This card counts how many of the nine base numbers appear anywhere in your name — the raw material your composure is built from. Your count lands close to the middle: not narrow, not exhaustive, a genuinely dependable range covering what actually comes up most often in an ordinary life. Most everyday pressure meets a steadiness in you that feels earned rather than accidental, and the rare extreme situations still test real edges, just edges further out than a narrower set would allow. That balance means you're rarely either overwhelmed or bored by what a normal day actually asks of you.`,
      shadow: `The comfort of a middle-ground kit is also its trap: assuming the current range is enough, and quietly stopping the deliberate growth that would have pushed it further. Because the range already covers "most" situations, there's little external pressure to notice the ones it doesn't. Growth here has to be chosen, not forced. Without that choice, a genuinely solid toolkit can quietly plateau years before it needed to.`,
      invitation: `Name one instinct this week you already know is weaker than the rest. Give it one deliberate hour of practice before you need it in a real moment. You are allowed to be steady and still keep building. Where would continued development actually matter most right now?`,
    },
    5: {
      title: `Subconscious Self 5 — A Genuinely Well-Rounded Toolkit`,
      mastery: `This card counts how many of the nine base numbers turn up anywhere in your name — not talent, not desire, just raw presence. Your count puts you solidly above the middle: a well-rounded set of instincts covering most of what life is likely to throw at you. Both familiar and unfamiliar pressure tend to find you reasonably prepared, and genuine surprise happens to you less often than it happens to most people. That preparedness makes you a genuinely calming presence for the people around you in a crisis.`,
      shadow: `The risk at this level is quietly assuming the range covers everything, and being caught by the one specific gap that a wide toolkit still doesn't close. What reads to others as composure can, in rare moments, be closer to overconfidence — a blind spot made harder to see precisely because it's surrounded by so much genuine capability. Because you're rarely wrong, being wrong once can land far harder than it would for someone more used to it. That rarity can also make it harder to ask for help, since needing it feels unfamiliar rather than routine.`,
      invitation: `Name, honestly, one situation this week that would still genuinely test you. Sit with what that gap would actually require of you, rather than assuming you'd figure it out live. You are allowed to be well-rounded and still have an edge somewhere. What's the last real gap worth closing?`,
    },
    6: {
      title: `Subconscious Self 6 — A Broad and Dependable Toolkit`,
      mastery: `This card counts how many of the nine base numbers show up in your name at all — the actual raw material behind your composure. A count this high gives you a genuinely broad set of instincts, wide enough that very little catches you fully unprepared. People lean on your steadiness specifically in the moments that would rattle most of them, and very different kinds of pressure tend to meet the same reliable footing in you. That breadth also means you can move between very different kinds of people and situations without having to fundamentally change who you are.`,
      shadow: `The risk of a kit this wide is spreading it evenly across everything, rather than letting any one instinct run especially deep — competent everywhere, masterful nowhere in particular. Being the reliable one in every room can also mean people stop asking what you actually want, only what you can handle. Given enough repetition, that role can start to feel less like a strength and more like a job you never applied for. Real specialization can start to feel like a loss of your usefulness, rather than a legitimate choice.`,
      invitation: `Lean fully into one specific instinct this week instead of trying to cover every angle equally. Notice what changes when you go deep instead of wide, just once. You are allowed to be broadly capable and still specialize. Where would real depth serve you better than more breadth?`,
    },
    7: {
      title: `Subconscious Self 7 — A Rich, Nearly Complete Toolkit`,
      mastery: `This card counts how many of the nine base numbers appear anywhere in your name — the raw inventory behind your composure. A count this high leaves you with a toolkit that's rich and nearly complete: genuine surprise becomes a rare event. Almost any situation, familiar or not, meets real preparation in you, and people notice how seldom you're caught with nothing to offer. That reputation for readiness is earned, built out of an unusually wide and well-tested set of instincts, not luck.`,
      shadow: `Completeness this close to total invites its own quiet trap: an unspoken pressure to always have an answer, even in the rare moments you genuinely don't. That pressure can make the honest "I don't know" harder to say than it should be, for someone this capable. People may quietly stop offering to help, assuming correctly that you rarely need it, which leaves you carrying more alone than you have to. The rare gap in your toolkit can feel disproportionately alarming precisely because everything around it works so well.`,
      invitation: `Admit, honestly, one thing this week you don't yet know how to handle. Say it out loud to someone before you've solved it. You are allowed to be this capable and still have a real edge left. What would closing that last piece actually require?`,
    },
    8: {
      title: `Subconscious Self 8 — An Unusually Comprehensive Toolkit`,
      mastery: `This card counts how many of the nine base numbers appear anywhere in your name at all — and a count this high is genuinely rare. Almost every base instinct is present in you somewhere, leaving very little ground where you're operating with no reference point whatsoever. People come to you specifically because your composure holds when theirs doesn't, and genuine surprise is a rare event for you, not a common one. That depth of instinct is a genuine rarity, not something you should mistake for ordinary.`,
      shadow: `The risk of a toolkit this complete is that it can start to feel like actual invulnerability, which makes the rare moment it genuinely fails land far harder than it would for someone more used to hitting real limits. What looks like invulnerability from the outside is, mostly, just a very deep bench, not immunity. Because failure is so rare for you, you may have little practice recovering from it when it finally does happen. That inexperience with real failure can make an ordinary setback feel far more catastrophic than it actually is.`,
      invitation: `Name, honestly, the last time this toolkit truly wasn't enough. Let that moment stay a genuine data point instead of an exception you explain away. You are allowed to be this resourceful and still occasionally get caught out. What did that moment actually teach you?`,
    },
    9: {
      title: `Subconscious Self 9 — The Complete Toolkit`,
      mastery: `This card counts how many of the nine base numbers appear anywhere in your name, and a count of 9 is the maximum the system allows. Every one of the base digits shows up somewhere in you; there's no single instinct entirely absent from your makeup, only differences in how deeply each one has been developed. You rarely enter a situation with nothing at all to draw on, and people notice how consistently you land on your feet across genuinely different kinds of pressure. That completeness is genuinely rare, and it's worth naming as a real asset rather than treating it as ordinary.`,
      shadow: `The risk of having it all is relying on breadth instead of ever going properly deep anywhere — capable of a little of everything, masterful at nothing in particular. Composure this constant can also read to others as detachment, as if nothing ever really costs you anything, when in fact you're just well-equipped, not unaffected. That misreading can leave people less careful with you than they'd be with someone who visibly struggled. What looks like ease to everyone else may still be costing you something they never think to ask about.`,
      invitation: `Go deliberately deeper into one instinct this week instead of spreading your attention evenly. Pick the one that would matter most if you actually mastered it. You are allowed to have the full kit and still choose where to specialize. Which piece of it deserves the most investment right now?`,
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
      text: `Waiting for someone else to move first is a familiar position for you, more familiar than it is for most people — and the letters behind this number are the reason why: none of them appear anywhere in your name, so going first was never handed to you as a reflex. Classical numerology reads that kind of absence as unfinished, not broken. You are allowed to practice starting things before you feel fully ready, on purpose, treating initiative as a skill under construction rather than a trait you were simply born without.`,
    },
    2: {
      heading: `Karmic Lesson: 2 — Developing Patience and Partnership`,
      text: `Real cooperation — the kind that lets a partnership actually develop instead of getting rushed toward an outcome — asks for a patience that isn't wired into you by default. This is the one number with zero letters in your name to draw on, a genuine gap rather than a character flaw. You are allowed to build that patience deliberately, treating it as something worth practicing rather than something you should have arrived with already.`,
    },
    3: {
      heading: `Karmic Lesson: 3 — Developing Self-Expression`,
      text: `Putting yourself forward — creatively, socially, out loud — has probably never felt like the easy option. Numerologically, that tracks: this number is absent from every letter in your name, so visibility was never wired in as a default setting, only as unfinished work still worth doing. You are allowed to practice being seen and heard more openly, treating it as a skill you're building rather than a risk you're avoiding.`,
    },
    4: {
      heading: `Karmic Lesson: 4 — Developing Discipline and Structure`,
      text: `Think of this one as a muscle that's simply never been worked — not because you lack discipline as a trait, but because this number carries zero letters in your name, so steady, unglamorous follow-through was never built in as instinct. You are allowed to build that consistency on purpose, especially past the point something stops feeling exciting, treating it as something trainable rather than a fixed part of who you are.`,
    },
    5: {
      heading: `Karmic Lesson: 5 — Developing Adaptability`,
      text: `Sudden change tends to meet resistance in you before it meets curiosity — and there's a reason: not one letter in your name carries this number, so flexibility was never handed to you as a reflex the way it is for some people. Classical numerology treats that as a real gap, not a personal shortcoming. You are allowed to practice meeting the unexpected more openly, on purpose, as a skill still being built rather than proof of something missing.`,
    },
    6: {
      heading: `Karmic Lesson: 6 — Developing Responsibility to Others`,
      text: `Showing up consistently for the people and spaces closest to you can take more deliberate effort for you than it visibly takes for other people — this number simply isn't present anywhere in your name's letters, an area still being formed rather than evidence you don't care. You are allowed to build that responsibility on purpose, without needing to feel naturally inclined toward it first for it to actually count.`,
    },
    7: {
      heading: `Karmic Lesson: 7 — Developing Depth and Reflection`,
      text: `There's a particular kind of patience — sitting with a question long enough to actually understand it, instead of moving on at the first plausible answer — that isn't second nature here, because this number never once turns up in your name's letters. Numerology reads that as unfinished, not broken. You are allowed to practice that depth deliberately, as a skill worth building rather than a trait you were simply left without.`,
    },
    8: {
      heading: `Karmic Lesson: 8 — Developing a Healthy Relationship With Power`,
      text: `Money, authority, material responsibility — a steady, uncomplicated relationship with any of it isn't something you were handed automatically. The letters that carry this number are entirely absent from your name, a genuine gap rather than a judgment on your character. You are allowed to build that relationship deliberately, learning to hold real power without either grabbing for more of it or flinching away the moment it arrives.`,
    },
    9: {
      heading: `Karmic Lesson: 9 — Developing Broad Compassion`,
      text: `Caring instinctively about people and causes well outside your own immediate circle takes more conscious reaching for you than it does for people who happen to carry this number in their name — you don't, not in a single letter. An area still forming, not a verdict on your character. You are allowed to build that wider compassion on purpose, as something you practice rather than something you simply either have or don't.`,
    },
  };
  function get(num) { return data[num] || null; }
  return { get };
})();

window.DCornerstoneContent = (function () {
  const data = {
    1: {
      title: `Cornerstone 1 — You Begin by Leading`,
      mastery: `Every version of your name opens on the same letter, the one part of your own introduction you don't get to revise. Numerology reads it as your instinctive first move into anything new, and yours is to lead: walk in, take the initiative, set the direction before anyone else has decided to. A new opportunity reads to you as an invitation, not a threat. You'd usually rather propose the plan than wait for someone else's version of it, and unfamiliar territory tends to bring out more confidence in you than caution.`,
      shadow: `Moving first can mean moving before you've actually gathered enough context — mistaking decisiveness for readiness, and finding out the difference later than you'd like. It can also mean you rarely get the experience of being led well, because you've claimed the front position before anyone else had the chance to offer. Left unexamined, that pattern can leave you carrying the weight of every beginning alone, whether or not it needed to be yours. Others may quietly step back the moment you step forward, assuming, correctly, that you already have it handled.`,
      invitation: `Gather one extra piece of information before your next new start. Let someone else set the direction, just once, and notice what that's actually like. You are allowed to lead and still pause to learn first. Where has moving first outpaced what you actually knew?`,
    },
    2: {
      title: `Cornerstone 2 — You Begin by Listening`,
      mastery: `The letter that opens your name has been fixed since before you had any say in it, the one unchangeable part of your own introduction. Numerology reads it as your instinctive first move into anything new, and yours is to watch first: read the room, gather information, engage once you actually understand what you're stepping into. A new environment tends to get a quiet observation period from you before you fully join it. You'd rather understand the dynamics of a room than speak into it blind.`,
      shadow: `Observation mode can run past its usefulness, and a real opportunity can quietly close while you're still gathering information you already have enough of. Caution this early can also read to others as hesitation or disinterest, when it's actually just your particular form of care. Across enough repetitions, watching from the edge that long can leave you feeling like a spectator in rooms you were fully entitled to join. The gathering itself can start to feel safer than the joining, even once you've genuinely gathered enough.`,
      invitation: `Act on your read of a situation sooner than usual this week. Give yourself a deadline for the observation phase before you commit to it. You are allowed to observe closely and still move at a reasonable pace. Where has caution at the start cost you something worth having?`,
    },
    3: {
      title: `Cornerstone 3 — You Begin by Expressing`,
      mastery: `Your name has opened on this same letter every time it's been written, unchosen and unchangeable. Numerology reads it as your instinctive first move into anything new, and yours is to engage out loud: talk, connect, make an impression right at the start rather than hang back and observe. A new room tends to hear from you fairly quickly, rather than after a long silent stretch. Humor and warmth are your default tools for building rapport at the start of something, and sociability shows up early and easily for you.`,
      shadow: `Talking before you've fully thought something through can mean making an impression before you actually understand what you've stepped into. It can also mean people form a first read of you based on charm alone, before they've seen the substance that's actually there underneath it. That first impression can be surprisingly hard to correct later, even once the deeper substance shows itself. Being underestimated on substance, for someone this quick with warmth, can sting more than it should.`,
      invitation: `Pause one extra beat before speaking at the start of something new this week. Let the room finish forming its first impression before you fill the silence. You are allowed to be expressive and still consider first. Where has the impression outpaced the understanding?`,
    },
    4: {
      title: `Cornerstone 4 — You Begin by Planning`,
      mastery: `The letter your name opens on has never changed and never will, the one fixed piece of your own introduction. Numerology reads it as your instinctive first move into anything new, and yours is to build a framework first: structure the approach before committing real momentum to it. A new project tends to get organized before it gets exciting. You're generally more comfortable beginning once there's at least a rough plan in place, and deliberateness, more than eagerness, tends to define how you start things.`,
      shadow: `Planning can tip into stalling, with the plan itself quietly standing in for the actual start rather than preparing you for it. It can also mean you miss windows that reward speed over structure, because the plan simply wasn't finished yet when the moment actually opened. The comfort of preparation can feel like progress even in the moments it's actually functioning as delay. That confusion is exactly what makes stalling so hard for you to catch in yourself.`,
      invitation: `Begin one thing this week with noticeably less planning than usual. Set a hard cutoff for how much preparation you'll allow yourself before you have to start. You are allowed to be methodical and still start before everything's mapped. Where has the plan become the obstacle instead of the preparation?`,
    },
    5: {
      title: `Cornerstone 5 — You Begin by Exploring`,
      mastery: `Your name has opened on the same letter every single time it's been written, a fact, not a choice. Numerology reads it as your instinctive first move into anything new, and yours is to try it directly: dive in, adjust based on what you find, rather than planning it out extensively beforehand. A new opportunity tends to get an eager, hands-on response from you before it gets a plan. You learn a situation faster by touching it than by studying it, and enthusiasm, more than caution, defines your early moves.`,
      shadow: `Jumping in without any real foundation can look like readiness when it's actually just eagerness, a distinction that tends to surface later than you'd want. It can also mean you abandon a genuinely promising start once the initial novelty wears off, before the real work has even begun. Other people can be left holding the follow-through you were excited enough to start but not to finish. That pattern, repeated, can quietly cost you credibility you'd otherwise have earned.`,
      invitation: `Build in one moment of preparation before your next new start. Ask one question you'd normally skip on your way in. You are allowed to explore and still ground yourself first. Where has eagerness outpaced any real foundation underneath it?`,
    },
    6: {
      title: `Cornerstone 6 — You Begin by Considering Others`,
      mastery: `Your name has opened on this same letter for as long as it's existed, unchosen and unchangeable. Numerology reads it as your instinctive first move into anything new, and yours runs through the people it affects: who's involved, how a beginning will land on them, before you commit to it purely on your own terms. A new opportunity tends to get filtered through its impact on people close to you before you fully commit to it. Their needs often factor in earlier than your own do, and thoughtfulness, more than self-interest, shapes how you start things.`,
      shadow: `Consideration for others can quietly delay a beginning that was genuinely yours to make, deferring something good simply because it wasn't unanimously convenient. It can also mean you rarely find out what you'd choose if no one else's reaction were part of the calculation. Unchecked, that habit can quietly hand veto power over your life to people who never actually asked for it. Genuine kindness and simple avoidance can end up looking identical, even to you.`,
      invitation: `Start one thing this week primarily because it's right for you, not because everyone's signed off on it. Notice how it feels to decide before you've checked with anyone. You are allowed to consider others and still claim a beginning as your own. Where has care for others' input become an excuse to stall?`,
    },
    7: {
      title: `Cornerstone 7 — You Begin by Understanding`,
      mastery: `The letter your name opens on has never once changed, the one fixed note of your own introduction. Numerology reads it as your instinctive first move into anything new, and yours is to understand it first: resist committing until you've genuinely grasped what you're actually stepping into. A new opportunity gets real scrutiny from you before it gets your commitment. You ask more questions at the outset than most people think to ask, and thoughtfulness, more than speed, defines your early moves.`,
      shadow: `Analysis can run past the point of usefulness, and a genuinely good opportunity can pass you by while you're still working to fully understand it. It can also mean you use the search for understanding as a socially acceptable reason to keep avoiding an actual decision. The pursuit of clarity can quietly become its own form of hiding, one that looks like diligence from the outside. Because the delay looks so reasonable, even you may not notice it's actually avoidance.`,
      invitation: `Commit to one new thing this week with slightly less certainty than you'd normally require. Set a deadline for how long you'll research before you have to choose. You are allowed to want understanding and still act before it's complete. Where has needing full clarity kept you from something worth taking anyway?`,
    },
    8: {
      title: `Cornerstone 8 — You Begin by Assessing the Stakes`,
      mastery: `Your name has opened on this exact letter every time it's been written, a fact you inherited, not one you chose. Numerology reads it as your instinctive first move into anything new, and yours runs through the stakes: what's actually at risk, materially and practically, before you commit real effort to it. A new opportunity gets weighed for tangible value before it gets your investment. You think in terms of return more than most people do at the outset, and seriousness, more than instinct, defines how you begin things.`,
      shadow: `A sharp eye for stakes can quietly filter out something genuinely meaningful, simply because its payoff wasn't immediately obvious in material terms. It can also mean you delay starting things you actually want, waiting for a business case that some genuinely good beginnings will never provide. That standard, applied evenly to everything, can quietly rule out the very things that would have mattered most. The parts of life that resist measurement can end up permanently postponed by a mind built to measure.`,
      invitation: `Begin one thing this week purely because it matters to you, independent of any practical payoff. Let it be enough that it's meaningful, not provably worthwhile. You are allowed to assess stakes and still start something with no guaranteed return. Where has your practical eye filtered out something worth taking anyway?`,
    },
    9: {
      title: `Cornerstone 9 — You Begin by Considering the Bigger Picture`,
      mastery: `The letter opening your name has been fixed for as long as your name has existed, the one unchosen constant of your own introduction. Numerology reads it as your instinctive first move into anything new, and yours runs through scale: how a beginning connects to something larger than the immediate moment. A new opportunity gets weighed for its broader meaning before it gets your commitment. You ask how something fits a bigger picture more than most people think to at the start of a project, and idealism, more than pragmatism, shapes how you begin things.`,
      shadow: `A focus this wide can miss the practical, immediate details right in front of you, a beginning beautifully framed and poorly grounded. It can also make ordinary, smaller-scale beginnings feel not worth your attention, even when they're exactly the ones that need it. Grand framing can end up substituting for the unglamorous groundwork that would have actually made it real. The bigger the vision, the easier it becomes to overlook the small first step that actually starts it.`,
      invitation: `Attend to one small, practical detail before your next new start. Let a beginning matter this week simply because it's in front of you, not because it's large. You are allowed to think big and still handle the immediate logistics. Where has the wider picture distracted from what actually needed handling first?`,
    },
  };
  function get(num) { return data[num] || null; }
  return { get };
})();

window.DCapstoneContent = (function () {
  const data = {
    1: {
      title: `Capstone 1 — You Finish by Claiming It as Yours`,
      mastery: `Every formal version of your name closes on the same letter, the last word your own name always gets, whether you notice it or not. Numerology reads it as how you actually follow through, and yours is decisive: an ending is real to you once it's unmistakably owned, not diffused across a group. Clear, individual credit or responsibility matters to you once something's actually done. A finished result satisfies you more when it's unmistakably yours, and decisiveness tends to show up strongest right at the close of something, not the start.`,
      shadow: `Owning the ending can tip into over-claiming a result that was genuinely shared, or resisting a needed late change simply because it wasn't your idea to begin with. It can also mean collaborators quietly stop offering input near the finish line, sensing that the final word is already yours regardless. Over time, that pattern can leave you finishing things more alone than they ever needed to be. Decisiveness at the close can quietly cost you the last useful idea someone else was about to offer.`,
      invitation: `Share credit for one finished thing this week, genuinely, out loud. Name specifically what someone else contributed before you name your own part. You are allowed to finish decisively and still name who helped. Where has claiming an ending left out people who actually earned part of it?`,
    },
    2: {
      title: `Capstone 2 — You Finish by Making Sure Everyone's Included`,
      mastery: `Your name closes on this exact letter every time it's written, fixed, not chosen. Numerology reads it as how you actually follow through, and yours is collaborative: something isn't truly finished for you until everyone involved genuinely agrees it is. Explicit agreement matters to you before you'll call something done. An ending feels incomplete if someone involved still seems uneasy about it, and thoroughness about other people's input tends to show up strongest right at the close.`,
      shadow: `Waiting for full agreement can mean never quite closing something out, because there's always one more approval left to gather before it counts as done. It can also hand real decision-making power to whichever person is slowest to sign off, simply because you won't finish without them. That single holdout can end up controlling the timeline of something that was otherwise ready. Genuine consensus and simple stalling can end up looking identical from the outside.`,
      invitation: `Declare one thing finished this week without waiting for full unanimous buy-in. Set a deadline for input, and honor it even if someone hasn't responded. You are allowed to seek consensus and still set a real endpoint. Where has an ending stayed open longer than it needed to?`,
    },
    3: {
      title: `Capstone 3 — You Finish With a Flourish`,
      mastery: `The final letter of your name has never changed, a fact your own name simply carries. Numerology reads it as how you actually follow through, and yours wants to be felt: an ending that's visible, sometimes celebrated, not quietly folded away without acknowledgment. Some form of recognition matters to you once something's finished, even a small one. A quiet, unremarked ending tends to feel slightly hollow, and showmanship shows up naturally right at the close of things.`,
      shadow: `Wanting the bigger, more visible finish can delay the actual ending, or leave you frustrated when a genuinely good ending doesn't get the recognition you feel it earned. It can also mean you privately rank your endings by how much notice they got, rather than by what they actually accomplished. That ranking can quietly diminish work that mattered just because it happened without an audience. The absence of applause can start to feel like the absence of a real accomplishment, even when it wasn't.`,
      invitation: `Let one thing this week end quietly, with no flourish attached. Notice what it's like to call something done without telling anyone. You are allowed to want recognition and still let some endings pass unremarked. Where has needing a visible finish been holding up a real one?`,
    },
    4: {
      title: `Capstone 4 — You Finish by Making It Solid`,
      mastery: `Your name closes on this same letter every time it's written, a permanent fact of it. Numerology reads it as how you actually follow through, and yours is structural: something counts as finished only once it's genuinely durable, checked, and built to hold. Real assurance that something will hold up matters to you before you'll move on from it. Loose ends bother you more than they bother most people, and thoroughness tends to define your endings more than your beginnings.`,
      shadow: `The pursuit of durability can mean never quite reaching an actual finish, because there's always one more detail that could theoretically be made more solid. It can also mean you hold a finished thing back from the people waiting on it, in service of a completeness only you can see the gap in. That delay can cost more than the theoretical flaw it was meant to prevent. The gap you're chasing can keep moving, since a mind built for solidity can always imagine one more improvement.`,
      invitation: `Call one thing finished this week at "solid enough" instead of "perfectly certain." Ship it before the last check feels fully done. Notice what actually happens when you do. You are allowed to want durability and still accept a reasonable stopping point. Where has certainty-seeking kept something from ever being called done?`,
    },
    5: {
      title: `Capstone 5 — You Finish by Moving On`,
      mastery: `The last letter of your name has stayed the same every time it's been written, a fixed fact, not a preference. Numerology reads it as how you actually follow through, and yours is fast: complete the essential work, then move, with little appetite for lingering. Restlessness tends to set in once a project's essentially wrapped. Lingering on something finished appeals to you less than starting the next thing, and momentum, more than closure, defines how your endings feel.`,
      shadow: `Moving fast can leave a project's less exciting final details unattended, technically done, but not actually finished. It can also mean you deny yourself the satisfaction of a completed thing, moving on before you've actually let it register as accomplished. Left unaddressed, that habit can leave a long trail of almost-finished work behind you, each one a little more finished than you gave it credit for. The next thing always feels more alive than the last thing did, which makes the loose ends easy to keep excusing.`,
      invitation: `Stay with one finished thing this week slightly longer than your instinct wants. Notice what it feels like before you let yourself move on. You are allowed to move quickly and still tie off the loose ends first. Where has your hurry left something less complete than it looked?`,
    },
    6: {
      title: `Capstone 6 — You Finish by Making Sure Everyone's Cared For`,
      mastery: `Your name has closed on this exact letter every time it's been written, fixed, not chosen. Numerology reads it as how you actually follow through, and yours is relational: an ending isn't complete until the people affected by it are genuinely okay. Checking in on people matters to you once a situation is wrapping up, beyond the practical logistics. An ending feels incomplete if someone involved seems hurt or unsettled by it, and tenderness, more than efficiency, defines how you close things out.`,
      shadow: `Concern for how an ending lands can delay a needed one, prolonging something past its natural close just to soften the impact. It can also mean you absorb other people's discomfort about an ending as your own responsibility to manage, even when it genuinely isn't. Carrying that extra weight repeatedly can leave you exhausted by endings that were never actually yours to smooth over. Kindness and delay can be genuinely hard to tell apart from the inside, especially at the moment you're choosing between them.`,
      invitation: `Let one ending be direct this week, even if it's not entirely comfortable for everyone. Say the thing plainly instead of softening it first. You are allowed to care about people and still close something out cleanly. Where has softening an ending actually just delayed it?`,
    },
    7: {
      title: `Capstone 7 — You Finish by Fully Understanding It`,
      mastery: `Your name closes on the same letter every time it's written, a permanent fact, not a choice. Numerology reads it as how you actually follow through, and yours is reflective: an ending isn't complete until you genuinely understand what happened and why. Processing a finished project fully matters to you before you'll consider it truly over. Endings tend to prompt real reflection in you, more than they do for most people, and depth, more than speed, defines how you close things out.`,
      shadow: `Reflection can outlast the practical ending it was meant to process, analyzing something that's genuinely already done. It can also mean you keep revisiting a closed chapter privately long after everyone else has moved on, mistaking that rumination for necessary understanding. The search for a final answer can quietly become the thing keeping the ending from actually ending. Some understanding only ever arrives with time and distance, not with one more round of analysis.`,
      invitation: `Declare one thing over this week before you've fully processed every part of it. Give yourself a set amount of reflection time, then actually stop. You are allowed to want understanding and still let an ending actually end. Where has reflecting stood in for genuinely moving on?`,
    },
    8: {
      title: `Capstone 8 — You Finish by Measuring the Result`,
      mastery: `The final letter of your name has never once changed, a fact it simply carries. Numerology reads it as how you actually follow through, and yours is results-oriented: something's genuinely finished once there's a clear, measurable outcome to point to. Concrete proof of success matters to you before you'll call a project complete. Ambiguous outcomes unsettle you more than they unsettle most people, and rigor, more than sentiment, defines how you close things out.`,
      shadow: `Needing a measurable result can mean discounting a genuinely meaningful ending simply because its value was harder to quantify. It can also mean you rush past the human side of a finish, the part that isn't on the scoreboard, in favor of the number that is. Given enough repetition, that habit can leave the felt experience of finishing something feeling strangely hollow. The number can start to feel more real than the thing it was only ever meant to represent.`,
      invitation: `Call one thing finished this week based on how it felt, not just what it measurably produced. Name the soft outcome as a real one, out loud. You are allowed to want results and still count a soft success as real. Where has needing a measurable outcome discounted something that actually mattered?`,
    },
    9: {
      title: `Capstone 9 — You Finish by Considering What It Leaves Behind`,
      mastery: `Your name has closed on this exact letter for as long as it's existed, a fact, not a preference. Numerology reads it as how you actually follow through, and yours is legacy-minded: an ending matters for what it leaves behind, not just for the immediate result. The broader impact of a finished project tends to occupy you as much as its immediate outcome. Endings prompt you to consider what comes next for everyone involved, not only for you, and generosity, more than urgency, defines how you close things out.`,
      shadow: `A focus this wide can miss the immediate, practical details right in front of you, an ending well-considered in theory, loose in the actual particulars. It can also delay a close that simply needed to happen now, while you weigh implications that were never actually yours to resolve. The bigger picture can become a reason to avoid the smaller, more uncomfortable task of actually finishing. Legacy is easier to think about than the unglamorous, immediate work of tying off the loose ends in front of you.`,
      invitation: `Attend to one immediate, practical detail this week before considering the bigger picture of an ending. Finish the small, boring part first. You are allowed to think about legacy and still handle what's right in front of you first. Where has the wider view distracted from what needed closing out?`,
    },
  };
  function get(num) { return data[num] || null; }
  return { get };
})();

// Bridge Number — |Life Path - Expression|, reduced. Needs both a
// birthdate and a name (like Maturity), so it's gated behind the same
// optional name input as everything else in this file.
window.DBridgeContent = (function () {
  const data = {
    0: {
      title: `Bridge 0 — What You Want and How You Act Are the Same Thing`,
      mastery: `Reduce the distance between your Life Path and your Expression number down to its simplest form, and for you it lands on zero, no gap at all. The number describing what your life is fundamentally about and the number describing how you naturally act turn out, after reduction, to be the same underlying number. Your daily actions tend to already point toward your deeper purpose without you having to force the connection. People who know you well would probably describe your life as coherent, and you likely spend less energy than most people reconciling who you are with what you're doing.`,
      shadow: `The risk of alignment this complete is complacency, assuming the fit will always hold without maintenance, and being genuinely thrown when life eventually asks you to grow in a direction your current alignment didn't anticipate. It can also make you less practiced at the ordinary work of realigning purpose and action, simply because you've rarely had to do it deliberately. When change does eventually arrive, the unfamiliarity of the effort itself can feel like a bigger problem than it actually is. What would be routine adjustment for someone with a wider gap can, for you, feel like a genuine crisis of identity.`,
      invitation: `Notice one place this week where this ease might be masking a change that's actually due. Ask yourself what growth would require you to change first, purpose or action. You are allowed to have real alignment and still keep checking it. Where might comfort be standing in for growth?`,
    },
    1: {
      title: `Bridge 1 — A Narrow, Easily Closed Gap`,
      mastery: `Reduce the distance between your Life Path and your Expression number, and for you it comes out to almost nothing, a gap of one. What your life is fundamentally about and how you naturally act sit close enough together that closing the remaining space rarely takes much conscious effort. Your instinctive actions usually serve your deeper purpose without much translation required. Small course corrections, when they're needed, tend to come easily, and you probably don't think of yourself as someone who has to "work at" alignment.`,
      shadow: `A gap this small is easy to stop noticing entirely, and the one place it does show up can go unaddressed simply because it's too minor to seem worth the attention. Because the fit is so close, you may also assume it will always stay that way without checking, until the one thread finally pulls. A small mismatch, left long enough, can quietly grow simply because nothing ever forced you to notice it. The near-total ease of the rest of the bridge can make the one loose thread easy to keep dismissing.`,
      invitation: `Name the one place this week where want and action don't quite match. Give that single thread real attention instead of letting the rest of the ease excuse it. You are allowed to have an easy alignment and still tend to its one loose thread. What small adjustment have you been letting slide because the rest already works?`,
    },
    2: {
      title: `Bridge 2 — A Light, Manageable Distance`,
      mastery: `Reduce the distance between your Life Path and your Expression number and you land on two, a light, genuinely manageable gap between what your life is fundamentally about and how you naturally act. You likely notice fairly quickly when your day-to-day actions have drifted from what actually matters to you, and correcting course doesn't usually take long. The gap shows up more as minor friction than real conflict, and most days, purpose and behavior cooperate without much negotiation. That light touch means the maintenance rarely feels like a burden, more like an occasional, easy adjustment.`,
      shadow: `A distance this manageable can be ignored precisely because it's manageable, letting small, repeated drift accumulate into something bigger than any single instance would suggest. Because each individual gap feels trivial, you may not notice the pattern until several of them have stacked up. The very lightness of the gap is what lets it go unattended long enough to matter. A correction that would have taken minutes early gets harder to make the longer the drift compounds.`,
      invitation: `Close one small gap this week between something you want and something you're actually doing about it. Do it before drift has a chance to compound. You are allowed to have an easy bridge and still walk across it on purpose. Where has minor drift been adding up quietly?`,
    },
    3: {
      title: `Bridge 3 — A Real but Bridgeable Gap`,
      mastery: `Reduce the distance between your Life Path and your Expression number and you get three, a real, noticeable gap between what your life is fundamentally about and how you naturally act. It's not so wide that it defines your daily experience, but it's wide enough that the two don't automatically line up without you doing something about it. You likely feel a genuine pull in two directions sometimes, one toward what you know matters, one toward what actually comes naturally in the moment. Bridging the two usually takes a deliberate decision rather than an automatic one, and the effort is real but rarely overwhelming.`,
      shadow: `A gap this size, left unattended, tends to widen slowly, small, repeated choices to act on impulse instead of purpose, each one small enough to excuse, until the distance is bigger than it started. Left long enough, it can start to feel like two competing versions of you rather than one person with a manageable gap. Each individual excuse feels reasonable in the moment, which is exactly what makes the pattern hard to catch. Only in hindsight does the accumulated drift usually become visible for what it actually is.`,
      invitation: `Make one deliberate choice this week that closes the gap instead of widening it. Notice which direction you default to when no one's watching. You are allowed to need effort here, it doesn't mean something's wrong. Which direction have you been drifting without quite deciding to?`,
    },
    4: {
      title: `Bridge 4 — A Genuine Structural Gap`,
      mastery: `Reduce the distance between your Life Path and your Expression number and you land on four, a real, structural gap between what your life is fundamentally about and how you naturally act. The two aren't opposed, but they don't share a wall either; building the connection between them takes actual, sustained effort rather than a passing adjustment. You likely notice, more often than someone with a smaller gap, that your instinctive actions and your deeper sense of purpose want different things in the moment. Bridging them tends to require real intention, applied consistently rather than once.`,
      shadow: `A gap this size, without ongoing attention, can settle into two separate tracks that stop actively talking to each other, a life that technically functions but has quietly split into a "what I want" side and a "what I do" side. That split can feel invisible from the inside, precisely because both tracks are still moving. Functioning fine on both tracks can quietly mask how disconnected they actually are from each other. It often takes an outside observer to notice the split before you do.`,
      invitation: `Build one small, repeated habit this week that deliberately connects the two. Make it something you can actually sustain, not a one-time gesture. You are allowed to need real structure here. What would a genuine bridge, built on purpose, actually look like for you?`,
    },
    5: {
      title: `Bridge 5 — A Wide Gap That Wants Real Attention`,
      mastery: `Reduce the distance between your Life Path and your Expression number and you get five, a wide gap between what your life is fundamentally about and how you naturally act. Left alone, the two genuinely drift; closing the distance is real, ongoing work, not a one-time fix. You likely feel the pull between purpose and instinct fairly often, sometimes as real internal friction rather than mild inconvenience. Actions that come naturally to you don't automatically serve what you actually care about most, and bridging the two probably requires conscious, repeated choice.`,
      shadow: `Left unattended, a gap this wide tends to produce a life that looks active and busy on the surface while quietly drifting further from what actually matters underneath it. The busyness itself can become a cover, something that lets the drift go unnoticed because there's always visible activity to point to. Other people, seeing the activity, may assume you're on track even as the gap quietly widens underneath it. That mistaken reassurance from the outside can make the drift even easier to keep ignoring.`,
      invitation: `Name, honestly, one recurring action this week that pulls you away from your deeper purpose. Choose a single, repeatable way to redirect it. You are allowed to need real, ongoing attention here. What would it take to make that action serve the purpose instead of competing with it?`,
    },
    6: {
      title: `Bridge 6 — A Substantial Gap Between Purpose and Instinct`,
      mastery: `Reduce the distance between your Life Path and your Expression number and you land on six, a substantial gap between what your life is fundamentally about and how you naturally act. The two aren't at war, but they clearly aren't the same conversation either, and bridging them takes real, deliberate architecture, not a quick patch. You likely experience a genuine split, at times, between what you know matters and what you actually reach for. Bridging the two tends to be effortful, ongoing work rather than an occasional correction.`,
      shadow: `A gap this size, without real attention, can produce a life that runs efficiently on autopilot while drifting steadily away from anything that would actually feel meaningful in hindsight. Instinctive action and deeper purpose can pull hard enough in different directions that ignoring the tension isn't really an option, even when it's tempting. The efficiency of the autopilot can be exactly what makes the drift so hard to notice in real time. By the time the meaninglessness registers, the habits driving it can already feel fixed.`,
      invitation: `Choose one action this week specifically because it serves your deeper purpose, even when instinct points elsewhere. Do it even though it isn't the automatic choice. You are allowed to need real, sustained work on this bridge. Where has autopilot been quietly running the show?`,
    },
    7: {
      title: `Bridge 7 — A Deep Gap Worth Taking Seriously`,
      mastery: `Reduce the distance between your Life Path and your Expression number and you get seven, a deep gap between what your life is fundamentally about and how you naturally act. This isn't a small misalignment; it's a genuine, structural distance that asks for real, ongoing attention if the two are ever going to cooperate reliably. You likely feel real tension, more often than not, between what you're instinctively drawn to do and what you know your life is actually about. Bridging them tends to require deliberate, sustained effort, not a single decision, but a practice.`,
      shadow: `Left unattended, a gap this deep tends to produce real internal conflict, a life that technically works but quietly feels like it's being lived by two different people taking turns. The two can feel like separate forces rather than a single coherent pull, which makes any single fix feel inadequate to the actual scale of the gap. That scale can also make the gap feel permanent, when in fact it's simply a larger amount of the same ordinary work. Feeling like two people can be genuinely exhausting long before you've named what's actually happening.`,
      invitation: `Name, plainly, one place this week where instinct and purpose are actively pulling apart. Build one genuine plank of the bridge today, however small. You are allowed to take this gap seriously without treating it as a crisis. What would it take to build one genuine plank of the bridge, today?`,
    },
    8: {
      title: `Bridge 8 — The Widest Possible Gap`,
      mastery: `Reduce the distance between your Life Path and your Expression number and you land on eight, the widest gap this reduction can produce. What your life is fundamentally about and how you naturally act sit about as far apart as this system allows, meaning the bridge between them has to be built consciously, deliberately, and more or less continuously. You likely experience a real, recurring split between instinct and purpose, actions that come easily rarely serve what you actually care about most without deliberate redirection. The upside is that the bridge, once built, tends to be unusually strong, precisely because it was never accidental.`,
      shadow: `Left completely unattended, a gap this wide can split into two genuinely separate lives, one lived on instinct, one held privately as "what actually matters," with less and less traffic running between them over time. This isn't a flaw in your chart; it's simply more construction work than most people are asked to do, but it does require you to keep showing up for it. Skipping even a little of that maintenance, given the scale of the gap, tends to show up faster than it would for anyone else. The two lives can start to feel like separate identities rather than two sides of one coherent person.`,
      invitation: `Build one deliberate connection this week between something you instinctively do and something you actually care about. Treat it as ongoing maintenance, not a project with an end date. You are allowed to need constant, conscious work here, it's not a failure, it's the actual shape of this particular chart. What's the first plank of that bridge?`,
    },
  };
  function get(num) { return data[num] || null; }
  return { get };
})();
