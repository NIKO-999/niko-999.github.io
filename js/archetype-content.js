'use strict';

/**
 * Destiny Matrix — Life Archetype
 * ─────────────────────────────────────────────────────────────
 * One entry per archetype bucket, not per Arcana. js/matrix-engine.js's
 * ARCHETYPE_MAP already sorts all 22 Arcana into six buckets, exposed as
 * getArchetype(n); until now that lookup only ever coloured individual
 * Talent Star Line nodes. This file supplies the written reading for the
 * bucket, applied at whole-chart scale.
 *
 * WHAT FEEDS IT — DestinyMatrix-v1.html routes the chart's single most
 * weighted Arcana (DMEngine.mostProminentArcana().dominant, whose tiered
 * 26-position methodology is documented in that function's header) through
 * getArchetype(). Both halves are existing engine logic; this composes
 * them rather than introducing a formula, per GOLDEN-STANDARD.md's
 * Sourcing rule. Six buckets means six possible readings — deliberately
 * coarser than the per-Arcana files, because it answers a coarser
 * question: not "what does this position mean" but "what are you, overall".
 *
 * THE NAMES — 'The Strategist', 'The Seeker' and the rest are presentation
 * labels this app puts on the engine's bucket keys (STRATEGIC_LEADERSHIP,
 * ESOTERIC_ANALYTICAL, …). They are naming, not sourced doctrine; the
 * buckets and their Arcana membership are the engine's, the English names
 * are ours.
 *
 * The card's live header — which Arcana produced the archetype and which
 * chart positions carry it — is generated in DestinyMatrix-v1.html from
 * the actual chart, never from this file. This file supplies the three
 * written sections underneath:
 *   meaning    -> WHAT IT MEANS TO BE [THE X]
 *   shadow     -> WHERE IT TURNS AGAINST YOU
 *   invitation -> THE WORK OF THIS LIFETIME
 *
 * Golden Standard voice throughout — `meaning` carries the mastery role
 * (see js/micro-content.js's header for the canonical reference block).
 * The section labels differ from the usual mastery/shadow/invitation trio
 * under GOLDEN-STANDARD.md's "Some systems swap the middle two labels"
 * clause; the depth rules are unchanged.
 *
 * API: DArchetypeContent.get(bucketKey) -> { name, tagline, meaning,
 *   shadow, invitation } or null
 *      DArchetypeContent.NAMES -> { bucketKey: displayName }
 */
window.DArchetypeContent = (function () {
  const data = {

    STRATEGIC_LEADERSHIP: {
      name: `The Strategist`,
      tagline: `A Design of Command Under Pressure`,
      meaning: `Somewhere early on you worked out that if you didn't hold the shape of a thing, it would come apart — and you have been holding shapes ever since. Command sits naturally in you, not as volume but as the quiet assumption that someone has to decide and it may as well be you. You read a room for its leverage points before you've consciously chosen to, and you're usually several moves ahead of the conversation you're actually in. Pressure clarifies you where it scatters other people; the moment something destabilises, you go calm and start sequencing. Others hand you responsibility without being asked, and they rarely notice they've done it. Underneath all of it runs a refusal to be at the mercy of circumstance — you would rather carry the weight than live inside someone else's handling of it.`,
      shadow: `The cost of being the one who holds it together is that you lose the ability to put it down. Control that began as competence hardens into a conviction that only your hands are safe, and handing something over stops feeling like relief and starts feeling like exposure. You conflate being needed with being valued, so you keep absorbing load that was never yours, then resent the people who let you. Rest gets postponed until things are stable, and things are never quite stable. What sits beneath the capability is often an old belief that being unnecessary and being unwanted are the same condition.`,
      invitation: `Where in your life are you the only one who knows how something works? Pick one of those things this month and hand it over completely — teach it, badly at first, and resist taking it back when it gets done differently than you'd do it. You are allowed to be someone who leads and still be someone who gets carried occasionally. Notice what happens in your body the first time it runs without you. What would you build if you trusted it would hold while you slept?`,
    },

    ESOTERIC_ANALYTICAL: {
      name: `The Seeker`,
      tagline: `A Design of Depth Over Surface`,
      meaning: `The surface of things has never held your attention for long. You are built to go under — into the mechanism, the motive, the pattern beneath the stated reason — and you do it so automatically that you forget most people stop at what was actually said. Information arrives to you pre-sorted; you catch the inconsistency in a story well before you could explain how you caught it. Solitude isn't deprivation for you but a working condition, the place where the real thinking happens. People trust you with what they don't say out loud, because something about you signals you won't flinch and won't simplify it. This pull toward the hidden isn't curiosity as a pastime — it's how you orient yourself, the way other people use daylight.`,
      shadow: `Understanding makes an excellent hiding place. Analysis that began as insight becomes a way to stand just outside your own life, examining a feeling rather than having one, and the examination can continue indefinitely because it never fully resolves. You withhold by default rather than by choice, and the people closest to you end up knowing your conclusions while never once meeting your uncertainty. Depth quietly becomes a standard you measure others against, and you disqualify anyone who seems content near the surface. What's usually underneath is a fear that being known plainly — without the interpretive layer you build first — would be unsurvivable.`,
      invitation: `What is one thing you understand thoroughly and have still never said out loud to anyone? Say it this week, to one person, in plain language, without constructing the framing you'd normally put around it first. You are allowed to be known before you have finished making sense of yourself. Watch closely what that costs you and what it turns out not to. When did you decide that being understood required being explained?`,
    },

    PUBLIC_VISIBILITY: {
      name: `The Luminary`,
      tagline: `A Design of Being Seen`,
      meaning: `Attention finds you whether or not you court it. There's a legibility to you — something in how you occupy a room that turns people toward you before you've done anything to earn it — and you learned young what to do with that. Warmth goes outward from you easily and returns multiplied; connection simply isn't the effortful thing for you that it visibly is for others. Atmosphere and beauty register as information rather than decoration, and you shape both without having been taught. When you speak about something you care about people believe it, which means what you put your face behind carries further than it would for anyone else. Your life has a public dimension whether or not you asked for one.`,
      shadow: `Visibility has a way of consuming the person underneath it. The self that gets shown becomes so practised that the seam between it and you stops being findable, and privacy starts to feel less like rest than like vanishing. You take the measure of yourself from the response you're getting, so a quiet season reads as failure rather than as weather. Approval slides in to replace your own judgement, and you catch yourself adjusting a position mid-sentence to keep the room with you. The fear beneath is plain and almost never said: that the warmth was for the performance, and there would not be much left standing without it.`,
      invitation: `Where are you still performing something you no longer actually feel? Take one week and do something you're genuinely good at without documenting it, mentioning it, or letting it be seen at all. You are allowed to exist unobserved and be entirely real while you do. Pay attention to the discomfort of the first few days, and to whatever moves in to replace it. If no one were ever going to see it, what would you still want to make?`,
    },

    SYSTEMIC_TEACHER: {
      name: `The Teacher`,
      tagline: `A Design of Structure That Holds`,
      meaning: `You organise things — not compulsively, but because disorder registers to you as a problem with an obvious solution nobody has bothered to apply. Principle matters to you in a way that's slightly out of fashion; you can name what you stand for, and you've generally arranged your life so the two line up. What you know, you can transmit, and that is rarer than you think — most people who understand something deeply cannot hand it to anyone. You're the one others come to for the framework, the ruling, the way to think about it, and you give it without condescension. Fairness isn't abstract for you; you feel its violation physically. Over time you become an institution in the small sense, the person whose consistency other people set their watch by.`,
      shadow: `The framework that steadies you can calcify into the only permissible shape. Certainty arrives early and then gets defended well past the point the evidence moved, because being wrong feels like the whole structure failing rather than one belief inside it giving way. You hold people to standards you've never actually stated, then experience their ordinary variation as a lapse in character. Teaching slides into correcting by degrees, and the room goes quieter around you without your noticing when. Judgement, in you, is usually old fear wearing a respectable coat: if the rules don't hold, then nothing does.`,
      invitation: `Which of your standards has never been examined, only inherited? Choose one this season and deliberately do it somebody else's way, long enough to find out what it's genuinely like from the inside. You are allowed to hold a principle loosely and remain a person of principle. Notice whether the ground actually gives way or simply shifts under you. Where did you first learn that the structure was the only thing keeping you safe?`,
    },

    INNOVATIVE_FREEDOM: {
      name: `The Innovator`,
      tagline: `A Design of the Unrepeatable`,
      meaning: `Constraint reads to you as a question rather than an answer. You have a native inability to accept that a thing must be done the way it has always been done, and across your life that has cost you and saved you in roughly equal measure. Ideas arrive sideways — you connect two unrelated things and can't afterwards reconstruct the route — and you've learned to trust the arrival without needing the reasoning. Freedom isn't a preference for you but a requirement; a life that closes its options down starts to feel physically wrong long before you can say why. You're comfortable not knowing, which is genuinely unusual, and it lets you stay inside the open part of a problem while everyone else rushes to shut it. What you make tends not to resemble anything else, because you weren't working from the same reference.`,
      shadow: `Openness becomes its own cage the moment it can never be closed. The freedom you protect turns into an inability to stay with anything long enough for it to become real, and a trail of genuinely good beginnings accumulates behind you. Every constraint gets read as a threat, including the ordinary ones — a routine, a promise, a person who needs to know where you'll be — so closeness stays just out of reach by design. You mistake restlessness for vision and move on at precisely the point where the work was about to get difficult. Beneath it usually runs a bet that if you never fully arrive anywhere, you can never be trapped there.`,
      invitation: `What have you left at eighty percent because finishing it would have made it ordinary? Go back to one of those things and take it all the way to done, tolerating how unremarkable the last stretch feels while you do. You are allowed to commit to one thing without it becoming the walls of your life. Watch what happens to the restlessness once something is actually complete. If freedom were guaranteed to you, what would you finally stay for?`,
    },

    CRISIS_TRANSFORMATION: {
      name: `The Alchemist`,
      tagline: `A Design of Rebuilding From Rubble`,
      meaning: `You have been through something. More precisely you have been through several things, and you came out carrying a capacity most people never develop: collapse doesn't frighten you. Endings that would flatten someone else are simply, to you, the part before the next thing, and you can stand inside a situation coming apart without needing it to stop. You see what people are concealing because you have concealed things yourself, and the recognition is immediate and unsentimental. Your presence steadies an emergency for reasons that have nothing to do with calm — you're steady because you know the floor gives way sometimes and you know what happens afterwards. Rebuilding is the actual skill, not surviving; anyone can survive, but you make the wreckage into something.`,
      shadow: `The trouble with being good at crisis is that stability begins to feel like nothing happening. You court the intensity you know how to handle without meaning to — ending things a season early, introducing friction into calm — because peace registers as the lull before something worse rather than as arrival. Old ruin hardens into identity; you keep the scars close because they explain you, and explanation turns quietly into permission. You test the people who stay, needing evidence they'll survive the worst version of you before you can rest anywhere near them. Running underneath is an expectation that everything ends, which makes it more bearable to be the one who ends it.`,
      invitation: `What in your life is currently fine, and what are you doing with that? Let one calm thing stay calm for a whole season without improving it, testing it, or bracing against it, and notice the specific discomfort of nothing going wrong. You are allowed to be someone who survived and no longer someone who is surviving. Pay attention to what moves into the space the crisis used to occupy. What would you build if you believed it would last?`,
    },

  };

  const NAMES = Object.keys(data).reduce((acc, k) => { acc[k] = data[k].name; return acc; }, {});

  function get(bucketKey) {
    return data[bucketKey] || null;
  }

  return { get, NAMES };
})();
