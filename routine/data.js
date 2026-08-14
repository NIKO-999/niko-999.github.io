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

  /* ── starting profile ──
     The morning is fixed and the shift is not, so they are stored
     differently. Wake, gym and sleep are one value each; work is a
     per-weekday window because a shift pattern is not a single time. */
  const PROFILE = {
    name:    'Niko',
    wake:    '05:45',
    workout: '06:30',
    sleep:   '22:45',
    /* Indexed by Date.getDay() — 0 is Sunday. `null` means no shift that
       day, and the day builds open around the fixed anchors instead. */
    week: {
      0: { start: '11:00', end: '17:00' },
      1: { start: '13:00', end: '21:00' },
      2: null,                              // occasional extra shift — set when it happens
      3: null,                              // the open day
      4: { start: '12:00', end: '22:00' },
      5: { start: '10:00', end: '18:00' },
      6: { start: '10:00', end: '18:00' },
    },
  };

  const WORKOUT_LEN = 60;
  const WALK_LEN    = 45;
  const READ_LEN    = 30;

  /* Today's shift, or null on an open day. */
  const shiftFor = (profile, weekday) =>
    (profile.week && profile.week[weekday]) || null;

  /* ── habits: the non-negotiables ──
     `anchor` ties a habit to a block, so completing the block keeps the
     habit. A habit with no anchor still counts and still earns — it just
     isn't pinned to a time, which is the honest way to carry one that
     moves around. `needle` marks the ones that move the needle most. */
  const HABITS = [
    { id: 'h-train', name: 'Gym',           domain: 'body',    anchor: 'train', needle: true  },
    { id: 'h-walk',  name: 'Walk',          domain: 'meaning', anchor: 'walk',  needle: false },
    { id: 'h-read',  name: 'Read 30 min',   domain: 'mind',    anchor: 'read',  needle: false },
    { id: 'h-trade', name: 'Trading',       domain: 'money',   anchor: null,    needle: true  },
  ];

  /* ── goals: one per domain, six-month horizon ── */
  const GOALS = [
    { id: 'g-1', domain: 'body', name: 'Train before the shift can take it',
      why: 'The gym happens before the day is anyone else\'s. Nothing later gets to negotiate with it.',
      needle: true,  habits: ['h-train'] },
    { id: 'g-2', domain: 'money', name: 'Trade the plan, not the feeling',
      why: 'The hours move around. The process does not.',
      needle: true,  habits: ['h-trade'] },
    { id: 'g-3', domain: 'meaning', name: 'Walk it off and think straight',
      why: 'The thinking happens while moving, away from a screen.',
      needle: false, habits: ['h-walk'] },
    { id: 'g-4', domain: 'mind', name: 'Read every day, however the shift lands',
      why: 'Thirty minutes after work beats scrolling into sleep.',
      needle: false, habits: ['h-read'] },
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
        next:  ['Coming up. Eat, hydrate, and stop negotiating with it.',
                'Next. Lay the kit out now so there is nothing to decide later.'],
        missed:['That one went by. It does not roll over.',
                'Missed. Tomorrow is the same hour, same ask.'],
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
        next:  ['Coming up. Leave the phone in another room for it.',
                'Next. Thirty minutes, however long the shift felt.'],
        missed:['Gone by unread. A long shift is a reason, not an excuse.',
                'Missed. It was thirty minutes.'],
        now:   ['Thirty minutes, off the phone. That is the whole ask.',
                'The shift is over. This part is yours.'],
        cold:  ['{n} days without reading. Long shifts, and nothing put back.',
                'The mind has been running unattended for {n} days.'],
        streak:['{n} days read, around every shift. That is the impressive part.',
                '{n} in a row. The hours moved, this did not.'],
        late:  ['The day is nearly gone and the book has not been opened.',
                'Scrolling into sleep is a decision too. Make a better one.'],
        done:  ['Read. Nothing left to carry into tomorrow.',
                'Done, after everything else the day asked for.'],
        idle:  ['Reading is not the point. Thinking afterwards is.',
                'Thirty minutes is small enough that no shift excuses it.'],
      },
      money: {
        next:  ['Coming up. Know your invalidation before the first candle.',
                'Next. Write the plan before you open the chart.'],
        missed:['Skipped. Not a loss, but not nothing either.',
                'Gone by. The screen was open, the plan was not.'],
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
        next:  ['Coming up. Leave the headphones behind for it.',
                'Next. No destination needed, just out the door.'],
        missed:['No walk today. The noise stays where it was.',
                'Gone by. It was the cheapest thing on the list.'],
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
  function buildRoutine(profile, weekday) {
    const wake  = toMin(profile.wake);
    let   sleep = toMin(profile.sleep);
    if (sleep <= wake) sleep += 1440;             // sleep after midnight

    const workout  = Math.max(toMin(profile.workout), wake);
    const trainEnd = workout + WORKOUT_LEN;
    const walkEnd  = trainEnd + WALK_LEN;

    const shift = shiftFor(profile, weekday);
    const wStart = shift ? toMin(shift.start) : null;
    let   wEnd   = shift ? toMin(shift.end)   : null;
    if (shift && wEnd <= wStart) wEnd += 1440;    // a shift running past midnight

    const blocks = [];
    const push = (key, phase, start, end, title, intent) => {
      if (end - start < 10) return;                // don't render slivers
      blocks.push({ key, phase, start, end, title, intent });
    };

    /* The morning is the same every day — that is the whole point of it.
       It runs before any shift, however late the shift starts. */
    push('rise', 'Rise', wake, Math.min(workout, wake + 45),
         'Rise',
         'Light, water, out the door. Nothing on the phone yet.');

    push('train', 'Train', workout, trainEnd,
         'Gym',
         'Before the day belongs to anyone else.');

    push('walk', 'Walk', trainEnd, walkEnd,
         'Walk',
         'Straight off the back of the gym. No headphones, no screen.');

    /* Reading is "after work, sometime" — so it is placed against the end
       of the shift rather than at a fixed hour, and moves with it. */
    let cursor = walkEnd;
    let after;                 // when the day's committed hours are done

    if (shift) {
      /* Whatever sits between the walk and the shift is genuinely open. */
      push('open', 'Open', cursor, wStart,
           'Open',
           'Yours until the shift. Trading fits here on most days.');

      /* Work, split by a real break at the midpoint. */
      const mid = Math.round((wStart + wEnd) / 2);
      push('work',  'Work', wStart, mid, 'Work', 'Committed hours.');
      push('reset', 'Work', mid, mid + 30,
           'Break',
           'Eat properly. Off your feet.');
      push('work2', 'Work', mid + 30, wEnd, 'Work', 'Second half — finish the loop.');

      after = wEnd + 20;
    } else {
      /* No shift. The long middle of the day is the point of it — this is
         the day there is actually room to move something. */
      after = sleep - 195;
      push('open', 'Open', cursor, after,
           'Open',
           'No shift today. This is the day something can actually move.');
    }

    /* Reading sits against the end of the day rather than at a fixed hour,
       so "after work, sometime" holds however the shift landed. On a late
       finish it compresses rather than disappearing — a 22:00 Thursday is
       real, and the day should show that instead of inventing an evening. */
    let windStart = sleep - 45;
    let readAt = Math.max(after, windStart - READ_LEN);
    if (readAt + READ_LEN > windStart) windStart = Math.min(readAt + READ_LEN, sleep - 15);
    const readEnd = Math.min(readAt + READ_LEN, windStart);

    /* Whatever is left between clocking off and reading. Skipped outright
       on a late finish rather than rendered as a token ten minutes. */
    if (readAt - after >= 30) {
      push('evening', 'Evening', after, readAt,
           'Evening',
           'Eat properly. Be present with whoever is in the room.');
    }

    push('read', 'Read', readAt, readEnd,
         'Read',
         shift ? 'Thirty minutes, off the phone. However the shift landed.'
               : 'Thirty minutes, off the phone. No excuse today of all days.');

    push('wind', 'Wind down', windStart, sleep,
         'Wind down',
         'Screens off. Nothing left to carry into tomorrow.');

    return blocks.sort((a, b) => a.start - b.start);
  }

  return { DOMAINS, PROFILE, HABITS, GOALS, REMINDER, REWARD, COUNSEL,
           buildRoutine, shiftFor, toMin, toHHMM };
})();
