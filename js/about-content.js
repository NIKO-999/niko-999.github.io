'use strict';

/**
 * Destiny Matrix — "What Is a Destiny Matrix?" primer
 * ─────────────────────────────────────────────────────────────
 * The one card in this app that isn't a reading. It sits at the very top
 * of the Star Index, has no star in the scene, no number, and no
 * position — it exists purely so someone who has never heard of a
 * Destiny Matrix can open the app, read one card, and understand what
 * they're looking at and what it's for.
 *
 * Deliberate scope decisions (per the project owner):
 *   - NO origin story, no lineage, no "who created this" — irrelevant to
 *     someone trying to understand the tool.
 *   - NO arithmetic. The app already does every calculation; explaining
 *     the reduction rules here would bury the actual point under math
 *     that nobody needs in order to use it.
 *   - The emphasis is on what it IS and how it's USED as a reflection
 *     tool, including an explicit honesty section about what it is not.
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
      body: `A Destiny Matrix is a map of your personality, drawn from your birth date, laid out as a diagram of connected points. Each point is a position — a specific area of life, like how you come across to other people, what you're here to work through, what you inherited through your generational line, how you relate to money. Each position holds a number from 1 to 22, and each of those numbers corresponds to one of the 22 major cards of the tarot. Put simply: the diagram tells you which archetype is sitting in which area of your life. Everything this app shows you is an expansion of that one idea.`,
    },
    {
      label: 'THE TAROT HALF',
      body: `The 22 Major Arcana are used here as a vocabulary of human patterns — twenty-two recognisable ways a person can be built. No card is drawn, and nothing is predicted. Each archetype simply carries a full picture: what it looks like at its best, how it fails when it goes unexamined, and what usually sits underneath both. That's the whole reason they're useful — a good archetype gives you language for something you already recognised in yourself but couldn't quite name.`,
    },
    {
      label: 'THE NUMEROLOGY HALF',
      body: `Numerology decides which archetype goes where. Your birth date produces the numbers, and each number lands on a specific position in the diagram — so the position tells you the area of life, and the number tells you the pattern operating in it. A second layer of classical numerology (Life Path, Expression, and the name-based numbers) can be filled in if you enter your name. The two describe the same person from different angles, and where they agree, that agreement is usually worth noticing.`,
    },
    {
      label: 'WHY POSITION CHANGES EVERYTHING',
      body: `An archetype is never read on its own — it's always that archetype expressed through the area of life it landed in. The same number sitting in your core character and in your relationship channel describes two genuinely different lived experiences, because the position changes what the pattern actually does to you. Every reading here is written for that specific combination rather than pulled from a generic description of the card. This is what makes it a matrix rather than a list.`,
    },
    {
      label: 'HOW TO USE IT',
      body: `Treat it as a set of questions, not a set of conclusions. Every reading is built in three parts: what this looks like when it's working (Mastery), how the same energy fails when it's unexamined (Shadow), and one concrete thing you could do about it (Invitation). The shadow isn't an accusation and the mastery isn't flattery — they're two ends of one pattern. Notice honestly what lands and what doesn't; the parts that make you slightly uncomfortable are usually worth the most attention. One position read properly beats the whole chart skimmed in an evening.`,
    },
    {
      label: 'WHAT IT IS NOT',
      body: `It doesn't predict the future, and it isn't a diagnosis, a personality score, or a substitute for therapy or a real conversation with someone who knows you. Nothing here is a verdict — a difficult position describes a pattern you can work with, not a sentence you've been handed. The honest framing is that it's a structured mirror. The value isn't whether the system is objectively true; it's what you notice about yourself while reading it.`,
    },
    {
      label: 'WHERE TO START',
      body: `The five brightest stars in the centre are the Core Cross — the foundation of the chart, and the right place to begin. The Star Index lists every position grouped by what it covers, so you can go straight to whatever you're curious about. The Numerology panel holds the name-and-date numbers; nothing requires a name, and nothing you enter is stored. Start with the Core Cross, then follow whatever question it raises.`,
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
