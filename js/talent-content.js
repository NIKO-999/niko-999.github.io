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
      why: `There is something you do that looks like courage to everyone else but feels, to you, like the only bearable option. When a room hesitates, you move. Hand you a half-formed plan and a circle of uncertain faces, and you'll be the one who steps across the threshold first — not because you're fearless, but because waiting sits in your body worse than acting ever has. People feel this in you almost immediately. They fall in behind your momentum without being asked, because something in the way you carry a decision tells them it's already happening. You are the starter, the closer, the steady hands a stalled moment has been waiting for.`,
      shadow: `The trouble begins when you push where you should have paused. You can mistake speed for progress, and control for leadership, driving a plan forward long after the moment that needed it has quietly closed behind you. When that happens, you burn through people faster than you realize — not because you meant to, but because your pace left no room for anyone to catch their breath. If people have been quietly dropping off, agreeing with you less than they used to, that isn't bad luck. It's an echo coming back to you. And underneath the compulsion to keep moving, there is often a younger you who learned that hesitating meant being overlooked or left behind — a child for whom constant motion became the only way to feel safe or seen. That child wasn't wrong to learn it. It worked. It kept you visible.`,
      path: `You are allowed to pause without disappearing. That is the quiet threshold you're standing at now: the old rule said motion equals safety, and something in you is beginning to sense that it no longer has to. Try asking a second question before you move — not just "can I push this forward," but "should I, right now, like this." Your drive is real and it is rare; most people freeze where you act. The mastery isn't slowing down for its own sake. It's choosing your moments as carefully as you already execute them, so people stop bracing against you and start moving with you. When was the last time you let a moment pass without acting on it — and what did the stillness try to tell you?`,
      positive: `People feel your momentum and fall in behind it without being asked, and because that drive is paired with discernment rather than force, the people you lead stay with you instead of eventually pulling away.`,
      negative: `Force applied in the wrong moment keeps generating resistance instead of followers — the push you're making is met with people quietly bracing against it rather than joining it.`,
    },

    INTUITION_WISDOM: {
      heading: 'You Know Before You Can Explain How',
      why: `You sense what's true before anyone hands you the proof. A room shifts and you feel it in your body before a word is spoken. A pattern repeats and you've clocked it three instances before anyone else notices there is one. This isn't guessing, and it isn't luck — it's a genuine gift for depth: for research, for reading people, for holding a complicated situation open without needing to resolve it just to feel comfortable. Where this sits in your chart, it marks a talent for going below the surface and staying down there long enough to actually understand something. Most people can't tolerate that depth. You live in it.`,
      shadow: `The catch is what you do with what you know. It's easy to let your perception become a private world instead of something you share — to stay quiet when speaking up could genuinely help, because turning a felt sense into plain words feels like it will lose something in translation. You may prefer the certainty of working things out alone over the mess of working them out with people. And if it ever feels like nobody's really listening to you, it's worth asking gently whether you've actually said the thing out loud yet. Somewhere behind that silence there is often a child who spoke what they sensed and wasn't believed — who learned that voicing the invisible wasn't welcome, and so made quiet into a fortress long before it became a spiritual style. That fortress protected you once. It's allowed to have been necessary.`,
      path: `You are allowed to be heard — not just to know, but to be known for what you know. Your work now is translation: finding the words, the timing, the moment that lets what you already sense reach the people who need it. What you carry was never meant to stay entirely internal, and the recognition you've been quietly hoping for can only respond to something you've actually offered. The more you say the true thing out loud, in real time, the more the world finally has something of yours to answer. What is one thing you've known for a long time that you have never once said out loud?`,
      positive: `You sense what's true before it can be proven, and because you actually say it out loud, recognition and collaboration have something real to respond to.`,
      negative: `Insight you keep to yourself is insight the world never gets a chance to respond to — it's hard to feel truly seen when the thing that would let people see you clearly was never actually spoken.`,
    },

    CREATIVITY_ART: {
      heading: 'You Make Things That Are Meant to Be Seen',
      why: `You have a gift for taking what's happening inside you and giving it a form other people can feel. Aesthetics, performance, public creative work — wherever this lands on your Talent Star Line, it marks a real talent for making things that move people, and for standing visible while you do it. This isn't vanity, whatever you may have been told. It's closer to translation: a private feeling finding its outer body, a thread pulled from somewhere wordless and woven into something someone else can hold.`,
      shadow: `Where this gets complicated is when you start needing the reaction more than you trust the work. You might notice yourself quietly shrinking a piece — making it safer, more predictable, more likely to be liked — trading its truth for its reception. Visibility starts to feel like the point instead of the natural echo of expressing something real. If audiences keep feeling lukewarm, it's worth asking whether the work got softened somewhere on its way out of you. And beneath that softening there is often a child whose creativity was only truly welcomed when it pleased — who learned early that being seen depended on being palatable first. That child made a reasonable bargain with the world it was given. You're allowed to grieve that it was ever the price.`,
      path: `You are allowed to make something true before you make it likeable. That's the threshold in front of you: letting being seen become a consequence of expression rather than its goal. Your talent is real, and it deserves an audience — but it doesn't need one to already be valid while you're making it. The more the work comes from genuine expression instead of approval-seeking, the more the audience it draws responds to something alive instead of something merely safe. If no one ever reacted to your work again — what would you make next, and for whom?`,
      positive: `You make things that genuinely move people, and because the work comes from real expression rather than approval-seeking, the audience it draws responds to something true.`,
      negative: `Work that's been quietly shrunk to be safely, predictably liked tends to draw a correspondingly lukewarm response — the audience is simply reflecting back the caution the work itself was made with.`,
    },

    TEACHER_FREEDOM: {
      heading: 'You Teach Best When You Let People Outgrow You',
      why: `You have a real talent for passing on what you know while leaving room for the other person to eventually go further than you did. It shows up as an aptitude for teaching, for building systems other people can actually use, for walking unconventional paths that others can later walk without you beside them. The best version of this gift was never about being needed. It's about building a container strong enough to hold people while they grow — and open enough that they can leave it when they're ready.`,
      shadow: `The risk here is subtle: a quiet need to stay necessary. You might catch yourself keeping a student, a team, or a system just slightly dependent on you continuing to show up — even while telling yourself, and them, that you're giving them freedom. The opposite trap exists too: rejecting structure so completely that nothing durable ever gets built or passed on. If the people you teach never quite launch on their own, it's worth asking gently whether the freedom you're offering is real or just the word you use for it. Underneath, there is often a child whose place in the family depended on being needed — for whom being indispensable became identity long before it became a teaching style. That child found belonging the only way that was offered. It made sense then.`,
      path: `You are allowed to matter without being needed. That's the threshold: teaching yourself out of a job, building something — or someone — fully capable of standing without you, and discovering that your worth survives their independence. That's the true measure of this talent. Once the freedom you offer is genuine rather than managed, the people you teach actually take it and run, and what you built keeps compounding long after you've stepped back. If everyone you've ever taught outgrew you tomorrow, what would be left that's just yours?`,
      positive: `You pass on what you know while leaving genuine room for the other person to outgrow you, and because that freedom is real, what you built keeps compounding long after you've stepped back.`,
      negative: `A quiet need to stay necessary keeps the freedom you're offering theoretical rather than real — students and systems stay dependent because that's the actual signal you've been sending them.`,
    },

    TRANSFORMATION_POWER: {
      heading: 'You Find Clarity Right Where Everyone Else Loses It',
      why: `You have a talent that only reveals itself when things fall apart. You step into collapse, crisis, real upheaval — and where other people freeze or scatter, something in you steadies. You can see what the breakdown is actually clearing space for while everyone around you is still grieving the rubble. This is a genuine capacity to turn a mess into a foundation, not just survive it. In the storm, you are the still point. People sense it, and they move toward you when everything else is moving away.`,
      shadow: `The risk is that crisis becomes your only comfortable terrain. Without quite meaning to, you can find yourself drawn toward drama or upheaval because stillness feels unfamiliar by comparison — even tearing down things that still had value, simply because tearing down is the move your hands know best. If upheaval keeps arriving in your life more often than seems reasonable, it's worth asking whether some part of you still doesn't trust the quiet. Often there's a child underneath this — one raised where only crisis reliably got attention, where calm was just the held breath before something broke. For that child, chaos was legible and peace was suspicious. Learning to read the storm was how you survived it. Of course calm still feels like a stranger.`,
      path: `You are allowed to rest inside a life that isn't on fire. That's the threshold you're standing at: learning to tell the difference between change that's genuinely needed and change that's merely familiar. Your capacity for transformation is real — the mastery is saving it for the moments that actually call for it, and letting the quiet stretches be quiet. Once stillness stops registering as a threat, change gets to arrive on its own terms instead of needing a crisis to get your attention. When your life is finally calm — what do you notice yourself waiting for?`,
      positive: `You step into genuine crisis and find the clarity that only that kind of intensity makes available, and because stillness no longer feels threatening, change gets to unfold deliberately instead of catastrophically.`,
      negative: `When stillness still reads as a threat, upheaval tends to show up to fill the space — not because change is truly needed, but because it's the only kind of movement that currently feels believable to you.`,
    },

  };

  function get(iconType) {
    return archetypes[iconType] || null;
  }

  return { get };

})();
