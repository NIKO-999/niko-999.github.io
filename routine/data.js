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

  /* ── the four domains ── */
  const DOMAINS = {
    mind:    { label: 'Mind',    color: 'var(--mind)' },
    money:   { label: 'Money',   color: 'var(--money)' },
    body:    { label: 'Body',    color: 'var(--body)' },
    meaning: { label: 'Meaning', color: 'var(--meaning)' },
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

  /* ── reminder copy ── */
  const REMINDER = {
    essayTitle: 'Whoever owns your first hour owns your day',
    essayBody:  'Reach for the phone first and the day belongs to whoever is ' +
                'loudest. Light, water, out the door — before anything is allowed ' +
                'to ask you for something. The hour itself is not the point. The ' +
                'point is proving, early and on the record, that you still do what ' +
                'you said you would. Everything after runs easier from a promise ' +
                'already kept.',
    vLabel:  'The long game:',
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

  return { DOMAINS, PROFILE, HABITS, GOALS, REMINDER, buildRoutine, toMin, toHHMM };
})();
