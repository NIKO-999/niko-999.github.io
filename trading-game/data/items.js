/**
 * items.js — Collectible inventory items.
 * Item: { id, name, rarity:'common'|'rare'|'epic'|'legendary',
 *   flavor, earned, perk:{type:'hintToken'|'streakShield'|'xpBoost'|'cosmetic', value, desc},
 *   icon: inline SVG string (64×64 viewBox, consistent duotone style) }
 */

const chip = (accent, id) => `
  <defs>
    <linearGradient id="ig-${id}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#131c2e"/><stop offset="1" stop-color="#0a0f1a"/>
    </linearGradient>
    <linearGradient id="ia-${id}" x1="0" y1="1" x2="1" y2="0">
      <stop offset="0" stop-color="${accent}"/><stop offset="1" stop-color="#ffffff" stop-opacity="0.85"/>
    </linearGradient>
  </defs>
  <rect x="1.5" y="1.5" width="61" height="61" rx="14" fill="url(#ig-${id})" stroke="${accent}" stroke-opacity="0.5" stroke-width="1.5"/>`;

export const rarities = {
  common: { label: 'Common', color: '#8fa0bf' },
  rare: { label: 'Rare', color: '#5ad1ff' },
  epic: { label: 'Epic', color: '#c497ff' },
  legendary: { label: 'Legendary', color: '#ffd166' },
};

export const items = [
  {
    id: 'smt-lens',
    name: 'SMT Lens',
    rarity: 'epic',
    flavor:
      'A cracked monocle ground from two correlated charts. Through it, every false reversal shows its missing divergence. No SMT, no trade — the lens simply refuses to focus.',
    earned: 'Answer 15 SMT-category questions correctly.',
    perk: { type: 'hintToken', value: 2, desc: 'Grants 2 hint tokens each day.' },
    icon: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">${chip('#c497ff', 'smtlens')}
      <circle cx="28" cy="28" r="13" fill="none" stroke="url(#ia-smtlens)" stroke-width="3"/>
      <line x1="38" y1="38" x2="50" y2="50" stroke="#c497ff" stroke-width="4" stroke-linecap="round"/>
      <path d="M21 30l6-6 4 4 6-8" fill="none" stroke="#e8eefc" stroke-width="2.2" stroke-linecap="round"/>
    </svg>`,
  },
  {
    id: 'cisd-trigger',
    name: 'CISD Trigger',
    rarity: 'rare',
    flavor:
      'A firing pin machined from a series of opposing close candles. It clicks only on an instant closure through the stack — hesitate, and the mechanism seizes.',
    earned: 'Complete the V1 track with every check quiz passed.',
    perk: { type: 'xpBoost', value: 0.1, desc: '+10% XP on entry-model questions.' },
    icon: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">${chip('#5ad1ff', 'cisd')}
      <rect x="14" y="14" width="7" height="16" rx="1.5" fill="#3a4a6b"/>
      <rect x="24" y="18" width="7" height="16" rx="1.5" fill="#3a4a6b"/>
      <rect x="34" y="22" width="7" height="16" rx="1.5" fill="#3a4a6b"/>
      <line x1="10" y1="44" x2="54" y2="44" stroke="url(#ia-cisd)" stroke-width="3" stroke-linecap="round"/>
      <path d="M44 40V20l8 8" fill="none" stroke="#5ad1ff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`,
  },
  {
    id: 'golden-wick',
    name: 'Golden Wick',
    rarity: 'legendary',
    flavor:
      'The perfect manipulation, preserved in amber-gold: a wick so small the candle spent its whole life distributing. Traders swear it hums at 2:00am.',
    earned: 'Defeat every boss without losing a single round.',
    perk: { type: 'xpBoost', value: 0.25, desc: '+25% XP from all sources.' },
    icon: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">${chip('#ffd166', 'gwick')}
      <line x1="32" y1="8" x2="32" y2="16" stroke="#ffd166" stroke-width="3" stroke-linecap="round"/>
      <rect x="23" y="16" width="18" height="34" rx="3" fill="url(#ia-gwick)"/>
      <line x1="32" y1="50" x2="32" y2="56" stroke="#ffd166" stroke-width="3" stroke-linecap="round"/>
      <path d="M14 22q-4 6 0 12M50 22q4 6 0 12" stroke="#ffd166" stroke-width="2" fill="none" opacity="0.6"/>
    </svg>`,
  },
  {
    id: 'journal-of-discipline',
    name: 'Journal of Discipline',
    rarity: 'epic',
    flavor:
      'Every page holds one trade, one checklist, zero excuses. The margins are full of a single repeated line: consistency over outcome.',
    earned: 'Defeat the FOMO Demon.',
    perk: { type: 'streakShield', value: 1, desc: 'One daily-streak repair per week.' },
    icon: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">${chip('#66e0a3', 'journal')}
      <rect x="16" y="12" width="32" height="40" rx="4" fill="#16233c" stroke="url(#ia-journal)" stroke-width="2.5"/>
      <line x1="24" y1="24" x2="42" y2="24" stroke="#66e0a3" stroke-width="2.5" stroke-linecap="round"/>
      <line x1="24" y1="32" x2="40" y2="32" stroke="#e8eefc" stroke-width="2.5" stroke-linecap="round" opacity="0.7"/>
      <line x1="24" y1="40" x2="36" y2="40" stroke="#e8eefc" stroke-width="2.5" stroke-linecap="round" opacity="0.4"/>
    </svg>`,
  },
  {
    id: 'streak-shield',
    name: 'Streak Shield',
    rarity: 'rare',
    flavor:
      'Forged from a protected swing — an opposing candle hammered into a key level. Like its namesake, once formed it is not revisited.',
    earned: 'Defeat the Revenge Trader, or hold a 7-day daily streak.',
    perk: { type: 'streakShield', value: 1, desc: 'Absorbs one wrong answer per Gauntlet run.' },
    icon: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">${chip('#5ad1ff', 'shield')}
      <path d="M32 10l16 6v12c0 12-7 20-16 24-9-4-16-12-16-24V16z" fill="#12263c" stroke="url(#ia-shield)" stroke-width="2.5"/>
      <path d="M25 31l5 5 10-11" fill="none" stroke="#5ad1ff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`,
  },
  {
    id: 'compass-of-bias',
    name: 'Compass of Bias',
    rarity: 'common',
    flavor:
      'Its needle ignores north and points only at the Draw on Liquidity. Ask it where price is going; ask the etched ring from where.',
    earned: 'Defeat The Chop Zone, or finish the V1 bias lessons.',
    perk: { type: 'hintToken', value: 1, desc: 'One free hint token per day.' },
    icon: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">${chip('#39d5c8', 'compass')}
      <circle cx="32" cy="32" r="18" fill="none" stroke="url(#ia-compass)" stroke-width="2.5"/>
      <path d="M40 24 35 35l-11 5 5-11z" fill="#39d5c8"/>
      <circle cx="32" cy="32" r="2.5" fill="#e8eefc"/>
    </svg>`,
  },
  {
    id: 'asia-range-map',
    name: 'Asian Range Map',
    rarity: 'common',
    flavor:
      'A narrow band of quiet candles, charted and laminated. Where it ends, London begins — and somebody’s stops become the day’s wick.',
    earned: 'Answer 10 London-reversal questions correctly.',
    perk: { type: 'xpBoost', value: 0.05, desc: '+5% XP on session-profile questions.' },
    icon: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">${chip('#7aa2ff', 'asiamap')}
      <rect x="12" y="26" width="28" height="12" rx="2" fill="#1a2740" stroke="#7aa2ff" stroke-width="2"/>
      <path d="M40 32h8m0 0-8 14m8-14-8-14" stroke="url(#ia-asiamap)" stroke-width="2.5" fill="none" stroke-linecap="round"/>
      <line x1="16" y1="30" x2="32" y2="30" stroke="#7aa2ff" stroke-width="1.6" opacity="0.6"/>
      <line x1="16" y1="34" x2="28" y2="34" stroke="#7aa2ff" stroke-width="1.6" opacity="0.4"/>
    </svg>`,
  },
  {
    id: 'driver-clock',
    name: 'Volatility Driver Clock',
    rarity: 'rare',
    flavor:
      'Two alarms only: 8:30 and 9:30. When it rings, manipulation gets paired with fuel — and the reversal you profiled either confirms or dies.',
    earned: 'Score 100% on a timed Gauntlet of time-window questions.',
    perk: { type: 'xpBoost', value: 0.1, desc: '+10% XP on time-window questions.' },
    icon: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">${chip('#ff9f6e', 'clock')}
      <circle cx="32" cy="34" r="16" fill="#241621" stroke="url(#ia-clock)" stroke-width="2.5"/>
      <line x1="32" y1="34" x2="32" y2="23" stroke="#ff9f6e" stroke-width="3" stroke-linecap="round"/>
      <line x1="32" y1="34" x2="40" y2="38" stroke="#e8eefc" stroke-width="3" stroke-linecap="round"/>
      <path d="M18 14l-6 6M46 14l6 6" stroke="#ff9f6e" stroke-width="3" stroke-linecap="round"/>
    </svg>`,
  },
  {
    id: 'protected-swing-sigil',
    name: 'Protected Swing Sigil',
    rarity: 'epic',
    flavor:
      'A wax seal pressed by an order block into a key level. Levels stamped with it are never revisited — trade away from it, never back into it.',
    earned: 'Correctly identify 10 protected swings in chart scenarios.',
    perk: { type: 'streakShield', value: 1, desc: 'Protects your scenario streak once per day.' },
    icon: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">${chip('#c497ff', 'sigil')}
      <circle cx="32" cy="32" r="15" fill="#1d1631" stroke="url(#ia-sigil)" stroke-width="2.5"/>
      <path d="M32 22l3.2 6.6 7.3 1-5.3 5.1 1.3 7.2L32 38.5l-6.5 3.4 1.3-7.2-5.3-5.1 7.3-1z" fill="#c497ff"/>
      <line x1="12" y1="50" x2="52" y2="50" stroke="#c497ff" stroke-width="2.5" stroke-dasharray="4 3"/>
    </svg>`,
  },
  {
    id: 'fvg-prism',
    name: 'FVG Prism',
    rarity: 'rare',
    flavor:
      'A glass wedge with a gap ground through its center. Hold it to the light and internal range liquidity glows — the reversal point of every IRL→ERL leg.',
    earned: 'Mark 10 fair value gaps correctly in chart-click scenarios.',
    perk: { type: 'hintToken', value: 1, desc: 'One extra hint in chart-click challenges.' },
    icon: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">${chip('#9ef0c2', 'fvg')}
      <rect x="18" y="10" width="9" height="18" rx="2" fill="#3a4a6b"/>
      <rect x="28" y="26" width="9" height="12" rx="2" fill="url(#ia-fvg)"/>
      <rect x="38" y="38" width="9" height="18" rx="2" fill="#3a4a6b"/>
      <rect x="14" y="28" width="36" height="8" fill="#9ef0c2" opacity="0.22"/>
      <line x1="14" y1="28" x2="50" y2="28" stroke="#9ef0c2" stroke-width="1.6"/>
      <line x1="14" y1="36" x2="50" y2="36" stroke="#9ef0c2" stroke-width="1.6"/>
    </svg>`,
  },
  {
    id: 'order-block-anvil',
    name: 'Order Block Anvil',
    rarity: 'common',
    flavor:
      'The opposing move forges it; the expansion is hammered upon it. Enter off the anvil with a small stop, or do not enter at all.',
    earned: 'Take 5 valid continuation entries in the Replay Trainer.',
    perk: { type: 'xpBoost', value: 0.05, desc: '+5% XP on continuation-entry questions.' },
    icon: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">${chip('#8fa0bf', 'anvil')}
      <path d="M14 24h36v6c-8 2-12 6-13 10h6v6H22v-6h6c-1-5-6-9-14-10z" fill="url(#ia-anvil)"/>
      <rect x="18" y="46" width="28" height="6" rx="2" fill="#3a4a6b"/>
    </svg>`,
  },
  {
    id: 'liquidity-vial',
    name: 'Vial of Resting Liquidity',
    rarity: 'common',
    flavor:
      'Bottled failure swings, still fizzing. Uncork it above old highs and watch price come to drink.',
    earned: 'Answer 10 liquidity-category questions correctly.',
    perk: { type: 'cosmetic', value: 1, desc: 'Cosmetic: liquid shimmer on your HUD streak flame.' },
    icon: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">${chip('#5ad1ff', 'vial')}
      <path d="M27 12h10v10l7 20a9 9 0 0 1-8.7 12H28.7A9 9 0 0 1 20 42l7-20z" fill="#12263c" stroke="url(#ia-vial)" stroke-width="2.5"/>
      <path d="M23 40h18l3 8a6 6 0 0 1-5.8 6H25.8A6 6 0 0 1 20 48z" fill="#5ad1ff" opacity="0.55"/>
      <circle cx="30" cy="44" r="1.8" fill="#e8eefc"/><circle cx="36" cy="48" r="1.4" fill="#e8eefc"/>
    </svg>`,
  },
  {
    id: 'expansion-sail',
    name: 'Expansion Sail',
    rarity: 'rare',
    flavor:
      'Cut from the body of a candle that never looked back. It only catches wind when every timeframe blows the same direction — true expansion or nothing.',
    earned: 'Complete the GxT alignment lessons with perfect quizzes.',
    perk: { type: 'xpBoost', value: 0.1, desc: '+10% XP on alignment questions.' },
    icon: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">${chip('#39d5c8', 'sail')}
      <line x1="32" y1="10" x2="32" y2="52" stroke="#e8eefc" stroke-width="3" stroke-linecap="round"/>
      <path d="M32 12c12 8 14 22 2 32H32z" fill="url(#ia-sail)"/>
      <path d="M30 18c-9 6-11 18-3 26h3z" fill="#12403d"/>
      <path d="M18 54h28" stroke="#39d5c8" stroke-width="3" stroke-linecap="round"/>
    </svg>`,
  },
  {
    id: 'ohlc-die',
    name: 'Die of Delivery',
    rarity: 'common',
    flavor:
      'Four faces, one order: O, then L or H, then the rest. Roll it at the open — if the wrong face lands first, the expansion was never yours.',
    earned: 'Answer 10 OHLC/OLHC questions correctly.',
    perk: { type: 'cosmetic', value: 1, desc: 'Cosmetic: OLHC glyph border on your avatar.' },
    icon: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">${chip('#f5d76e', 'die')}
      <rect x="16" y="16" width="32" height="32" rx="7" fill="#241f12" stroke="url(#ia-die)" stroke-width="2.5"/>
      <text x="32" y="39" font-family="system-ui" font-size="15" font-weight="700" fill="#f5d76e" text-anchor="middle">OL</text>
      <circle cx="22" cy="22" r="2" fill="#f5d76e"/><circle cx="42" cy="42" r="2" fill="#f5d76e"/>
    </svg>`,
  },
  {
    id: 'crown-of-liquidity',
    name: 'Crown of Liquidity',
    rarity: 'legendary',
    flavor:
      'Worn by the Architect of the Wick until you took it. Its points are unswept highs; its jewels, protected lows. Wear it and the whole range is your order book.',
    earned: 'Defeat The Market Maker.',
    perk: { type: 'xpBoost', value: 0.2, desc: '+20% XP and +20% coins from bosses.' },
    icon: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">${chip('#ffd166', 'crown')}
      <path d="M14 42 12 22l12 9 8-15 8 15 12-9-2 20z" fill="url(#ia-crown)"/>
      <rect x="14" y="42" width="36" height="7" rx="2" fill="#3a2f12" stroke="#ffd166" stroke-width="1.8"/>
      <circle cx="22" cy="45.5" r="1.8" fill="#ffd166"/><circle cx="32" cy="45.5" r="1.8" fill="#ffd166"/><circle cx="42" cy="45.5" r="1.8" fill="#ffd166"/>
    </svg>`,
  },
  {
    id: 'fractal-key',
    name: 'Fractal Key',
    rarity: 'epic',
    flavor:
      'Its teeth are a 30-minute model; its bow, a 4-hour candle. It only turns when the small lock and the large lock align — and then every door on the timeframe stack opens at once.',
    earned: 'Complete the GxT track.',
    perk: { type: 'hintToken', value: 1, desc: 'Reveals the HTF context once per scenario.' },
    icon: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">${chip('#9ef0c2', 'fkey')}
      <circle cx="24" cy="24" r="10" fill="none" stroke="url(#ia-fkey)" stroke-width="3"/>
      <circle cx="24" cy="24" r="4" fill="none" stroke="#9ef0c2" stroke-width="2"/>
      <line x1="31" y1="31" x2="48" y2="48" stroke="#9ef0c2" stroke-width="3.5" stroke-linecap="round"/>
      <path d="M42 42l5-5M46 50l5-5" stroke="#9ef0c2" stroke-width="3" stroke-linecap="round"/>
    </svg>`,
  },
  {
    id: 'dol-lodestone',
    name: 'DOL Lodestone',
    rarity: 'rare',
    flavor:
      'A magnet that ignores iron and pulls only toward external range liquidity. Price feels it too — every close through the previous candle drags the day one step closer.',
    earned: 'Hit the correct draw in 10 bias scenarios.',
    perk: { type: 'xpBoost', value: 0.1, desc: '+10% XP on bias and target questions.' },
    icon: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">${chip('#7aa2ff', 'lode')}
      <path d="M20 14v18a12 12 0 0 0 24 0V14h-9v18a3 3 0 0 1-6 0V14z" fill="url(#ia-lode)"/>
      <rect x="20" y="14" width="9" height="7" fill="#e8eefc"/>
      <rect x="35" y="14" width="9" height="7" fill="#e8eefc"/>
      <path d="M32 50v6m-8-8-4 5m20-5 4 5" stroke="#7aa2ff" stroke-width="2.5" stroke-linecap="round"/>
    </svg>`,
  },
];

const itemsData = { items, rarities };
export default itemsData;
