/**
 * ═══════════════════════════════════════════════════════════════════════════
 *  ASTRONOMICAL TIME — wall clock → instant → Julian Ephemeris Day
 * ═══════════════════════════════════════════════════════════════════════════
 *  A birth time is a local wall-clock reading. Turning it into the instant an
 *  ephemeris wants takes two conversions, and both have a quiet way of being
 *  wrong:
 *
 *  1. LOCAL → UTC needs the zone's offset AT THAT MOMENT, including historical
 *     rules. The browser already ships tzdata, so no library and no geocoding
 *     is needed — but the offset must be RECONSTRUCTED from formatToParts, not
 *     parsed from a 'longOffset' string, which rounds to whole minutes. Real
 *     sub-minute offsets exist: Amsterdam ran at +00:19:32 until 1937. Losing
 *     19½ minutes moves the Moon by about a fifth of a Gene Keys line.
 *
 *     Two clock readings a year are not a single instant (the autumn fold) and
 *     one is no instant at all (the spring gap). Resolving by iteration alone
 *     returns a plausible, silently wrong answer in both. So every candidate is
 *     formatted BACK and kept only if it reproduces the wall clock asked for.
 *
 *  2. UTC → TT. Ephemeris series are in Terrestrial Time; civil time is UT, and
 *     the gap ΔT is ~69 s today. The Moon moves 0.55″/s, so that is ~38″ —
 *     around 1% of a line. Invisible in casual testing, wrong at boundaries.
 *
 *  API:
 *    DAstroTime.tzOffsetMs(tz, instantMs)   -> ms east of UTC, exact
 *    DAstroTime.localToInstant(parts)       -> { ms, offsetMs, status }
 *                                              status: ok | ambiguous | nonexistent
 *    DAstroTime.deltaTSeconds(year)         -> TT − UT
 *    DAstroTime.jdFromMs(ms)                -> Julian Day (UT)
 *    DAstroTime.jdeFromMs(ms)               -> Julian Ephemeris Day (TT)
 *    DAstroTime.zoneList()                  -> IANA zone names
 *    DAstroTime.VALID / .FAILURES
 * ═══════════════════════════════════════════════════════════════════════════
 */

(function (root) {
  'use strict';

  const DAY = 86400000;

  /* ── zone offsets ─────────────────────────────────────────────────────── */

  const FMT = Object.create(null);
  function fmt(tz) {
    if (!FMT[tz]) {
      FMT[tz] = new Intl.DateTimeFormat('en-US', {
        timeZone: tz, hourCycle: 'h23',
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', second: '2-digit',
      });
    }
    return FMT[tz];
  }

  // What the clock in `tz` reads at `instantMs`, as a UTC-stamped wall time.
  function wallOf(tz, instantMs) {
    const p = Object.create(null);
    for (const part of fmt(tz).formatToParts(instantMs)) p[part.type] = part.value;
    return Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour % 24, +p.minute, +p.second);
  }

  // Offset east of UTC, to the second. Reconstructed, never string-parsed.
  function tzOffsetMs(tz, instantMs) {
    return wallOf(tz, instantMs) - instantMs;
  }

  /**
   * Resolve a local wall-clock reading to a UTC instant.
   *
   * Two candidates are generated (one per plausible offset) and each is
   * verified by formatting it back. Survivors decide the outcome:
   *   2 → the clock ran twice (DST fold). Take the earlier, and say so.
   *   1 → unambiguous.
   *   0 → the clock never read this (spring-forward gap). Land on the instant
   *       the clock jumped to, and say so.
   */
  function localToInstant(o) {
    const tz = o.tz;
    const wall = Date.UTC(o.y, o.mo - 1, o.d, o.h || 0, o.mi || 0, o.s || 0);
    // Probe the offset a day either side of the reading. Any transition is
    // bracketed by that window, so this yields BOTH plausible offsets — where
    // iterating from the wall time alone converges on one of them and can
    // never see the other, which silently turns a fold into a single answer.
    const t1 = wall - tzOffsetMs(tz, wall - DAY);
    const t2 = wall - tzOffsetMs(tz, wall + DAY);

    const seen = [], ok = [];
    for (const t of [t1, t2]) {
      if (seen.indexOf(t) !== -1) continue;
      seen.push(t);
      if (wallOf(tz, t) === wall) ok.push(t);
    }
    if (ok.length === 1) return { ms: ok[0], offsetMs: tzOffsetMs(tz, ok[0]), status: 'ok' };
    if (ok.length > 1) {
      const ms = Math.min.apply(null, ok);
      return { ms, offsetMs: tzOffsetMs(tz, ms), status: 'ambiguous' };
    }
    // Nothing round-trips: the wall time falls inside a gap. Applying the
    // PRE-transition offset lands after the jump — 02:30 in a spring-forward
    // gap resolves to 03:30, shifted forward by the gap's own width. That is
    // the conventional resolution; the other candidate would shift backwards.
    const ms = Math.max(t1, t2);
    return { ms, offsetMs: tzOffsetMs(tz, ms), status: 'nonexistent' };
  }

  /* ── ΔT ───────────────────────────────────────────────────────────────── */

  // Espenak & Meeus piecewise fit. Good to a second or two across the range
  // this app accepts, which is ~0.001° of Moon — far inside any threshold.
  function deltaTSeconds(year) {
    const y = year;
    let t;
    if (y < 1900) { const u = (y - 1820) / 100; return -20 + 32 * u * u; }
    if (y < 1920) { t = y - 1900; return -2.79 + t * (1.494119 + t * (-0.0598939 + t * (0.0061966 + t * -0.000197))); }
    if (y < 1941) { t = y - 1920; return 21.20 + t * (0.84493 + t * (-0.076100 + t * 0.0020936)); }
    if (y < 1961) { t = y - 1950; return 29.07 + 0.407 * t - t * t / 233 + t * t * t / 2547; }
    if (y < 1986) { t = y - 1975; return 45.45 + 1.067 * t - t * t / 260 - t * t * t / 718; }
    if (y < 2005) {
      t = y - 2000;
      return 63.86 + t * (0.3345 + t * (-0.060374 + t * (0.0017275 + t * (0.000651814 + t * 0.00002373599))));
    }
    if (y < 2050) { t = y - 2000; return 62.92 + t * (0.32217 + t * 0.005589); }
    if (y < 2150) { const u = (y - 1820) / 100; return -20 + 32 * u * u - 0.5628 * (2150 - y); }
    const u = (y - 1820) / 100;
    return -20 + 32 * u * u;
  }

  const jdFromMs = ms => ms / DAY + 2440587.5;

  function jdeFromMs(ms) {
    const d = new Date(ms);
    const yr = d.getUTCFullYear() + (d.getUTCMonth() + 0.5) / 12;
    return jdFromMs(ms + deltaTSeconds(yr) * 1000);
  }

  /* ── zone list ────────────────────────────────────────────────────────── */

  function zoneList() {
    if (typeof Intl.supportedValuesOf === 'function') {
      try { return Intl.supportedValuesOf('timeZone'); } catch (e) { /* fall through */ }
    }
    return FALLBACK_ZONES.slice();
  }

  // Only used where Intl.supportedValuesOf is missing (older Safari/Firefox).
  // Deliberately short: the common zones plus every distinct offset shape, so
  // an affected browser is usable rather than complete.
  const FALLBACK_ZONES = [
    'UTC', 'Europe/London', 'Europe/Dublin', 'Europe/Lisbon', 'Europe/Madrid',
    'Europe/Paris', 'Europe/Brussels', 'Europe/Amsterdam', 'Europe/Berlin',
    'Europe/Zurich', 'Europe/Rome', 'Europe/Vienna', 'Europe/Prague',
    'Europe/Warsaw', 'Europe/Stockholm', 'Europe/Oslo', 'Europe/Copenhagen',
    'Europe/Helsinki', 'Europe/Athens', 'Europe/Bucharest', 'Europe/Kyiv',
    'Europe/Moscow', 'Europe/Istanbul', 'Atlantic/Reykjavik',
    'Africa/Casablanca', 'Africa/Lagos', 'Africa/Cairo', 'Africa/Nairobi',
    'Africa/Johannesburg', 'Africa/Accra', 'Africa/Monrovia',
    'America/St_Johns', 'America/Halifax', 'America/New_York',
    'America/Toronto', 'America/Chicago', 'America/Mexico_City',
    'America/Denver', 'America/Phoenix', 'America/Los_Angeles',
    'America/Vancouver', 'America/Anchorage', 'Pacific/Honolulu',
    'America/Bogota', 'America/Lima', 'America/Santiago',
    'America/Sao_Paulo', 'America/Argentina/Buenos_Aires', 'America/Caracas',
    'Asia/Jerusalem', 'Asia/Beirut', 'Asia/Baghdad', 'Asia/Tehran',
    'Asia/Dubai', 'Asia/Karachi', 'Asia/Kolkata', 'Asia/Kathmandu',
    'Asia/Dhaka', 'Asia/Yangon', 'Asia/Bangkok', 'Asia/Jakarta',
    'Asia/Singapore', 'Asia/Hong_Kong', 'Asia/Shanghai', 'Asia/Taipei',
    'Asia/Manila', 'Asia/Seoul', 'Asia/Tokyo',
    'Australia/Perth', 'Australia/Darwin', 'Australia/Adelaide',
    'Australia/Brisbane', 'Australia/Sydney', 'Australia/Lord_Howe',
    'Pacific/Auckland', 'Pacific/Chatham', 'Pacific/Fiji',
  ];

  /* ── validation ───────────────────────────────────────────────────────────
     Fixtures with independently known answers, each chosen for a specific way
     this code can be wrong. They assert at load in the style of
     js/hexagrams.js: a failure disables the feature, it never throws.        */

  const M = 60000;
  const FIXTURES = [
    // Sub-minute offset — the fixture that fails if offsets are parsed from a
    // 'longOffset' string instead of reconstructed, since that rounds to whole
    // minutes. (Monrovia, not Amsterdam: some ICU builds trim pre-1970 LMT
    // rules entirely, so an Amsterdam-1930 fixture would test the platform's
    // data rather than this code. See NOTE on pre-1970 precision below.)
    { t: 'seconds',  i: { y: 1970, mo: 1, d: 1, h: 12, mi: 0, tz: 'Africa/Monrovia' },  off: -(44 * M + 30000), st: 'ok' },
    // half- and quarter-hour zones. Chatham in JULY: January is southern
    // summer and the zone is on DST at +12:45+1.
    { t: 'half',     i: { y: 2020, mo: 6, d: 1, h: 12, mi: 0, tz: 'Asia/Kolkata' },     off: 330 * M, st: 'ok' },
    { t: 'quarter',  i: { y: 2024, mo: 7, d: 1, h: 12, mi: 0, tz: 'Pacific/Chatham' },  off: 765 * M, st: 'ok' },
    { t: 'quarterD', i: { y: 2024, mo: 1, d: 1, h: 12, mi: 0, tz: 'Pacific/Chatham' },  off: 825 * M, st: 'ok' },
    { t: 'nepal',    i: { y: 1990, mo: 6, d: 15, h: 14, mi: 30, tz: 'Asia/Kathmandu' }, off: 345 * M, st: 'ok' },
    // DST edges — fail if candidates are not round-trip verified
    // ms is pinned as well as status: the gap must shift FORWARD to 03:30 EDT
    // and the fold must take the EARLIER of its two readings.
    { t: 'gap',      i: { y: 2024, mo: 3, d: 10, h: 2, mi: 30, tz: 'America/New_York' }, st: 'nonexistent', ms: Date.UTC(2024, 2, 10, 7, 30), off: -4 * 60 * M },
    { t: 'fold',     i: { y: 2024, mo: 11, d: 3, h: 1, mi: 30, tz: 'America/New_York' }, st: 'ambiguous', ms: Date.UTC(2024, 10, 3, 5, 30), off: -4 * 60 * M },
    // southern hemisphere, 30-minute DST step
    { t: 'lordhowe', i: { y: 2024, mo: 7, d: 1, h: 12, mi: 0, tz: 'Australia/Lord_Howe' }, off: 630 * M, st: 'ok' },
    // ordinary summer/winter
    { t: 'bst',      i: { y: 1990, mo: 6, d: 15, h: 14, mi: 30, tz: 'Europe/London' },   off: 60 * M, st: 'ok' },
    { t: 'gmt',      i: { y: 1990, mo: 1, d: 15, h: 14, mi: 30, tz: 'Europe/London' },   off: 0, st: 'ok' },
  ];

  const FAILURES = [];
  FIXTURES.forEach(f => {
    let r;
    try { r = localToInstant(f.i); } catch (e) { FAILURES.push(f.t + ':threw'); return; }
    if (r.status !== f.st) FAILURES.push(f.t + ':status=' + r.status);
    else if (f.off !== undefined && r.offsetMs !== f.off) FAILURES.push(f.t + ':offset=' + r.offsetMs);
    else if (f.ms !== undefined && r.ms !== f.ms) FAILURES.push(f.t + ':ms=' + new Date(r.ms).toISOString());
  });

  // ΔT anchors: measured values, not predictions.
  if (Math.abs(deltaTSeconds(2000) - 63.86) > 0.5) FAILURES.push('deltaT:2000');
  if (Math.abs(deltaTSeconds(1900) + 2.79) > 1.0) FAILURES.push('deltaT:1900');
  if (Math.abs(deltaTSeconds(1970) - 40.2) > 3.0) FAILURES.push('deltaT:1970');
  // J2000.0 is 2000-01-01 12:00 TT, i.e. JDE 2451545.0 exactly
  if (Math.abs(jdFromMs(Date.UTC(2000, 0, 1, 12)) - 2451545.0) > 1e-9) FAILURES.push('jd:j2000');

  /* NOTE on pre-1970 precision. Zone offsets come from the platform's own
     tzdata via Intl, and several ICU builds ship pre-1970 rules simplified to
     whole hours — Europe/Amsterdam reports +00:00 for 1930 here rather than
     its true +00:19:32. Nothing in this file can recover data the platform
     does not carry, so a very early birth may be off by up to ~30 minutes of
     clock time (~16' of Moon, under a fifth of a line). The reconstruction
     path itself is exact and is proven by the Monrovia fixture, which does
     carry seconds. */

  const api = {
    tzOffsetMs, localToInstant, deltaTSeconds, jdFromMs, jdeFromMs, zoneList,
    FIXTURES, FAILURES, VALID: FAILURES.length === 0,
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.DAstroTime = api;
})(typeof window !== 'undefined' ? window : globalThis);
