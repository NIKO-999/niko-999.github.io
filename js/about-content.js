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
      body: `A Destiny Matrix is a map of your personality, drawn from your birth date, laid out as a diagram of connected points. Each point is a position — a specific area of life, like how you come across to other people, what you're here to work through, what you inherited from your father's side, how you relate to money. Each position holds a number from 1 to 22, and each of those numbers corresponds to one of the 22 major cards of the tarot. Put simply: the diagram tells you which archetype is sitting in which area of your life. Everything this app shows you is an expansion of that one idea.`,
    },
    {
      label: 'THE TAROT HALF — 22 ARCHETYPES',
      body: `The 22 Major Arcana of the tarot aren't used here for fortune-telling, and no card is drawn at random. They're used as a vocabulary of human patterns — twenty-two recognisable ways a person can be built. The Hermit is the pattern of understanding things through solitude and depth. The Tower is the pattern of structures collapsing and what gets rebuilt afterward. The Empress is abundance, care, and things that grow. Each one carries a full picture: what it looks like at its best, what it looks like when it goes wrong, and what usually sits underneath both. These are old, well-worn descriptions of ways people actually are, and that's the entire reason they're useful here — not because a card predicts anything, but because a good archetype gives you language for something you already recognised in yourself but couldn't quite name.`,
    },
    {
      label: 'THE NUMEROLOGY HALF — WHERE EACH ARCHETYPE LANDS',
      body: `Numerology is what decides which archetype goes where. Your birth date produces a set of numbers, and each number is assigned to a specific position in the diagram — one position for how you naturally are, one for your spiritual potential, one for the material and practical side of your life, one for the patterns you're carrying that keep asking to be resolved, and so on outward through the ancestral square, the money and love channels, and the rest. The number that lands on a position is the archetype that lives there. This app also runs a second, separate layer of classical numerology — Life Path, Expression, Soul Urge, and the name-based numbers — which asks slightly different questions and can be filled in if you enter your name. The two systems don't compete; they describe the same person from different angles, and where they agree, that agreement is usually worth paying attention to.`,
    },
    {
      label: 'WHY THE SAME NUMBER MEANS DIFFERENT THINGS',
      body: `This is the part people most often miss, and it's the thing that makes a matrix a matrix rather than a list. An archetype is never read on its own — it's always the archetype expressed through the position it's sitting in. The Hermit in your core character is a person who genuinely needs solitude to think clearly. The Hermit in your relationship channel is something quite different: a pull toward withdrawal at exactly the moments closeness is being asked of you. Same archetype, completely different lived experience, because the area of life it's landed in changes what it actually does to you. Every reading in this app is written for that specific combination rather than pulled from a generic description of the card, which is why the same number can appear twice in your chart and read as two genuinely different things.`,
    },
    {
      label: 'HOW TO ACTUALLY USE IT',
      body: `Treat it as a set of questions rather than a set of conclusions. Open one position, read it, and notice honestly what lands and what doesn't — the parts that make you slightly uncomfortable are usually the ones worth sitting with longest. Every reading here is deliberately built in three parts: what this looks like when it's working (Mastery), how the same energy fails when it's unexamined (Shadow), and one concrete thing you could actually do about it (Invitation). The shadow is not an accusation and the mastery is not flattery; they're two ends of one pattern, and most people can find themselves somewhere along it. You don't need to read the whole chart. One position, read properly and thought about for a week, is worth more than all twenty-nine skimmed in an evening.`,
    },
    {
      label: 'WHAT IT IS NOT',
      body: `It doesn't predict the future, and nothing in this app will tell you what's going to happen to you. It isn't a diagnosis, a personality test with a score, or a substitute for therapy, medical advice, or a real conversation with someone who knows you. It also isn't a verdict — nothing here is fixed, and a difficult position describes a pattern you can work with, not a sentence you've been handed. The honest framing is this: it's a structured mirror. The value isn't in whether the system is objectively true; it's in what you notice about yourself while reading it. If a passage makes you think about something you'd been avoiding, it's done its job, and that would still be true whatever system had prompted it.`,
    },
    {
      label: 'FINDING YOUR WAY AROUND',
      body: `The five brightest stars in the centre are the Core Cross — the foundation of the chart, and the right place to start if you only read a few things. The Star Index lists every position in the chart grouped by what it covers, so you can go straight to whatever you're actually curious about rather than hunting for it in the scene. The Numerology panel holds the classical name-and-date numbers, most of which stay empty until you add a name; nothing here requires a name, and nothing you enter is stored. Anything still unwritten says so honestly rather than showing you filler. Start with the Core Cross, then follow whatever question it raises.`,
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
