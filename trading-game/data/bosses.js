/**
 * bosses.js — Boss battle definitions.
 * Boss: { id, name, epithet, lore, unlockLevel, hp, playerHp,
 *   portrait: inline SVG string,
 *   intro: string shown on the intro screen,
 *   rounds: ordered mix of
 *     { type:'quiz', ref:'<quizbank id>' }                — pull from quizbank.js
 *     { type:'question', q, options:[4], answer, explain } — inline hard question
 *     { type:'scenario', ref:'<scenario id>', prompt }     — chart scenario challenge
 *   damage: { hit, crit }  — damage dealt to boss per correct (crit = fast/perfect answer)
 *   selfDamage             — damage the player takes per mistake
 *   rewards: { xp, itemId?, characterId? }
 *   victory / defeat: flavor lines
 * }
 */

const frame = (accent, id) => `
  <defs>
    <radialGradient id="bg-${id}" cx="0.5" cy="0.35" r="0.9">
      <stop offset="0" stop-color="#182238"/><stop offset="1" stop-color="#070b13"/>
    </radialGradient>
    <linearGradient id="ac-${id}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${accent}"/><stop offset="1" stop-color="#ffffff" stop-opacity="0.7"/>
    </linearGradient>
  </defs>
  <rect x="2" y="2" width="124" height="124" rx="20" fill="url(#bg-${id})" stroke="${accent}" stroke-opacity="0.5" stroke-width="2"/>`;

export const bosses = [
  {
    id: 'chop-zone',
    name: 'The Chop Zone',
    epithet: 'Devourer of Undisciplined Entries',
    unlockLevel: 3,
    hp: 60,
    playerHp: 3,
    damage: { hit: 12, crit: 16 },
    selfDamage: 1,
    lore:
      'A formless sideways horror that lives where Asia consolidates and dailies go unclear. It feeds on traders who force entries during consolidation — the one condition every model in this curriculum tells you to refuse.',
    intro:
      'The candles flatten. The range tightens. Somewhere in the chop, your patience is being hunted. Answer cleanly — hesitation and forced trades feed it.',
    portrait: `<svg viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">${frame('#8fa0bf', 'chop')}
      <path d="M20 64q8-10 16 0t16 0 16 0 16 0 16 0" fill="none" stroke="#8fa0bf" stroke-width="4" stroke-linecap="round"/>
      <path d="M20 78q8-8 16 0t16 0 16 0 16 0 16 0" fill="none" stroke="#55627d" stroke-width="4" stroke-linecap="round"/>
      <path d="M20 50q8-8 16 0t16 0 16 0 16 0 16 0" fill="none" stroke="#55627d" stroke-width="4" stroke-linecap="round"/>
      <circle cx="49" cy="40" r="5" fill="url(#ac-chop)"/>
      <circle cx="79" cy="40" r="5" fill="url(#ac-chop)"/>
      <path d="M52 96q12 8 24 0" fill="none" stroke="url(#ac-chop)" stroke-width="4" stroke-linecap="round"/>
    </svg>`,
    rounds: [
      { type: 'quiz', ref: 'q-n-05' },
      { type: 'quiz', ref: 'q-n-14' },
      {
        type: 'question',
        q: 'The daily chart is unclear and the market is consolidating. The model says:',
        options: [
          'Use 4H analysis — it always works',
          'No clean read — 4H analysis is the fallback except during consolidation',
          'Trade the range edges',
          'Double down on the last bias',
        ],
        answer: 1,
        explain:
          'V1: “When the daily chart is unclear, use 4H chart analysis (except during consolidation).” Consolidation offers no read at all.',
      },
      {
        type: 'question',
        q: 'Price consolidates on M15 right before your CISD forms. The entry is:',
        options: ['Stronger — energy is building', 'Invalid — no consolidation prior to CISD', 'Valid at half size', 'Valid if SMT exists'],
        answer: 1,
        explain: 'V1 caution: “No consolidation prior to CISD.” The Chop Zone wins when you ignore this.',
      },
      { type: 'scenario', ref: 'sc-chop-trap', prompt: 'Survive its lair: is this a valid setup?' },
    ],
    rewards: { xp: 300, itemId: 'compass-of-bias', characterId: 'wick-whisperer' },
    victory:
      'The range snaps. A clean expansion candle cuts the chop in half — you waited, and the market paid you for it.',
    defeat:
      'The chop swallows another forced entry. Consolidation is not a setup. Regroup and return.',
  },
  {
    id: 'fomo-demon',
    name: 'FOMO Demon',
    epithet: 'Whisperer of Missed Moves',
    unlockLevel: 6,
    hp: 80,
    playerHp: 3,
    damage: { hit: 12, crit: 16 },
    selfDamage: 1,
    lore:
      'Born from a thousand green candles watched from the sidelines, the Demon murmurs one word: chase. It knows the model forbids entries after lower-timeframe targets are met — and it knows exactly how much you want to break that rule.',
    intro:
      'The move already left. The Demon grins and offers you the top. Prove you know when entries are valid — and when the only trade is no trade.',
    portrait: `<svg viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">${frame('#ff6b6b', 'fomo')}
      <path d="M40 34l-8-16 16 8zM88 34l8-16-16 8z" fill="url(#ac-fomo)"/>
      <circle cx="64" cy="66" r="30" fill="#241019" stroke="#ff6b6b" stroke-width="3"/>
      <path d="M50 62l10 6-10 6zM78 62l-10 6 10 6z" fill="#ff6b6b"/>
      <path d="M50 84q14 10 28 0" fill="none" stroke="#ff6b6b" stroke-width="3.5" stroke-linecap="round"/>
      <path d="M24 96l12-30M104 96 92 66" stroke="#ff6b6b" stroke-width="3" stroke-linecap="round" opacity="0.5"/>
    </svg>`,
    rounds: [
      { type: 'quiz', ref: 'q-m-01' },
      { type: 'quiz', ref: 'q-t-22' },
      {
        type: 'question',
        q: 'Price rips away before your entry fills. The Demon says “market in.” The model says:',
        options: [
          'Chase — momentum confirms',
          'Do not chase; wait until price re-engages a key level for continuation',
          'Enter at the next round number',
          'Flip your bias',
        ],
        answer: 1,
        explain:
          'GxT: “Aim to trade away from the lower timeframe key levels before the lower timeframe targets are met… Do not chase price.”',
      },
      { type: 'quiz', ref: 'q-m-15' },
      {
        type: 'question',
        q: 'A setup appears at 11:04 AM, structurally perfect. You:',
        options: [
          'Take it fast before it leaves',
          'Take half size as a compromise',
          'Stand down — no trades post 11:00 AM',
          'Set an alert for 11:30',
        ],
        answer: 2,
        explain: 'V1: “No trades post 11:00 AM.” FOMO respects no clocks; the model does.',
      },
      { type: 'scenario', ref: 'sc-chase-check', prompt: 'Its final temptation: valid entry or chase?' },
    ],
    rewards: { xp: 450, itemId: 'journal-of-discipline' },
    victory:
      'The whisper dies mid-sentence. You let the runner go — and the next key-level re-engagement paid you in full.',
    defeat:
      'You chased. The Demon fed. Every missed move funds the next disciplined entry — if you let it go.',
  },
  {
    id: 'revenge-trader',
    name: 'The Revenge Trader',
    epithet: 'Ghost of the Blown Account',
    unlockLevel: 9,
    hp: 90,
    playerHp: 3,
    damage: { hit: 14, crit: 18 },
    selfDamage: 1,
    lore:
      'Once a promising student of the model, now a spectre doubling size after every loss. It remembers the rules — SMT compulsory, no counter-trend, entries post 8:00 — it simply refuses them the moment a stop is hit.',
    intro:
      'A red trade flickers behind its eyes. It offers you the same poison: win it back, right now, rules later. Answer with the framework — every rule you quote correctly cuts it deeper.',
    portrait: `<svg viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">${frame('#c76bff', 'revenge')}
      <path d="M64 24c18 0 30 14 30 34v30l-10-8-10 10-10-10-10 10-10-10-10 8V58c0-20 12-34 30-34z" fill="#1d1226" stroke="#c76bff" stroke-width="3"/>
      <path d="M48 56l12 8-12 4zM80 56l-12 8 12 4z" fill="url(#ac-revenge)"/>
      <path d="M40 20l10 12M88 20 78 32" stroke="#c76bff" stroke-width="3.5" stroke-linecap="round"/>
      <path d="M56 88h16" stroke="#c76bff" stroke-width="4" stroke-linecap="round"/>
    </svg>`,
    rounds: [
      { type: 'quiz', ref: 'q-n-07' },
      {
        type: 'question',
        q: 'Your reversal entry just stopped out. The model’s prescribed next move is:',
        options: [
          'Re-enter immediately at a worse price',
          'Look for a continuation entry meeting all previous criteria — C3 of the swing',
          'Double size on the same level',
          'Trade the opposite direction out of spite',
        ],
        answer: 1,
        explain:
          'V1: “If reversal entry fails: look for continuation entries meeting all previous criteria. Continuation Candle: Always the 3rd candle of the swing point.”',
      },
      { type: 'quiz', ref: 'q-t-07' },
      {
        type: 'question',
        q: 'The Revenge Trader shorts into a bullish swing “because it owes him.” The model calls this:',
        options: [
          'A hedge',
          'A counter-trend trade — forbidden',
          'Scaling in',
          'Delta-neutral positioning',
        ],
        answer: 1,
        explain: 'V1 caution: “No counter-trend trades.” Emotion is not a PD array.',
      },
      { type: 'quiz', ref: 'q-m-22' },
      { type: 'scenario', ref: 'sc-counter-trend', prompt: 'Break its cycle: bias check under pressure.' },
    ],
    rewards: { xp: 600, itemId: 'streak-shield', characterId: 'discipline-monk' },
    victory:
      'The spectre unclenches. Somewhere a journal closes gently: the loss was logged, the process held, the account survived.',
    defeat:
      'One loss became three. The ghost grows stronger on tilt — walk away, breathe, and come back to the checklist.',
  },
  {
    id: 'market-maker',
    name: 'The Market Maker',
    epithet: 'Architect of the Wick',
    unlockLevel: 12,
    hp: 120,
    playerHp: 3,
    damage: { hit: 14, crit: 18 },
    selfDamage: 1,
    lore:
      'The final examiner. It builds the manipulation you are taught to trade away from — running Asia’s range at 2am, sweeping the 1H swing at 8:30, leaving protected lows in its wake. Beat it by reading its own playbook back to it.',
    intro:
      'It shows you a wick and asks what it means. It shows you a time and asks what forms. Every profile, every window, every swing — recite the model and take its crown.',
    portrait: `<svg viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">${frame('#39d5c8', 'mm')}
      <path d="M64 22l6 12 12 2-9 9 2 13-11-6-11 6 2-13-9-9 12-2z" fill="url(#ac-mm)"/>
      <rect x="40" y="62" width="14" height="34" rx="3" fill="#123a38" stroke="#39d5c8" stroke-width="2.5"/>
      <line x1="47" y1="48" x2="47" y2="62" stroke="#39d5c8" stroke-width="3"/>
      <line x1="47" y1="96" x2="47" y2="110" stroke="#39d5c8" stroke-width="3"/>
      <rect x="74" y="54" width="14" height="30" rx="3" fill="url(#ac-mm)"/>
      <line x1="81" y1="42" x2="81" y2="54" stroke="#e8eefc" stroke-width="3"/>
      <line x1="81" y1="84" x2="81" y2="104" stroke="#e8eefc" stroke-width="3"/>
      <line x1="30" y1="110" x2="98" y2="110" stroke="#39d5c8" stroke-width="2.5" stroke-dasharray="4 4"/>
    </svg>`,
    rounds: [
      { type: 'quiz', ref: 'q-m-07' },
      { type: 'quiz', ref: 'q-m-04' },
      {
        type: 'question',
        q: 'The Maker printed a 2am low at a 4H key level after Asia consolidated. The day’s script now reads:',
        options: [
          'NY prints a new low at 10am',
          'London reversal — trade the 4H expansion away from the LOD; 6am continues 8–10am',
          'Range day, no trades',
          'Reversal invalid without a 14:00 sweep',
        ],
        answer: 1,
        explain:
          'GxT: London Reversal forms the low 2–5am at a relevant level; “2am London reversal → 6am New York Continuation… between 8am - 10am, continuation away from the LOD.”',
      },
      { type: 'quiz', ref: 'q-m-09' },
      {
        type: 'question',
        q: 'It leaves a large opposing wick on the daily. Its next trap is set for traders who target:',
        options: [
          'The daily open',
          'Expansion beyond the daily open — which the wick no longer supports',
          'The Asian midpoint',
          'The 50% of the wick',
        ],
        answer: 1,
        explain:
          'GxT: after a large opposing run, “adjust the targets back to the opening price or back within the daily range as price is unlikely to expand past the daily open.”',
      },
      { type: 'quiz', ref: 'q-m-03' },
      { type: 'scenario', ref: 'sc-mm-final', prompt: 'The final exam: name the profile it just built.' },
    ],
    rewards: { xp: 1000, itemId: 'crown-of-liquidity', characterId: 'liquidity-warden' },
    victory:
      'The Architect bows. You saw the wick for what it was — manipulation, then distribution — and traded the expansion like you built it yourself.',
    defeat:
      'Its wick swallowed your stop and its body left without you. Study the profiles; the exam repeats until passed.',
  },
];

const bossesData = { bosses };
export default bossesData;
