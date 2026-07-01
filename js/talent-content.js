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
      heading: 'The Drive That Moves Things Forward',
      why: `This node carries the frequency of directed action — the capacity to take a thought and push it into motion before doubt has time to accumulate. Wherever it lives on your Talent Star Line, it marks a natural aptitude for leadership that doesn't need to be performed: people feel the momentum in you and fall in behind it without being asked to. This is the talent of the starter, the closer, the one who steps forward when a room is waiting for someone to move first.`,
      shadow: `The shadow here is action divorced from patience — force applied where finesse was needed, or momentum kept up long after the moment that required it has passed. Left unchecked, this energy can burn through people and resources at a pace nothing sustainable can match, mistaking speed for progress and control for leadership — and a trail of people who stop following is rarely bad luck; it's a frequency of force being met with resistance rather than momentum.`,
      path: `The integration is learning to pair drive with discernment — to ask not just "can I move this forward" but "should I, right now, like this." Your gift is real. The mastery is choosing your moments as carefully as you execute them. Once drive is offered with discernment rather than force, people stop bracing against it and start moving with it.`,
      positive: `People feel the momentum in you and fall in behind it without being asked, and because that drive is paired with discernment rather than force, collaborators stay with you instead of eventually resisting.`,
      negative: `Force applied where finesse was needed keeps generating resistance rather than followers — the momentum you're pushing for is met with people quietly bracing against it instead of joining it.`,
    },

    INTUITION_WISDOM: {
      heading: 'The Knowing That Arrives Before the Proof',
      why: `This node carries the frequency of interior knowing — a talent for sensing what is true before it can be explained, and for holding complexity without needing to resolve it immediately. Wherever it lives on your Talent Star Line, it marks a genuine gift for depth: research, pattern recognition, reading people and situations correctly on instinct alone.`,
      shadow: `The shadow is withholding — using the depth of your perception as a private world rather than a shared resource, staying silent when your insight could actually help because translating it into plain language feels like a loss. It can also tip into isolation: preferring the certainty of your own inner processing to the mess of collaborative thinking — and a world that keeps feeling like it isn't listening is often just responding to wisdom that was never actually offered out loud.`,
      path: `The integration is translation — finding the language, the timing, the format that lets what you know actually reach the people who need it. Your wisdom was never meant to stay internal only. Once it's genuinely offered, the recognition and collaboration that felt scarce start having something real to respond to.`,
      positive: `You sense what's true before it can be proven, and because you actually offer that reading out loud, recognition and collaboration have something real to respond to.`,
      negative: `Insight that stays withheld is insight the world never gets to respond to — a quiet isolation confirming itself simply because the wisdom was never actually offered out loud.`,
    },

    CREATIVITY_ART: {
      heading: 'The Expression That Wants to Be Witnessed',
      why: `This node carries the frequency of creative visibility — a talent for making things that move people, and for being seen while you do it. Wherever it lives on your Talent Star Line, it marks a natural gift for aesthetics, performance, or public creative work: the specific alchemy of turning an internal feeling into something external that lands.`,
      shadow: `The shadow is dependence on the witness — needing the audience's reaction to validate the work's worth, or shrinking the work itself to fit what is safely, predictably well received. There is also the trap of vanity: mistaking visibility for the point, rather than the natural byproduct of genuine expression — and an audience that stays lukewarm is often just responding to work that was shrunk to be safe rather than made to be true.`,
      path: `The integration is creating from the work itself first — letting the visibility be a consequence, not the goal. Your talent is real and wants an audience. It does not need to perform for one to be valid. Once the work is made from genuine expression rather than approval-seeking, the audience it draws responds to something real instead of something safe.`,
      positive: `You make things that genuinely move people, and because the work comes from real expression rather than approval-seeking, the audience it draws responds to something true.`,
      negative: `Work shrunk to be safely, predictably well received draws a correspondingly lukewarm response — the audience simply reflecting back the caution the work itself was made with.`,
    },

    TEACHER_FREEDOM: {
      heading: 'The Transmission That Sets Both Sides Loose',
      why: `This node carries the frequency of structured transmission held lightly — a talent for passing on what you know while leaving room for the other person to outgrow it. Wherever it lives on your Talent Star Line, it marks an aptitude for teaching, systems-thinking, or unconventional paths that others can eventually walk without you.`,
      shadow: `The shadow is the trap of the permanent guide — a subtle need to remain necessary, to keep the student or system dependent on your continued involvement, even when calling it freedom. It can also swing the other way: rejecting all structure so completely that nothing durable gets built or passed on — and students who never quite launch are matching a frequency of freedom that was offered in name only.`,
      path: `The integration is teaching toward your own obsolescence — building something, or someone, that becomes fully capable of standing without you. That is the actual measure of this talent's success. Once freedom is genuinely offered rather than managed, the people you teach actually take it, and what you built keeps compounding without needing you to sustain it.`,
      positive: `You pass on what you know while leaving genuine room for the other person to outgrow it, and because that freedom is real, what you built keeps compounding long after your direct involvement ends.`,
      negative: `A quiet need to stay necessary keeps freedom offered in name only — students and systems stay dependent because that is the exact frequency actually being extended to them.`,
    },

    TRANSFORMATION_POWER: {
      heading: 'The Force That Clears the Ground for Rebuilding',
      why: `This node carries the frequency of high-stakes change — a talent for stepping into collapse, crisis, or deep restructuring and finding the clarity that only that intensity makes available. Wherever it lives on your Talent Star Line, it marks a genuine capacity for turning breakdown into a foundation, rather than just surviving it.`,
      shadow: `The shadow is manufacturing the crisis you're best equipped to handle — an unconscious pull toward drama or upheaval because stillness feels less like your natural terrain. It can also show up as scorched-earth change: dismantling what still had value simply because dismantling is what you know how to do well — a life that keeps delivering upheaval is often just a frequency still identified with crisis as the only believable form of movement.`,
      path: `The integration is discernment about when transformation is actually required versus when it is simply familiar. Your power is real. The mastery is reserving it for the moments that genuinely call for it. Once stillness stops feeling like a threat, change stops needing to arrive as crisis to get your attention.`,
      positive: `You step into genuine crisis and find the clarity that only that intensity makes available, and because stillness no longer feels threatening, change gets to unfold deliberately instead of catastrophically.`,
      negative: `A frequency still identified with crisis as the only believable form of movement keeps manufacturing upheaval — stillness reads as danger, so drama arrives to fill the vacancy.`,
    },

  };

  function get(iconType) {
    return archetypes[iconType] || null;
  }

  return { get };

})();
