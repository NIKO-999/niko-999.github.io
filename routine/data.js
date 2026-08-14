'use strict';

/**
 * RITUAL — default content + routine generation
 * ──────────────────────────────────────────────
 * Nothing personal is stored in this file. It holds the *shape* of a day
 * and neutral starting copy. Real times, goals and history live in
 * localStorage on the device (see app.js → STORE).
 *
 * buildRoutine(profile) is the actual routine builder: it takes the day's
 * anchors — wake, workout, work start, work end, sleep — and lays the day
 * out around them, so the routine bends to the schedule instead of the
 * other way round.
 */

window.RITUAL_DATA = (function () {

  /* ── the four domains ──
     Deliberately uncoloured. One accent in this app — the ember — and it
     is reserved for what is live or kept, not for categories. */
  const DOMAINS = {
    mind:    { label: 'Mind' },
    money:   { label: 'Money' },
    body:    { label: 'Body' },
    meaning: { label: 'Meaning' },
  };

  /* ── starting profile — placeholder until setup is run ── */
  const PROFILE = {
    name:      'Niko',
    wake:      '05:30',
    workout:   '06:00',
    workStart: '09:00',
    workEnd:   '17:30',
    sleep:     '22:00',
  };

  const WORKOUT_LEN = 60;
  const WALK_LEN    = 40;

  /* ── habits: the non-negotiables ──
     `anchor` ties a habit to a block, so completing the block keeps the
     habit. `needle` marks the ones that move the needle most. */
  const HABITS = [
    { id: 'h-sun',   name: 'Sunlight + water', domain: 'body',    anchor: 'rise',  needle: false },
    { id: 'h-train', name: 'Workout',          domain: 'body',    anchor: 'train', needle: true  },
    { id: 'h-trade', name: 'Trading block',    domain: 'money',   anchor: 'deep',  needle: true  },
    { id: 'h-walk',  name: 'Walk & reflect',   domain: 'meaning', anchor: 'walk',  needle: true  },
    { id: 'h-read',  name: 'Read 20 min',      domain: 'mind',    anchor: 'wind',  needle: false },
    { id: 'h-plan',  name: 'Plan tomorrow',    domain: 'mind',    anchor: 'wind',  needle: true  },
  ];

  /* ── goals: one per domain, six-month horizon ── */
  const GOALS = [
    { id: 'g-1', domain: 'body', name: 'Train before the day can take it',
      why: 'First hour, already done. Nothing later gets to negotiate with it.',
      needle: true,  habits: ['h-train', 'h-sun'] },
    { id: 'g-2', domain: 'money', name: 'Trade the plan, not the feeling',
      why: 'The edge is in the repetition, not in any single position.',
      needle: true,  habits: ['h-trade'] },
    { id: 'g-3', domain: 'meaning', name: 'Walk it off and think straight',
      why: 'The thinking happens while moving, away from a screen.',
      needle: true,  habits: ['h-walk'] },
    { id: 'g-4', domain: 'mind', name: 'Close the day on purpose',
      why: 'Reading and a plan beat scrolling into sleep.',
      needle: false, habits: ['h-read', 'h-plan'] },
  ];

  /* ── reward: XP, tiers, and the four characters ──
     XP is never stored. It is recomputed from the log on every render, the
     same contract as goalPct() — so history already recorded counts
     retroactively and there is nothing to migrate.

     Each domain's level step is derived from that domain's own best day
     rather than hardcoded, so a domain carrying one habit doesn't fall
     permanently behind one carrying two. Change the habit list and the
     pacing corrects itself. */
  const REWARD = {
    BASE_XP:        10,   // a habit kept
    NEEDLE_XP:      20,   // a needle-mover kept
    DAYS_PER_LEVEL:  4,   // perfect days per level, in every domain
    TIERS: [
      { level:  1, name: 'Full kit' },
      { level:  5, name: 'Aura' },
      { level: 12, name: 'Embers' },
      { level: 25, name: 'Crown of flame' },
      { level: 50, name: 'Ascended' },
    ],
    CHARACTERS: {
      body:    { name: 'Warrior'  },
      mind:    { name: 'Scholar'  },
      money:   { name: 'Keeper'   },
      meaning: { name: 'Wanderer' },
    },
  };

  /* ── counsel: what the characters say on Today ──
     Chosen from real state, not shuffled at random. Each character keeps
     its own register: the Warrior is blunt, the Scholar precise, the
     Keeper risk-aware, the Wanderer quiet. */
  const COUNSEL = {
    COLD_AFTER: 3,                    // days untouched before a domain is "cold"
    MILESTONES: [7, 14, 30, 100],     // streaks worth remarking on
    LATE_AT: 0.7,                     // how far through the day counts as "late"

    LINES: {
      body: {
        now:   ['This is the hour. Nothing later gets a vote on it.',
                'You already decided last night. Go.'],
        cold:  ['{n} days. The body forgets faster than you think.',
                'Nothing has been asked of you in {n} days. That shows.'],
        streak:['{n} days straight. That is not motivation any more, it is who you are.',
                '{n} in a row. Keep the chain boring.'],
        late:  ['Still undone, and the day is nearly spent.',
                'It gets no easier the later it gets.'],
        done:  ['Done. The rest of the day is downhill from here.',
                'Spent early, as it should be.'],
        idle:  ['Show up on the bad days. Those are the ones that count.',
                'Strength is just attendance, repeated.'],
      },
      mind: {
        now:   ['Close the day deliberately. Read, then write tomorrow down.',
                'One page and one plan. That is the whole ask.'],
        cold:  ['{n} days without a plan written down. It shows in the mornings.',
                'The mind has been running unattended for {n} days.'],
        streak:['{n} days of closing properly. Mornings are easier for it.',
                '{n} nights planned. You are no longer improvising.'],
        late:  ['The day is nearly gone and tomorrow is still unwritten.',
                'Scrolling into sleep is a decision too. Make a better one.'],
        done:  ['Tomorrow is already decided. Sleep on it.',
                'Closed properly. Nothing left to carry.'],
        idle:  ['Reading is not the point. Thinking afterwards is.',
                'A plan written down is a plan you stop rehearsing.'],
      },
      money: {
        now:   ['One screen, nothing else open. The plan, not the feeling.',
                'If you are hunting for a setup, you have already left the plan.'],
        cold:  ['{n} days away from the charts. The edge decays quietly.',
                '{n} days untouched. Skill is not stored, it is maintained.'],
        streak:['{n} sessions kept. The edge lives in the repetition.',
                '{n} days. Consistency is the only edge that compounds.'],
        late:  ['The block is still open and the day is closing.',
                'A missed session costs more than a bad one.'],
        done:  ['Session kept. Whatever it paid today is not the point.',
                'Done. Judge the process, not the number.'],
        idle:  ['The market pays for patience, not for effort.',
                'Position size is the only thing you fully control.'],
      },
      meaning: {
        now:   ['Move. No headphones, no screen. Let the day sort itself out.',
                'The thinking happens while walking, not at the desk.'],
        cold:  ['{n} days without stepping away. It gets loud in there.',
                'You have not been alone with a thought in {n} days.'],
        streak:['{n} days of walking it off. It is doing more than you notice.',
                '{n} days. The clearest thinking you get all day.'],
        late:  ['Still no walk, and the light is going.',
                'Ten minutes outside beats an hour of turning it over.'],
        done:  ['Walked. Whatever was tangled is looser now.',
                'Done. That is the quiet part handled.'],
        idle:  ['Nothing gets solved staring at it. Go and move.',
                'The walk is not a break from the work.'],
      },
    },
  };

  /* ── reminder copy ── */
  const REMINDER = {
    essayTitle: 'The Importance of a Morning Routine',
    essayBody:  'Morning is an important time of day because how you spend your ' +
                'morning can often tell you what kind of day you are going to have. ' +
                'It can change your outlook on life, filling you with a sense of ' +
                'possibility and motivation. Small, positive habits practiced daily ' +
                'can accumulate into significant personal growth and achievements ' +
                'over time.',
    vLabel:  'What compounds:',
    head:    '180 days from today',
    sub:     'Nothing moves in a week. Everything moves in a hundred and eighty.',
    foot:    'It does not arrive at once. It arrives daily.',
  };

  /* ═══════════════════════════════════════════
     ROUTINE BUILDER
     ═══════════════════════════════════════════ */

  const toMin  = (hhmm) => { const [h, m] = hhmm.split(':').map(Number); return h * 60 + m; };
  const toHHMM = (min)  => {
    const m = ((min % 1440) + 1440) % 1440;
    return String(Math.floor(m / 60)).padStart(2, '0') + ':' + String(m % 60).padStart(2, '0');
  };

  /**
   * Lay the day out around the anchors. Returns blocks sorted by start,
   * each with phase, title, intent and a key the habits anchor to.
   */
  function buildRoutine(profile) {
    const wake   = toMin(profile.wake);
    const wStart = toMin(profile.workStart);
    const wEnd   = toMin(profile.workEnd);
    let   sleep  = toMin(profile.sleep);
    if (sleep <= wEnd) sleep += 1440;             // sleep after midnight

    let workout = toMin(profile.workout);
    if (workout < wake) workout = wake;

    const blocks = [];
    const push = (key, phase, start, end, title, intent) => {
      if (end - start < 10) return;                // don't render slivers
      blocks.push({ key, phase, start, end, title, intent });
    };

    const morningWorkout = workout < wStart;
    let deepPlaced = false;

    if (morningWorkout) {
      /* Wake → out the door. Short on purpose. */
      push('rise', 'Rise', wake, Math.min(workout, wake + 40),
           'Rise',
           'Light, water, out the door. Nothing on the phone yet.');

      const trainEnd = Math.min(workout + WORKOUT_LEN, wStart);
      push('train', 'Train', workout, trainEnd,
           'Workout',
           'The first hour, already spent. Nothing later gets a vote on it.');

      /* Trading takes whatever clear air is left before work. */
      if (wStart - trainEnd >= 50) {
        push('deep', 'Trading', trainEnd, wStart,
             'Trading',
             'The plan, not the feeling. One screen, nothing else open.');
        deepPlaced = true;
      }
    } else {
      /* Workout is later in the day, so the morning is the clear air. */
      const riseEnd = Math.min(wake + 45, wStart);
      push('rise', 'Rise', wake, riseEnd,
           'Rise',
           'Light, water, no phone. Slow start, on purpose.');

      if (wStart - riseEnd >= 50) {
        push('deep', 'Trading', riseEnd, wStart,
             'Trading',
             'The plan, not the feeling. One screen, nothing else open.');
        deepPlaced = true;
      }
    }

    /* Work, split by a genuine reset at the midpoint. */
    const mid = Math.round((wStart + wEnd) / 2);
    push('work',  'Work', wStart, mid, 'Work', 'Committed hours.');
    push('reset', 'Work', mid, mid + 40,
         'Reset',
         'Eat away from the desk. Nothing productive.');
    push('work2', 'Work', mid + 40, wEnd, 'Work', 'Second half — finish the loop.');

    /* After work. */
    let cursor = wEnd + 15;
    const windStart = sleep - 75;

    if (!morningWorkout) {
      const start = Math.max(workout, cursor);
      const end   = Math.min(start + WORKOUT_LEN, windStart);
      push('train', 'Train', start, end,
           'Workout',
           'Non-negotiable. Show up even on the bad days.');
      cursor = end;
    }

    /* The walk is where the thinking happens — it is not filler. */
    const walkEnd = Math.min(cursor + WALK_LEN, windStart);
    push('walk', 'Walk', cursor, walkEnd,
         'Walk & reflect',
         'Move, no headphones, no screen. Let the day sort itself out.');
    cursor = walkEnd;

    /* If the morning had no clear air, trading lands here rather than
       vanishing from the day altogether. */
    if (!deepPlaced) {
      const deepEnd = Math.min(cursor + 60, windStart);
      push('deep', 'Trading', cursor, deepEnd,
           'Trading',
           'No clear air this morning — so it happens tonight, before anything else.');
      cursor = deepEnd;
    }

    push('evening', 'Evening', cursor, windStart,
         'Fuel & people',
         'Eat properly. Be present with whoever is in the room.');

    push('wind', 'Wind down', windStart, sleep,
         'Wind down',
         'Screens off, read, write down tomorrow\'s one thing.');

    return blocks.sort((a, b) => a.start - b.start);
  }

  return { DOMAINS, PROFILE, HABITS, GOALS, REMINDER, REWARD, COUNSEL, buildRoutine, toMin, toHHMM };
})();
