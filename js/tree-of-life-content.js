/**
 * ═══════════════════════════════════════════════════════════════════════════
 *  TREE OF LIFE — STRUCTURAL DATA  (Kabbalistic Tree · Golden Dawn paths)
 * ═══════════════════════════════════════════════════════════════════════════
 *  Pure data for the Tree of Life overlay: the ten sephiroth with normalized
 *  layout coordinates (viewBox 0 0 100 130, pillars at x = 25 / 50 / 75) and
 *  the 22 paths with their Golden Dawn Hebrew-letter and Major-Arcana
 *  attributions.
 *
 *  NUMBERING NOTE (load-bearing): this app's ARCANA_NAMES uses the Marseille
 *  scheme — 8 = Justice, 11 = Strength, 22 = The Fool, 21 = The World. The
 *  Golden Dawn attributes CARDS to paths (Teth = Strength, Lamed = Justice),
 *  so path 19 carries app arcana 11 and path 22 carries app arcana 8; every
 *  other path follows plain trump order, with The Fool (app 22) on path 11.
 *  Each app arcana 1–22 appears on exactly one path.
 *
 *  API:
 *    DTreeContent.get() -> { SEPHIROTH, PATHS }
 *      SEPHIROTH: [{ key, name, title, x, y } × 10]
 *      PATHS:     [{ gdNum, from, to, hebrew, letterName, arcana } × 22]
 *                 from/to reference sephira keys; arcana is the APP number.
 * ═══════════════════════════════════════════════════════════════════════════
 */

window.DTreeContent = (function () {
  'use strict';

  const SEPHIROTH = [
    { key: 'kether',    name: 'Kether',    title: 'Crown',         x: 50, y: 8   },
    { key: 'chokmah',   name: 'Chokmah',   title: 'Wisdom',        x: 75, y: 22  },
    { key: 'binah',     name: 'Binah',     title: 'Understanding', x: 25, y: 22  },
    { key: 'chesed',    name: 'Chesed',    title: 'Mercy',         x: 75, y: 48  },
    { key: 'geburah',   name: 'Geburah',   title: 'Severity',      x: 25, y: 48  },
    { key: 'tiphareth', name: 'Tiphareth', title: 'Beauty',        x: 50, y: 62  },
    { key: 'netzach',   name: 'Netzach',   title: 'Victory',       x: 75, y: 88  },
    { key: 'hod',       name: 'Hod',       title: 'Splendour',     x: 25, y: 88  },
    { key: 'yesod',     name: 'Yesod',     title: 'Foundation',    x: 50, y: 102 },
    { key: 'malkuth',   name: 'Malkuth',   title: 'Kingdom',       x: 50, y: 122 },
  ];

  const PATHS = [
    { gdNum: 11, from: 'kether',    to: 'chokmah',   hebrew: 'א', letterName: 'Aleph',  arcana: 22 },
    { gdNum: 12, from: 'kether',    to: 'binah',     hebrew: 'ב', letterName: 'Beth',   arcana: 1  },
    { gdNum: 13, from: 'kether',    to: 'tiphareth', hebrew: 'ג', letterName: 'Gimel',  arcana: 2  },
    { gdNum: 14, from: 'chokmah',   to: 'binah',     hebrew: 'ד', letterName: 'Daleth', arcana: 3  },
    { gdNum: 15, from: 'chokmah',   to: 'tiphareth', hebrew: 'ה', letterName: 'Heh',    arcana: 4  },
    { gdNum: 16, from: 'chokmah',   to: 'chesed',    hebrew: 'ו', letterName: 'Vav',    arcana: 5  },
    { gdNum: 17, from: 'binah',     to: 'tiphareth', hebrew: 'ז', letterName: 'Zayin',  arcana: 6  },
    { gdNum: 18, from: 'binah',     to: 'geburah',   hebrew: 'ח', letterName: 'Cheth',  arcana: 7  },
    { gdNum: 19, from: 'chesed',    to: 'geburah',   hebrew: 'ט', letterName: 'Teth',   arcana: 11 },
    { gdNum: 20, from: 'chesed',    to: 'tiphareth', hebrew: 'י', letterName: 'Yod',    arcana: 9  },
    { gdNum: 21, from: 'chesed',    to: 'netzach',   hebrew: 'כ', letterName: 'Kaph',   arcana: 10 },
    { gdNum: 22, from: 'geburah',   to: 'tiphareth', hebrew: 'ל', letterName: 'Lamed',  arcana: 8  },
    { gdNum: 23, from: 'geburah',   to: 'hod',       hebrew: 'מ', letterName: 'Mem',    arcana: 12 },
    { gdNum: 24, from: 'tiphareth', to: 'netzach',   hebrew: 'נ', letterName: 'Nun',    arcana: 13 },
    { gdNum: 25, from: 'tiphareth', to: 'yesod',     hebrew: 'ס', letterName: 'Samekh', arcana: 14 },
    { gdNum: 26, from: 'tiphareth', to: 'hod',       hebrew: 'ע', letterName: 'Ayin',   arcana: 15 },
    { gdNum: 27, from: 'netzach',   to: 'hod',       hebrew: 'פ', letterName: 'Peh',    arcana: 16 },
    { gdNum: 28, from: 'netzach',   to: 'yesod',     hebrew: 'צ', letterName: 'Tzaddi', arcana: 17 },
    { gdNum: 29, from: 'netzach',   to: 'malkuth',   hebrew: 'ק', letterName: 'Qoph',   arcana: 18 },
    { gdNum: 30, from: 'hod',       to: 'yesod',     hebrew: 'ר', letterName: 'Resh',   arcana: 19 },
    { gdNum: 31, from: 'hod',       to: 'malkuth',   hebrew: 'ש', letterName: 'Shin',   arcana: 20 },
    { gdNum: 32, from: 'yesod',     to: 'malkuth',   hebrew: 'ת', letterName: 'Tav',    arcana: 21 },
  ];

  return { get: () => ({ SEPHIROTH, PATHS }) };
})();
