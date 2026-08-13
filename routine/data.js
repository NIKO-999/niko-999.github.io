'use strict';

/**
 * RITUAL — default content + routine generation
 * ──────────────────────────────────────────────
 * Nothing personal is stored in this file. It holds the *shape* of a day
 * and neutral starting copy. Your real times, goals and history live in
 * localStorage on your own device (see app.js → STORE).
 *
 * buildRoutine(profile) is the actual routine builder: it takes four
 * anchors — wake, work start, work end, sleep — and lays the day out
 * around them, so the routine bends to your schedule instead of you
 * bending to a template.
 */

window.RITUAL_DATA = (function () {

  /* ── the four domains (image 5) ── */
  const DOMAINS = {
    mentally:    { label: 'Mentally',    color: 'var(--mentally)' },
    financially: { label: 'Financially', color: 'var(--financially)' },
    physically:  { label: 'Physically',  color: 'var(--physically)' },
    spiritually: { label: 'Spiritually', color: 'var(--spiritually)' },
  };

  /* ── starting profile — placeholder until setup is run ── */
  const PROFILE = {
    name:      'Niko',
    wake:      '05:30',
    workStart: '09:00',
    workEnd:   '17:30',
    sleep:     '22:00',
  };

  /* ── habits: the non-negotiables ──
     `anchor` ties a habit to a block so the timeline can show what
     each block is actually for. `needle` marks the ones that move
     the needle most — those get weighted in the day score. */
  const HABITS = [
    { id: 'h-sun',   name: 'Sunlight + water',   domain: 'physically',  anchor: 'rise',  needle: false },
    { id: 'h-still', name: 'Stillness / prayer', domain: 'spiritually', anchor: 'rise',  needle: true  },
    { id: 'h-deep',  name: 'Deep work block',    domain: 'financially', anchor: 'deep',  needle: true  },
    { id: 'h-train', name: 'Train',              domain: 'physically',  anchor: 'train', needle: true  },
    { id: 'h-read',  name: 'Read 20 min',        domain: 'mentally',    anchor: 'wind',  needle: false },
    { id: 'h-plan',  name: 'Plan tomorrow',      domain: 'mentally',    anchor: 'wind',  needle: true  },
  ];

  /* ── goals: one per domain, six-month horizon ── */
  const GOALS = [
    { id: 'g-1', domain: 'spiritually', name: 'A settled mind before the day starts',
      why: 'Everything else is downstream of how the first hour goes.',
      needle: true,  habits: ['h-still', 'h-sun'] },
    { id: 'g-2', domain: 'financially', name: 'Ship the work that compounds',
      why: 'One protected deep block a day, before the world gets a vote.',
      needle: true,  habits: ['h-deep'] },
    { id: 'g-3', domain: 'physically', name: 'Train without negotiating',
      why: 'The body sets the ceiling for everything else.',
      needle: true,  habits: ['h-train'] },
    { id: 'g-4', domain: 'mentally', name: 'Close the day on purpose',
      why: 'Reading and a plan beat scrolling into sleep.',
      needle: false, habits: ['h-read', 'h-plan'] },
  ];

  /* ── reminder copy (images 4 & 5) ── */
  const REMINDER = {
    essayTitle: 'The Importance of a Morning Routine',
    essayBody:  'Morning is an important time of day because how you spend your ' +
                'morning can often tell you what kind of day you are going to have. ' +
                'It can change your outlook on life, filling you with a sense of ' +
                'possibility and motivation. Small, positive habits practiced daily ' +
                'can accumulate into significant personal growth and achievements over time.',
    vLabel:  'Daily reminder:',
    head:    'Six months from now',
    sub:     'You can be in a completely different space',
    foot:    'Keep working and believe in yourself',
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
   * Lay the day out around the four anchors.
   * Returns blocks sorted by start, each with phase, title, intent and
   * the habit ids that belong to it.
   */
  function buildRoutine(profile) {
    const wake  = toMin(profile.wake);
    const wStart = toMin(profile.workStart);
    const wEnd   = toMin(profile.workEnd);
    let   sleep  = toMin(profile.sleep);
    if (sleep <= wEnd) sleep += 1440;          // sleep after midnight

    const blocks = [];
    const push = (key, phase, start, end, title, intent) => {
      if (end - start < 10) return;             // don't render slivers
      blocks.push({ key, phase, start, end, title, intent });
    };

    /* 1 — Rise. First 45 minutes belong to you, not to a screen. */
    const riseEnd = Math.min(wake + 45, wStart);
    push('rise', 'Rise', wake, riseEnd,
         'Rise & ritual',
         'Light, water, stillness. No phone until this is done.');

    /* 2 — Deep work, if there's real room before work starts.
           This is the block that moves the needle, so it gets the
           freshest hours available. If the morning is too tight it
           does NOT get dropped — it moves to the evening below. */
    const deepInMorning = (wStart - riseEnd) >= 50;
    if (deepInMorning) {
      push('deep', 'Deep work', riseEnd, wStart,
           'Deep work',
           'One thing that compounds. Phone in another room.');
    }

    /* 3 — Work, split by a genuine reset at the midpoint. */
    const mid = Math.round((wStart + wEnd) / 2);
    push('work', 'Work', wStart, mid, 'Work', 'Committed hours.');
    push('reset', 'Work', mid, mid + 40,
         'Reset',
         'Eat away from the desk. Walk. Nothing productive.');
    push('work2', 'Work', mid + 40, wEnd, 'Work', 'Second half — finish the loop.');

    /* 4 — Train, straight after work while momentum is still up. */
    push('train', 'Train', wEnd + 15, wEnd + 90,
         'Train',
         'Non-negotiable. Show up even on the bad days.');

    /* 5 — Evening. If the morning had no room for deep work, it lands
           here rather than disappearing from the day altogether. */
    const windStart = sleep - 75;
    let eveningStart = wEnd + 90;

    if (!deepInMorning) {
      const deepEnd = Math.min(eveningStart + 60, windStart);
      push('deep', 'Deep work', eveningStart, deepEnd,
           'Deep work',
           'No room this morning — so it happens tonight, before anything else.');
      eveningStart = deepEnd;
    }

    push('evening', 'Evening', eveningStart, windStart,
         'Fuel & people',
         'Eat properly. Be present with whoever is in the room.');

    /* 6 — Wind down. Last 75 minutes set up tomorrow morning. */
    push('wind', 'Wind down', windStart, sleep,
         'Wind down',
         'Screens off, read, write down tomorrow\'s one thing.');

    return blocks.sort((a, b) => a.start - b.start);
  }

  return { DOMAINS, PROFILE, HABITS, GOALS, REMINDER, buildRoutine, toMin, toHHMM };
})();
