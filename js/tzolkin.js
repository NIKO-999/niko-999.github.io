/* =============================================================
   DTzolkin — Maya calendar mathematics
   =============================================================
   Pure math, no DOM. Shared by tzolkin.html.

   Correlation: GMT (Goodman–Martínez–Thompson), JDN 584283.
   This is the standard correlation and matches the unbroken
   260-day count still kept by K'iche' daykeepers in highland
   Guatemala. The "astronomical" variant (584285) is exposed as
   a constant for footnotes but is not used for readings.

   All conversions are date-based (the Tzolk'in is a day count,
   not a clock count). Dates are proleptic-Gregorian.

   API:
     DTzolkin.jdnFromISO('2002-05-08')      -> 2452403
     DTzolkin.isoFromJDN(2452403)           -> '2002-05-08'
     DTzolkin.fromISO('2002-05-08')         -> full reading object
     DTzolkin.fromJDN(jdn)                  -> same, from a JDN
     DTzolkin.kinOf(number, signIndex)      -> kin 1..260
     DTzolkin.DAY_SIGNS / TONES / HAAB_MONTHS
     DTzolkin.CORRELATION (584283), CORRELATION_ASTRO (584285)
     DTzolkin.VALID / FAILURES              -> self-test result

   Reading object fields:
     jdn, iso, kin (1..260),
     tone (1..13), signIndex (0..19), sign {yucatec,kiche,meaning},
     trecena {tone:1, signIndex, kin, iso}   — start of the 13-day wave
     haab {day, monthIndex, month}           — e.g. 8 Kumk'u = {8,17,...}
     longCount {baktun,katun,tun,uinal,kin,text}
     lordOfNight ('G1'..'G9')
     yearBearer {tone, signIndex} | null     — Tzolk'in day of 0 Pop
     calendarRound {jdn, iso}                — next same CR date (+18980 d)
   ============================================================= */
(function () {
  'use strict';

  var CORRELATION = 584283;        // GMT: Long Count 0.0.0.0.0 = JDN 584283 = 4 Ajaw 8 Kumk'u
  var CORRELATION_ASTRO = 584285;

  var DAY_SIGNS = [
    { yucatec: 'Imix',      kiche: "Imox",      meaning: 'Crocodile · primordial waters' },
    { yucatec: "Ik'",       kiche: "Iq'",       meaning: 'Wind · breath, spirit' },
    { yucatec: "Ak'b'al",   kiche: "Aq'ab'al",  meaning: 'Night · the dark house' },
    { yucatec: "K'an",      kiche: "K'at",      meaning: 'Seed · ripe maize' },
    { yucatec: 'Chikchan',  kiche: 'Kan',       meaning: 'Serpent · lifeforce' },
    { yucatec: 'Kimi',      kiche: 'Kame',      meaning: 'Death · transformation' },
    { yucatec: "Manik'",    kiche: 'Kej',       meaning: 'Deer · the healing hand' },
    { yucatec: 'Lamat',     kiche: "Q'anil",    meaning: 'Star · Venus, abundance' },
    { yucatec: 'Muluk',     kiche: 'Toj',       meaning: 'Water · offering' },
    { yucatec: 'Ok',        kiche: "Tz'i'",     meaning: 'Dog · loyalty, guidance' },
    { yucatec: 'Chuwen',    kiche: "B'atz'",    meaning: 'Monkey · the weaver of time' },
    { yucatec: 'Eb',        kiche: 'E',         meaning: 'Road · the journey' },
    { yucatec: "B'en",      kiche: 'Aj',        meaning: 'Reed · the pillar of the home' },
    { yucatec: 'Ix',        kiche: "I'x",       meaning: 'Jaguar · earth magic' },
    { yucatec: 'Men',       kiche: "Tz'ikin",   meaning: 'Eagle · vision' },
    { yucatec: 'Kib',       kiche: 'Ajmaq',     meaning: 'Vulture · ancestral pardon' },
    { yucatec: "Kab'an",    kiche: "No'j",      meaning: 'Earth · thought, movement' },
    { yucatec: "Etz'nab'",  kiche: 'Tijax',     meaning: 'Flint · the obsidian blade' },
    { yucatec: 'Kawak',     kiche: 'Kawoq',     meaning: 'Storm · the rain of renewal' },
    { yucatec: 'Ajaw',      kiche: 'Ajpu',      meaning: 'Lord · the Sun, the flower' }
  ];

  var HAAB_MONTHS = [
    'Pop', 'Wo', 'Sip', "Sotz'", 'Sek', 'Xul', "Yaxk'in", 'Mol', "Ch'en",
    'Yax', 'Sak', 'Keh', 'Mak', "K'ank'in", 'Muwan', 'Pax', "K'ayab'",
    "Kumk'u", "Wayeb'"
  ];

  var TONES = 13;

  function mod(n, m) { return ((n % m) + m) % m; }

  /* Gregorian (proleptic) -> JDN. Fliegel & Van Flandern. */
  function jdn(y, m, d) {
    var a = Math.floor((14 - m) / 12);
    var yy = y + 4800 - a;
    var mm = m + 12 * a - 3;
    return d + Math.floor((153 * mm + 2) / 5) + 365 * yy +
      Math.floor(yy / 4) - Math.floor(yy / 100) + Math.floor(yy / 400) - 32045;
  }

  function jdnFromISO(iso) {
    var p = String(iso).split('-').map(Number);
    return jdn(p[0], p[1], p[2]);
  }

  /* JDN -> Gregorian ISO. */
  function isoFromJDN(J) {
    var f = J + 1401 + Math.floor((Math.floor((4 * J + 274277) / 146097) * 3) / 4) - 38;
    var e = 4 * f + 3;
    var g = Math.floor(mod(e, 1461) / 4);
    var h = 5 * g + 2;
    var day = Math.floor(mod(h, 153) / 5) + 1;
    var month = mod(Math.floor(h / 153) + 2, 12) + 1;
    var year = Math.floor(e / 1461) - 4716 + Math.floor((14 - month) / 12);
    function pad(n, w) { n = String(Math.abs(n)); while (n.length < w) n = '0' + n; return n; }
    return (year < 0 ? '-' : '') + pad(year, 4) + '-' + pad(month, 2) + '-' + pad(day, 2);
  }

  /* Kin 1..260 from tone (1..13) and sign index (0..19).
     Kin 1 = 1 Imix; kin k has tone ((k-1) mod 13)+1, sign (k-1) mod 20. */
  function kinOf(tone, signIndex) {
    // solve k ≡ tone-1 (mod 13), k ≡ signIndex (mod 20), k in 0..259
    for (var k = signIndex; k < 260; k += 20) {
      if (mod(k, 13) === tone - 1) return k + 1;
    }
    return null;
  }

  function fromJDN(J) {
    var d = J - CORRELATION;              // days since 0.0.0.0.0 (= 4 Ajaw 8 Kumk'u)
    var signIndex = mod(19 + d, 20);      // day 0 is Ajaw (index 19)
    var tone = mod(3 + d, 13) + 1;        // day 0 is tone 4
    var kin = kinOf(tone, signIndex);

    // Haab: day 0 is 8 Kumk'u => haab position 348 of the 365-day year
    // (17 months * 20 + 8 = 348).
    var haabPos = mod(d + 348, 365);
    var haabMonth = Math.floor(haabPos / 20);
    var haabDay = mod(haabPos, 20);

    // Long Count
    var lc = null;
    if (d >= 0) {
      var r = d;
      var baktun = Math.floor(r / 144000); r -= baktun * 144000;
      var katun = Math.floor(r / 7200); r -= katun * 7200;
      var tun = Math.floor(r / 360); r -= tun * 360;
      var uinal = Math.floor(r / 20); r -= uinal * 20;
      lc = { baktun: baktun, katun: katun, tun: tun, uinal: uinal, kin: r,
             text: baktun + '.' + katun + '.' + tun + '.' + uinal + '.' + r };
    }

    // Lord of the Night: day 0.0.0.0.0 is G9.
    var lordOfNight = 'G' + (mod(d + 8, 9) + 1);

    // Trecena start: walk back to tone 1.
    var trecJ = J - (tone - 1);
    var trecSign = mod(19 + (trecJ - CORRELATION), 20);

    // Year Bearer: Tzolk'in day of the most recent 0 Pop (start of Haab year).
    var pop0 = J - haabPos;
    var ybD = pop0 - CORRELATION;
    var yearBearer = {
      tone: mod(3 + ybD, 13) + 1,
      signIndex: mod(19 + ybD, 20),
      iso: isoFromJDN(pop0)
    };

    return {
      jdn: J,
      iso: isoFromJDN(J),
      kin: kin,
      tone: tone,
      signIndex: signIndex,
      sign: DAY_SIGNS[signIndex],
      trecena: { tone: 1, signIndex: trecSign, kin: kinOf(1, trecSign), iso: isoFromJDN(trecJ), jdn: trecJ },
      haab: { day: haabDay, monthIndex: haabMonth, month: HAAB_MONTHS[haabMonth] },
      longCount: lc,
      lordOfNight: lordOfNight,
      yearBearer: yearBearer,
      calendarRound: { jdn: J + 18980, iso: isoFromJDN(J + 18980) }
    };
  }

  function fromISO(iso) { return fromJDN(jdnFromISO(iso)); }

  /* ---------------- self-test ---------------- */
  var FAILURES = [];
  function check(label, got, want) {
    if (got !== want) FAILURES.push(label + ': got ' + got + ', want ' + want);
  }
  (function selfTest() {
    // Epoch: 0.0.0.0.0 = 4 Ajaw 8 Kumk'u
    var e = fromJDN(CORRELATION);
    check('epoch tone', e.tone, 4);
    check('epoch sign', e.sign.yucatec, 'Ajaw');
    check('epoch haab', e.haab.day + ' ' + e.haab.month, "8 Kumk'u");
    check('epoch LC', e.longCount.text, '0.0.0.0.0');
    check('epoch G', e.lordOfNight, 'G9');

    // 2012-12-21 = 13.0.0.0.0 = 4 Ajaw 3 K'ank'in
    var b = fromISO('2012-12-21');
    check('2012 LC', b.longCount.text, '13.0.0.0.0');
    check('2012 tone', b.tone, 4);
    check('2012 sign', b.sign.yucatec, 'Ajaw');
    check('2012 haab', b.haab.day + ' ' + b.haab.month, "3 K'ank'in");

    // JDN round trips
    check('jdn 2000-01-01', jdnFromISO('2000-01-01'), 2451545);
    check('iso roundtrip', isoFromJDN(2452403), '2002-05-08');

    // User anchor: 2002-05-08 = 11 Ajaw, kin 180
    var u = fromISO('2002-05-08');
    check('2002 tone', u.tone, 11);
    check('2002 sign', u.sign.yucatec, 'Ajaw');
    check('2002 kin', u.kin, 180);

    // kin arithmetic: 1 Imix = kin 1, 4 Ajaw = kin 160, 13 Ajaw = kin 260
    check('kin 1 Imix', kinOf(1, 0), 1);
    check('kin 4 Ajaw', kinOf(4, 19), 160);
    check('kin 13 Ajaw', kinOf(13, 19), 260);
  })();

  window.DTzolkin = {
    CORRELATION: CORRELATION,
    CORRELATION_ASTRO: CORRELATION_ASTRO,
    DAY_SIGNS: DAY_SIGNS,
    HAAB_MONTHS: HAAB_MONTHS,
    TONES: TONES,
    jdnFromISO: jdnFromISO,
    isoFromJDN: isoFromJDN,
    kinOf: kinOf,
    fromJDN: fromJDN,
    fromISO: fromISO,
    VALID: FAILURES.length === 0,
    FAILURES: FAILURES
  };
})();
