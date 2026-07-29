'use strict';

/**
 * Destiny Matrix — Name-Based Numerology (Expression, Soul Urge,
 * Personality, Maturity)
 * ─────────────────────────────────────────────────────────────
 * Classical numerology numbers that require a full NAME, not just a
 * birthdate — the only content set in this app that does. See
 * js/matrix-engine.js's expressionNumber()/soulUrgeNumber()/
 * personalityNumber()/maturityNumber() for the Pythagorean-grid formulas,
 * and DestinyMatrix-v1.html's optional name input (inside #numerology-index)
 * for how a name gets collected — never required, never persisted.
 *
 * Each of the four systems gets its own consistent lens across all 12
 * classical values (1-9, 11, 22, 33), so the same underlying number reads
 * differently depending on which question is being asked:
 *   Expression   — HOW you act; your natural mode of doing things.
 *   Soul Urge    — WHAT you actually want, underneath the doing.
 *   Personality  — HOW you land on first impression, before anyone knows you.
 *   Maturity     — WHO you grow into, once Life Path and Expression converge.
 *
 * All content originally composed, tight rather than padded, matching the
 * "impact over bloat" direction established for the Life Path/Pinnacles
 * rewrites — no positive/negative-state framing.
 *
 * API (all identical shape):
 *   DExpressionContent.get(num)  -> { heading, why, shadow, path } or null
 *   DSoulUrgeContent.get(num)    -> { heading, why, shadow, path } or null
 *   DPersonalityContent.get(num) -> { heading, why, shadow, path } or null
 *   DMaturityContent.get(num)    -> { heading, why, shadow, path } or null
 */

window.DExpressionContent = (function () {
  const data = {
    1: {
      heading: `Expression 1 — You Act By Going First`,
      why: `The way you move through the world is by starting things — you're the one who steps into the gap nobody else will fill and just begins.`,
      shadow: `Unchecked, it looks like doing everything yourself because delegating feels slower than just handling it.`,
      path: `Try handing one task to someone else today instead of doing it yourself. You are allowed to go first without doing it alone.`,
    },
    2: {
      heading: `Expression 2 — You Act By Bringing People Together`,
      why: `Your natural mode is cooperation — you move things forward by aligning people, not by pushing through on your own.`,
      shadow: `Unchecked, it looks like over-mediating, softening your own position until it disappears entirely.`,
      path: `Try stating your own position clearly today before smoothing it for the group. You are allowed to unite people and still be one of them.`,
    },
    3: {
      heading: `Expression 3 — You Act Through Words and Presence`,
      why: `You move things forward by expressing them — speaking, writing, performing — turning ideas into something other people can actually feel.`,
      shadow: `Unchecked, it looks like talking a plan into existence and never quite building it.`,
      path: `Try finishing one thing today that you already talked about starting. You are allowed to speak brilliantly and still follow through.`,
    },
    4: {
      heading: `Expression 4 — You Act By Building the Structure`,
      why: `Your natural mode is construction — turning a loose idea into something with real form, one deliberate piece at a time.`,
      shadow: `Unchecked, it looks like refusing to move until every detail is locked down, even past the point that's useful.`,
      path: `Try starting one structure today before it's fully planned. You are allowed to build carefully and still begin imperfectly.`,
    },
    5: {
      heading: `Expression 5 — You Act By Moving and Adapting`,
      why: `You move things forward through motion itself — trying, adjusting, changing course fast when something isn't working.`,
      shadow: `Unchecked, it looks like changing direction so often that nothing gets the time it needs to actually work.`,
      path: `Try staying with today's plan even when a better-looking option shows up. You are allowed to adapt and still commit.`,
    },
    6: {
      heading: `Expression 6 — You Act By Taking Care of Things`,
      why: `Your natural mode is responsibility — you move things forward by making sure the people and details around you are actually looked after.`,
      shadow: `Unchecked, it looks like taking on responsibility nobody actually assigned you.`,
      path: `Try letting one thing today go uncared-for that isn't yours to manage. You are allowed to care selectively.`,
    },
    7: {
      heading: `Expression 7 — You Act By Understanding First`,
      why: `You move things forward by figuring them out completely before you commit — depth and precision are your actual method.`,
      shadow: `Unchecked, it looks like researching a decision long after you already had enough to act on it.`,
      path: `Try acting today on the understanding you already have. You are allowed to know enough without knowing everything.`,
    },
    8: {
      heading: `Expression 8 — You Act By Executing at Scale`,
      why: `Your natural mode is getting real, material results — you move things forward by actually building the outcome, not just the idea of it.`,
      shadow: `Unchecked, it looks like measuring every action purely by its output.`,
      path: `Try doing one thing today for a reason that has nothing to do with the result. You are allowed to act without a scoreboard.`,
    },
    9: {
      heading: `Expression 9 — You Act On Behalf of Something Larger`,
      why: `You move things forward by giving — your natural mode of action serves people or causes beyond your own immediate interest.`,
      shadow: `Unchecked, it looks like acting on everyone else's behalf and rarely your own.`,
      path: `Try taking one action today purely for yourself. You are allowed to act in your own interest too.`,
    },
    11: {
      heading: `Expression 11 — You Act On Inspiration`,
      why: `Your natural mode is acting from insight — moving on what you sense before you can fully explain it, trusting the download.`,
      shadow: `Unchecked, it looks like staying inspired without ever grounding the action.`,
      path: `Try turning today's insight into one concrete step. You are allowed to be inspired and still be practical.`,
    },
    22: {
      heading: `Expression 22 — You Act By Building at Scale`,
      why: `You move things forward by constructing something genuinely large — your natural mode combines vision with the discipline to finish it.`,
      shadow: `Unchecked, it looks like taking on more scale than your actual capacity can sustain.`,
      path: `Try pacing today's effort against your real energy, not the project's full size. You are allowed to build big and still rest.`,
    },
    33: {
      heading: `Expression 33 — You Act Through Service`,
      why: `Your natural mode is caring for others directly — you move things forward by showing up for people going through something real.`,
      shadow: `Unchecked, it looks like acting in service of everyone until there's nothing left over for you.`,
      path: `Try doing one thing today purely for your own care. You are allowed to serve others and still serve yourself.`,
    },
  };
  function get(num) { return data[num] || null; }
  return { get };
})();

window.DSoulUrgeContent = (function () {
  const data = {
    1: {
      heading: `Soul Urge 1 — You Crave Independence`,
      why: `Underneath everything else, what you actually want is to be the author of your own life — answering to your own judgment, not someone else's.`,
      shadow: `Left unspoken, that craving turns into resenting anyone who asks you to check in or explain yourself.`,
      path: `Try naming your want for independence directly today instead of just acting on it sideways. You are allowed to want autonomy out loud.`,
    },
    2: {
      heading: `Soul Urge 2 — You Crave Real Closeness`,
      why: `Underneath everything else, what you actually want is genuine partnership — to be truly known by someone, not just agreeable with them.`,
      shadow: `Left unspoken, that craving turns into over-accommodating people just to keep them close.`,
      path: `Try asking for the closeness you want directly today. You are allowed to want to be truly known.`,
    },
    3: {
      heading: `Soul Urge 3 — You Crave to Be Truly Seen`,
      why: `Underneath everything else, what you actually want is for your real self — not just the performance — to be genuinely delighted in.`,
      shadow: `Left unspoken, that craving turns into performing so constantly that the real version stays hidden.`,
      path: `Try letting the unpolished version of yourself show today. You are allowed to want to be seen, not just entertaining.`,
    },
    4: {
      heading: `Soul Urge 4 — You Crave Real Security`,
      why: `Underneath everything else, what you actually want is solid ground — something dependable enough that you can finally stop bracing for it to collapse.`,
      shadow: `Left unspoken, that craving turns into over-controlling your surroundings to manufacture a safety no one can guarantee.`,
      path: `Try naming what actually makes you feel secure today, out loud, to someone. You are allowed to want stability.`,
    },
    5: {
      heading: `Soul Urge 5 — You Crave Real Freedom`,
      why: `Underneath everything else, what you actually want is room to move — to not be boxed into one version of your life forever.`,
      shadow: `Left unspoken, that craving turns into avoiding any commitment that might feel like a cage.`,
      path: `Try naming what freedom would actually look like today, specifically. You are allowed to want room to move.`,
    },
    6: {
      heading: `Soul Urge 6 — You Crave to Belong`,
      why: `Underneath everything else, what you actually want is a real home — people who are yours, and a place that's genuinely built around care.`,
      shadow: `Left unspoken, that craving turns into over-giving to earn a belonging that was never actually conditional.`,
      path: `Try asking to be cared for today instead of only providing it. You are allowed to want belonging without earning it first.`,
    },
    7: {
      heading: `Soul Urge 7 — You Crave Real Understanding`,
      why: `Underneath everything else, what you actually want is to genuinely understand — yourself, the world, something true beneath the surface.`,
      shadow: `Left unspoken, that craving turns into isolating with the search instead of sharing what you're finding.`,
      path: `Try sharing one thing you're still figuring out today. You are allowed to want understanding and still be interrupted.`,
    },
    8: {
      heading: `Soul Urge 8 — You Crave Real Impact`,
      why: `Underneath everything else, what you actually want is to matter at scale — to build something whose effect is undeniable.`,
      shadow: `Left unspoken, that craving turns into chasing achievement as proof you're allowed to exist.`,
      path: `Try naming what impact would actually satisfy you today, honestly. You are allowed to want to matter.`,
    },
    9: {
      heading: `Soul Urge 9 — You Crave to Give Something That Matters`,
      why: `Underneath everything else, what you actually want is for your care to genuinely help — to leave things better than you found them.`,
      shadow: `Left unspoken, that craving turns into giving past the point you have anything left to give.`,
      path: `Try noticing today what you need to receive, not just give. You are allowed to want something back.`,
    },
    11: {
      heading: `Soul Urge 11 — You Crave to Illuminate Something`,
      why: `Underneath everything else, what you actually want is for your insight to genuinely reach someone — to matter beyond just being right.`,
      shadow: `Left unspoken, that craving turns into needing everyone to see what you see, even when they're not ready to.`,
      path: `Try sharing one insight today without needing it to land perfectly. You are allowed to want to illuminate something.`,
    },
    22: {
      heading: `Soul Urge 22 — You Crave to Build Something Lasting`,
      why: `Underneath everything else, what you actually want is to leave something standing — proof, in structure, that you were genuinely here.`,
      shadow: `Left unspoken, that craving turns into never feeling like anything you've built is quite big enough yet.`,
      path: `Try naming what "enough" would actually look like today. You are allowed to want to build something lasting.`,
    },
    33: {
      heading: `Soul Urge 33 — You Crave to Heal Something`,
      why: `Underneath everything else, what you actually want is for your care to genuinely repair something — a person, a wound, a broken pattern.`,
      shadow: `Left unspoken, that craving turns into needing to fix everyone around you before you can rest.`,
      path: `Try letting one thing today stay unfixed by you. You are allowed to want to heal, and still not be responsible for everyone.`,
    },
  };
  function get(num) { return data[num] || null; }
  return { get };
})();

window.DPersonalityContent = (function () {
  const data = {
    1: {
      heading: `Personality 1 — You Come Across as Confident`,
      why: `On first meeting, people read you as decisive and self-assured — someone who already knows where they're going.`,
      shadow: `The risk is that this reads as unapproachable before anyone's had the chance to see the warmth underneath it.`,
      path: `Try letting one moment of not-knowing show today, on purpose. You are allowed to look confident and still be reachable.`,
    },
    2: {
      heading: `Personality 2 — You Come Across as Gentle`,
      why: `On first meeting, people read you as easy to talk to — approachable, calm, someone who won't judge what they say.`,
      shadow: `The risk is that this reads as a pushover before anyone's seen how much you actually think.`,
      path: `Try voicing one clear opinion today in a first conversation. You are allowed to be gentle and still be taken seriously.`,
    },
    3: {
      heading: `Personality 3 — You Come Across as Magnetic`,
      why: `On first meeting, people read you as fun and alive — the person the room naturally gravitates toward.`,
      shadow: `The risk is that this reads as lightweight before anyone's seen how much substance is actually there.`,
      path: `Try letting one serious thought show through the charm today. You are allowed to be magnetic and substantial at once.`,
    },
    4: {
      heading: `Personality 4 — You Come Across as Solid`,
      why: `On first meeting, people read you as dependable — someone whose word can actually be trusted at face value.`,
      shadow: `The risk is that this reads as rigid or humorless before anyone's seen your actual range.`,
      path: `Try letting a little lightness show in a first meeting today. You are allowed to be solid and still be fun.`,
    },
    5: {
      heading: `Personality 5 — You Come Across as Exciting`,
      why: `On first meeting, people read you as spontaneous and interesting — someone whose life sounds genuinely unpredictable.`,
      shadow: `The risk is that this reads as unreliable before anyone's seen how deep your actual commitments run.`,
      path: `Try mentioning one long-standing commitment in a first conversation today. You are allowed to be exciting and still be steady.`,
    },
    6: {
      heading: `Personality 6 — You Come Across as Warm`,
      why: `On first meeting, people read you as caring and easy to be around — someone who already seems to want the best for them.`,
      shadow: `The risk is that this reads as needing to be needed before anyone's seen your own boundaries.`,
      path: `Try stating one boundary today in a new relationship, early. You are allowed to be warm and still have limits.`,
    },
    7: {
      heading: `Personality 7 — You Come Across as Mysterious`,
      why: `On first meeting, people read you as thoughtful and a little unreachable — someone with clearly more going on beneath the surface.`,
      shadow: `The risk is that this reads as cold before anyone's earned the trust to see past it.`,
      path: `Try offering one small piece of yourself early in a new interaction today. You are allowed to be private and still be warm on first contact.`,
    },
    8: {
      heading: `Personality 8 — You Come Across as Powerful`,
      why: `On first meeting, people read you as capable and in command — someone clearly used to being in charge of things.`,
      shadow: `The risk is that this reads as intimidating before anyone's seen how much you actually care.`,
      path: `Try letting a moment of softness show in a first meeting today. You are allowed to be powerful and still be gentle.`,
    },
    9: {
      heading: `Personality 9 — You Come Across as Generous`,
      why: `On first meeting, people read you as warm and open-minded — someone who already seems to want good things for the world.`,
      shadow: `The risk is that this reads as naive before anyone's seen how sharp your read on people actually is.`,
      path: `Try naming one clear-eyed observation about someone today, early. You are allowed to be generous and still be discerning.`,
    },
    11: {
      heading: `Personality 11 — You Come Across as Inspired`,
      why: `On first meeting, people read you as intense and a little electric — someone operating on a different frequency than most.`,
      shadow: `The risk is that this reads as overwhelming before anyone's had time to catch up to your pace.`,
      path: `Try slowing your first impression down today, on purpose. You are allowed to be inspired and still be easy to be around.`,
    },
    22: {
      heading: `Personality 22 — You Come Across as Capable`,
      why: `On first meeting, people read you as someone who could actually build the thing everyone else is only talking about.`,
      shadow: `The risk is that this reads as intimidating before anyone's seen your own real limits.`,
      path: `Try admitting one limit in a first conversation today. You are allowed to look capable and still ask for help.`,
    },
    33: {
      heading: `Personality 33 — You Come Across as Deeply Caring`,
      why: `On first meeting, people read you as someone safe to bring their real problems to — genuinely present, genuinely kind.`,
      shadow: `The risk is that this reads as endless availability before anyone's seen you have limits too.`,
      path: `Try naming one thing you need in a first conversation today, not just offering care. You are allowed to be cared for too.`,
    },
  };
  function get(num) { return data[num] || null; }
  return { get };
})();

window.DMaturityContent = (function () {
  const data = {
    1: {
      heading: `Maturity 1 — Becoming Genuinely Self-Directed`,
      why: `In the second half of life, you're growing into real, settled authority over your own path — leadership that no longer needs to prove itself.`,
      shadow: `The risk is arriving at that authority still defending it like it's under threat.`,
      path: `Try leading one thing this season without needing to justify it. You are allowed to simply be in charge of your own life.`,
    },
    2: {
      heading: `Maturity 2 — Becoming Genuinely Balanced`,
      why: `In the second half of life, you're growing into real partnership — cooperation that no longer requires losing yourself to sustain it.`,
      shadow: `The risk is arriving there still over-adjusting for everyone else's comfort.`,
      path: `Try stating one need plainly this season instead of managing around it. You are allowed to be balanced and still be direct.`,
    },
    3: {
      heading: `Maturity 3 — Becoming Genuinely Expressive`,
      why: `In the second half of life, you're growing into expression with real substance behind it — creativity that's finally allowed to be serious too.`,
      shadow: `The risk is still hiding behind the performance instead of letting the depth show.`,
      path: `Try sharing one serious piece of work this season without softening it into a joke. You are allowed to be taken seriously.`,
    },
    4: {
      heading: `Maturity 4 — Becoming Genuinely Grounded`,
      why: `In the second half of life, you're growing into real stability — structure that finally has enough room in it to actually live inside.`,
      shadow: `The risk is arriving there and still treating flexibility as failure.`,
      path: `Try changing one plan this season without treating it as a defeat. You are allowed to be grounded and still adapt.`,
    },
    5: {
      heading: `Maturity 5 — Becoming Genuinely Free`,
      why: `In the second half of life, you're growing into freedom that's chosen on purpose, not just reactive movement away from commitment.`,
      shadow: `The risk is still mistaking restlessness for actual freedom.`,
      path: `Try choosing one form of stability on purpose this season. You are allowed to be free and still want roots.`,
    },
    6: {
      heading: `Maturity 6 — Becoming Genuinely Nurturing`,
      why: `In the second half of life, you're growing into care that no longer needs control to feel complete — love that can simply let people be.`,
      shadow: `The risk is arriving there still needing to manage the outcome of your caring.`,
      path: `Try releasing one thing this season you'd normally manage out of love. You are allowed to care and let go at once.`,
    },
    7: {
      heading: `Maturity 7 — Becoming Genuinely Wise`,
      why: `In the second half of life, you're growing into understanding that's finally ready to be shared, not just privately held.`,
      shadow: `The risk is still keeping the depth to yourself out of old habit.`,
      path: `Try teaching one thing you know this season instead of just knowing it. You are allowed to be wise and still be generous with it.`,
    },
    8: {
      heading: `Maturity 8 — Becoming Genuinely Powerful`,
      why: `In the second half of life, you're growing into authority that no longer has to prove its worth by what it's produced.`,
      shadow: `The risk is still measuring your own value purely by output.`,
      path: `Try counting one thing this season as valuable that produced nothing measurable. You are allowed to matter without a metric.`,
    },
    9: {
      heading: `Maturity 9 — Becoming Genuinely Generous`,
      why: `In the second half of life, you're growing into giving that's sustainable — care for the world that finally includes yourself in it.`,
      shadow: `The risk is still giving until there's nothing left over.`,
      path: `Try keeping one thing this season purely for yourself. You are allowed to be generous and still be replenished.`,
    },
    11: {
      heading: `Master Maturity 11 — Becoming Genuinely Grounded Vision`,
      why: `In the second half of life, you're growing into inspiration that finally lands — insight that's actually built into something real.`,
      shadow: `The risk is still staying purely in the vision without finishing the build.`,
      path: `Try completing one inspired idea this season, start to finish. You are allowed to be visionary and still be finished.`,
    },
    22: {
      heading: `Master Maturity 22 — Becoming Genuinely Sustainable Power`,
      why: `In the second half of life, you're growing into large-scale building that no longer costs you your own health to sustain.`,
      shadow: `The risk is still treating rest as a threat to the scale of what you're building.`,
      path: `Try resting for one full day this season without guilt. You are allowed to build big and still stop.`,
    },
    33: {
      heading: `Master Maturity 33 — Becoming Genuinely Whole Service`,
      why: `In the second half of life, you're growing into care for others that finally makes room for being cared for too.`,
      shadow: `The risk is still treating your own needs as something to handle after everyone else's.`,
      path: `Try receiving one act of care this season without deflecting it. You are allowed to serve and be served.`,
    },
  };
  function get(num) { return data[num] || null; }
  return { get };
})();
