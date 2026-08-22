/**
 * characters.js — Unlockable trader characters.
 * Character: { id, name, title, lore, perk:{desc, effect:{key, value}},
 *   unlock:{type:'level'|'boss'|'achievement', value, label}, avatar: inline SVG string }
 * Perk effect keys consumed by the engine:
 *   xpMult (multiplier), xpMultTimed (multiplier on time-window questions),
 *   hintDiscount (fraction), streakShield (count per day), scenarioXpMult,
 *   bossDamageMult, quizTimeBonus (seconds), coinMult, replayForgive (count)
 * All avatars share one art style: 128×128 viewBox, dark rounded-square field,
 * duotone figure with a single accent, crisp geometry, no external assets.
 */

const bg = (accent, id) => `
  <defs>
    <linearGradient id="g-${id}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#101726"/><stop offset="1" stop-color="#0a0f1a"/>
    </linearGradient>
    <linearGradient id="a-${id}" x1="0" y1="1" x2="1" y2="0">
      <stop offset="0" stop-color="${accent}"/><stop offset="1" stop-color="#ffffff" stop-opacity="0.85"/>
    </linearGradient>
  </defs>
  <rect x="2" y="2" width="124" height="124" rx="26" fill="url(#g-${id})" stroke="${accent}" stroke-opacity="0.45" stroke-width="2"/>`;

export const characters = [
  {
    id: 'apprentice',
    name: 'The Apprentice',
    title: 'Student of the Narrative',
    lore:
      'Fresh from the prop-desk waiting room, the Apprentice memorized one sentence before anything else: a model is an edge, not a prophecy. They journal every DOL and POI by hand, refusing to click buy until the story is written.',
    perk: {
      desc: '+10% XP from Academy lessons — the narrative compounds.',
      effect: { key: 'xpMult', value: 1.1 },
    },
    unlock: { type: 'level', value: 1, label: 'Available from the start' },
    avatar: `<svg viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">${bg('#39d5c8', 'apprentice')}
      <circle cx="64" cy="50" r="17" fill="#e8eefc"/>
      <path d="M34 104c3-20 14-30 30-30s27 10 30 30" fill="#1d2a44" stroke="#e8eefc" stroke-width="3"/>
      <rect x="42" y="88" width="44" height="30" rx="4" fill="url(#a-apprentice)" opacity="0.9"/>
      <line x1="48" y1="96" x2="80" y2="96" stroke="#0a0f1a" stroke-width="3"/>
      <line x1="48" y1="103" x2="72" y2="103" stroke="#0a0f1a" stroke-width="3"/>
      <circle cx="64" cy="46" r="3" fill="#101726"/><circle cx="54" cy="48" r="2.4" fill="#101726"/><circle cx="74" cy="48" r="2.4" fill="#101726"/>
    </svg>`,
  },
  {
    id: 'profiler',
    name: 'The Profiler',
    title: '4H Candle Specialist',
    lore:
      'Six candles, one story — the Profiler sees the whole day as 18:00 through 14:00 and nothing else. They can tell you which candle will print the low before London wakes up, and they have the journal to prove it.',
    perk: {
      desc: '+15% XP on time-window and 4H-profile questions.',
      effect: { key: 'xpMultTimed', value: 1.15 },
    },
    unlock: { type: 'level', value: 4, label: 'Reach Level 4' },
    avatar: `<svg viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">${bg('#7aa2ff', 'profiler')}
      <g stroke-width="3">
        <line x1="34" y1="40" x2="34" y2="92" stroke="#3a4a6b"/><rect x="27" y="52" width="14" height="26" rx="2" fill="#3a4a6b"/>
        <line x1="58" y1="34" x2="58" y2="86" stroke="#7aa2ff"/><rect x="51" y="44" width="14" height="24" rx="2" fill="url(#a-profiler)"/>
        <line x1="82" y1="26" x2="82" y2="72" stroke="#7aa2ff"/><rect x="75" y="32" width="14" height="26" rx="2" fill="url(#a-profiler)"/>
        <line x1="103" y1="42" x2="103" y2="80" stroke="#3a4a6b"/><rect x="96" y="50" width="14" height="18" rx="2" fill="#3a4a6b"/>
      </g>
      <circle cx="64" cy="104" r="10" fill="none" stroke="#e8eefc" stroke-width="3"/>
      <line x1="64" y1="104" x2="64" y2="97" stroke="#e8eefc" stroke-width="3"/>
      <line x1="64" y1="104" x2="70" y2="106" stroke="#e8eefc" stroke-width="3"/>
    </svg>`,
  },
  {
    id: 'session-ghost',
    name: 'Session Ghost',
    title: 'London Specialist',
    lore:
      'They say the Ghost has never seen a New York lunch. Awake at 2am, asleep by noon, the Ghost lives inside the 2–5am window where Asia’s consolidation becomes London’s manipulation — and vanishes the moment the wick is in.',
    perk: {
      desc: '+20% XP on London-reversal scenarios.',
      effect: { key: 'scenarioXpMult', value: 1.2 },
    },
    unlock: { type: 'level', value: 7, label: 'Reach Level 7' },
    avatar: `<svg viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">${bg('#a9b7ff', 'session-ghost')}
      <path d="M40 96V60c0-14 10-24 24-24s24 10 24 24v36l-8-7-8 7-8-7-8 7-8-7z" fill="#e8eefc" opacity="0.92"/>
      <circle cx="55" cy="60" r="4" fill="#101726"/><circle cx="73" cy="60" r="4" fill="#101726"/>
      <path d="M30 44a26 26 0 0 1 18-24 30 30 0 0 0-6 24z" fill="url(#a-session-ghost)" opacity="0.8"/>
      <text x="88" y="36" font-family="system-ui" font-size="14" fill="#a9b7ff" font-weight="700">2:00</text>
    </svg>`,
  },
  {
    id: 'sniper',
    name: 'The Sniper',
    title: 'One Perfect Entry a Day',
    lore:
      'The Sniper fires once — C2 of the swing, SMT loaded, M5 CISD as the trigger — and then racks the rifle until tomorrow. No revenge shots, no second-guessing. If the checklist misses a line, so does the trigger finger.',
    perk: {
      desc: 'First scenario each day pays +30% XP.',
      effect: { key: 'firstTradeXpMult', value: 1.3 },
    },
    unlock: { type: 'achievement', value: 'perfect-run', label: 'Complete a perfect Gauntlet run' },
    avatar: `<svg viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">${bg('#ffd166', 'sniper')}
      <circle cx="64" cy="64" r="30" fill="none" stroke="#e8eefc" stroke-width="3"/>
      <circle cx="64" cy="64" r="14" fill="none" stroke="url(#a-sniper)" stroke-width="3"/>
      <circle cx="64" cy="64" r="4" fill="#ffd166"/>
      <line x1="64" y1="22" x2="64" y2="42" stroke="#e8eefc" stroke-width="3"/>
      <line x1="64" y1="86" x2="64" y2="106" stroke="#e8eefc" stroke-width="3"/>
      <line x1="22" y1="64" x2="42" y2="64" stroke="#e8eefc" stroke-width="3"/>
      <line x1="86" y1="64" x2="106" y2="64" stroke="#e8eefc" stroke-width="3"/>
    </svg>`,
  },
  {
    id: 'smt-oracle',
    name: 'The SMT Oracle',
    title: 'Reader of Divergence',
    lore:
      'Two charts, one truth. The Oracle watches correlated pairs the way others watch price, and refuses every reversal that arrives alone. Their ledger has one motto embossed on the cover: No SMT, no trade.',
    perk: {
      desc: 'Hints cost 25% less — divergence reveals the answer.',
      effect: { key: 'hintDiscount', value: 0.25 },
    },
    unlock: { type: 'level', value: 10, label: 'Reach Level 10' },
    avatar: `<svg viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">${bg('#c497ff', 'smt-oracle')}
      <path d="M28 78 58 48l14 12 26-28" fill="none" stroke="#e8eefc" stroke-width="3.5" stroke-linecap="round"/>
      <path d="M28 94 58 72l14 8 26-16" fill="none" stroke="url(#a-smt-oracle)" stroke-width="3.5" stroke-linecap="round"/>
      <circle cx="98" cy="32" r="5" fill="#c497ff"/>
      <circle cx="98" cy="63" r="5" fill="none" stroke="#c497ff" stroke-width="3"/>
      <ellipse cx="64" cy="110" rx="26" ry="6" fill="#1d2a44"/>
    </svg>`,
  },
  {
    id: 'timekeeper',
    name: 'The Timekeeper',
    title: 'Warden of the Windows',
    lore:
      'Entries after 8:00, hands off at 11:00, drivers at 8:30 and 9:30 — the Timekeeper trades the clock before the chart. Legend says they once skipped a 500-tick runner because it triggered at 11:01, and slept perfectly.',
    perk: {
      desc: '+8 seconds on every timed Gauntlet question.',
      effect: { key: 'quizTimeBonus', value: 8 },
    },
    unlock: { type: 'level', value: 13, label: 'Reach Level 13' },
    avatar: `<svg viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">${bg('#66e0a3', 'timekeeper')}
      <circle cx="64" cy="64" r="34" fill="#101726" stroke="#e8eefc" stroke-width="3"/>
      <line x1="64" y1="64" x2="64" y2="40" stroke="url(#a-timekeeper)" stroke-width="4" stroke-linecap="round"/>
      <line x1="64" y1="64" x2="82" y2="72" stroke="#e8eefc" stroke-width="4" stroke-linecap="round"/>
      <circle cx="64" cy="64" r="4" fill="#66e0a3"/>
      <text x="58" y="30" font-family="system-ui" font-size="11" fill="#66e0a3" font-weight="700">8:00</text>
      <text x="88" y="96" font-family="system-ui" font-size="11" fill="#3a4a6b" font-weight="700">11:00</text>
    </svg>`,
  },
  {
    id: 'wick-whisperer',
    name: 'The Wick Whisperer',
    title: 'Disciple of OLHC',
    lore:
      'Open, low, high, close — the Whisperer hears the order of delivery inside every candle. Small wick? They lean in. Large opposing run? They quietly re-draw the target back to the daily open and walk away.',
    perk: {
      desc: '+15% XP on candle-anatomy and wick-size questions.',
      effect: { key: 'xpMult', value: 1.15 },
    },
    unlock: { type: 'boss', value: 'chop-zone', label: 'Defeat The Chop Zone' },
    avatar: `<svg viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">${bg('#ff9f6e', 'wick-whisperer')}
      <line x1="52" y1="18" x2="52" y2="34" stroke="#e8eefc" stroke-width="3"/>
      <rect x="42" y="34" width="20" height="56" rx="3" fill="url(#a-wick-whisperer)"/>
      <line x1="52" y1="90" x2="52" y2="110" stroke="#e8eefc" stroke-width="3"/>
      <line x1="86" y1="30" x2="86" y2="70" stroke="#3a4a6b" stroke-width="3"/>
      <rect x="78" y="70" width="16" height="14" rx="3" fill="#3a4a6b"/>
      <line x1="86" y1="84" x2="86" y2="98" stroke="#3a4a6b" stroke-width="3"/>
      <path d="M30 60q-8 4 0 8" fill="none" stroke="#ff9f6e" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M24 56q-12 8 0 16" fill="none" stroke="#ff9f6e" stroke-width="2.5" stroke-linecap="round" opacity="0.6"/>
    </svg>`,
  },
  {
    id: 'liquidity-warden',
    name: 'The Liquidity Warden',
    title: 'Keeper of Protected Swings',
    lore:
      'The Warden patrols the range with a ledger of every swing: protected, unprotected, failed. They know an OB into a key level is a locked door — and that price always leaves through the side where failure swings sleep.',
    perk: {
      desc: 'One streak shield per day — a wrong answer won’t break your streak.',
      effect: { key: 'streakShield', value: 1 },
    },
    unlock: { type: 'boss', value: 'market-maker', label: 'Defeat The Market Maker' },
    avatar: `<svg viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">${bg('#5ad1ff', 'liquidity-warden')}
      <path d="M64 20l30 12v22c0 22-13 38-30 46-17-8-30-24-30-46V32z" fill="#1d2a44" stroke="url(#a-liquidity-warden)" stroke-width="3"/>
      <line x1="46" y1="56" x2="82" y2="56" stroke="#5ad1ff" stroke-width="3"/>
      <line x1="46" y1="68" x2="74" y2="68" stroke="#e8eefc" stroke-width="3" opacity="0.7"/>
      <line x1="46" y1="80" x2="66" y2="80" stroke="#e8eefc" stroke-width="3" opacity="0.4"/>
      <circle cx="88" cy="68" r="4" fill="#5ad1ff"/>
    </svg>`,
  },
  {
    id: 'fractal-architect',
    name: 'The Fractal Architect',
    title: 'Builder of Aligned Timeframes',
    lore:
      'Daily into 4H, 4H into 1H, 1H into the M5 — the Architect will not lay a brick until every storey agrees. When all timeframes expand as one, they call it true expansion; anything else is scaffolding.',
    perk: {
      desc: '+20% XP whenever you finish a full lesson track or boss.',
      effect: { key: 'xpMult', value: 1.2 },
    },
    unlock: { type: 'level', value: 18, label: 'Reach Level 18' },
    avatar: `<svg viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">${bg('#9ef0c2', 'fractal-architect')}
      <rect x="26" y="30" width="22" height="68" rx="3" fill="none" stroke="#e8eefc" stroke-width="3"/>
      <rect x="56" y="42" width="16" height="44" rx="3" fill="none" stroke="url(#a-fractal-architect)" stroke-width="3"/>
      <rect x="80" y="52" width="12" height="26" rx="3" fill="#9ef0c2"/>
      <line x1="37" y1="18" x2="37" y2="30" stroke="#e8eefc" stroke-width="3"/>
      <line x1="37" y1="98" x2="37" y2="112" stroke="#e8eefc" stroke-width="3"/>
      <line x1="64" y1="32" x2="64" y2="42" stroke="#9ef0c2" stroke-width="3"/>
      <line x1="64" y1="86" x2="64" y2="96" stroke="#9ef0c2" stroke-width="3"/>
      <line x1="86" y1="44" x2="86" y2="52" stroke="#9ef0c2" stroke-width="2.5"/>
      <line x1="86" y1="78" x2="86" y2="86" stroke="#9ef0c2" stroke-width="2.5"/>
    </svg>`,
  },
  {
    id: 'discipline-monk',
    name: 'The Discipline Monk',
    title: 'Consistency Over Outcome',
    lore:
      'The Monk once turned a rule-breaking +2R winner into a framed reminder titled “Loss.” They grade themselves only on execution, quoting Douglas by candlelight: the edge is probability, and probability only pays the consistent.',
    perk: {
      desc: 'One rule-violation forgiveness per Replay session (score kept).',
      effect: { key: 'replayForgive', value: 1 },
    },
    unlock: { type: 'boss', value: 'revenge-trader', label: 'Defeat The Revenge Trader' },
    avatar: `<svg viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">${bg('#f5d76e', 'discipline-monk')}
      <circle cx="64" cy="46" r="16" fill="#e8eefc"/>
      <path d="M38 100c2-18 12-28 26-28s24 10 26 28z" fill="#1d2a44" stroke="url(#a-discipline-monk)" stroke-width="3"/>
      <path d="M50 72c4 6 24 6 28 0" fill="none" stroke="#f5d76e" stroke-width="3"/>
      <circle cx="64" cy="26" r="4" fill="none" stroke="#f5d76e" stroke-width="2.5"/>
      <line x1="46" y1="108" x2="82" y2="108" stroke="#f5d76e" stroke-width="3" stroke-linecap="round"/>
    </svg>`,
  },
];

const charactersData = { characters };
export default charactersData;
