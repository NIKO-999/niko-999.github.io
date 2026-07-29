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
      why: `This number shows up more than any other across the letters of your name — not because you chose it, but because it's simply the pattern your name keeps returning to, over and over, almost involuntarily. For you, that recurring pattern is leadership and initiative: a genuine, well-worn capacity to go first, to originate, to take a room somewhere it wasn't already headed. The reason this qualifies as a "hidden" passion rather than an obvious one is that something this automatic to you can be easy to dismiss as unremarkable, simply because it's never once felt difficult.`,
      traits: `You probably step into leadership roles more often than you consciously register doing so. Starting new things likely feels less risky to you than it does to most people. You may downplay this capacity specifically because it comes so naturally it doesn't feel like a "talent" to you at all.`,
      shadow: `The risk of a passion this deeply worn-in is that you stop actively developing it, coasting on raw natural ability instead of sharpening it further — a real gift left slightly underused simply because it's never once demanded effort from you.`,
      path: `Try naming one place this week where you've been leading without giving yourself credit for it. You are allowed to take this talent seriously precisely because it feels effortless. Where has "it's just what I do" been quietly minimizing something real?`,
    },
    2: {
      heading: `Hidden Passion 2 — A Diplomacy You Keep Underselling`,
      why: `This number shows up more than any other across the letters of your name — an involuntary pattern, not a chosen one. For you, that recurring pattern is sensitivity and diplomacy: a genuine, well-worn talent for reading people, mediating tension, and holding two sides of a disagreement without needing either one to lose. Because this comes to you so automatically, it's easy to treat it as unremarkable — simply "how you are" rather than a real skill other people have to work much harder to develop.`,
      traits: `You likely notice unspoken tension in a room before anyone names it. Mediating conflict probably feels more natural to you than most people find it. You may genuinely underestimate how rare this particular sensitivity actually is.`,
      shadow: `The risk of a passion this automatic is that you stop actively refining it, relying on raw instinct instead of deliberately building it into something even sharper — a real gift left slightly underused simply because it's never once felt like work.`,
      path: `Try naming one moment this week where your read on a situation was quietly the reason it went well. You are allowed to take credit for a talent that feels effortless. Where has this sensitivity been working invisibly, without acknowledgment?`,
    },
    3: {
      heading: `Hidden Passion 3 — A Creative Voice You Keep Underselling`,
      why: `This number shows up more than any other across the letters of your name — a recurring pattern you didn't choose, simply the shape your name keeps returning to. For you, that shape is creative self-expression: a real, well-worn gift for words, humor, and making things and people feel more alive. Because this ability arrives so effortlessly, it's easy to treat it as simply your personality rather than a genuine, developable talent worth real investment.`,
      traits: `You likely find self-expression easier than most people find it, in conversation or in creative work. Making a room laugh or feel something probably happens for you without conscious effort. You may treat this gift casually specifically because it's never once felt hard-won.`,
      shadow: `The risk of a passion this automatic is that it stays a party trick rather than becoming a genuinely developed craft — natural talent left slightly underused because putting in real, structured effort has never felt necessary.`,
      path: `Try taking one piece of creative work more seriously this week than you normally would. You are allowed to invest real effort in something that already comes easily. What have you been treating as "just for fun" that's actually worth building?`,
    },
    4: {
      heading: `Hidden Passion 4 — A Discipline You Keep Underselling`,
      why: `This number shows up more than any other across the letters of your name — an involuntary recurring pattern, not a deliberate choice. For you, that pattern is discipline and reliability: a genuine, well-worn capacity for structure, follow-through, and steady, patient effort other people often find much harder to sustain. Because this comes to you so automatically, it's easy to underrate — simply "how you operate" rather than a rare and real strength.`,
      traits: `You likely maintain routines and commitments more consistently than most people around you. Long, unglamorous tasks probably don't discourage you the way they discourage others. You may take this steadiness for granted precisely because it's never once required visible willpower.`,
      shadow: `The risk of a passion this automatic is that you never actively develop it further, letting it run on autopilot instead of aiming it deliberately at something that would actually benefit from this much sustained attention.`,
      path: `Try pointing this steady discipline at one goal this week that actually deserves it. You are allowed to take your own reliability seriously. Where has this strength been running on autopilot instead of being aimed somewhere on purpose?`,
    },
    5: {
      heading: `Hidden Passion 5 — An Adaptability You Keep Underselling`,
      why: `This number shows up more than any other across the letters of your name — a pattern you didn't consciously choose, simply the one your name keeps returning to. For you, that pattern is adaptability and resourcefulness: a real, well-worn talent for handling change and uncertainty with an ease most people never quite develop. Because this ability feels so natural, it's easy to dismiss it as simple flexibility rather than recognizing it as a genuine, valuable skill.`,
      traits: `You likely adjust to new situations faster than most people you know. Uncertainty probably unsettles you noticeably less than it unsettles others. You may undervalue this specifically because it's never once felt like a skill you had to build.`,
      shadow: `The risk of a passion this automatic is that you never consciously refine it, treating it as luck or personality rather than a genuine strength that could be deployed even more deliberately.`,
      path: `Try naming one recent moment where your adaptability quietly saved a situation. You are allowed to recognize this as a real skill, not just good luck. Where has your own flexibility gone completely unacknowledged?`,
    },
    6: {
      heading: `Hidden Passion 6 — A Devotion You Keep Underselling`,
      why: `This number shows up more than any other across the letters of your name — an involuntary recurring pattern, simply the shape your name keeps returning to. For you, that shape is care and responsibility: a genuine, well-worn gift for nurturing people, spaces, and relationships in a way that makes them noticeably better for your attention. Because this comes so naturally, it's easy to treat it as simply your personality rather than recognizing how rare this particular devotion actually is.`,
      traits: `You likely notice what a person or space needs before anyone's asked you to. Caretaking probably requires less conscious effort from you than it does from most people. You may underrate this gift precisely because it's never once felt like a skill you had to learn.`,
      shadow: `The risk of a passion this automatic is that it stays reactive rather than becoming something you consciously build and direct — real devotion left slightly underused because it's never had to be deliberately developed.`,
      path: `Try naming one place this week where your care for someone was the actual reason things went well. You are allowed to take credit for a gift that feels effortless. Where has your devotion been working invisibly, unacknowledged?`,
    },
    7: {
      heading: `Hidden Passion 7 — An Insight You Keep Underselling`,
      why: `This number shows up more than any other across the letters of your name — a recurring pattern you didn't choose, simply the one your name keeps returning to. For you, that pattern is depth and analysis: a real, well-worn talent for understanding things fully, seeing past the surface explanation most people settle for. Because this ability arrives so automatically, it's easy to underrate — simply "how your mind works" rather than a genuine, rare capability.`,
      traits: `You likely reach real understanding of complex things faster than most people around you. Surface-level explanations probably satisfy you less than they satisfy others. You may treat this depth casually specifically because it's never once felt effortful.`,
      shadow: `The risk of a passion this automatic is that it stays entirely private, understanding kept to yourself rather than deliberately shared or built into something other people can actually benefit from.`,
      path: `Try sharing one piece of understanding this week that you'd normally have kept to yourself. You are allowed to take this depth seriously enough to actually offer it. What insight have you been sitting on that's genuinely ready to be spoken?`,
    },
    8: {
      heading: `Hidden Passion 8 — An Executive Capacity You Keep Underselling`,
      why: `This number shows up more than any other across the letters of your name — an involuntary recurring pattern, not a deliberate choice. For you, that pattern is executive capability: a genuine, well-worn talent for turning ambition into tangible results, for handling real responsibility without flinching from its weight. Because this comes to you so automatically, it's easy to underrate it — simply "how you get things done" rather than a rare and valuable strength.`,
      traits: `You likely take on responsibility more comfortably than most people around you do. Following through on ambitious plans probably feels less daunting to you than it does to others. You may undersell this capability precisely because it's never once felt like a struggle.`,
      shadow: `The risk of a passion this automatic is that you never point it deliberately at something worthy of its full scale, letting real capability run on smaller, safer tasks than it's actually built for.`,
      path: `Try aiming this capability at one genuinely ambitious goal this week instead of a safe one. You are allowed to take your own competence seriously. Where has this strength been underused simply because it's never demanded a real challenge?`,
    },
    9: {
      heading: `Hidden Passion 9 — A Compassion You Keep Underselling`,
      why: `This number shows up more than any other across the letters of your name — a pattern you didn't consciously choose, simply the one your name keeps returning to. For you, that pattern is broad, generous compassion: a real, well-worn capacity to feel for people beyond your own immediate circle, to care about causes and outcomes larger than your personal stake in them. Because this feels so natural, it's easy to treat it as simply your temperament rather than recognizing it as a genuine and rare gift.`,
      traits: `You likely feel for people you've never met more readily than most people do. Causes bigger than your own life probably move you more than they move others. You may underrate this compassion precisely because it's never once felt like effort.`,
      shadow: `The risk of a passion this automatic is that it stays diffuse, felt broadly but never focused or acted on deliberately, real compassion left slightly underused because it's never been aimed at something specific enough to build.`,
      path: `Try directing this compassion at one specific action this week, rather than a general feeling. You are allowed to take this gift seriously enough to actually act on it. What cause or person have you been feeling for without ever doing anything about it?`,
    },
  };
  function get(num) { return data[num] || null; }
  return { get };
})();

window.DSubconsciousSelfContent = (function () {
  const data = {
    1: {
      heading: `Subconscious Self 1 — A Narrow but Sharp Toolkit`,
      why: `This number measures something different from every other reading in this chart — not what you want, act on, or appear as, but how much of the raw 1-through-9 toolkit is actually present in your name at all, and how resourceful that leaves you under real pressure. A count this low means your internal toolkit runs narrow but sharp: you rely heavily on a small number of instincts, which can make you extremely decisive in the situations those instincts cover, and noticeably less equipped everywhere else.`,
      traits: `You likely have a small number of go-to responses you reach for in a crisis, used with real confidence. Situations outside that narrow range probably rattle you more than they'd rattle someone with a broader toolkit. Your decisiveness in familiar territory tends to be genuinely impressive.`,
      shadow: `The risk of a narrow toolkit is being caught without a ready response when a situation falls outside your handful of reliable instincts — confidence in familiar territory that doesn't automatically transfer to unfamiliar ground.`,
      path: `Try naming one kind of pressure that reliably catches you off guard. You are allowed to have a narrow toolkit and still build it out deliberately. Where would one new instinct actually help you most?`,
    },
    2: {
      heading: `Subconscious Self 2 — A Small but Growing Toolkit`,
      why: `This number measures your internal resourcefulness under real pressure — how many of the raw 1-through-9 instincts are actually present in your name at all. A count this low still leaves you with a genuinely usable toolkit, just a compact one; you can meet a fair range of situations, but the edges of your composure tend to show up sooner than they would for someone carrying a wider set of instincts.`,
      traits: `You probably handle a reasonable range of everyday pressure without much trouble. Genuinely novel situations likely test you more than familiar ones do. Your confidence tends to be real, just bounded by a smaller set of proven responses.`,
      shadow: `The risk of a toolkit this size is running low on options right at the edge of your comfort zone — composure that holds steady until a situation asks for something you simply haven't developed yet.`,
      path: `Try naming one edge case this week where your usual approach didn't quite fit. You are allowed to have gaps and still be resourceful within them. What's one instinct you could deliberately start building?`,
    },
    3: {
      heading: `Subconscious Self 3 — A Genuinely Capable Range`,
      why: `This number measures your internal resourcefulness under real pressure — how many of the raw 1-through-9 instincts show up in your name at all. A count at this level gives you a genuinely capable range: you can meet a solid variety of situations without needing to improvise from nothing, though there's still real room to grow before your composure becomes truly comprehensive.`,
      traits: `You likely handle a wider range of pressure than someone with a narrower toolkit, without it feeling effortless. Most everyday challenges probably don't fully catch you off guard. You're likely aware of a few specific gaps where your composure noticeably thins.`,
      shadow: `The risk at this level is assuming your range is broader than it actually is, and getting genuinely surprised the few times it isn't — a solid toolkit mistaken, occasionally, for a complete one.`,
      path: `Try naming one gap you already know about honestly this week. You are allowed to have real range and still have blind spots. What's the next instinct worth deliberately developing?`,
    },
    4: {
      heading: `Subconscious Self 4 — A Balanced, Reliable Toolkit`,
      why: `This number measures your internal resourcefulness under real pressure — how many of the raw 1-through-9 instincts are present in your name at all. A count right around the middle gives you a genuinely balanced toolkit: neither narrow nor exhaustive, but reliable across a fair spread of situations, with real composure that holds in most of the moments that actually matter.`,
      traits: `You likely feel reasonably equipped for a broad range of everyday pressures. Genuinely rare or extreme situations probably still test the edges of what you've got. Your steadiness tends to feel earned rather than accidental.`,
      shadow: `The risk of a balanced toolkit is complacency — assuming the middle ground is enough and stopping deliberate growth simply because you're rarely caught completely unprepared.`,
      path: `Try identifying one instinct this week that you know is weaker than the rest. You are allowed to be balanced and still keep building. Where would continued development matter most right now?`,
    },
    5: {
      heading: `Subconscious Self 5 — A Genuinely Well-Rounded Toolkit`,
      why: `This number measures your internal resourcefulness under real pressure — how many of the raw 1-through-9 instincts show up in your name at all. A count at this level puts you solidly above average: a well-rounded set of instincts that covers most situations you're likely to face, with real, earned confidence that doesn't depend on staying inside familiar territory.`,
      traits: `You likely feel prepared for a genuinely wide range of pressure, both familiar and unfamiliar. Surprises tend to rattle you less than they rattle most people. Your composure probably reads as authentic rather than performed, because it largely is.`,
      shadow: `The risk at this level is overconfidence — assuming your broad range means you're covered for absolutely everything, and being caught off guard by the specific instincts you still genuinely lack.`,
      path: `Try naming one situation this week that would still genuinely test you, honestly. You are allowed to be well-rounded and still have edges. What's the last real gap worth closing?`,
    },
    6: {
      heading: `Subconscious Self 6 — A Broad and Dependable Toolkit`,
      why: `This number measures your internal resourcefulness under real pressure — how many of the raw 1-through-9 instincts are present in your name at all. A count this high gives you a broad, genuinely dependable toolkit: you can meet most situations, familiar or not, with real composure, drawing on a wide enough range of instincts that few things catch you truly unprepared.`,
      traits: `You likely handle most pressure, expected or not, without losing your footing. People probably lean on your steadiness in genuinely difficult moments. Your resourcefulness tends to show up reliably across very different kinds of challenges.`,
      shadow: `The risk of a toolkit this broad is spreading yourself thin, trying to be equally ready for everything instead of letting a few instincts run especially deep.`,
      path: `Try leaning fully into one instinct this week instead of trying to cover every angle equally. You are allowed to be broadly capable and still specialize somewhere. Where would real depth matter more than more breadth?`,
    },
    7: {
      heading: `Subconscious Self 7 — A Rich, Nearly Complete Toolkit`,
      why: `This number measures your internal resourcefulness under real pressure — how many of the raw 1-through-9 instincts show up in your name at all. A count this high leaves you with a rich, nearly complete toolkit: you're equipped to meet almost any situation with real composure, and the moments that genuinely surprise you are correspondingly rare.`,
      traits: `You likely feel unusually prepared across a wide variety of pressures, familiar or not. Very few situations probably catch you fully off guard. People around you likely notice and rely on how steady you tend to stay.`,
      shadow: `The risk of a toolkit this complete is complacency about the few gaps that remain, or an unconscious pressure to always have an answer, even in the rare moments you genuinely don't.`,
      path: `Try admitting one thing this week you honestly don't know how to handle yet. You are allowed to be this capable and still have a genuine edge left. What would completing that last piece actually take?`,
    },
    8: {
      heading: `Subconscious Self 8 — An Unusually Comprehensive Toolkit`,
      why: `This number measures your internal resourcefulness under real pressure — how many of the raw 1-through-9 instincts are present in your name at all. A count this high is genuinely rare: an unusually comprehensive set of instincts that leaves very little territory where you're operating without some kind of prior reference point, giving you real, well-earned composure across almost any situation.`,
      traits: `You likely feel equipped for nearly any kind of pressure, expected or entirely novel. People probably come to you specifically because your steadiness holds when theirs doesn't. Genuine surprise is likely a rare experience for you.`,
      shadow: `The risk of a toolkit this comprehensive is that it can start to feel like invulnerability, making the rare moments it actually fails land harder than they would for someone used to regularly meeting their own limits.`,
      path: `Try naming, honestly, the last time this toolkit genuinely wasn't enough. You are allowed to be this resourceful and still occasionally be caught out. What did that moment actually teach you?`,
    },
    9: {
      heading: `Subconscious Self 9 — The Full Toolkit`,
      why: `This number measures your internal resourcefulness under real pressure — how many of the raw 1-through-9 instincts are present in your name at all. A count of 9 is the maximum possible: every one of the base digits shows up somewhere in your name, meaning you carry the full available range of instinctive resourcefulness, with no digit's particular strength entirely absent from your makeup.`,
      traits: `You likely feel genuinely equipped for an unusually wide range of situations, familiar or not. People probably notice how rarely you seem completely without a next move. Composure tends to be a consistent, reliable feature of how you handle pressure.`,
      shadow: `The risk of a full toolkit is relying on breadth instead of developing real depth anywhere — capable of a little of everything without necessarily being masterful at any one thing in particular.`,
      path: `Try going deliberately deeper into one instinct this week instead of spreading attention evenly across all of them. You are allowed to have it all and still choose where to specialize. Which one piece of this toolkit deserves the most investment right now?`,
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
      text: `This digit is missing from your name, which classical numerology reads as an area still being built rather than a natural strength: initiative that doesn't wait for someone else to go first. You are allowed to practice starting things before you feel fully ready — that instinct simply has to be built deliberately instead of arriving automatically.`,
    },
    2: {
      heading: `Karmic Lesson: 2 — Developing Patience and Partnership`,
      text: `This digit is missing from your name, which classical numerology reads as an area still being developed: patience, tact, and genuine cooperation with other people. You are allowed to practice slowing down and letting a partnership actually develop — that instinct simply has to be built deliberately instead of arriving automatically.`,
    },
    3: {
      heading: `Karmic Lesson: 3 — Developing Self-Expression`,
      text: `This digit is missing from your name, which classical numerology reads as an area still being developed: comfort with genuine self-expression, whether creative or social. You are allowed to practice being seen and heard more openly — that instinct simply has to be built deliberately instead of arriving automatically.`,
    },
    4: {
      heading: `Karmic Lesson: 4 — Developing Discipline and Structure`,
      text: `This digit is missing from your name, which classical numerology reads as an area still being developed: consistent discipline and the patience for unglamorous, structural work. You are allowed to practice sticking with something past the point it stops being exciting — that instinct simply has to be built deliberately instead of arriving automatically.`,
    },
    5: {
      heading: `Karmic Lesson: 5 — Developing Adaptability`,
      text: `This digit is missing from your name, which classical numerology reads as an area still being developed: genuine ease with change and the unfamiliar. You are allowed to practice meeting unexpected shifts with curiosity instead of resistance — that instinct simply has to be built deliberately instead of arriving automatically.`,
    },
    6: {
      heading: `Karmic Lesson: 6 — Developing Responsibility to Others`,
      text: `This digit is missing from your name, which classical numerology reads as an area still being developed: genuine responsibility for the people and spaces close to you. You are allowed to practice showing up for real care without waiting to feel naturally inclined toward it — that instinct simply has to be built deliberately instead of arriving automatically.`,
    },
    7: {
      heading: `Karmic Lesson: 7 — Developing Depth and Reflection`,
      text: `This digit is missing from your name, which classical numerology reads as an area still being developed: genuine depth, solitude, and the patience to actually understand something fully before moving on. You are allowed to practice sitting with a question longer than feels comfortable — that instinct simply has to be built deliberately instead of arriving automatically.`,
    },
    8: {
      heading: `Karmic Lesson: 8 — Developing a Healthy Relationship With Power`,
      text: `This digit is missing from your name, which classical numerology reads as an area still being developed: a genuinely healthy relationship with authority, money, and material responsibility. You are allowed to practice claiming real power without either grabbing for more of it or shrinking from it — that instinct simply has to be built deliberately instead of arriving automatically.`,
    },
    9: {
      heading: `Karmic Lesson: 9 — Developing Broad Compassion`,
      text: `This digit is missing from your name, which classical numerology reads as an area still being developed: genuine compassion for people and causes beyond your own immediate circle. You are allowed to practice caring about something larger than your personal stake in it — that instinct simply has to be built deliberately instead of arriving automatically.`,
    },
  };
  function get(num) { return data[num] || null; }
  return { get };
})();

window.DCornerstoneContent = (function () {
  const data = {
    1: {
      heading: `Cornerstone 1 — You Begin by Leading`,
      why: `The Cornerstone comes from the very first letter of your first name — the letter that opens every single introduction of yourself, the one thing about your name you never get to revise. Classical numerology reads it as how you actually approach new opportunities and beginnings, the instinctive first move you make at the start of anything. For you, that first move is to lead: you tend to walk into new situations ready to take initiative rather than wait and see how things unfold around you.`,
      traits: `New opportunities likely excite rather than intimidate you. You probably prefer proposing the plan over waiting for someone else's. Beginnings tend to bring out real confidence in you, even in unfamiliar territory.`,
      shadow: `The risk of beginning this way is moving too fast into something new without gathering enough context first, mistaking decisive initiative for actual preparation.`,
      path: `Try gathering one extra piece of information before your next new beginning. You are allowed to lead and still pause to learn first. Where has your instinct to move first outpaced what you actually knew?`,
    },
    2: {
      heading: `Cornerstone 2 — You Begin by Listening`,
      why: `The Cornerstone comes from the very first letter of your first name — the one immovable piece of your own introduction. Classical numerology reads it as how you approach new opportunities and beginnings. For you, that approach is careful and attentive: you tend to start new situations by observing and gathering information rather than immediately asserting yourself into them.`,
      traits: `New environments likely get a period of quiet observation from you before you fully engage. You probably prefer understanding the dynamics of a room before speaking up in it. Beginnings tend to bring out real caution in you, even when the opportunity is genuinely good.`,
      shadow: `The risk of beginning this way is staying in observation mode long past the point it's useful, letting real opportunities slip by while you're still gathering information you already have enough of.`,
      path: `Try acting on your read of a new situation sooner than usual this week. You are allowed to observe carefully and still move at a reasonable pace. Where has caution at the start cost you a genuinely good opening?`,
    },
    3: {
      heading: `Cornerstone 3 — You Begin by Expressing`,
      why: `The Cornerstone comes from the very first letter of your first name — the fixed opening note of your own introduction. Classical numerology reads it as how you approach new opportunities and beginnings. For you, that approach is expressive and social: you tend to enter new situations by engaging, talking, and making an impression rather than staying quietly on the sidelines.`,
      traits: `New rooms likely get your voice fairly quickly, rather than a long silent stretch first. You probably use humor or warmth as a genuine way of building rapport at the start of something. Beginnings tend to bring out real sociability in you.`,
      shadow: `The risk of beginning this way is talking before you've actually thought something through, making an impression before you've fully understood what you're stepping into.`,
      path: `Try pausing to think one extra beat before speaking at the start of something new this week. You are allowed to be expressive and still consider first. Where has making an impression outpaced actually understanding the situation?`,
    },
    4: {
      heading: `Cornerstone 4 — You Begin by Planning`,
      why: `The Cornerstone comes from the very first letter of your first name — the unchanging opening of your own introduction. Classical numerology reads it as how you approach new opportunities and beginnings. For you, that approach is methodical: you tend to start new situations by building a structure or plan first, rather than diving in and figuring it out as you go.`,
      traits: `New projects likely get an organized approach from you before any real momentum starts. You probably feel more comfortable beginning something once you have at least a rough framework in place. Beginnings tend to bring out real deliberateness in you.`,
      shadow: `The risk of beginning this way is over-planning to the point of delay, treating the plan itself as a substitute for the actual start rather than a preparation for it.`,
      path: `Try beginning one thing this week with less planning than usual. You are allowed to be methodical and still start before everything's mapped out. Where has the plan itself become the thing standing between you and actually beginning?`,
    },
    5: {
      heading: `Cornerstone 5 — You Begin by Exploring`,
      why: `The Cornerstone comes from the very first letter of your first name — the fixed first note of your own introduction. Classical numerology reads it as how you approach new opportunities and beginnings. For you, that approach is curious and experimental: you tend to start new situations by trying things out directly, adjusting quickly based on what you find, rather than planning extensively beforehand.`,
      traits: `New opportunities likely get an eager, exploratory response from you. You probably learn a new situation faster through direct trial than through study beforehand. Beginnings tend to bring out real enthusiasm in you.`,
      shadow: `The risk of beginning this way is jumping in too fast without any real foundation, mistaking eagerness for actual readiness.`,
      path: `Try pausing for one moment of preparation before your next new beginning. You are allowed to explore and still ground yourself first. Where has your eagerness to start outpaced any real foundation underneath it?`,
    },
    6: {
      heading: `Cornerstone 6 — You Begin by Considering Others`,
      why: `The Cornerstone comes from the very first letter of your first name — the unchanging opening of your own introduction. Classical numerology reads it as how you approach new opportunities and beginnings. For you, that approach is relational: you tend to start new situations by thinking about who else is involved and how the beginning will affect them, rather than considering it purely in terms of your own interests.`,
      traits: `New opportunities likely get filtered through their impact on people close to you before you fully commit. You probably factor in others' needs early, sometimes before your own. Beginnings tend to bring out real thoughtfulness in you.`,
      shadow: `The risk of beginning this way is letting consideration for others delay or dilute a beginning that was genuinely yours to make, deferring a good opportunity simply because it wasn't unanimously convenient.`,
      path: `Try starting one thing this week primarily because it's right for you, not because everyone else has signed off on it. You are allowed to consider others and still claim a beginning as your own. Where has your care for others' input become an excuse to delay?`,
    },
    7: {
      heading: `Cornerstone 7 — You Begin by Understanding`,
      why: `The Cornerstone comes from the very first letter of your first name — the fixed opening of your own introduction. Classical numerology reads it as how you approach new opportunities and beginnings. For you, that approach is analytical: you tend to start new situations by trying to genuinely understand them first, resisting the urge to commit before you've actually grasped what you're stepping into.`,
      traits: `New opportunities likely get real scrutiny from you before you commit to them. You probably ask more questions at the start of something than most people think to ask. Beginnings tend to bring out real thoughtfulness in you.`,
      shadow: `The risk of beginning this way is analyzing a genuinely good opportunity so thoroughly that it passes you by while you're still trying to fully understand it.`,
      path: `Try committing to one new thing this week with slightly less certainty than you'd normally require. You are allowed to want understanding and still act before it's complete. Where has needing full clarity kept you from a beginning worth taking anyway?`,
    },
    8: {
      heading: `Cornerstone 8 — You Begin by Assessing the Stakes`,
      why: `The Cornerstone comes from the very first letter of your first name — the unchanging opening note of your own introduction. Classical numerology reads it as how you approach new opportunities and beginnings. For you, that approach is strategic: you tend to start new situations by evaluating what's actually at stake, materially and practically, before committing your effort to them.`,
      traits: `New opportunities likely get assessed for real, tangible value before you invest yourself in them. You probably think in terms of return on effort more than most people do at the start of something. Beginnings tend to bring out real seriousness in you.`,
      shadow: `The risk of beginning this way is passing over a genuinely meaningful opportunity simply because its material payoff wasn't immediately obvious.`,
      path: `Try beginning one thing this week purely because it matters to you, independent of its practical payoff. You are allowed to assess stakes and still start something with no guaranteed return. Where has your practical eye been filtering out opportunities that were worth taking anyway?`,
    },
    9: {
      heading: `Cornerstone 9 — You Begin by Considering the Bigger Picture`,
      why: `The Cornerstone comes from the very first letter of your first name — the fixed first note of your own introduction. Classical numerology reads it as how you approach new opportunities and beginnings. For you, that approach is expansive: you tend to start new situations by thinking about their wider significance, how they connect to something larger than the immediate moment, rather than evaluating them narrowly.`,
      traits: `New opportunities likely get considered for their broader meaning before you commit to them. You probably ask how something fits into a bigger picture more than most people do at the start of a project. Beginnings tend to bring out real idealism in you.`,
      shadow: `The risk of beginning this way is overlooking practical, immediate details in favor of the larger meaning, starting something beautifully framed but poorly grounded.`,
      path: `Try attending to one small, practical detail before your next new beginning. You are allowed to think big and still handle the immediate logistics. Where has the wider picture been distracting from what actually needed handling first?`,
    },
  };
  function get(num) { return data[num] || null; }
  return { get };
})();

window.DCapstoneContent = (function () {
  const data = {
    1: {
      heading: `Capstone 1 — You Finish by Claiming It as Yours`,
      why: `The Capstone comes from the very last letter of your last name — the letter that closes every formal version of your own name, the final note of it. Classical numerology reads it as how you follow through and finish what you start. For you, that finish is decisive: you tend to complete things by taking full, personal ownership of the outcome, rather than letting a project's ending feel diffuse or shared.`,
      traits: `You likely want clear, individual credit or responsibility once something is actually done. Finishing something probably feels more satisfying when the result is unmistakably yours. Endings tend to bring out real decisiveness in you.`,
      shadow: `The risk of finishing this way is over-claiming a result that was genuinely collaborative, or resisting a needed adjustment near the end simply because it wasn't originally your idea.`,
      path: `Try sharing credit for one finished thing this week, genuinely. You are allowed to finish decisively and still acknowledge who helped. Where has claiming an ending as entirely yours left out people who earned part of it?`,
    },
    2: {
      heading: `Capstone 2 — You Finish by Making Sure Everyone's Included`,
      why: `The Capstone comes from the very last letter of your last name — the final, unchanging note of your own name. Classical numerology reads it as how you follow through and finish what you start. For you, that finish is collaborative: you tend to complete things by checking that everyone involved is genuinely satisfied with the outcome, rather than declaring something done unilaterally.`,
      traits: `You likely seek explicit agreement before considering something truly finished. Endings probably feel incomplete to you if someone involved still seems uneasy about them. Finishing tends to bring out real thoroughness in you when it comes to other people's input.`,
      shadow: `The risk of finishing this way is never quite closing something out, because there's always one more person's approval left to gather before you'll call it done.`,
      path: `Try declaring one thing finished this week without waiting for full unanimous agreement. You are allowed to seek consensus and still set a real endpoint. Where has an ending been held open longer than it actually needed to be?`,
    },
    3: {
      heading: `Capstone 3 — You Finish With a Flourish`,
      why: `The Capstone comes from the very last letter of your last name — the final note that closes your own name every time it's written. Classical numerology reads it as how you follow through and finish what you start. For you, that finish is expressive: you tend to complete things with a visible, sometimes celebratory flourish, wanting the ending to actually be felt and noticed, not just quietly wrapped up.`,
      traits: `You likely want some acknowledgment or expression attached to a finished project, even a small one. Quiet, unremarked endings probably feel slightly unsatisfying to you. Finishing tends to bring out real showmanship in you.`,
      shadow: `The risk of finishing this way is delaying an actual ending in favor of a bigger, more impressive one, or growing frustrated when an ending doesn't get the recognition you feel it deserves.`,
      path: `Try letting one thing this week end quietly, with no flourish attached. You are allowed to want recognition and still let some endings be unremarkable. Where has needing a visible finish been holding up an actual one?`,
    },
    4: {
      heading: `Capstone 4 — You Finish by Making It Solid`,
      why: `The Capstone comes from the very last letter of your last name — the final, unmoving note of your own name. Classical numerology reads it as how you follow through and finish what you start. For you, that finish is structural: you tend to complete things by making sure they're genuinely solid and durable, checking every detail before you'll actually call something done.`,
      traits: `You likely want real assurance that a finished thing will hold up before you move on from it. Loose ends probably bother you more than they bother most people. Finishing tends to bring out real thoroughness in you.`,
      shadow: `The risk of finishing this way is never quite reaching an actual endpoint, since there's always one more detail that could theoretically be made more solid than it already is.`,
      path: `Try calling one thing finished this week at "solid enough" instead of "perfectly certain." You are allowed to want durability and still accept a reasonable stopping point. Where has the pursuit of certainty kept something from actually being called done?`,
    },
    5: {
      heading: `Capstone 5 — You Finish by Moving On`,
      why: `The Capstone comes from the very last letter of your last name — the final note that closes your name every time it's written. Classical numerology reads it as how you follow through and finish what you start. For you, that finish is quick: you tend to complete things and move on from them fast, rarely lingering once the essential work is done, ready for whatever's next almost immediately.`,
      traits: `You likely feel restless once a project has essentially reached its conclusion. Lingering on a finished thing probably feels less appealing to you than starting the next one. Finishing tends to bring out real momentum in you.`,
      shadow: `The risk of finishing this way is leaving a project's final, less exciting details unattended in your hurry to move on, technically done but not actually polished.`,
      path: `Try staying with one finished thing this week for slightly longer than your instinct suggests. You are allowed to move quickly and still tie off the loose ends first. Where has your hurry to move on left something less finished than it looked?`,
    },
    6: {
      heading: `Capstone 6 — You Finish by Making Sure Everyone's Cared For`,
      why: `The Capstone comes from the very last letter of your last name — the final, fixed note of your own name. Classical numerology reads it as how you follow through and finish what you start. For you, that finish is relational: you tend to complete things by checking that the people affected by the outcome are genuinely okay, treating the human impact of an ending as part of the actual work of finishing it.`,
      traits: `You likely check in on people once a project or situation is wrapping up, beyond just the practical details. Endings probably feel incomplete to you if someone involved seems hurt or unsettled by them. Finishing tends to bring out real tenderness in you.`,
      shadow: `The risk of finishing this way is delaying a needed ending out of concern for how it will land, prolonging something past its natural close simply to soften the impact.`,
      path: `Try letting one ending be direct this week, even if it's not entirely comfortable for everyone involved. You are allowed to care about people and still close something out cleanly. Where has softening an ending actually just delayed it?`,
    },
    7: {
      heading: `Capstone 7 — You Finish by Fully Understanding It`,
      why: `The Capstone comes from the very last letter of your last name — the final note that closes your name every time it's written. Classical numerology reads it as how you follow through and finish what you start. For you, that finish is reflective: you tend to complete things by making sure you genuinely understand what happened and why, treating the closing review as important as the work itself.`,
      traits: `You likely want to fully process a finished project before considering it truly over. Endings probably prompt real reflection from you, more than they do from most people. Finishing tends to bring out real depth in you.`,
      shadow: `The risk of finishing this way is staying in the reflective phase long after the practical ending has already happened, analyzing something that's genuinely already done.`,
      path: `Try declaring one thing over this week before you've fully processed every part of it. You are allowed to want understanding and still let an ending actually be an ending. Where has reflection been standing in for genuinely moving on?`,
    },
    8: {
      heading: `Capstone 8 — You Finish by Measuring the Result`,
      why: `The Capstone comes from the very last letter of your last name — the final, unmoving note of your own name. Classical numerology reads it as how you follow through and finish what you start. For you, that finish is results-oriented: you tend to complete things by checking the tangible, measurable outcome, treating a clear result as the actual marker of whether something is genuinely done.`,
      traits: `You likely want concrete proof that a finished project actually succeeded before you'll call it complete. Ambiguous outcomes probably unsettle you more than they unsettle most people. Finishing tends to bring out real rigor in you.`,
      shadow: `The risk of finishing this way is discounting a genuinely meaningful ending simply because its value wasn't easily measurable, treating a soft or emotional success as somehow less real.`,
      path: `Try calling one thing finished this week based on how it felt, not just what it measurably produced. You are allowed to want results and still count a soft success as real. Where has needing a measurable outcome discounted something that actually mattered?`,
    },
    9: {
      heading: `Capstone 9 — You Finish by Considering What It Leaves Behind`,
      why: `The Capstone comes from the very last letter of your last name — the final note that closes your own name every time it's written. Classical numerology reads it as how you follow through and finish what you start. For you, that finish is legacy-minded: you tend to complete things by considering what they leave behind, how the ending affects people or situations beyond the immediate project itself.`,
      traits: `You likely think about the broader impact of a finished project, not just its immediate result. Endings probably prompt you to consider what comes next for everyone involved, not just for you. Finishing tends to bring out real generosity in you.`,
      shadow: `The risk of finishing this way is getting so focused on the wider legacy of an ending that you neglect the immediate, practical details right in front of you.`,
      path: `Try attending to one immediate, practical detail this week before considering the bigger picture of an ending. You are allowed to think about legacy and still handle what's right in front of you first. Where has the wider view been distracting from what actually needed closing out?`,
    },
  };
  function get(num) { return data[num] || null; }
  return { get };
})();
