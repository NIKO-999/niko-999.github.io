/**
 * scenarios.js — Chart scenario definitions for the procedural generator.
 * Scenario: {
 *   id, title,
 *   patternType: 'swingPoint'|'cisd'|'fvg'|'londonReversal'|'nyReversal'|
 *     'protectedSwing'|'largeOpposingRun'|'continuation'|'smt'|'ohlc'|
 *     'chopTrap'|'chase'|'counterTrend'|'profileExam',
 *   bias: 'bullish'|'bearish'|'either',
 *   difficulty: 1..3,
 *   setup: narrative text shown before the chart,
 *   gen: hints for the procedural chart generator {
 *     timeframe, sessions:boolean, bars, features:[...]  — feature tags the
 *     renderer/generator understands (e.g. 'sweepLow','fvg','cisdLevel',
 *     'asiaConsolidation','smtPanel','protectedLow','largeWick','swing3')
 *   },
 *   question: { kind:'mcq', prompt, options:[...], answer:index }
 *          | { kind:'chartClick', prompt, target:'<feature tag>', tolerance:'bars'|'zone' },
 *   rationale: explanation quoting the framework rule,
 *   xp
 * }
 */

export const scenarios = [
  {
    id: 'sc-swing-id',
    title: 'Anatomy of a Swing',
    patternType: 'swingPoint',
    bias: 'bullish',
    difficulty: 1,
    setup:
      'Price has been selling off into a daily discount array. Three candles print at the low: one drives down, the next takes out its low and stalls, the third turns up.',
    gen: { timeframe: '4H', sessions: false, bars: 18, features: ['swing3', 'sweepLow'] },
    question: {
      kind: 'chartClick',
      prompt: 'Click the C2 of the swing point — the candle that takes out the previous low.',
      target: 'swing-c2',
      tolerance: 'bars',
    },
    rationale:
      'V1: “A swing point consists of three candles. C1: first candle. C2: second candle, which takes out the previous candle’s high or low. C3: third candle, which reverses direction.”',
    xp: 40,
  },
  {
    id: 'sc-cisd-mark',
    title: 'Find the CISD',
    patternType: 'cisd',
    bias: 'bullish',
    difficulty: 2,
    setup:
      'A 4H swing point has formed at a PD array with SMT confirmed. On M15, a run of bearish close candles built the final leg down. Price has just snapped back up.',
    gen: { timeframe: 'M15', sessions: true, bars: 40, features: ['opposingCloses', 'cisdLevel', 'sweepLow'] },
    question: {
      kind: 'chartClick',
      prompt: 'Click the level whose closure above confirms the CISD.',
      target: 'cisd-level',
      tolerance: 'zone',
    },
    rationale:
      'V1: M15 CISD is a “closure below/above a series of opposing close candles” — the opening level of that bearish series is the line that must be closed through, instantly.',
    xp: 60,
  },
  {
    id: 'sc-fvg-click',
    title: 'Internal Range Liquidity',
    patternType: 'fvg',
    bias: 'bullish',
    difficulty: 1,
    setup:
      'An impulsive rally left an inefficiency behind. Price is now rotating back down into the range. In an IRL→ERL model, this pocket is your reversal point.',
    gen: { timeframe: '1H', sessions: false, bars: 26, features: ['fvg', 'retraceIntoFvg'] },
    question: {
      kind: 'chartClick',
      prompt: 'Mark the Fair Value Gap price is drawing back into.',
      target: 'fvg-zone',
      tolerance: 'zone',
    },
    rationale:
      'GxT: “In an IRL→ERL model, the market retraces into a FVG (IRL), acting as a reversal point to expand towards the swing high or low (ERL).”',
    xp: 40,
  },
  {
    id: 'sc-london-rev',
    title: 'The 2:00 Wick',
    patternType: 'londonReversal',
    bias: 'bullish',
    difficulty: 2,
    setup:
      'Asia spent the night consolidating in a tight band above a 4H key level. At 2:00 the market knifes below the Asian range into the level, then closes back inside.',
    gen: {
      timeframe: 'M15',
      sessions: true,
      bars: 64,
      features: ['asiaConsolidation', 'sweepLow', 'keyLevel', 'smtPanel'],
    },
    question: {
      kind: 'mcq',
      prompt: 'What is the highest-probability read of this sequence?',
      options: [
        'Breakdown — short the retest of the Asian low',
        'London reversal — the 2–5am low at the level is the day’s wick; trade the 4H expansion away from it',
        'Range day — fade both extremes',
        'Wait for 14:00 confirmation before any bias',
      ],
      answer: 1,
    },
    rationale:
      'GxT: “Between 2am - 5am, the daily candle forms a low at a relevant level and reverses. Once the level is engaged, the 4H expansion candle can be traded away from the low of day.” V2 adds the trigger: Asia consolidation/protraction → London prints the wick, NY expands.',
    xp: 70,
  },
  {
    id: 'sc-ny-rev-6',
    title: 'New York Takes the Wheel',
    patternType: 'nyReversal',
    bias: 'bullish',
    difficulty: 2,
    setup:
      'The overnight session protracted lower without reaching a key level. At 8:30 a news driver spikes price into a 1H swing low, sweeps it, and SMT diverges against the sister pair.',
    gen: {
      timeframe: 'M15',
      sessions: true,
      bars: 56,
      features: ['protraction', 'sweepLow', 'newsMarker0830', 'smtPanel'],
    },
    question: {
      kind: 'mcq',
      prompt: 'Classify the profile and the play.',
      options: [
        '6:00 NY reversal — LOD forms 8–10am; trade the 6am 4H expansion candle away from it',
        'London reversal — the low was in at 2am',
        'No-trade day — news invalidates everything',
        '10:00 reversal — wait two more hours regardless',
      ],
      answer: 0,
    },
    rationale:
      'GxT: “6am Reversal: Between 8am - 10am, reversal into expansion forms the LOD expanding towards the draw… pairing manipulation and entries with any present volatility drivers.” V2: “Driver times like 8:30 and 9:30 usually help confirm the move.”',
    xp: 70,
  },
  {
    id: 'sc-ny-rev-10',
    title: 'Last Chance Saloon',
    patternType: 'nyReversal',
    bias: 'bearish',
    difficulty: 3,
    setup:
      'The 6:00 candle failed to reverse. At 10:00, on the back of scheduled news, price extends one final push into a 4H key level and prints a small opposing wick. Daily logic supports downside.',
    gen: {
      timeframe: 'M15',
      sessions: true,
      bars: 60,
      features: ['failedSixAm', 'sweepHigh', 'keyLevel', 'smallWick', 'newsMarker1000'],
    },
    question: {
      kind: 'mcq',
      prompt: 'How does the model treat this 10:00 print?',
      options: [
        'Too late — reversals are only valid before 10:00',
        'The last point for a proper reversal; a small wick supported by daily logic makes it a strong entry',
        'Only valid if the 14:00 candle confirms first',
        'A continuation signal, never a reversal',
      ],
      answer: 1,
    },
    rationale:
      'V2: “10:00 Reversal (Late NY Reversal): If 6:00 failed to reverse or news at 10:00 is involved, this becomes the last point for a proper reversal. If small wick + supported by daily logic, it’s a strong entry point.”',
    xp: 90,
  },
  {
    id: 'sc-protected',
    title: 'Locked Doors',
    patternType: 'protectedSwing',
    bias: 'bullish',
    difficulty: 2,
    setup:
      'An uptrend has left three lows behind. One of them was carved by an opposing candle slamming into a 4H key level; the other two are ordinary pullbacks.',
    gen: { timeframe: '1H', sessions: false, bars: 34, features: ['protectedLow', 'ordinaryLows', 'keyLevel'] },
    question: {
      kind: 'chartClick',
      prompt: 'Click the protected swing — the low the market should not revisit.',
      target: 'protected-low',
      tolerance: 'bars',
    },
    rationale:
      'V2: “Protected Swing = OB/opposing candle into key level. Once formed, these aren’t revisited. We want to trade away from protected swings toward unprotected ones or failure swings.”',
    xp: 60,
  },
  {
    id: 'sc-large-run',
    title: 'The Overgrown Wick',
    patternType: 'largeOpposingRun',
    bias: 'bullish',
    difficulty: 3,
    setup:
      'Today’s candle opened, spent all of Asia and London driving down, and only found a key level mid-morning. The opposing run is enormous. You are now long from the level.',
    gen: { timeframe: 'M15', sessions: true, bars: 64, features: ['largeWick', 'keyLevel', 'dailyOpenLine'] },
    question: {
      kind: 'mcq',
      prompt: 'Where does the framework tell you to place your target?',
      options: [
        'A full expansion beyond the daily high',
        'Back to the opening price / within the daily range — price is unlikely to expand past the daily open',
        'Twice the wick length, measured from the low',
        'The next week’s open',
      ],
      answer: 1,
    },
    rationale:
      'GxT: “Since price created a large opposing run, it does not support an expansion candle. Therefore, adjust the targets back to the opening price or back within the daily range as price is unlikely to expand past the daily open.”',
    xp: 90,
  },
  {
    id: 'sc-continuation',
    title: 'Third Candle’s the Charm',
    patternType: 'continuation',
    bias: 'bullish',
    difficulty: 2,
    setup:
      'The reversal entry came and went without you. The swing point is complete, and its third candle has just opened with a small opposing dip that carved a fresh order block.',
    gen: { timeframe: 'M15', sessions: true, bars: 44, features: ['swing3', 'orderBlock', 'smallWick'] },
    question: {
      kind: 'mcq',
      prompt: 'What is the model-approved continuation play?',
      options: [
        'Skip it — missed means missed',
        'Enter the expansion off the OB created by the opposing move, with a small stop, expecting small wick → large body',
        'Enter at C1’s open with a full-range stop',
        'Fade C3 back into the swing',
      ],
      answer: 1,
    },
    rationale:
      'V1 continuation entries: “Continuation Candle: Always the 3rd candle of the swing point. Small wick → Large body expected. Opposing move creates an OB → Enter expansion with small stop. Wait for opposing run before entering.”',
    xp: 70,
  },
  {
    id: 'sc-smt-gate',
    title: 'The Missing Divergence',
    patternType: 'smt',
    bias: 'bearish',
    difficulty: 2,
    setup:
      'A 4H swing high forms at a premium array right in the 9:00 window. The checklist glows green — order flow, PD array, M15 CISD ready. The SMT panel shows both pairs making equal new highs.',
    gen: { timeframe: 'M15', sessions: true, bars: 48, features: ['sweepHigh', 'smtPanelNoDivergence', 'cisdLevel'] },
    question: {
      kind: 'mcq',
      prompt: 'Both correlated pairs printed the new high together. Your action?',
      options: [
        'Short anyway — four out of five conditions is plenty',
        'No trade — SMT divergence is compulsory; no SMT, no trade',
        'Short half size',
        'Wait for a bigger wick then short',
      ],
      answer: 1,
    },
    rationale:
      'V1: “SMT Divergence (Compulsory for This Model)… Mandatory before trading reversal candles. No SMT → No trade.” Both pairs confirming the high together is the absence of divergence.',
    xp: 70,
  },
  {
    id: 'sc-ohlc-open',
    title: 'Reading the Open',
    patternType: 'ohlc',
    bias: 'bullish',
    difficulty: 1,
    setup:
      'Your daily bias is bullish toward an old high. The new 4H candle opens and immediately dips, forming a small low at a discount array before turning back up.',
    gen: { timeframe: 'M15', sessions: false, bars: 30, features: ['openMarker', 'smallWick', 'olhc'] },
    question: {
      kind: 'mcq',
      prompt: 'Does this open support your bullish expansion?',
      options: [
        'No — any dip after the open is bearish',
        'Yes — OLHC: a bullish expansion candle opens and creates its low first, forming the wick before the body',
        'Only if the dip lasts more than an hour',
        'Irrelevant — opens carry no information',
      ],
      answer: 1,
    },
    rationale:
      'GxT: “A bullish expansion candle will open and create a low first, creating the wick of the higher time frame candle. Once the wick has formed, price will expand away creating the body.”',
    xp: 40,
  },
  {
    id: 'sc-chop-trap',
    title: 'Bait in the Balance',
    patternType: 'chopTrap',
    bias: 'either',
    difficulty: 2,
    setup:
      'M15 has coiled into a tight consolidation for two hours. A CISD-looking close finally pokes through the stack of opposing candles — but the entire leg it closes through is the consolidation itself.',
    gen: { timeframe: 'M15', sessions: true, bars: 50, features: ['consolidation', 'fakeCisd'] },
    question: {
      kind: 'mcq',
      prompt: 'Is this a valid CISD entry?',
      options: [
        'Yes — a close through opposing candles is always a CISD',
        'No — there was consolidation prior to the CISD, which invalidates the entry',
        'Yes, if volume expands',
        'Only after three confirming candles',
      ],
      answer: 1,
    },
    rationale:
      'V1 caution: “No consolidation prior to CISD.” A closure out of a coil is chop bait, not a change in state of delivery.',
    xp: 60,
  },
  {
    id: 'sc-chase-check',
    title: 'The Train Already Left',
    patternType: 'chase',
    bias: 'bullish',
    difficulty: 2,
    setup:
      'Your 1H draw was hit twenty minutes ago and price is still climbing without you. The HTF target sits far above. No key level has been re-engaged since the LTF objective filled.',
    gen: { timeframe: 'M15', sessions: true, bars: 46, features: ['targetHitMarker', 'extendedRun'] },
    question: {
      kind: 'mcq',
      prompt: 'What does the framework permit here?',
      options: [
        'Market in — the HTF target justifies any entry',
        'Nothing yet — after LTF targets are met, entries are invalid until price re-engages a key level. Do not chase',
        'Buy the next green candle',
        'Short the exhaustion',
      ],
      answer: 1,
    },
    rationale:
      'GxT: “After the lower timeframe targets are reached, entries are no longer valid until price reengages a key level for continuation. Do not chase price.”',
    xp: 60,
  },
  {
    id: 'sc-counter-trend',
    title: 'Against the Current',
    patternType: 'counterTrend',
    bias: 'bearish',
    difficulty: 3,
    setup:
      'Daily and 4H order flow are decisively bearish — lower lows, bearish arrays respected. On M15 a tidy little bullish swing forms mid-morning, and it is tempting.',
    gen: { timeframe: 'M15', sessions: true, bars: 44, features: ['bearOrderFlow', 'minorBullSwing'] },
    question: {
      kind: 'mcq',
      prompt: 'The M15 bullish swing against 4H/daily bearish order flow is:',
      options: [
        'A scalp long opportunity',
        'Forbidden — no counter-trend trades; order flow must align',
        'Valid with a tight stop',
        'Valid only before 11:00',
      ],
      answer: 1,
    },
    rationale:
      'V1 entry conditions require “Order Flow must align” and the cautions state “No counter-trend trades.” The model takes reversals with the higher-timeframe flow, never against it.',
    xp: 90,
  },
  {
    id: 'sc-hod-4h',
    title: 'Which Candle Prints the Low?',
    patternType: 'profileExam',
    bias: 'bullish',
    difficulty: 3,
    setup:
      'The previous 4H candle closed as an expansion into a 4H key level. Asia is drifting sideways. Your bias for the day is bullish toward external range liquidity above.',
    gen: { timeframe: '4H', sessions: true, bars: 12, features: ['prev4hExpansionIntoLevel', 'sixCandleDay'] },
    question: {
      kind: 'mcq',
      prompt: 'Which 4H candle does the model expect to form the low of day?',
      options: [
        'The 18:00 candle',
        'The 2:00 candle — a reversal-into-expansion off the previous candle’s low, creating the LOD',
        'The 14:00 candle',
        'None — bullish days have no LOD',
      ],
      answer: 1,
    },
    rationale:
      'GxT 4H profiling: “When previous 4H candle hits a 4H key level and closes as an expansion candle, seek the 2:00am 4H reversal into expansion candle. This candle reverses off the previous candle’s high or low, forming a wick and expanding away, creating the low or high of day.”',
    xp: 90,
  },
  {
    id: 'sc-mm-final',
    title: 'Name the Architect’s Profile',
    patternType: 'profileExam',
    bias: 'bullish',
    difficulty: 3,
    setup:
      'Asia consolidated. At 2:40am price swept the Asian range low into a 1H swing at a key level while SMT diverged, and by 6:00 the recovery is underway. Session highs from Asia remain untouched overhead.',
    gen: {
      timeframe: 'M15',
      sessions: true,
      bars: 70,
      features: ['asiaConsolidation', 'sweepLow', 'smtPanel', 'unsweptHighs'],
    },
    question: {
      kind: 'mcq',
      prompt: 'Name the full profile and the day’s draw.',
      options: [
        'NY reversal; draw is the daily open',
        'Ideal London reversal — Asian-range manipulation paired with SMT creates a protected low; the unswept session highs are the target',
        'Chop day; no draw',
        'Overnight reversal; draw is the Asian low',
      ],
      answer: 1,
    },
    rationale:
      'GxT: “Ideal London reversal profile occurs when Asia session consolidates or retraces. The wick forms from manipulation of the Asian range, creating a protected swing… Pair this manipulation with SMT.” And on targets: with “no protected high to trade away from,” the session highs left behind become the draw.',
    xp: 120,
  },
];

const scenariosData = { scenarios };
export default scenariosData;
