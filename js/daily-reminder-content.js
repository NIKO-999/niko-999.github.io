'use strict';

/**
 * Destiny Matrix — Daily Reminder notification bodies
 * ────────────────────────────────────────────────────
 * Short (native-notification-length) Golden Standard-voice blurbs, one per
 * Personal Day number (1-9/11/22/33 — see DMEngine.personalDay()). Native
 * app only: js/native.js schedules one of these as a repeating local
 * notification body, recomputed each day from the on-device-stored DOB.
 *
 * API: DDailyReminderContent.get(n) -> string | null
 */
window.DDailyReminderContent = (function () {
  const days = {
    1: `A Personal Day 1 — good day to start something instead of waiting for the perfect moment.`,
    2: `A Personal Day 2 — patience and partnership carry more weight today than pushing solo.`,
    3: `A Personal Day 3 — say the thing, make the call, let something you're making be seen.`,
    4: `A Personal Day 4 — the unglamorous, structural work pays off more today than the flashy stuff.`,
    5: `A Personal Day 5 — expect the plan to shift. Today rewards flexibility over control.`,
    6: `A Personal Day 6 — attention wants to go toward home, family, or something you're responsible for.`,
    7: `A Personal Day 7 — a quieter day suits you. Reflection will tell you more than activity will.`,
    8: `A Personal Day 8 — today has real leverage in it, especially around money or authority.`,
    9: `A Personal Day 9 — good day to close a loop, let something go, or finish what's overdue.`,
    11: `A Personal Day 11 — your intuition is unusually loud today. Worth actually listening to it.`,
    22: `A Personal Day 22 — today can hold big-picture building, not just busywork.`,
    33: `A Personal Day 33 — what you offer someone else today may matter more than what you get done.`,
  };
  function get(n) { return days[n] || null; }
  return { get };
})();
