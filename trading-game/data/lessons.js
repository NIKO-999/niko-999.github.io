/**
 * lessons.js — Academy curriculum data.
 * Three tracks: V1 Trading Model, V2 4H Profiling, GxT Model.
 * Content blocks: {type:'text', html} | {type:'image', src, caption} |
 * {type:'callout', title, html} | {type:'rule', html} | {type:'keypoints', points:[...]}
 * Each lesson ends with a 3–5 question check quiz:
 * {q, options:[4], answer:index, explain}
 */

export const tracks = [
  {
    id: 'v1',
    title: 'V1 — The Trading Model',
    subtitle: 'Daily bias, swing points, SMT and the 4H→M15 engine',
    accent: '#39d5c8',
    description:
      'The foundation. Build a daily narrative, read swing points, and execute the bread-and-butter 4H to M15 entry with SMT as your non-negotiable filter.',
  },
  {
    id: 'v2',
    title: 'V2 — Profiling 4H Candles',
    subtitle: 'Wick = reversal, body = expansion. Time the day.',
    accent: '#7aa2ff',
    description:
      'A day is six 4H candles. Learn to locate the reversal wick — overnight, London or New York — and trade the expansion that follows it.',
  },
  {
    id: 'gxt',
    title: 'GxT Model',
    subtitle: 'Framing expansions with 4-hour profiling',
    accent: '#c497ff',
    description:
      "Garrett's approach: OHLC/OLHC candle logic, expansion alignment across timeframes, reversal formations, time-based profiles, wick size and targets.",
  },
];

export const lessons = [
  /* ══════════════════════ TRACK V1 ══════════════════════ */
  {
    id: 'v1-01',
    track: 'v1',
    order: 1,
    title: 'What Is a Trading Model?',
    minutes: 4,
    sections: [
      {
        heading: 'The edge, defined',
        blocks: [
          {
            type: 'text',
            html: 'A trading model is a framework — an edge — that gives a trader a high probability of one outcome over another, as stated by Mark Douglas. Your job is not to predict every candle; it is to execute a structured process whose outcomes tilt in your favor over a series of trades.',
          },
          {
            type: 'callout',
            title: 'Consistency over outcome',
            html: 'A profitable trade that violates the model is still a losing habit. This entire curriculum grades your <em>process</em>, not your P&amp;L.',
          },
          {
            type: 'text',
            html: 'The model you are about to learn integrates the teachings of ICT, MMXM Trader, TTrades, AM Trades and Sniper Trades into one structured workflow: build a daily narrative, drop into the 4H profile, and refine entries on the lower timeframes.',
          },
          {
            type: 'keypoints',
            points: [
              'A model is a repeatable framework, not a prediction machine.',
              'Edge = high probability of one outcome over another (Mark Douglas).',
              'The V1 workflow: Daily narrative → 4H profile → refined LTF entry.',
            ],
          },
        ],
      },
    ],
    quiz: [
      {
        q: 'According to the framework, what is a trading model?',
        options: [
          'A guaranteed prediction of the next candle',
          'A framework or edge giving a high probability of one outcome over another',
          'A set of indicators that fire buy and sell signals',
          'A money-management spreadsheet',
        ],
        answer: 1,
        explain:
          'The V1 document opens with Mark Douglas: “a framework or edge that gives a trader a high probability of one outcome over another.”',
      },
      {
        q: 'What does this curriculum grade above everything else?',
        options: ['Profit per trade', 'Number of trades taken', 'Process consistency', 'Win streaks'],
        answer: 2,
        explain:
          'Consistency > outcome. A rule-breaking winner is still a failed execution under the model.',
      },
      {
        q: 'What is the correct top-down order of the V1 workflow?',
        options: [
          'M15 entry → 4H profile → Daily bias',
          'Daily narrative → 4H profile → lower-timeframe entry',
          '4H profile → Daily bias → M15 entry',
          'Weekly bias → M5 entry → Daily review',
        ],
        answer: 1,
        explain:
          'V1 is strictly top-down: establish the daily bias first, profile the 4H candles, then refine the entry.',
      },
    ],
  },
  {
    id: 'v1-02',
    track: 'v1',
    order: 2,
    title: 'Daily Bias: DOL, POI and IRL ↔ ERL',
    minutes: 6,
    sections: [
      {
        heading: 'Where is price going — and from where?',
        blocks: [
          {
            type: 'text',
            html: 'To trade the market effectively we must determine <strong>where price is going</strong> and <strong>from where it is going</strong>. As an intraday trader this means identifying the daily bias — the expected direction of the daily candle.',
          },
          {
            type: 'rule',
            html: '<strong>Where is it going?</strong> → the DOL (Draw on Liquidity).<br><strong>From where is it going?</strong> → the Point of Interest (POI).',
          },
          {
            type: 'text',
            html: 'Daily bias is built as a narrative from three ingredients: understanding <strong>order flow</strong>, defining <strong>key levels</strong>, and recognizing the <strong>phases of price delivery</strong>. Within POIs we then identify swing points to refine trade entries.',
          },
          {
            type: 'callout',
            title: 'Universal behavior',
            html: '<strong>IRL to ERL and ERL to IRL is a universal price behavior.</strong> Price shuttles between Internal Range Liquidity (FVGs inside the range) and External Range Liquidity (old highs/lows at range extremes).',
          },
          {
            type: 'text',
            html: 'Bullish order flow means higher highs and higher lows with bullish PD arrays being respected. When the daily chart is unclear, drop to the 4H for analysis — except during consolidation, when no timeframe gives you a clean read.',
          },
          {
            type: 'keypoints',
            points: [
              'DOL answers “where is price going”; POI answers “from where”.',
              'IRL ↔ ERL movement is universal price behavior.',
              'Bullish order flow: HH + HL with bullish PD arrays respected.',
              'Unclear daily → use 4H analysis, except in consolidation.',
            ],
          },
        ],
      },
    ],
    quiz: [
      {
        q: 'In the V1 narrative, the DOL answers which question?',
        options: [
          'From where is price going?',
          'Where is price going?',
          'When will price move?',
          'How fast will price move?',
        ],
        answer: 1,
        explain: 'The framework states: “Where is it going? → DOL. From where is it going? → Point of Interest.”',
      },
      {
        q: 'Which behavior does the framework call universal?',
        options: [
          'Trend continuation on Mondays',
          'IRL to ERL and ERL to IRL movement',
          'Price always filling gaps within a day',
          'Reversals at round numbers',
        ],
        answer: 1,
        explain: '“IRL to ERL and ERL to IRL is a universal price behavior.”',
      },
      {
        q: 'When the daily chart is unclear, what does the model say to do?',
        options: [
          'Trade the weekly chart',
          'Skip the day entirely, always',
          'Use 4H chart analysis — except during consolidation',
          'Double position size to compensate',
        ],
        answer: 2,
        explain:
          'V1: “When the daily chart is unclear, use 4H chart analysis (except during consolidation).”',
      },
      {
        q: 'What defines bullish order flow in this model?',
        options: [
          'Three green candles in a row',
          'Higher highs and higher lows with bullish PD arrays respected',
          'Price above a 200 moving average',
          'RSI above 50',
        ],
        answer: 1,
        explain:
          '“Bullish Order Flow: Look for higher highs (HH) and higher lows (HL) with bullish PD arrays being respected.”',
      },
    ],
  },
  {
    id: 'v1-03',
    track: 'v1',
    order: 3,
    title: 'Swing Points & the Next Day Model',
    minutes: 7,
    sections: [
      {
        heading: 'The three-candle swing point',
        blocks: [
          {
            type: 'text',
            html: 'Every reversal in this model is anchored to a <strong>swing point</strong> — a specific three-candle sequence:',
          },
          {
            type: 'rule',
            html: '<strong>C1:</strong> the first candle.<br><strong>C2:</strong> the second candle, which takes out the previous candle’s high or low.<br><strong>C3:</strong> the third candle, which reverses direction.',
          },
          {
            type: 'text',
            html: 'The MMXM Next Day Model / TTFM then supplies the engine: <strong>price expands in the direction of the DOL whenever it closes above/below the previous candle, until the draw is met.</strong> A close through the prior candle is the ignition; the draw on liquidity is the destination.',
          },
          {
            type: 'image',
            src: 'assets/v1-page05.png',
            caption:
              'The MMXM Next Day Model / TTFM. Left: a bearish candle is undercut, C2 sweeps the low and reverses at the 50% of its range. Right: each successive close above the previous candle keeps the expansion running — note the 50% retrace levels the following candles respect on their way to the draw.',
          },
          {
            type: 'keypoints',
            points: [
              'Swing point = C1, C2 (takes prior high/low), C3 (reverses).',
              'Close above/below previous candle → expansion toward the DOL.',
              'Expansion continues until the draw is met.',
            ],
          },
        ],
      },
      {
        heading: 'Top-down: Daily to 4H',
        blocks: [
          {
            type: 'text',
            html: 'On the daily chart: find the direction of the next daily candle, determine the phase of price delivery and order flow, and apply the Next Day Model at relevant POIs (IRL &amp; ERL). The draw is external range liquidity.',
          },
          {
            type: 'rule',
            html: 'A single daily candle contains <strong>six 4H candles</strong>. Identify which 4H candle will form the high or low of the day.',
          },
          {
            type: 'text',
            html: 'Use 4H order flow and the IRL→ERL structure for bias confirmation. The 4H is where the daily narrative becomes an executable map.',
          },
        ],
      },
    ],
    quiz: [
      {
        q: 'In a swing point, what does C2 do?',
        options: [
          'It closes exactly at the open of C1',
          'It takes out the previous candle’s high or low',
          'It must be a doji',
          'It gaps away from C1',
        ],
        answer: 1,
        explain: 'V1: “C2: Second candle, which takes out the previous candle’s high or low.”',
      },
      {
        q: 'Per the Next Day Model, when does price expand toward the DOL?',
        options: [
          'Whenever RSI is oversold',
          'Whenever it closes above/below the previous candle, until the draw is met',
          'Only at the London open',
          'After three consecutive inside bars',
        ],
        answer: 1,
        explain:
          '“Price expands in the direction of the DOL whenever it closes above/below the previous candle until the draw is met.”',
      },
      {
        q: 'How many 4H candles make up one daily candle?',
        options: ['Four', 'Five', 'Six', 'Eight'],
        answer: 2,
        explain: '“A single daily candle contains six 4H candles.”',
      },
      {
        q: 'On the daily chart, the draw is typically what kind of liquidity?',
        options: ['Internal range liquidity', 'External range liquidity', 'Equal highs only', 'Midnight open'],
        answer: 1,
        explain: 'V1 top-down analysis: “The draw would be external range liquidity.”',
      },
    ],
  },
  {
    id: 'v1-04',
    track: 'v1',
    order: 4,
    title: 'SMT Divergence — Compulsory',
    minutes: 4,
    sections: [
      {
        heading: 'The non-negotiable filter',
        blocks: [
          {
            type: 'text',
            html: 'SMT divergence — one correlated instrument making a new high/low while the other fails to — is <strong>compulsory for this model</strong>. It is not a bonus confluence; it is a gate.',
          },
          {
            type: 'rule',
            html: 'SMT divergence <strong>increases win rate by 8–12%</strong>, confirms reversals, and is <strong>mandatory before trading reversal candles</strong>. <strong>No SMT → No trade.</strong>',
          },
          {
            type: 'image',
            src: 'assets/v1-page11.png',
            caption:
              'The 4H→M15 sequence in action. Left: the 6:00 4H candle sweeps the low while the correlated pair diverges (purple SMT line) — the swing point forms. Right: on M15, price breaks through the series of opposing close candles (CISD, blue line) after 8:00 and expands into 10:00.',
          },
          {
            type: 'keypoints',
            points: [
              'SMT adds 8–12% win rate.',
              'It confirms reversals and is mandatory before trading reversal candles.',
              'No SMT = no trade. Ever.',
            ],
          },
        ],
      },
    ],
    quiz: [
      {
        q: 'How much win rate does SMT divergence add, per the framework?',
        options: ['1–2%', '8–12%', '25–30%', 'It does not change win rate'],
        answer: 1,
        explain: 'V1: “Increases win rate by 8-12%.”',
      },
      {
        q: 'You have a perfect swing point at a PD array but no SMT. What do you do?',
        options: [
          'Take half size',
          'Take the trade with a wider stop',
          'No trade — SMT is compulsory',
          'Wait for RSI confirmation instead',
        ],
        answer: 2,
        explain: 'The rule is absolute: “No SMT → No trade.”',
      },
      {
        q: 'SMT is mandatory before trading which candles?',
        options: ['Continuation candles', 'Reversal candles', 'Inside bars', 'News candles'],
        answer: 1,
        explain: 'V1: “Mandatory before trading reversal candles.”',
      },
    ],
  },
  {
    id: 'v1-05',
    track: 'v1',
    order: 5,
    title: 'The 4H → M15 Model (Bread & Butter)',
    minutes: 8,
    sections: [
      {
        heading: 'Entry conditions',
        blocks: [
          {
            type: 'text',
            html: 'This is the bread-and-butter entry of the whole system. Every condition must be present:',
          },
          {
            type: 'rule',
            html: '1. Order flow must align.<br>2. 4H profiling &amp; swing point formation at relevant PD arrays.<br>3. SMT divergence at the swing point / high / low.<br>4. M15 CISD — closure below/above a <em>series of opposing close candles</em>.<br>5. Entries post 8:00 AM — unless news at 8:30 AM (wait for the reaction).',
          },
          {
            type: 'callout',
            title: 'What is CISD?',
            html: 'A Change In State of Delivery: price closing through the series of opposing-close candles that built the manipulation leg. It is the M15 confirmation that the swing is real.',
          },
        ],
      },
      {
        heading: 'Rules & cautions',
        blocks: [
          {
            type: 'rule',
            html: '• CISD should happen <strong>instantly</strong>.<br>• No counter-trend trades.<br>• If CISD is far above, take <strong>IFVG entries</strong>.<br>• No consolidation prior to CISD.<br>• No contradictory swings — bullish and bearish swings cannot coexist.<br>• <strong>No trades post 11:00 AM.</strong><br>• No SMT → no trade.',
          },
          {
            type: 'text',
            html: 'These cautions are the difference between the model and improvisation. An entry at 11:30 AM with perfect structure is still a rule violation. A sluggish CISD after consolidation is a warning, not a trigger.',
          },
          {
            type: 'keypoints',
            points: [
              'All five entry conditions must stack — order flow, 4H swing at PD array, SMT, M15 CISD, post-8:00.',
              'CISD must be instant; hesitation invalidates it.',
              'IFVG entry substitutes when CISD is too far away.',
              'Hard cutoff: nothing after 11:00 AM.',
            ],
          },
        ],
      },
    ],
    quiz: [
      {
        q: 'What does M15 CISD require?',
        options: [
          'A single wick through the low',
          'Closure below/above a series of opposing close candles',
          'Two consecutive dojis',
          'A gap at the open',
        ],
        answer: 1,
        explain: 'V1 defines CISD as “Closure below/above a series of opposing close candles.”',
      },
      {
        q: 'Entries are valid starting at what time — with what exception?',
        options: [
          'Post 7:00 AM, no exceptions',
          'Post 8:00 AM, unless 8:30 news — then wait for the reaction',
          'Post 9:30 AM, unless FOMC',
          'Any time before noon',
        ],
        answer: 1,
        explain: '“Entries post 8:00 AM, unless news at 8:30 AM (wait for reaction).”',
      },
      {
        q: 'The CISD prints far above your POI. The model says:',
        options: [
          'Chase it with a market order',
          'Take IFVG entries instead',
          'Skip the day',
          'Enter at the CISD level anyway',
        ],
        answer: 1,
        explain: '“If CISD is far above, take IFVG entries.”',
      },
      {
        q: 'Which of these invalidates a setup?',
        options: [
          'CISD happening instantly',
          'Consolidation prior to CISD',
          'SMT at the swing point',
          'Order flow aligned with bias',
        ],
        answer: 1,
        explain: 'One of the cautions: “No consolidation prior to CISD.”',
      },
      {
        q: 'What is the hard cutoff time for new trades?',
        options: ['10:00 AM', '11:00 AM', '12:00 PM', '2:00 PM'],
        answer: 1,
        explain: '“No trades post 11:00 AM.” Time discipline is part of the edge.',
      },
    ],
  },
  {
    id: 'v1-06',
    track: 'v1',
    order: 6,
    title: 'Continuation Entries (4H → M15)',
    minutes: 5,
    sections: [
      {
        heading: 'When the reversal entry fails',
        blocks: [
          {
            type: 'text',
            html: 'Missed or failed the reversal? Look for continuation entries meeting <em>all previous criteria</em>. The continuation candle is <strong>always the 3rd candle of the swing point</strong>.',
          },
          {
            type: 'rule',
            html: 'Continuation conditions:<br>• Small wick → large body expected.<br>• The opposing move creates an OB → enter the expansion with a small stop.<br>• Wait for the opposing run <em>before</em> entering.',
          },
          {
            type: 'callout',
            title: 'Continuation Protocol 2',
            html: 'If C2 has a CISD but gave no entry, wait for an <strong>order block or propulsion block within C2</strong> and engage from there.',
          },
          {
            type: 'keypoints',
            points: [
              'Continuation candle = always C3 of the swing point.',
              'Small wick before a large body is the tell.',
              'The opposing move builds the OB you enter from — with a small stop.',
              'Protocol 2: OB/propulsion block within C2 after a no-entry CISD.',
            ],
          },
        ],
      },
    ],
    quiz: [
      {
        q: 'Which candle of the swing point is the continuation candle?',
        options: ['C1', 'C2', 'C3', 'Whichever has the biggest body'],
        answer: 2,
        explain: '“Continuation Candle: Always the 3rd candle of the swing point.”',
      },
      {
        q: 'What wick/body profile does a continuation entry expect?',
        options: [
          'Large wick → small body',
          'Small wick → large body',
          'Equal wick and body',
          'No wick at all',
        ],
        answer: 1,
        explain: 'Continuation condition: “Small wick → Large body expected.”',
      },
      {
        q: 'Continuation Protocol 2 applies when:',
        options: [
          'C2 has CISD but gave no entry — wait for an OB/propulsion block within C2',
          'The day is a consolidation',
          'SMT fails on both pairs',
          'Price runs past 11 AM',
        ],
        answer: 0,
        explain:
          '“If C2 has CISD but no entry, wait for an order block or propulsion block within C2.”',
      },
      {
        q: 'Before entering the continuation, you should wait for:',
        options: ['A news release', 'The opposing run', 'Three inside bars', 'The daily close'],
        answer: 1,
        explain: '“Wait for opposing run before entering” — the opposing move creates the OB.',
      },
    ],
  },
  {
    id: 'v1-07',
    track: 'v1',
    order: 7,
    title: 'The 1H → M5 Model',
    minutes: 6,
    sections: [
      {
        heading: 'Positioning inside a fresh 4H expansion',
        blocks: [
          {
            type: 'text',
            html: 'Four 1H candles equal one 4H candle. <strong>If the next 4H candle expands, the next four 1H candles expand too.</strong> The play: position within the first 1H candles of a new 4H expansion.',
          },
          {
            type: 'rule',
            html: 'Wait for swing point formation, then catch the <strong>2nd candle of the swing point</strong> with:<br>• SMT divergence (compulsory).<br>• M5 CISD.<br>• No consolidation on M5 or 1H prior to entry.<br>• Entry post 8:00 AM.',
          },
          {
            type: 'text',
            html: 'Valid POIs for the swing point: <strong>FVG, IRL→ERL, old high or low</strong>.',
          },
          {
            type: 'image',
            src: 'assets/v1-page15.png',
            caption:
              'The 1H→M5 model. Left: the 1H chart forms SMT into 8:00 AM and breaks through 6:00 — four 1H candles building one 4H expansion (center). Right: the M5 chart prints CISD levels (blue) and a “new hourly candle” continuation as the expansion unfolds.',
          },
          {
            type: 'text',
            html: 'If the reversal entry fails, continuation logic mirrors the 4H→M15 track: continuation candle is always C3, small wick → large body, opposing move creates the OB → enter the expansion with a small stop.',
          },
          {
            type: 'keypoints',
            points: [
              '4 × 1H = one 4H; expansion cascades down.',
              'Catch C2 of the swing with SMT + M5 CISD.',
              'No prior consolidation on M5 or 1H; entries post 8:00 AM.',
              'POIs: FVG, IRL→ERL, old high/low.',
            ],
          },
        ],
      },
    ],
    quiz: [
      {
        q: 'How do 1H candles relate to a 4H candle?',
        options: [
          'Two 1H candles make one 4H',
          'Four 1H candles make one 4H — expansion cascades to them',
          'Six 1H candles make one 4H',
          'They are unrelated timeframes',
        ],
        answer: 1,
        explain:
          '“4 x 1H candles = 1 4H candle → If the next 4H candle expands, the next four 1H candles expand too.”',
      },
      {
        q: 'Which candle of the swing point does the 1H→M5 model try to catch?',
        options: ['C1', 'C2', 'C3', 'C4'],
        answer: 1,
        explain: '“Catching the 2nd Candle of the Swing Point: SMT Divergence (Compulsory). M5 CISD.”',
      },
      {
        q: 'Which is NOT a listed POI for the swing point?',
        options: ['FVG', 'IRL to ERL', 'Old high or low', 'The 200 EMA'],
        answer: 3,
        explain: 'The framework lists FVG, IRL→ERL, and old high/low. Moving averages are not part of the model.',
      },
      {
        q: 'Consolidation on M5 or 1H before the entry means:',
        options: ['Better liquidity, take it', 'The entry is invalid', 'Wait one candle then enter', 'Halve the stop'],
        answer: 1,
        explain: '“No consolidation on M5 or 1H prior to entry.”',
      },
    ],
  },

  /* ══════════════════════ TRACK V2 ══════════════════════ */
  {
    id: 'v2-01',
    track: 'v2',
    order: 1,
    title: 'Wick = Reversal, Body = Expansion',
    minutes: 4,
    sections: [
      {
        heading: 'The anatomy of a candle',
        blocks: [
          {
            type: 'text',
            html: 'Strip a candle down and it has two phases. The <strong>wick is the reversal</strong>. The <strong>body is the expansion</strong>. Price expands after reversal — so the goal is simple: <strong>identify the reversal, then trade the expansion</strong>.',
          },
          {
            type: 'image',
            src: 'assets/v2-page04.png',
            caption:
              'One higher-timeframe candle, exploded. The lower-timeframe sell-off and V-shaped recovery on the left is compressed into the single candle on the right: the drop becomes the lower wick (reversal phase), the rally becomes the body (expansion phase).',
          },
          {
            type: 'text',
            html: 'We are essentially trading away from the daily high/low — which becomes the wick — toward the Draw on Liquidity. Every profile you will learn is a way to locate that wick in time.',
          },
          {
            type: 'keypoints',
            points: [
              'Wick = reversal phase; body = expansion phase.',
              'Price expands after reversal.',
              'Identify the reversal, trade the expansion — away from the day’s high/low toward the DOL.',
            ],
          },
        ],
      },
    ],
    quiz: [
      {
        q: 'In candle anatomy, the wick represents:',
        options: ['Expansion', 'The reversal phase', 'Indecision only', 'Volume'],
        answer: 1,
        explain: 'V2: “Wick = Reversal. Body = Expansion.”',
      },
      {
        q: 'The stated goal of 4H profiling is to:',
        options: [
          'Predict the exact daily close',
          'Identify the reversal, then trade the expansion',
          'Trade every 4H candle open',
          'Fade every wick',
        ],
        answer: 1,
        explain: '“The goal is simple: identify the reversal, and then trade the expansion.”',
      },
      {
        q: 'We trade away from the daily high/low toward:',
        options: ['The previous week’s open', 'The Draw on Liquidity', 'The Asia midpoint', 'The nearest round number'],
        answer: 1,
        explain:
          '“We’re basically trading away from the daily high/low (which becomes the wick), toward the Draw on Liquidity.”',
      },
    ],
  },
  {
    id: 'v2-02',
    track: 'v2',
    order: 2,
    title: 'The Six 4H Candles & HRLR → LRLR',
    minutes: 6,
    sections: [
      {
        heading: 'A day in six candles',
        blocks: [
          {
            type: 'rule',
            html: 'A day = six 4H candles: <strong>18:00, 22:00, 2:00, 6:00, 10:00, 14:00</strong> (New York time).',
          },
          {
            type: 'text',
            html: 'If the reversal happens in the early candles (<strong>18:00 / 22:00 / 2:00</strong>) it is an <strong>Overnight/London reversal</strong> and the New York session becomes the expansion phase. If the high/low is not formed until the NY session (<strong>6:00 / 10:00</strong>), that is your <strong>NY reversal</strong>.',
          },
          {
            type: 'callout',
            title: 'HRLR → LRLR',
            html: 'Price moves from <strong>High Resistance Liquidity Runs to Low Resistance Liquidity Runs</strong>. In simple terms: <strong>manipulation → failure swing</strong>.',
          },
          {
            type: 'image',
            src: 'assets/v2-page06.png',
            caption:
              'HRLR → LRLR. Left: the intraday route — a grinding sell-off into a hard-fought low, then clean expansion. Center: the same story as three daily candles. Right: labeled — the swept low is the HRLR (high-resistance run through protected liquidity), the untouched highs above are the LRLR that price expands toward.',
          },
          {
            type: 'keypoints',
            points: [
              'Six 4H candles: 18:00, 22:00, 2:00, 6:00, 10:00, 14:00 NY.',
              'Early reversal (18/22/2) → NY is expansion.',
              'No high/low until NY (6/10) → NY reversal.',
              'HRLR → LRLR = manipulation → failure swing.',
            ],
          },
        ],
      },
    ],
    quiz: [
      {
        q: 'Which are the six 4H candle opens (NY time)?',
        options: [
          '17:00, 21:00, 1:00, 5:00, 9:00, 13:00',
          '18:00, 22:00, 2:00, 6:00, 10:00, 14:00',
          '0:00, 4:00, 8:00, 12:00, 16:00, 20:00',
          '19:00, 23:00, 3:00, 7:00, 11:00, 15:00',
        ],
        answer: 1,
        explain: 'V2: a day has six 4H candles opening 18:00, 22:00, 2:00, 6:00, 10:00, 14:00 NY time.',
      },
      {
        q: 'A reversal in the 18:00, 22:00 or 2:00 candle makes NY the:',
        options: ['Reversal phase', 'Expansion phase', 'Consolidation phase', 'Retracement phase'],
        answer: 1,
        explain:
          '“If reversal happens in the early candles (18:00/22:00/2:00), it’s an Overnight/London reversal, and NY session becomes the expansion phase.”',
      },
      {
        q: 'HRLR → LRLR translates in simple terms to:',
        options: [
          'Consolidation → breakout',
          'Manipulation → failure swing',
          'News → drift',
          'Accumulation → distribution',
        ],
        answer: 1,
        explain: '“In simple terms: manipulation → failure swing.”',
      },
      {
        q: 'When is a reversal classified as a NY reversal?',
        options: [
          'Whenever it happens after lunch',
          'When the high/low isn’t formed until the 6:00 or 10:00 candle',
          'Only on news days',
          'When Asia consolidates',
        ],
        answer: 1,
        explain:
          '“If the high/low isn’t formed until the NY session (6:00 / 10:00), then that’s your NY reversal.”',
      },
    ],
  },
  {
    id: 'v2-03',
    track: 'v2',
    order: 3,
    title: 'Protected Swings & Failure Swings',
    minutes: 6,
    sections: [
      {
        heading: 'Which lows hold, which highs fold',
        blocks: [
          {
            type: 'rule',
            html: '<strong>Protected swing</strong> = an OB / opposing candle into a key level. Once formed, these aren’t revisited. We trade <strong>away from protected swings toward unprotected ones or failure swings</strong>.',
          },
          {
            type: 'image',
            src: 'assets/v2-page08.png',
            caption:
              'Left: protected swings marked along an uptrend — each circled low is an opposing candle into a key level that price never revisits, with the OB zone shaded. Right: the MMXM NDM/TTFM ladder for the same idea — closes above the previous candle chain the expansion, 50% levels holding beneath.',
          },
          {
            type: 'text',
            html: 'Daily profiles in one line each: <strong>London Reversal</strong> — the daily candle prints its wick in London, NY continues the expansion. <strong>NY Reversal</strong> — the daily candle prints its wick in NY, usually after London/Asia fails to form a high/low.',
          },
          {
            type: 'callout',
            title: 'No swing point, no reversal',
            html: 'The market <strong>can’t reverse without a swing point</strong>. Following the 2nd candle of the swing point, the 3rd and 4th candles will expand until some DOL is met.',
          },
          {
            type: 'keypoints',
            points: [
              'Protected swing = OB/opposing candle into a key level; not revisited.',
              'Trade away from protected, toward unprotected/failure swings.',
              'London reversal: wick in London, NY expands. NY reversal: wick in NY.',
              'After C2, candles 3 and 4 expand until a DOL is met.',
            ],
          },
        ],
      },
    ],
    quiz: [
      {
        q: 'What creates a protected swing?',
        options: [
          'Any equal lows',
          'An OB/opposing candle into a key level',
          'A doji at session open',
          'Three touches of a trendline',
        ],
        answer: 1,
        explain: '“Protected Swing = OB/opposing candle into key level. Once formed, these aren’t revisited.”',
      },
      {
        q: 'The model trades in which direction relative to swings?',
        options: [
          'Toward protected swings',
          'Away from protected swings, toward unprotected/failure swings',
          'Always toward equal highs',
          'Random — direction doesn’t matter',
        ],
        answer: 1,
        explain:
          '“We want to trade away from protected swings toward unprotected ones or failure swings.”',
      },
      {
        q: 'Can the market reverse without a swing point?',
        options: ['Yes, on news', 'Yes, at round numbers', 'No — it can’t reverse without a swing point', 'Only in Asia'],
        answer: 2,
        explain: 'V2 states plainly: “The market can’t reverse without a swing point.”',
      },
      {
        q: 'After the 2nd candle of the swing point, what do candles 3 and 4 do?',
        options: [
          'Consolidate',
          'Expand until some DOL is met',
          'Retrace to the origin',
          'Print equal highs',
        ],
        answer: 1,
        explain:
          '“Following the 2nd candle of the swing point the 3rd and 4th candle will expand until some DOL is met.”',
      },
    ],
  },
  {
    id: 'v2-04',
    track: 'v2',
    order: 4,
    title: 'Overnight & London Reversals (18:00 / 22:00 / 2:00)',
    minutes: 7,
    sections: [
      {
        heading: '4H → M15 positional entries',
        blocks: [
          {
            type: 'text',
            html: '<strong>18:00 / 22:00 reversal (overnight session):</strong> usually after the previous day hits a key level. The reversal sets up in the overnight hours — wait for it to end, then trade the London continuation or NY continuation.',
          },
          {
            type: 'text',
            html: '<strong>2:00 reversal (London open):</strong> happens when Asia consolidates or does a protraction. London prints the wick; NY expands.',
          },
          {
            type: 'rule',
            html: 'How to engage the 2:00 reversal: wait for <strong>M15 reversal confirmation</strong>, then enter the <strong>next continuation candle</strong>.',
          },
          {
            type: 'image',
            src: 'assets/v2-page10.png',
            caption:
              'Two profiles side by side. Left — Overnight Reversal: the low forms across 22:00 into 2:00am and the day expands from there; the 4H pair beside it shows the 22:00 bear candle and the 2:00 expansion. Right — London Reversal: Asia chops sideways from 18:00, the 2:00am candle sweeps the low into 6:00am expansion; beside it, the compressed 4H view.',
          },
          {
            type: 'keypoints',
            points: [
              '18:00/22:00 reversal follows the prior day tagging a key level; trade London/NY continuation after it completes.',
              '2:00 reversal requires Asia consolidation or protraction.',
              'London prints the wick, NY expands.',
              'Engage: M15 reversal confirmation → next continuation candle.',
            ],
          },
        ],
      },
    ],
    quiz: [
      {
        q: 'An 18:00/22:00 overnight reversal usually follows what?',
        options: [
          'A quiet Asia session',
          'The previous day hitting a key level',
          'A US bank holiday',
          'A gap open',
        ],
        answer: 1,
        explain: '“Usually after the previous day hits a key level. Reversal sets up in the overnight hours.”',
      },
      {
        q: 'The 2:00 London reversal happens when:',
        options: [
          'Asia trends strongly',
          'Asia consolidates or does protraction',
          'NY closed red the day before',
          'The weekly candle is bullish',
        ],
        answer: 1,
        explain: '“2:00 Reversal (London Open): Happens when Asia consolidates or do protraction.”',
      },
      {
        q: 'In a London reversal, who prints the wick and who expands?',
        options: [
          'NY prints the wick, London expands',
          'London prints the wick, NY expands',
          'Asia prints the wick, London expands',
          'London prints both wick and body',
        ],
        answer: 1,
        explain: '“London prints the wick, NY expands.”',
      },
      {
        q: 'The prescribed engagement for the 2:00 reversal is:',
        options: [
          'Market order at 2:00 sharp',
          'Wait for M15 reversal confirmation, then enter the next continuation candle',
          'Limit order at Asia low',
          'Enter on the 4H close only',
        ],
        answer: 1,
        explain: '“Wait for M15 reversal confirmation, then enter next continuation candle.”',
      },
    ],
  },
  {
    id: 'v2-05',
    track: 'v2',
    order: 5,
    title: 'New York Reversals (6:00 / 10:00)',
    minutes: 6,
    sections: [
      {
        heading: 'When the overnight fails to print the wick',
        blocks: [
          {
            type: 'text',
            html: '<strong>6:00 reversal (NY reversal):</strong> after the early session protracts or consolidates, New York makes the reversal. Driver times like <strong>8:30 and 9:30</strong> usually help confirm the move.',
          },
          {
            type: 'text',
            html: '<strong>10:00 reversal (late NY reversal):</strong> if 6:00 failed to reverse — or news at 10:00 is involved — this becomes the <strong>last point for a proper reversal</strong>. If it prints a small wick and is supported by daily logic, it’s a strong entry point.',
          },
          {
            type: 'image',
            src: 'assets/v2-page12.png',
            caption:
              'Left — NY Reversal within the 6:00 candle: early session consolidates, 6:00 sweeps the low and expands; the paired 4H view shows the small-wick 6:00 candle igniting. Right — NY Reversal within the 10:00 candle: the sell-off stretches to 10:00am, which prints the LOD and reverses; the 4H pair shows the late wick and full-bodied recovery.',
          },
          {
            type: 'keypoints',
            points: [
              '6:00 reversal: early session protracts/consolidates, NY reverses; 8:30/9:30 drivers confirm.',
              '10:00 reversal: the last chance for a proper reversal.',
              'Small wick + daily logic support = strong 10:00 entry.',
            ],
          },
        ],
      },
    ],
    quiz: [
      {
        q: 'Which driver times help confirm the 6:00 NY reversal?',
        options: ['7:00 and 7:30', '8:30 and 9:30', '10:30 and 11:00', '12:00 and 13:30'],
        answer: 1,
        explain: '“Driver times like 8:30 and 9:30 usually help confirm the move.”',
      },
      {
        q: 'The 10:00 reversal is described as:',
        options: [
          'The first reversal of the day',
          'The last point for a proper reversal',
          'A continuation pattern',
          'Only valid on Fridays',
        ],
        answer: 1,
        explain:
          '“If 6:00 failed to reverse or news at 10:00 is involved, this becomes the last point for a proper reversal.”',
      },
      {
        q: 'What makes a 10:00 reversal a strong entry point?',
        options: [
          'A giant wick against the trend',
          'A small wick supported by daily logic',
          'Low volume',
          'An inside bar',
        ],
        answer: 1,
        explain: '“If small wick + supported by daily logic, it’s a strong entry point.”',
      },
    ],
  },
  {
    id: 'v2-06',
    track: 'v2',
    order: 6,
    title: 'Scalping Entries: 4H → 1H → M5/M3',
    minutes: 6,
    sections: [
      {
        heading: 'Riding the fresh expansion candle',
        blocks: [
          {
            type: 'rule',
            html: 'If the previous 4H candle has a reversal aligned with the daily profile and phases of price, <strong>the new 4H candle will expand</strong>.',
          },
          {
            type: 'text',
            html: 'How to engage: inside the 4H candle, if a <strong>1H reversal candle</strong> is established, trade the continuation. If no swing point exists from the previous 4H candle, wait for the new 4H candle to create that swing and continue. If the daily candle is still in protraction, wait for the new 4H candle to reverse and expand. You can use the classic MMXM entries or the TTFM model to enter these setups.',
          },
          {
            type: 'image',
            src: 'assets/v2-page14.png',
            caption:
              'Three intraday variants of the same scalping idea. Left: 6:00am sweep, entry at 8:00am, expansion onward. Center: reversal confirmed between 9:30 and 10:00am, then trend day. Right: the 2:00am candle sets the low and each subsequent session continues — the entry is always the continuation after a confirmed reversal.',
          },
          {
            type: 'keypoints',
            points: [
              'Previous 4H reversal aligned with the daily profile → new 4H expands.',
              'Trade the 1H reversal-continuation inside the expanding 4H.',
              'No prior swing? Wait for the new 4H to create it.',
              'Daily still protracting? Wait for the new 4H to reverse and expand.',
            ],
          },
        ],
      },
    ],
    quiz: [
      {
        q: 'When will the new 4H candle expand, per the scalping model?',
        options: [
          'Whenever volume spikes',
          'When the previous 4H has a reversal aligned with the daily profile and phases of price',
          'Every day at 10:00',
          'Only after three red candles',
        ],
        answer: 1,
        explain:
          '“If the previous 4H candle has a reversal aligned with the daily profile and phases of price, then the new 4H candle will expand.”',
      },
      {
        q: 'Inside the expanding 4H, what do you trade?',
        options: [
          'The 1H reversal candle’s continuation',
          'Every M5 candle',
          'The 4H open blindly',
          'Only the 14:00 candle',
        ],
        answer: 0,
        explain:
          '“Inside the 4H candle, if there is a 1H reversal candle established, then trade the continuation.”',
      },
      {
        q: 'The daily candle is still in protraction. You should:',
        options: [
          'Enter immediately — protraction is expansion',
          'Wait for the new 4H candle to reverse and expand',
          'Fade the protraction',
          'Switch to the weekly chart',
        ],
        answer: 1,
        explain:
          '“If the daily candle is still in the protraction phase, then wait for the new 4H candle to reverse and expand.”',
      },
      {
        q: 'Which entry models are named for executing these scalps?',
        options: [
          'Classic MMXM entries or the TTFM model',
          'VWAP bounces',
          'Opening range breakouts',
          'Bollinger squeezes',
        ],
        answer: 0,
        explain: '“You can use the classic MMXM entries or the TTFM model to enter these setups.”',
      },
    ],
  },

  /* ══════════════════════ TRACK GXT ══════════════════════ */
  {
    id: 'gxt-01',
    track: 'gxt',
    order: 1,
    title: 'OHLC / OLHC — How a Candle Forms',
    minutes: 6,
    sections: [
      {
        heading: 'The entire logic in four letters',
        blocks: [
          {
            type: 'text',
            html: 'The entire logic of the GxT model is based on a deep understanding of how a candlestick forms: <strong>OHLC or OLHC</strong> — the order in which Open, High, Low and Close are delivered.',
          },
          {
            type: 'rule',
            html: '<strong>OLHC (bullish candle):</strong> a bullish expansion candle opens and creates its <strong>low first</strong> — the wick of the higher-timeframe candle. Once the wick has formed, price expands away, creating the body. We do <em>not</em> want to see price open and trade higher first.',
          },
          {
            type: 'image',
            src: 'assets/gxt-p02-1.png',
            caption:
              'OLHC, the bullish sequence. Left: the finished higher-timeframe candle — long lower wick, full body. Right: its lower-timeframe internals — Open, dip to the Low (wick built), then expansion all the way up through the High into the Close.',
          },
          {
            type: 'rule',
            html: '<strong>OHLC (bearish candle):</strong> a bearish expansion candle opens and creates its <strong>high first</strong>, forming the wick, then expands away downward to create the body. We do not want to see price open and trade lower first.',
          },
          {
            type: 'image',
            src: 'assets/gxt-p03-1.png',
            caption:
              'OHLC, the bearish mirror. Left: the completed bearish candle with its upper wick. Right: the internals — Open, push up to the High first, then a full expansion lower through the Low into the Close.',
          },
          {
            type: 'keypoints',
            points: [
              'OLHC bullish: open → low first (wick) → expand to high → close.',
              'OHLC bearish: open → high first (wick) → expand to low → close.',
              'A candle opening the “wrong way first” argues against your expansion.',
            ],
          },
        ],
      },
    ],
    quiz: [
      {
        q: 'A bullish expansion candle should do what first after the open?',
        options: [
          'Trade higher immediately',
          'Create its low first, forming the wick',
          'Consolidate for half its duration',
          'Gap up',
        ],
        answer: 1,
        explain:
          'GxT: “A bullish expansion candle will open and create a low first, creating the wick… We do not want to see price open and trade higher first.”',
      },
      {
        q: 'OHLC delivery describes which candle?',
        options: ['Bullish expansion', 'Bearish expansion', 'A doji', 'An inside bar'],
        answer: 1,
        explain: 'OHLC = high first after the open — the bearish expansion sequence.',
      },
      {
        q: 'Your bias is bullish but the 4H opens and immediately trades higher. Per the model this is:',
        options: [
          'Perfect — momentum confirms',
          'Undesirable — we don’t want the open trading the wrong way first',
          'Irrelevant to the model',
          'A guaranteed reversal',
        ],
        answer: 1,
        explain:
          'For a bullish candle we want the low formed first (OLHC). Opening higher first works against the expansion profile.',
      },
    ],
  },
  {
    id: 'gxt-02',
    track: 'gxt',
    order: 2,
    title: 'Positive & Negative Conditions (Wick Size)',
    minutes: 5,
    sections: [
      {
        heading: 'Manipulation time vs distribution time',
        blocks: [
          {
            type: 'rule',
            html: '<strong>Positive conditions:</strong> all expansion candles form <em>small opposing runs</em>. The small wick allows a large-range body. <strong>The less time it takes to manipulate (create the wick), the more time the candle has to distribute (create the body).</strong> This filters for high-probability conditions.',
          },
          {
            type: 'image',
            src: 'assets/gxt-p05-1.png',
            caption:
              'Positive conditions: a bullish and a bearish expansion candle, each with a tiny opposing wick and a dominant body — minimal manipulation time, maximal distribution time.',
          },
          {
            type: 'rule',
            html: '<strong>Negative conditions:</strong> reversal or indecision candles form <em>large opposing runs</em>. The large wick does not support expansion — the candle took too much time to manipulate, leaving too little time to distribute. This filters out low-probability conditions.',
          },
          {
            type: 'image',
            src: 'assets/gxt-p06-1.png',
            caption:
              'Negative conditions: the same two candles gone wrong — enormous opposing wicks dwarfing small bodies. Too much time spent manipulating; expansion is not supported.',
          },
          {
            type: 'keypoints',
            points: [
              'Small opposing run → large body: high-probability filter.',
              'Large opposing run → reversal/indecision: avoid.',
              'Wick time is manipulation time; body time is distribution time.',
            ],
          },
        ],
      },
    ],
    quiz: [
      {
        q: 'Why does a small wick support expansion?',
        options: [
          'It looks cleaner on the chart',
          'Less time manipulating leaves more time to distribute (build the body)',
          'It means low volatility',
          'It guarantees a trend day',
        ],
        answer: 1,
        explain:
          '“The less time it takes to manipulate (create the wick), the more time the candle has to distribute (create the body).”',
      },
      {
        q: 'Large opposing runs are characteristic of which candles?',
        options: [
          'Expansion candles',
          'Reversal or indecision candles',
          'Only news candles',
          'Only Asia candles',
        ],
        answer: 1,
        explain: '“All reversal or indecision candles in the market form large opposing runs.”',
      },
      {
        q: 'What role do these wick-size conditions play in the model?',
        options: [
          'Entry triggers',
          'A probability filter — embrace small wicks, avoid large ones',
          'Stop-loss placement rules',
          'Position-sizing rules',
        ],
        answer: 1,
        explain:
          'Positive conditions “act as a filter for high probability conditions”; negative ones “for avoiding low probability conditions.”',
      },
    ],
  },
  {
    id: 'gxt-03',
    track: 'gxt',
    order: 3,
    title: 'Expansion Alignment Across Timeframes',
    minutes: 7,
    sections: [
      {
        heading: 'True expansion',
        blocks: [
          {
            type: 'rule',
            html: '<strong>True expansion occurs when all timeframes are aligned in one direction.</strong>',
          },
          {
            type: 'image',
            src: 'assets/gxt-p09-1.png',
            caption:
              'The target state: Daily, H4 and H1 all printing the same full-bodied expansion candle with matching small wicks — every timeframe telling the same story.',
          },
          {
            type: 'text',
            html: '<strong>Trading away from a key level:</strong> once a key level is hit and the anticipated high of day (HOD) or low of day (LOD) has formed — the wick of the higher-timeframe candle — aim to align multiple timeframe expansion candles in the same direction.',
          },
          {
            type: 'text',
            html: '<strong>Wait for expansion support:</strong> if the higher-timeframe candle price is currently trading in does not support expansion, wait for the next candle to open to align with the expansion.',
          },
          {
            type: 'image',
            src: 'assets/gxt-p11-1.png',
            caption:
              'Lower-timeframe model alignment: the 1H sequence bottoms and turns while the 4H candle (right) opens at the same level and expands — the LTF model is executed inside a HTF candle that supports it.',
          },
          {
            type: 'text',
            html: '<strong>Lower-timeframe model alignment:</strong> align the LTF model with the higher-timeframe expansion candle. If the current HTF candle does not support expansion, wait for the next HTF candle to open and confirm. Once the HTF candle is aligned, price is more likely to move away from the key level.',
          },
          {
            type: 'keypoints',
            points: [
              'All timeframes one direction = true expansion.',
              'Key level hit + HOD/LOD wick formed → align multi-timeframe expansion.',
              'HTF candle not supportive? Wait for the next candle open.',
              'LTF model executes inside an aligned HTF expansion candle.',
            ],
          },
        ],
      },
    ],
    quiz: [
      {
        q: 'When does true expansion occur?',
        options: [
          'When the 4H is bullish regardless of other timeframes',
          'When all timeframes are aligned in one direction',
          'When volume doubles',
          'At every London open',
        ],
        answer: 1,
        explain: '“True expansion occurs when all time frames are aligned in one direction.”',
      },
      {
        q: 'The current HTF candle does not support expansion. The model says:',
        options: [
          'Force the LTF entry anyway',
          'Wait for the next candle to open and align with the expansion',
          'Reverse your bias',
          'Add to your position',
        ],
        answer: 1,
        explain:
          '“If the higher time frame candle… does not support expansion, wait for the next candle to open to align with the expansion.”',
      },
      {
        q: 'You may trade away from a key level once:',
        options: [
          'Any candle touches it',
          'The anticipated HOD/LOD wick of the HTF candle has formed',
          'It has been tested three times',
          'The spread narrows',
        ],
        answer: 1,
        explain:
          '“Once a key level is hit, and the anticipated HOD or LOD has formed (wick of higher time frame candle), aim to align multiple time frame expansion candles.”',
      },
    ],
  },
  {
    id: 'gxt-04',
    track: 'gxt',
    order: 4,
    title: 'Liquidity Models: IRL→ERL, ERL→IRL, HRLR→LRLR',
    minutes: 6,
    sections: [
      {
        heading: 'Three routes price travels',
        blocks: [
          {
            type: 'rule',
            html: '<strong>IRL→ERL:</strong> the market retraces into an FVG (internal range liquidity), which acts as a reversal point to expand toward the swing high or low (external range liquidity).',
          },
          {
            type: 'image',
            src: 'assets/gxt-p45-1.png',
            caption:
              'Both directions of the internal↔external shuttle. Left: retrace into the IRL (FVG), reversal, expansion to the ERL swing high. Right: expansion into the ERL swing low becomes the reversal point back toward the IRL (FVG) above.',
          },
          {
            type: 'rule',
            html: '<strong>ERL→IRL:</strong> the market expands into a swing high or low, which acts as a reversal point to retrace into the FVG (IRL).',
          },
          {
            type: 'rule',
            html: '<strong>HRLR→LRLR / order pairing:</strong> the market manipulates a swing high or low on one side of the range, then expands away from that side toward the opposing side where resting failure swings await.',
          },
          {
            type: 'image',
            src: 'assets/gxt-p47-1.png',
            caption:
              'Order pairing in both directions. Left: the reversal sweeps a swing low (HRLR), and the untested failure-swing highs above become the target. Right: the mirror — a swing-high sweep, with failure-swing lows below as the draw.',
          },
          {
            type: 'keypoints',
            points: [
              'IRL→ERL: FVG retrace → expand to swing high/low.',
              'ERL→IRL: swing sweep → retrace to FVG.',
              'HRLR→LRLR: manipulate one side, expand to failure swings on the other.',
            ],
          },
        ],
      },
    ],
    quiz: [
      {
        q: 'In the IRL→ERL model, what acts as the reversal point?',
        options: ['A swing high', 'The FVG price retraces into', 'The daily open', 'A trendline'],
        answer: 1,
        explain:
          '“The market retraces into a FVG (IRL), acting as a reversal point to expand towards the swing high or low (ERL).”',
      },
      {
        q: 'In the HRLR→LRLR model, price expands toward:',
        options: [
          'The manipulated side of the range',
          'The opposing side where resting failure swings await',
          'The weekly open',
          'The nearest FVG only',
        ],
        answer: 1,
        explain:
          '“Price then expands away from this side of the range towards the opposing side where resting failure swings await.”',
      },
      {
        q: 'ERL→IRL means:',
        options: [
          'Expansion into a swing high/low, then retrace into the FVG',
          'Retrace into an FVG, then expansion to a swing',
          'Consolidation inside the range',
          'A gap fill',
        ],
        answer: 0,
        explain:
          '“The market expands into a swing high or low, acting as a reversal point to retrace into the FVG (IRL).”',
      },
    ],
  },
  {
    id: 'gxt-05',
    track: 'gxt',
    order: 5,
    title: 'Reversal Formations',
    minutes: 8,
    sections: [
      {
        heading: 'The four reversal types',
        blocks: [
          {
            type: 'rule',
            html: '<strong>Type 1:</strong> C1 hits a key level, C2 forms a reversal candle, wait for the expansion candle in C3.<br><strong>Type 2:</strong> C2 hits a key level and forms a reversal candle, wait for the expansion candle in C3.',
          },
          {
            type: 'image',
            src: 'assets/gxt-p15-1.png',
            caption:
              'Types 1 & 2 in both directions: a candle tags the key level, the next closes as a reversal candle, and the third expands away — bullish sequence left, bearish mirror right.',
          },
          {
            type: 'rule',
            html: '<strong>Type 3:</strong> C1 hits a key level, C2 forms a reversal-into-expansion candle off C1’s high/low. A small wick supports expansion. (Variant: C2 opens <em>near</em> the key level and reverses off C1’s high/low.)',
          },
          {
            type: 'image',
            src: 'assets/gxt-p16-1.png',
            caption:
              'Type 3: C1 completes at the key level and C2 reverses straight into expansion off C1’s extreme — the small opposing wick on C2 is what licenses the move.',
          },
          {
            type: 'rule',
            html: '<strong>Type 4:</strong> C2 hits the key level but does <em>not</em> close a reversal candle. C3 does not sweep C2’s high/low — instead it expands.',
          },
          {
            type: 'image',
            src: 'assets/gxt-p18-1.png',
            caption:
              'Type 4 inside a live sequence: the deep candle tags the level without closing as a reversal; the next candle refuses to sweep its extreme and simply expands, leaving the swing protected.',
          },
          {
            type: 'text',
            html: 'Worked example (4H and above): C1 hits the key level and closes as an expansion candle. C2 forms a small opposing run reversing off C1’s low — the small wick supports expansion higher.',
          },
          {
            type: 'image',
            src: 'assets/gxt-p19-1.png',
            caption:
              'The worked example: C1 closes expansion into the level; C2’s brief opposing run off C1’s low becomes the launch wick for continuation higher.',
          },
          {
            type: 'keypoints',
            points: [
              'Type 1: C1 hits level, C2 reverses, expand in C3.',
              'Type 2: C2 itself hits the level and reverses; expand in C3.',
              'Type 3: C2 reverses into expansion off C1’s extreme — small wick required.',
              'Type 4: C2 tags the level without closing reversal; C3 expands without sweeping C2.',
            ],
          },
        ],
      },
    ],
    quiz: [
      {
        q: 'In reversal Type 1, when do you seek the expansion candle?',
        options: ['C1', 'C2', 'C3', 'C4'],
        answer: 2,
        explain: '“C1 hits a key level, C2 forms reversal candle, wait for expansion candle in C3.”',
      },
      {
        q: 'What supports expansion in the C2 reversal-into-expansion formation?',
        options: ['A large wick', 'A small wick', 'High volume', 'A gap'],
        answer: 1,
        explain: '“C2 forms a reversal into expansion candle off of C1 high/low. A small wick supports expansion.”',
      },
      {
        q: 'In Type 4, what does C3 do?',
        options: [
          'Sweeps C2’s high/low then reverses',
          'Does not sweep C2’s high/low — it expands instead',
          'Closes inside C1',
          'Forms a doji',
        ],
        answer: 1,
        explain:
          '“C2 hits key level but does not close reversal candle. C3 does not sweep C2 high/low but instead expands.”',
      },
      {
        q: 'In the worked 4H example, what did C1 do at the key level?',
        options: [
          'Closed as an expansion candle',
          'Closed as a doji',
          'Failed to reach it',
          'Gapped over it',
        ],
        answer: 0,
        explain: '“C1 hits key level and closes expansion candle,” then C2 reverses off C1’s low with a small wick.',
      },
    ],
  },
  {
    id: 'gxt-06',
    track: 'gxt',
    order: 6,
    title: 'Time-Based Profiles: London & New York',
    minutes: 9,
    sections: [
      {
        heading: '2am London reversal',
        blocks: [
          {
            type: 'rule',
            html: '<strong>London Reversal:</strong> between <strong>2am–5am</strong> the daily candle forms a low at a relevant level and reverses. Once the level is engaged, the 4H expansion candle can be traded away from the low of day.',
          },
          {
            type: 'image',
            src: 'assets/gxt-p20-1.png',
            caption:
              'London Reversal: the 15m chart bottoms between 2 and 5am and turns; on the right, the 22:00 bear candle hands off to the 02:00 4H expansion candle whose low is the LOD.',
          },
          {
            type: 'text',
            html: '<strong>NY Continuation (2am → 6am):</strong> between 8am–10am, continuation away from the LOD reaching toward the draw. Trade the 6am 4H expansion candle away from the LOD, pairing continuation entries with any present volatility drivers.',
          },
          {
            type: 'image',
            src: 'assets/gxt-p22-1.png',
            caption:
              '2am London reversal → 6am NY continuation: the 15m recovery from the London low accelerates through 8–10am; the 4H pair shows the small 02:00 candle and the towering 06:00 expansion.',
          },
          {
            type: 'text',
            html: '<strong>10am continuation:</strong> between 10am–12pm, continuation away from the LOD toward the draw — trading the 10am 4H expansion candle paired with continuation entries. This applies after a 2am or 6am reversal has formed the HOD/LOD.',
          },
        ],
      },
      {
        heading: '6am & 10am New York reversals',
        blocks: [
          {
            type: 'rule',
            html: '<strong>6am Reversal:</strong> between <strong>8am–10am</strong>, a reversal-into-expansion forms the LOD and expands toward the draw. Trade the 6am 4H expansion candle away from the LOD, pairing manipulation and entries with any present volatility drivers.',
          },
          {
            type: 'image',
            src: 'assets/gxt-p25-1.png',
            caption:
              '6am NY Reversal: the 15m chart sweeps its final low between 8 and 10am and reverses; on the 4H pair, the 02:00 candle is the failed drop and 06:00 prints the reversal-into-expansion.',
          },
          {
            type: 'rule',
            html: '<strong>10am Reversal:</strong> between <strong>10am–12pm</strong>, a reversal-into-expansion forms the LOD and expands toward the draw — trading the 10am 4H expansion candle away from the LOD.',
          },
          {
            type: 'image',
            src: 'assets/gxt-p26-1.png',
            caption:
              '10am NY Reversal: the low finally forms after 10am on the 15m; the 4H pair shows the 06:00 candle failing to reverse and the 10:00 candle doing the work.',
          },
        ],
      },
      {
        heading: '4H profiling by candle',
        blocks: [
          {
            type: 'text',
            html: '<strong>2am reversal (4H profiling):</strong> when the previous 4H candle hits a 4H key level and closes as an expansion candle, seek the 2:00am 4H reversal-into-expansion candle. It reverses off the previous candle’s high or low, forming a wick and expanding away — creating the LOD/HOD. A continuation can then be found at the 6:00am candle, and with a 2:00am or 6:00am reversal in place, the 10am candle offers continuation.',
          },
          {
            type: 'image',
            src: 'assets/gxt-p28-1.png',
            caption:
              '2am reversal, profiled three ways: in each variant the 18:00 and 22:00 candles carry the decline into the level and the 02:00 candle reverses off the prior extreme into expansion — its wick is the day’s low.',
          },
          {
            type: 'text',
            html: '<strong>6am reversal (4H profiling):</strong> when the previous 4H candle hits a 4H key level, look to trade the 6:00am reversal-into-expansion candle — it reverses off the previous candle’s high/low, forming the wick or HOD/LOD. <strong>10am reversal:</strong> with the previous 4H candle hitting a 4H key level, the 10am reversal-into-expansion candle provides opportunity in the same way.',
          },
          {
            type: 'image',
            src: 'assets/gxt-p30-1.png',
            caption:
              '6am reversal profiles: the overnight candles (18:00 → 02:00) stair-step into the key level; the 06:00 candle reverses off the prior candle’s extreme and expands, printing the LOD wick.',
          },
          {
            type: 'keypoints',
            points: [
              'London reversal: 2–5am low at a relevant level; trade the 4H expansion away from LOD.',
              'NY continuation: 8–10am (6am candle) and 10–12pm (10am candle) away from LOD toward the draw.',
              '6am reversal: LOD forms 8–10am; 10am reversal: LOD forms 10–12pm.',
              'Prior 4H tagging a key level is the precondition for the reversal-into-expansion candle.',
            ],
          },
        ],
      },
    ],
    quiz: [
      {
        q: 'The London reversal low forms in which window?',
        options: ['12am–2am', '2am–5am', '5am–7am', '8am–10am'],
        answer: 1,
        explain: '“Between 2am - 5am, the daily candle forms a low at a relevant level and reverses.”',
      },
      {
        q: 'After a 2am London reversal, the 6am NY continuation runs primarily between:',
        options: ['6am–7am', '8am–10am', '10am–12pm', '1pm–3pm'],
        answer: 1,
        explain:
          '“2am London reversal → 6am New York Continuation. Between 8am - 10am, continuation away from the LOD reaching towards the draw.”',
      },
      {
        q: 'In a 6am NY reversal, the LOD forms:',
        options: ['Between 8am–10am', 'Before 2am', 'Exactly at 6am', 'After 12pm'],
        answer: 0,
        explain:
          '“6am Reversal: Between 8am - 10am, reversal into expansion forms the low of day expanding towards the draw.”',
      },
      {
        q: 'The precondition for seeking the 2:00am 4H reversal-into-expansion candle is:',
        options: [
          'Asia trending strongly',
          'The previous 4H candle hitting a 4H key level and closing as an expansion candle',
          'A gap at midnight',
          'The 18:00 candle being bullish',
        ],
        answer: 1,
        explain:
          '“When previous 4H candle hits a 4H key level and closes as an expansion candle, seek the 2:00am 4H reversal into expansion candle.”',
      },
      {
        q: 'With a 2am or 6am reversal forming the HOD/LOD, the 10am candle offers:',
        options: ['A fresh reversal only', 'Continuation', 'Nothing — day is done', 'A guaranteed retrace'],
        answer: 1,
        explain: '“With 2:00am or 6:00am reversal forming the HOD/LOD, 10am 4H candle continuation can be used.”',
      },
    ],
  },
  {
    id: 'gxt-07',
    track: 'gxt',
    order: 7,
    title: 'The Ideal Profile',
    minutes: 6,
    sections: [
      {
        heading: 'Consolidation, manipulation, protected swing',
        blocks: [
          {
            type: 'rule',
            html: 'The ideal profile occurs when the previous session(s) <strong>consolidate or retrace</strong>. The HOD/LOD wick forms from <strong>manipulation of a 1H/4H swing high or low</strong>, creating a protected swing for the candle to expand away from — which forms the candle body. <strong>Pair the manipulation with either a volatility driver or SMT.</strong>',
          },
          {
            type: 'image',
            src: 'assets/gxt-p33-1.png',
            caption:
              'The ideal profile skeleton: the 1H/4H chops sideways, sweeps a swing (blue), and expands — compressing into a single full-bodied Daily Expansion candle on the right.',
          },
          {
            type: 'text',
            html: '<strong>Ideal London reversal:</strong> occurs when the Asia session consolidates or retraces. The HOD/LOD wick forms from manipulation of the <strong>Asian range</strong>, creating a protected swing within the candle to expand away from. <strong>Pair this manipulation with SMT.</strong>',
          },
          {
            type: 'image',
            src: 'assets/gxt-p34-1.png',
            caption:
              'Ideal London reversal: Asia consolidates in a tight band, London runs the range low (angled sweep line), and the day expands — the swept low is the protected swing.',
          },
          {
            type: 'text',
            html: '<strong>Ideal New York reversal:</strong> the previous sessions consolidate or retrace; the HOD/LOD wick forms from manipulation of a 1H/4H swing high or low, creating a protected swing within the candle. <strong>Pair manipulation with a volatility driver or SMT.</strong>',
          },
          {
            type: 'image',
            src: 'assets/gxt-p35-1.png',
            caption:
              'Ideal NY reversal: Asia and London drift lower in consolidation, then the 8:30/9:30 window (red) drives the final sweep — the New York reversal — before a full trend leg.',
          },
          {
            type: 'keypoints',
            points: [
              'Ideal profile needs prior consolidation or retracement.',
              'HOD/LOD wick = manipulation of a 1H/4H swing (London: the Asian range).',
              'The manipulated swing becomes protected; the body expands away from it.',
              'Always pair manipulation with a volatility driver or SMT (London: SMT).',
            ],
          },
        ],
      },
    ],
    quiz: [
      {
        q: 'The ideal profile requires the previous session(s) to:',
        options: ['Trend strongly', 'Consolidate or retrace', 'Gap open', 'Close at highs'],
        answer: 1,
        explain: '“The ideal profile occurs when the previous session(s) consolidate or retrace.”',
      },
      {
        q: 'In the ideal London reversal, the wick forms from manipulation of:',
        options: ['The weekly open', 'The Asian range', 'The previous month’s low', 'A trendline'],
        answer: 1,
        explain: '“The high or low of day wick forms from manipulation of the Asian range… Pair this manipulation with SMT.”',
      },
      {
        q: 'What must the manipulation be paired with?',
        options: [
          'Nothing — time is enough',
          'A volatility driver or SMT',
          'A moving-average cross',
          'Round-number support',
        ],
        answer: 1,
        explain: '“Pair the manipulation with either a volatility driver or SMT.”',
      },
      {
        q: 'What does the manipulated swing become?',
        options: ['A failure swing', 'A protected swing the candle expands away from', 'Dead liquidity', 'A magnet'],
        answer: 1,
        explain:
          '“…creating a protected swing with the candle to expand away from which forms the candle body.”',
      },
    ],
  },
  {
    id: 'gxt-08',
    track: 'gxt',
    order: 8,
    title: 'Wick Size & Fading Large Opposing Runs',
    minutes: 7,
    sections: [
      {
        heading: 'When the wick gets big',
        blocks: [
          {
            type: 'rule',
            html: 'Expansion is supported by <strong>small opposing wicks</strong>. Fading a large opposing run requires a very specific framework.',
          },
          {
            type: 'image',
            src: 'assets/gxt-p37-1.png',
            caption:
              'Wick size at a glance: two candles whose opposing wicks rival their bodies — the signature of reversal or indecision, not expansion.',
          },
          {
            type: 'text',
            html: 'When fading a large opposing run, the candle must <strong>open and form a low first</strong> (supporting a bullish candle). The high of day should form <strong>early into the candle — such as the Asia session</strong> — minimizing wick-formation time and allowing more expansion.',
          },
          {
            type: 'image',
            src: 'assets/gxt-p38-1.png',
            caption:
              'A large opposing run day: Asia sets the high at 18:00, London bleeds lower all night, and the daily candle (D1) closes as a full bear bar — the early high is what made the downside expansion possible.',
          },
          {
            type: 'rule',
            html: 'Because price created a large opposing run, it does <strong>not</strong> support an expansion candle. <strong>Adjust targets back to the opening price or back within the daily range</strong> — price is unlikely to expand past the daily open.',
          },
          {
            type: 'image',
            src: 'assets/gxt-p40-1.png',
            caption:
              'Target adjustment after a large opposing run: the London sweep reverses through 8:30/9:30 and price recovers — but the realistic objective is the daily open (D1 marker), not a new expansion beyond it.',
          },
          {
            type: 'text',
            html: 'The high or low of day should form <strong>from a key level before 10:00</strong>, providing enough time for price to expand back to the daily open. Pair this with a volatility driver and SMT for reversal to add extra confluence. Once price trades into a key level, we look to trade the 4H expansion candles away from the HOD/LOD back to the daily open.',
          },
          {
            type: 'image',
            src: 'assets/gxt-p41-1.png',
            caption:
              'The timing rule drawn out: the 02:00 candle completes the manipulation at the key level well before 10:00, and the 06:00/10:00 candles expand back toward the daily open (dotted), with D1 alongside.',
          },
          {
            type: 'keypoints',
            points: [
              'Fading a large run: candle must open and form its low first.',
              'HOD should form early (Asia) to leave time for expansion.',
              'Targets shrink to the daily open — not beyond it.',
              'HOD/LOD from a key level before 10:00; add volatility driver + SMT.',
            ],
          },
        ],
      },
    ],
    quiz: [
      {
        q: 'When fading a large opposing run (bullish case), the candle must:',
        options: [
          'Open and trade higher first',
          'Open and form a low first',
          'Gap through the level',
          'Close above the previous high immediately',
        ],
        answer: 1,
        explain:
          '“When fading a large opposing run, the candle must open and form a low first as this supports a bullish candle.”',
      },
      {
        q: 'After a large opposing run, where do targets adjust to?',
        options: [
          'A new all-time high',
          'Back to the opening price / within the daily range',
          'The weekly close',
          'Double the daily range',
        ],
        answer: 1,
        explain:
          '“Adjust the targets back to the opening price or back within the daily range as price is unlikely to expand past the daily open.”',
      },
      {
        q: 'By when should the HOD/LOD form from a key level in this framework?',
        options: ['Before 10:00', 'Before 14:00', 'Before midnight', 'Any time'],
        answer: 0,
        explain:
          '“The high or low of day should form from a key level before 10:00, providing enough time for price to expand back to the daily open.”',
      },
      {
        q: 'Why does an early (Asia) HOD help when fading a large run?',
        options: [
          'It guarantees news alignment',
          'It minimizes wick-formation time, allowing more expansion',
          'It attracts more volume',
          'It creates equal highs',
        ],
        answer: 1,
        explain:
          '“The high of day should form early into the candle such as the Asia session, minimizing the time it takes to form the wick and allowing for more expansion.”',
      },
    ],
  },
  {
    id: 'gxt-09',
    track: 'gxt',
    order: 9,
    title: 'Targets & Order Pairing',
    minutes: 7,
    sections: [
      {
        heading: 'Stacking LTF targets under HTF draws',
        blocks: [
          {
            type: 'rule',
            html: 'When a lower-timeframe key level and target <strong>align with the higher-timeframe target</strong>, it greatly increases the probability of success.',
          },
          {
            type: 'image',
            src: 'assets/gxt-p42-1.png',
            caption:
              'Nested draws: two 1H draws stack beneath the Daily ERL draw, with the ideal entries marked at each key-level re-engagement — every LTF objective feeds the HTF one.',
          },
          {
            type: 'text',
            html: 'Aim to trade away from the LTF key levels <em>before</em> the LTF targets are met, managing the position toward the HTF targets. <strong>After the LTF targets are reached, entries are no longer valid until price re-engages a key level for continuation. Do not chase price.</strong>',
          },
          {
            type: 'text',
            html: 'In a bullish candle the market opens, forms a low into a key level (LOD), <strong>leaving session highs behind as a target</strong>. The ideal position is within the daily wick, below the daily open. When the market trades into a key level, session highs should be available to target — this increases the probability of the daily candle expanding (OLHC), as there is <strong>no protected high to trade away from, making it the target</strong>.',
          },
          {
            type: 'image',
            src: 'assets/gxt-p44-1.png',
            caption:
              'Session highs left behind: in both the New York and London variants, the sell-off leaves Asia’s highs untouched above — with no protected high overhead, those highs are the day’s draw once the low is secured.',
          },
          {
            type: 'keypoints',
            points: [
              'LTF target + HTF target aligned = high probability.',
              'Enter away from LTF key levels before LTF targets are met; manage toward HTF targets.',
              'LTF targets met → stand down until price re-engages a key level. Never chase.',
              'Bullish OLHC day: unprotected session highs left behind become the target; ideal position is inside the daily wick, below the open.',
            ],
          },
        ],
      },
    ],
    quiz: [
      {
        q: 'What greatly increases the probability of success on a target?',
        options: [
          'Trading only Mondays',
          'LTF key level and target aligning with the HTF target',
          'A wider stop',
          'Averaging in',
        ],
        answer: 1,
        explain:
          '“When a lower timeframe key level and target align with the higher timeframe target, it greatly increases the probability of success.”',
      },
      {
        q: 'After LTF targets are reached, entries are valid again when:',
        options: [
          'Five candles pass',
          'Price re-engages a key level for continuation',
          'Spread normalizes',
          'The session changes',
        ],
        answer: 1,
        explain:
          '“After the lower timeframe targets are reached, entries are no longer valid until price reengages a key level for continuation. Do not chase price.”',
      },
      {
        q: 'On a bullish day, why do session highs left behind matter?',
        options: [
          'They cap the day’s range',
          'With no protected high to trade away from, they become the target',
          'They signal a short',
          'They are irrelevant',
        ],
        answer: 1,
        explain:
          '“…there is no protected high to trade away from, making it the target. This increases the probability of the daily candle expanding (OLHC).”',
      },
      {
        q: 'Where is the ideal position located in a bullish candle?',
        options: [
          'Above the daily high',
          'Within the daily wick, below the daily open',
          'At the 14:00 open',
          'At the previous day’s close',
        ],
        answer: 1,
        explain: '“The ideal position is within the daily wick, below the daily open.”',
      },
    ],
  },
  {
    id: 'gxt-10',
    track: 'gxt',
    order: 10,
    title: 'TTrades Fractal Model Alignment',
    minutes: 5,
    sections: [
      {
        heading: 'The LTF engine inside the 4H',
        blocks: [
          {
            type: 'text',
            html: 'The final alignment layer connects the 4H candle to the TTrades Fractal Model running on the 1H or 30M. There are two configurations:',
          },
          {
            type: 'rule',
            html: '<strong>1.</strong> The 4H opens into an <em>already existing</em> lower-timeframe fractal model on the 1H or 30M.<br><strong>2.</strong> The 4H reversal-to-expansion candle’s high or low is <em>formed from</em> a 1H/M30 fractal model.',
          },
          {
            type: 'image',
            src: 'assets/gxt-p48-1.png',
            caption:
              'Configuration 1: the 4H (left pair) opens directly into a 1H/30m fractal model already in progress (right pair) — the LTF sweep completes exactly where the 4H expansion candle launches.',
          },
          {
            type: 'image',
            src: 'assets/gxt-p49-1.png',
            caption:
              'Configuration 2: the 4H reversal candle’s low is built from the 1H/30m fractal model itself — the aligned H1/M30 model and the H4 expansion candle share one origin.',
          },
          {
            type: 'keypoints',
            points: [
              '4H opening into an existing 1H/30M fractal model = alignment.',
              '4H reversal high/low formed from a 1H/30M fractal model = alignment.',
              'An aligned H1/M30 model + H4 expansion candle is the full stack.',
            ],
          },
        ],
      },
    ],
    quiz: [
      {
        q: 'Which timeframes host the TTrades Fractal Model in this alignment?',
        options: ['Weekly/Daily', '1H or 30M', 'M5 or M1', '4H only'],
        answer: 1,
        explain: 'GxT describes the 4H opening into — or its extreme formed from — a 1H/M30 TTrades Fractal Model.',
      },
      {
        q: 'One valid alignment is the 4H opening into:',
        options: [
          'An already existing LTF fractal model',
          'A round number',
          'The previous week’s VWAP',
          'A news candle',
        ],
        answer: 0,
        explain: '“When the 4H opens into an already existing lower timeframe TTrades Fractal Model on the 1H or 30M.”',
      },
      {
        q: 'The other valid alignment is when the 4H reversal candle’s high/low is:',
        options: [
          'Untested for a week',
          'Formed from a 1H/M30 fractal model',
          'Exactly at the daily open',
          'A gap fill',
        ],
        answer: 1,
        explain:
          '“When the 4H reversal to expansion candles high or low is formed from an 1H/M30 TTrades Fractal Model.”',
      },
    ],
  },
];

const lessonsData = { tracks, lessons };
export default lessonsData;
