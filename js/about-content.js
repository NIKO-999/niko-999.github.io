'use strict';

/**
 * Destiny Matrix — "What Is Destiny Matrix?" primer
 * ─────────────────────────────────────────────────────────────
 * The one card in this app that isn't a reading. It sits at the very top
 * of the Star Index, has no star in the scene, no number, and no
 * position — it exists purely so someone who has never heard of Destiny
 * Matrix can open the app, read one card, and understand what they're
 * looking at and what it's for.
 *
 * Deliberate scope decisions (per the project owner):
 *   - NO origin story, no lineage, no "who created this".
 *   - NO arithmetic. The app does every calculation already.
 *   - NO examples of what individual cards or numbers mean — readers pick
 *     that up from the readings themselves.
 *   - Written for someone with ZERO prior exposure: short sentences,
 *     plain words, no jargon left undefined. Every system the app uses
 *     (numerology, tarot archetypes, chakras) gets one short section
 *     saying what it is and how it's used here — nothing more.
 *   - "Destiny Matrix" is treated as a name, not "a destiny matrix".
 *
 * Voice: the same trauma-informed Golden Standard second person used
 * everywhere else (see NON_NEGOTIABLE_RULES.md) — plain, warm, direct,
 * no mysticism-as-authority, no promises about the future.
 *
 * API:
 *   DAboutContent.sections() -> [{ label, body }]
 *   DAboutContent.html()     -> ready-to-inject pb-full-section markup
 */

window.DAboutContent = (function () {
  const sections = [
    {
      label: 'THE SHORT VERSION',
      body: `Destiny Matrix is a map of your personality, worked out from your birth date. It's drawn as a diagram of connected points. Each point covers one area of life — how you come across, what you're here to work through, what you inherited through your generational line, how you handle money. Each point also holds a number, and every number stands for a personality pattern. So the diagram tells you which pattern is sitting in which part of your life. That's the whole idea. Everything else here is just that, explained in more detail.`,
    },
    {
      label: 'THE NUMBERS',
      body: `The numbers come from your birth date. That's the numerology part, and the app does all the maths for you — you never have to work anything out. Each number lands on a point in the diagram. The point tells you the area of life; the number tells you the pattern showing up there. If you enter your name, a second set of numbers unlocks, based on the letters. It asks slightly different questions about the same person.`,
    },
    {
      label: 'THE CARDS',
      body: `Each number from 1 to 22 matches one of the 22 major tarot cards. No cards are shuffled or drawn here — they're used purely as a set of descriptions. Think of them as 22 well-known ways a person can be built. Each one comes with a full picture: how it looks when it's going well, how it goes wrong, and what usually sits underneath. They're borrowed because they're good, familiar descriptions of how people actually are.`,
    },
    {
      label: 'THE BODY CHAKRAS',
      body: `Chakras are seven centres running up the body, from the base of the spine to the top of the head. Each one covers a different part of being human — feeling safe, creativity, confidence, love, speaking up, intuition, and meaning. Open the panel on the side of the screen and you'll see all seven, each with three numbers next to it. The first is how that centre shows up in practical, physical life. The second is how much energy you actually have available there. The third is how it feels day to day. Tap any centre to read what it looks like when it's flowing and when it's stuck, plus one thing you can do about it. It's the same person as the rest of the chart, looked at through the body instead of through your circumstances.`,
    },
    {
      label: 'WHY THE SAME NUMBER CAN MEAN TWO THINGS',
      body: `A number never means just one thing on its own. What it means depends on where it lands. The same number in the part about who you are, and in the part about your relationships, describes two very different experiences — because the area of life changes what that pattern actually does to you. Every reading here is written for that exact combination. That's what makes it a map instead of a list.`,
    },
    {
      label: 'HOW TO USE IT',
      body: `Read it as questions, not answers. Every reading comes in three parts: what this looks like when it's working, how it goes wrong when you're not paying attention, and one thing you could actually do about it. The difficult part isn't an accusation and the good part isn't flattery — they're two ends of the same thing. Notice what rings true and what doesn't. The bits that make you a little uncomfortable are usually the ones worth thinking about. One point read properly is better than the whole chart skimmed.`,
    },
    {
      label: 'WHAT IT IS NOT',
      body: `It doesn't tell the future. It isn't a medical or psychological diagnosis, and it's not a replacement for therapy or a real conversation with someone who knows you. Nothing here is a verdict — a hard reading describes something you can work on, not a sentence you've been handed. The honest way to put it: it's a mirror with some structure to it. Whether the system is "true" matters less than what you notice about yourself while reading it.`,
    },
    {
      label: 'WHERE TO START',
      body: `The five brightest stars in the middle are the Core Cross. They're the foundation of the chart and the best place to begin. The Star Index lists every point grouped by what it covers, so you can jump straight to whatever you're curious about. The Numerology panel holds the name-based numbers — you never have to enter a name, and nothing you type is saved. Start in the middle, then follow whatever question it raises.`,
    },
  ];

  function html() {
    return sections.map(s =>
      `<div class="pb-full-section">
         <div class="pb-full-label" style="color:rgba(var(--accent-rgb),0.75)">${s.label}</div>
         <div class="pb-full-text">${s.body}</div>
       </div>`
    ).join('');
  }

  return { sections: () => sections.slice(), html };
})();
