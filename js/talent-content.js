'use strict';

/**
 * Destiny Matrix — Talent Star Line Content
 * ──────────────────────────────────────────
 * Archetype-level readings, keyed by the 5-bucket `iconType` string
 * computed in js/matrix-engine.js (LEADER_ACTION, INTUITION_WISDOM,
 * CREATIVITY_ART, TEACHER_FREEDOM, TRANSFORMATION_POWER).
 *
 * One entry per bucket — not per-arcana — since the Talent Star Line
 * is presented through the archetype abstraction, not the raw number.
 *
 * API:
 *   DTalentContent.get(iconType) → { heading, why, shadow, path } or null
 */

window.DTalentContent = (function () {

  const archetypes = {

    LEADER_ACTION: {
      heading: 'You Move Before Anyone Else Is Ready To',
      why: `You take a thought and put it into motion before doubt has a chance to build up. Give you a half-formed plan and a room full of hesitation, and you'll be the one who steps forward first — not because you're fearless, but because waiting feels worse to you than acting. People notice this in you almost immediately. They fall in behind your momentum without needing to be asked, because something in the way you carry a decision tells them it's already happening. You're the starter, the closer, the one who moves when a room is waiting for someone else to move first.`,
      shadow: `The trouble starts when you push where you should have paused. You can mistake speed for progress, and control for leadership, driving a plan forward long after the moment that actually needed it has passed. When that happens, you burn through people faster than you realize — not because you meant to, but because your pace didn't leave room for anyone to catch their breath. If you've noticed people quietly dropping off, or agreeing with you less than they used to, that's rarely bad luck. It's usually a signal that your force is being met with resistance instead of momentum. That compulsion to move before you're ready can trace to an old, unhealed root: an inner child who learned that hesitating meant being overlooked or left behind, so constant motion became the only way to feel safe or seen.`,
      path: `Try asking a second question before you move: not just "can I push this forward," but "should I, right now, like this." Your drive is real and it's rare — most people freeze where you act. The mastery isn't slowing down for its own sake; it's choosing your moments as carefully as you already execute them. Once you pair that drive with real discernment, people stop bracing against you and start moving with you instead.`,
      positive: `People feel your momentum and fall in behind it without being asked, and because that drive is paired with discernment rather than force, the people you lead stay with you instead of eventually pulling away.`,
      negative: `Force applied in the wrong moment keeps generating resistance instead of followers — the push you're making is met with people quietly bracing against it rather than joining it.`,
    },

    INTUITION_WISDOM: {
      heading: 'You Know Before You Can Explain How',
      why: `You sense what's true before anyone hands you the proof. A room shifts and you feel it before anyone says a word. A pattern repeats and you clock it three instances before someone else even notices there is one. This isn't guessing — it's a genuine talent for depth: research, reading people, holding a complicated situation without needing to resolve it immediately just to feel comfortable. Where this shows up in your chart, it marks a real gift for going below the surface and staying there long enough to actually understand something.`,
      shadow: `The catch is what you do with what you know. It's easy to let your perception become a private world instead of something you actually share — to stay quiet when speaking up could genuinely help, because turning a feeling into plain words feels like it will lose something in translation. You might also find yourself preferring the certainty of thinking things through alone over the mess of working it out with other people. If it ever feels like nobody's really listening to you, it's worth asking honestly whether you've actually said the thing out loud yet. That instinct to keep your knowing private can trace to an inner child who learned early that voicing what you sensed wasn't welcomed or believed by a parent, so silence became the safer habit long before it became a spiritual style.`,
      path: `Your work is translation — finding the words, the timing, the moment that lets what you already know actually reach the people who need it. What you carry was never meant to stay entirely internal. The more you offer it, out loud, in real time, the more the recognition and collaboration you've been quietly hoping for finally has something real to respond to.`,
      positive: `You sense what's true before it can be proven, and because you actually say it out loud, recognition and collaboration have something real to respond to.`,
      negative: `Insight you keep to yourself is insight the world never gets a chance to respond to — it's hard to feel truly seen when the thing that would let people see you clearly was never actually spoken.`,
    },

    CREATIVITY_ART: {
      heading: 'You Make Things That Are Meant to Be Seen',
      why: `You have a real gift for turning what's happening inside you into something outside you that other people can feel. Aesthetics, performance, public creative work — wherever this shows up on your Talent Star Line, it marks a genuine talent for making things that move people, and for being visible while you do it. This isn't vanity. It's closer to translation: taking a private feeling and finding its external form.`,
      shadow: `Where this gets complicated is when you start needing the reaction more than you trust the work. You might notice yourself shrinking a piece to make it safer, more likely to land well, more predictably liked — trading the truth of it for approval. Visibility can start to feel like the whole point, instead of the natural result of expressing something real. If an audience keeps feeling lukewarm, it's worth checking whether the work itself got quietly softened somewhere along the way. That need for approval over truth can trace to an inner child whose creative expression was only really welcomed when it pleased a parent, teaching you early that being seen depended on being palatable first.`,
      path: `Try making the thing for its own sake first, and let being seen be a consequence rather than the goal. Your talent is real, and it deserves an audience — but it doesn't need one to already be valid while you're making it. The more you create from genuine expression instead of approval-seeking, the more the audience you draw in responds to something true instead of something merely safe.`,
      positive: `You make things that genuinely move people, and because the work comes from real expression rather than approval-seeking, the audience it draws responds to something true.`,
      negative: `Work that's been quietly shrunk to be safely, predictably liked tends to draw a correspondingly lukewarm response — the audience is simply reflecting back the caution the work itself was made with.`,
    },

    TEACHER_FREEDOM: {
      heading: 'You Teach Best When You Let People Outgrow You',
      why: `You have a real talent for passing on what you know while leaving enough room for the other person to eventually go further than you did. This shows up as an aptitude for teaching, for building systems other people can actually use, for walking unconventional paths that others can later walk without you standing beside them. The best version of this talent isn't about being needed — it's about building something that keeps working after you step back.`,
      shadow: `The risk here is subtle: a quiet need to stay necessary. You might catch yourself keeping a student, a team, or a system just a little bit dependent on you continuing to show up — even while telling yourself, and them, that you're giving them freedom. The opposite trap exists too: rejecting structure so completely that nothing durable ever actually gets built or passed on. If the people you teach never quite launch on their own, it's worth asking honestly whether the freedom you're offering is real or just the word you're using for it. That quiet need to stay necessary can trace to an inner child whose place in the family depended on being needed, so being indispensable became identity long before it became a teaching style.`,
      path: `Aim to teach yourself out of a job — build something, or someone, that becomes fully capable of standing without you. That's the actual measure of whether this talent worked. Once the freedom you're offering is genuine rather than managed, the people you teach actually take it and run — and what you built keeps compounding without needing you to hold it up.`,
      positive: `You pass on what you know while leaving genuine room for the other person to outgrow you, and because that freedom is real, what you built keeps compounding long after you've stepped back.`,
      negative: `A quiet need to stay necessary keeps the freedom you're offering theoretical rather than real — students and systems stay dependent because that's the actual signal you've been sending them.`,
    },

    TRANSFORMATION_POWER: {
      heading: 'You Find Clarity Right Where Everyone Else Loses It',
      why: `You have a genuine talent for stepping into collapse, crisis, or serious upheaval and finding a clarity there that calmer conditions never seem to offer you. Where other people freeze or scatter under real pressure, you tend to steady — and you're often the one who can see what the breakdown is actually clearing space for. This is a real capacity to turn a mess into a foundation, not just survive it.`,
      shadow: `The risk is that you start recognizing crisis as your only comfortable terrain — and, without quite meaning to, you can find yourself pulled toward drama or upheaval because stillness feels unfamiliar by comparison. This can tip into tearing down things that still had value, simply because tearing down is the move you know how to make well. If upheaval keeps showing up in your life more often than seems reasonable, it's worth asking whether some part of you still doesn't fully trust the quiet. That pull toward crisis can trace to an inner child raised where only upheaval reliably got attention or brought clarity, so calm never registered as safe, real, or trustworthy.`,
      path: `The work is learning to tell the difference between change that's genuinely needed and change that's just familiar. Your capacity for this is real — the mastery is saving it for the moments that actually call for it. Once stillness stops feeling like a threat, change gets to arrive on its own terms instead of needing a crisis to get your attention.`,
      positive: `You step into genuine crisis and find the clarity that only that kind of intensity makes available, and because stillness no longer feels threatening, change gets to unfold deliberately instead of catastrophically.`,
      negative: `When stillness still reads as a threat, upheaval tends to show up to fill the space — not because change is truly needed, but because it's the only kind of movement that currently feels believable to you.`,
    },

  };

  function get(iconType) {
    return archetypes[iconType] || null;
  }

  return { get };

})();
