/* ==========================================================================
   4H Candle Profiling — Study Archive
   A small hash-routed app over CONTENT (js/data.js).
   Views: home (card grid) · lesson · approach · sessions · glossary · sources
   No quizzes, no games.
   ========================================================================== */
(function () {
  'use strict';

  var C = window.CONTENT;
  if (!C) { console.error('CONTENT missing'); return; }

  var IS_MAC = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);
  var $  = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  /* ----------------------------------------------------------------------
     ICONS
     ---------------------------------------------------------------------- */
  var I = {
    home:    '<path d="M4 10.5 12 4l8 6.5V20h-5v-5H9v5H4z"/>',
    compass: '<circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2 5-5 2 2-5z"/>',
    clock:   '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    layers:  '<path d="m12 3 8 4.5-8 4.5-8-4.5z"/><path d="m4 12 8 4.5 8-4.5"/><path d="m4 16.5 8 4.5 8-4.5"/>',
    candle:  '<rect x="5" y="8" width="5" height="8" rx="1"/><path d="M7.5 4v4M7.5 16v4"/><rect x="14" y="6" width="5" height="11" rx="1"/><path d="M16.5 3v3M16.5 17v4"/>',
    book:    '<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H19v15H6.5A2.5 2.5 0 0 0 4 20.5z"/><path d="M4 5.5v15"/>',
    grid:    '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
    tag:     '<path d="M12.6 3H21v8.4L11.4 21 3 12.6z"/><circle cx="17" cy="7" r="1.3"/>',
    search:  '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
    doc:     '<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4"/>',
    shield:  '<path d="M12 3 5 6v6c0 4.5 3 7.5 7 9 4-1.5 7-4.5 7-9V6z"/>',
    print:   '<path d="M7 9V3h10v6"/><rect x="4" y="9" width="16" height="8" rx="2"/><path d="M7 15h10v6H7z"/>',
    back:    '<path d="M19 12H5"/><path d="m11 6-6 6 6 6"/>',
    next:    '<path d="M5 12h14"/><path d="m13 6 6 6-6 6"/>',
    expand:  '<path d="M9 3H3v6"/><path d="M15 21h6v-6"/><path d="M3 3l7 7"/><path d="M21 21l-7-7"/>',
    check:   '<path d="M20 6 9 17l-5-5"/>',
    chev:    '<path d="m6 9 6 6 6-6"/>',
    alert:   '<path d="M12 4 2.5 20h19z"/><path d="M12 10v4"/><path d="M12 17.4h0"/>',
    link:    '<path d="M10 13a5 5 0 0 0 7 0l2-2a5 5 0 0 0-7-7l-1 1"/><path d="M14 11a5 5 0 0 0-7 0l-2 2a5 5 0 0 0 7 7l1-1"/>'
  };
  function icon(n, cls) {
    return '<svg class="ic ' + (cls || '') + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
           'stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (I[n] || '') + '</svg>';
  }

  /* ----------------------------------------------------------------------
     DERIVED DATA
     ---------------------------------------------------------------------- */
  var WAYS = ['teal', 'amber', 'violet', 'blue', 'rose', 'green'];

  /* category is derived from the lesson, so the card tags mean something
     rather than repeating the module name on every card */
  var CATS = [
    [/continuation/i,                    'Continuation', 'amber'],
    [/reversal/i,                        'Reversal',     'teal'],
    [/entr(y|ies)/i,                     'Entry',        'blue'],
    [/smt|divergence/i,                  'Confirmation', 'violet'],
    [/swing|protected|failure/i,         'Structure',    'rose'],
    [/session|candle|range|daily profile/i, 'Session',   'green'],
    [/direction|top-down|bias|profil/i,  'Bias',         'violet'],
    [/hrlr|lrlr|liquidity/i,             'Liquidity',    'rose']
  ];
  function categorise(L) {
    var hay = L.title + ' ' + (L.rules || []).join(' ');
    for (var i = 0; i < CATS.length; i++) if (CATS[i][0].test(hay)) return CATS[i];
    return [null, 'Framework', 'teal'];
  }

  var WAY_FOR = {
    Reversal: 'teal', Continuation: 'amber', Entry: 'blue', Structure: 'violet',
    Session: 'green', Confirmation: 'rose', Liquidity: 'rose', Bias: 'violet', Framework: 'teal'
  };
  var ALL = [], BY_ID = {};
  (C.modules || []).forEach(function (M, mi) {
    (M.lessons || []).forEach(function (L, li) {
      L._module = M;
      var cat = categorise(L);
      L._cat = L.cat || cat[1];
      L._way = WAY_FOR[L._cat] || cat[2];
      L._thumb = L.plate ? L.plate.replace('.png', '-thumb.png')
                          : 'assets/art-' + L.id + '.png';
      var f = L.excerpt || (L.reading && L.reading[0]) || '';
      L._excerpt = f.length > 175 ? f.slice(0, 175).replace(/\s+\S*$/, '') + '…' : f;
      L._hay = [L.number, L.title, L.source, L.cat, L._excerpt,
                (L.rules || []).join(' '), (L.reading || []).join(' '),
                (L.approach || []).join(' '), (L.watchouts || []).join(' '),
                (L.notes || []).join(' '), L.plateCaption || ''
               ].join(' ').toLowerCase()
               .replace(/(^|[^\d:])(\d{1,2})\s*am\b/g, '$1$2:00 am')
               .replace(/(^|[^\d])0(\d):00/g, '$1$2:00');
      L._i = ALL.length;
      ALL.push(L);
      BY_ID[L.id] = L;
    });
  });
  function plateMode() {
    try { return localStorage.getItem('plateMode') || 'dark'; } catch (e) { return 'dark'; }
  }
  function setPlateMode(m) { try { localStorage.setItem('plateMode', m); } catch (e) {} }

  var CATCOUNT = {};
  ALL.forEach(function (L) { CATCOUNT[L._cat] = (CATCOUNT[L._cat] || 0) + 1; });
  var STATS = {
    lessons: ALL.length,
    plates: ALL.filter(function (L) { return L.plate; }).length,
    rules: ALL.reduce(function (n, L) { return n + (L.rules || []).length; }, 0),
    terms: (C.glossary || []).length
  };

  /* ----------------------------------------------------------------------
     PIECES
     ---------------------------------------------------------------------- */
  function cardHTML(L) {
    var M = L._module;
    var h = [];
    h.push('<a class="card way-' + L._way + '" href="#/l/' + esc(L.id) + '" data-kind="card" ' +
           'data-module="' + esc(M.moduleId) + '" data-cat="' + esc(L._cat) + '" data-plate="' + (L.plate ? '1' : '0') + '">');
    h.push('<div class="card-art">');
    if (L._thumb) h.push('<img class="card-img" src="' + esc(L._thumb) + '" alt="" loading="lazy" decoding="async">');
    h.push('<span class="card-wash"></span>');
    h.push('<span class="card-icon">' + icon(L.plate ? 'candle' : 'book') + '</span>');
    h.push('<span class="card-tag">' + icon('tag') + esc(L._cat) + '</span>');
    h.push('</div>');
    h.push('<div class="card-body">');
    h.push('<div class="card-meta"><span class="card-num">' + esc(L.number) + '</span>' + esc(L.source || '') + '</div>');
    h.push('<h3>' + esc(L.title) + '</h3>');
    h.push('<p>' + esc(L._excerpt) + '</p>');
    h.push('</div>');
    h.push('<div class="card-foot"><span class="card-link">Open lesson' + icon('next') + '</span><span class="pills">');
    if (L.rules) h.push('<span class="pill">' + L.rules.length + ' rules</span>');
    if (L.plate) h.push('<span class="pill pill-on">Plate</span>');
    h.push('</span></div></a>');
    return h.join('');
  }

  /* link the first occurrence of each glossary term, once per lesson render */
  var GTERMS = (C.glossary || []).slice().sort(function (a, b) { return b.term.length - a.term.length; });
  function gloss(html, used) {
    GTERMS.forEach(function (t) {
      if (used[t.term]) return;
      var word = t.term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      var re = new RegExp('(^|[\\s(\u2014\u2013\\-])(' + word + ')(?=[\\s.,;:)\u2014\u2013?]|$)', 'i');
      if (!re.test(html)) return;
      used[t.term] = 1;
      html = html.replace(re, function (m, pre, hit) {
        return pre + '<a class="gl-link" href="#/glossary" title="' + esc(t.full ? t.full + ' — ' + t.def : t.def) + '">' + hit + '</a>';
      });
    });
    return html;
  }

  function banner(kind, label, inner) {
    return '<section class="banner banner-' + kind + '"><div class="banner-bar"></div><div class="banner-body">' +
           (label ? '<h2 class="banner-lead">' + esc(label) + '</h2>' : '') +
           inner + '</div></section>';
  }

  /* ----------------------------------------------------------------------
     VIEW: home
     ---------------------------------------------------------------------- */
  function viewHome() {
    var h = [];

    h.push('<header class="hero" id="top"><div class="hero-art"></div><div class="hero-veil"></div>');
    h.push('<div class="hero-inner"><div class="wrap">');
    h.push('<div class="eyebrow"><span class="dot"></span>Three source documents · indices</div>');
    h.push('<h1>4H Candle Profiling <em>the mechanical way to read price action</em></h1>');
    h.push('<p class="hero-lede">Every rule, diagram and explanation from the three source documents, in one place. ' +
           'Each lesson gives you the rule set first, the diagram second, and the full reading beneath it.</p>' +
           '<p class="hero-route">New to this? Read <a href="#/l/fractal-thought-process">III.1</a> and ' +
           '<a href="#/l/daily-range-structure">III.2</a> for the idea, <a href="#/l/asia-reversal-pattern">III.3</a>–' +
           '<a href="#/l/ny-reversal-patterns">III.5</a> for the three day-shapes, then ' +
           '<a href="#/l/entry-ideas-cisd-and-orderblocks">III.6</a> and <a href="#/l/smt-divergence">I.4</a> for the ' +
           'entry and the one condition that vetoes it. Modules I and II are the same framework in more depth.</p>');
    h.push('<div class="hero-meta">' +
      '<span><b>' + STATS.lessons + '</b> Lessons</span>' +
      '<span><b>' + STATS.plates + '</b> Plates</span>' +
      '<span><b>' + STATS.rules + '</b> Rules</span>' +
      '<span><b>' + STATS.terms + '</b> Glossary terms</span></div>');
    h.push('</div></div></header>');

    /* quick tiles */
    h.push('<div class="wrap"><div class="tiles">');
    [['#/approach', 'compass', C.approach ? C.approach.title : 'How to approach it', (C.approach ? C.approach.steps.length : 0) + ' steps, in order'],
     ['#/sessions', 'clock', C.sessions ? C.sessions.title : 'Session clock', 'Which 4H candle does what'],
     ['#/glossary', 'book', 'Glossary', STATS.terms + ' terms defined'],
     ['#/invalidations', 'alert', 'Invalidations', 'Everything that kills a read, in one place'],
     ['#/l/fractal-thought-process', 'candle', 'Start here', 'The five-lesson path through the idea']
    ].forEach(function (t) {
      h.push('<a class="tile" href="' + t[0] + '"><span class="tile-ic">' + icon(t[1]) + '</span>' +
             '<b>' + esc(t[2]) + '</b><span>' + esc(t[3]) + '</span>' + icon('next', 'tile-go') + '</a>');
    });
    h.push('</div>');

    /* toolbar */
    var withPlates = ALL.filter(function (L) { return L._thumb; });
    h.push('<div class="index-head"><div><h2>All lessons <span class="n">(' + ALL.length + ')</span></h2>' +
           '<p>Pick a pattern to open it. Every card is a lesson.</p></div>' +
           '<div class="stack-wrap"><span class="stack-label">Diagram plates</span><span class="stack">' +
           withPlates.slice(0, 5).map(function (L) {
             return '<img src="' + esc(L._thumb) + '" alt="" loading="lazy">'; }).join('') +
           '<span class="stack-more">+' + (withPlates.length - 5) + '</span></span></div></div>');
    h.push('<div class="toolbar">');
    h.push('<div class="field">' + icon('search') +
           '<input id="q" type="search" placeholder="Search every rule, reading and caution…" autocomplete="off" aria-label="Search lessons">' +
           '<span class="keys">' + (IS_MAC ? '<kbd>\u2318</kbd>' : '<kbd>Ctrl</kbd>') + '<kbd>K</kbd></span></div>');
    h.push('<div class="segmented" role="tablist" aria-label="Filter lessons">');
    h.push('<button class="seg is-on" data-filter="all" role="tab" aria-selected="true">All <span class="n">' + ALL.length + '</span></button>');
    (C.modules || []).forEach(function (M) {
      h.push('<button class="seg" data-filter="' + esc(M.moduleId) + '" role="tab" aria-selected="false">' +
             'Module ' + esc(M.numeral) + ' <span class="n">' + M.lessons.length + '</span></button>');
    });
    h.push('<button class="seg" data-filter="plate" role="tab" aria-selected="false">With plates <span class="n">' + STATS.plates + '</span></button>');
    h.push('</div></div>');
    h.push('<div class="cats">');
    Object.keys(CATCOUNT).sort().forEach(function (c) {
      h.push('<button class="cat" data-cat="' + esc(c) + '">' + esc(c) + '<span class="n">' + CATCOUNT[c] + '</span></button>');
    });
    h.push('</div>');

    /* grid grouped by module */
    (C.modules || []).forEach(function (M) {
      h.push('<div class="group" data-group="' + esc(M.moduleId) + '">');
      var mp = M.lessons.filter(function (L) { return L.plate; }).length;
      var mr = M.lessons.reduce(function (n, L) { return n + (L.rules || []).length; }, 0);
      h.push('<div class="group-head"><h2>' + esc(M.title) + ' <span class="n">(' + M.lessons.length + ')</span></h2>' +
             '<span class="group-meta">Module ' + esc(M.numeral) + ' · ' + mr + ' rules · ' + mp + ' plates</span></div>' +
             (M.subtitle ? '<p class="group-sub">' + esc(M.subtitle) + '</p>' : ''));
      h.push('<div class="cards">');
      M.lessons.forEach(function (L) { h.push(cardHTML(L)); });
      h.push('</div></div>');
    });
    h.push('<p class="no-results is-hidden" id="no-results">Nothing matches that search.</p>');
    h.push('</div>');
    return h.join('');
  }

  /* ----------------------------------------------------------------------
     VIEW: lesson
     ---------------------------------------------------------------------- */
  function viewLesson(id) {
    var L = BY_ID[id];
    if (!L) return viewMissing();
    var M = L._module;
    var prev = ALL[L._i - 1], next = ALL[L._i + 1];
    var GU = {};
    var h = [];

    h.push('<div class="wrap lesson-view way-' + L._way + '">');

    h.push('<div class="crumbs"><a href="#/">All lessons</a><span>/</span>' +
           '<a href="#/m/' + esc(M.moduleId) + '">' + esc(M.title) + '</a><span>/</span><b>' + esc(L.number) + '</b></div>');

    h.push('<header class="lesson-head">');
    h.push('<div class="lesson-tags"><span class="tag tag-num">' + esc(L.number) + '</span>');
    if (L.source) h.push('<span class="tag">' + icon('doc') + esc(L.source) + '</span>');
    if (L.rules) h.push('<span class="tag">' + L.rules.length + ' rules</span>');
    if (L.plate) h.push('<span class="tag tag-plate">' + icon('grid') + 'Plate</span>');
    h.push('</div><h1>' + esc(L.title) + '</h1></header>');

    /* 1 — RULE SET, above the plate */
    if (L.rules && L.rules.length) {
      h.push('<section class="ruleset"><h2 class="panel-label"><span class="dot"></span>Rule set' +
             '<span class="count">' + L.rules.length + '</span></h2><ol>');
      L.rules.forEach(function (r) { h.push('<li>' + gloss(esc(r), GU) + '</li>'); });
      h.push('</ol></section>');
    }

    /* 2 — PLATE */
    if (L.plate) {
      h.push('<div class="plate-bar"><h2 class="plate-bar-label">' + icon('grid') + 'Diagram</h2>' +
             '<label class="toggle"><span class="lab lab-light' + (plateMode() === 'dark' ? '' : ' is-on') + '">Original</span>' +
             '<input type="checkbox" id="plate-mode"' + (plateMode() === 'dark' ? ' checked' : '') +
             ' aria-label="Show the diagram in dark mode">' +
             '<span class="track"><span class="knob"></span></span>' +
             '<span class="lab lab-dark' + (plateMode() === 'dark' ? ' is-on' : '') + '">Dark</span></label></div>');
      h.push('<figure class="plate"><div class="plate-frame" role="button" tabindex="0" ' +
             'data-full="' + esc(L.plate) + '" data-cap="' + esc(L.plateCaption || L.title) + '" ' +
             'aria-label="Enlarge plate">' +
             '<img id="plate-img" src="' + esc(plateMode() === 'dark' ? L.plate : L.plate.replace('.png', '-light.png')) +
             '" data-dark="' + esc(L.plate) + '" data-light="' + esc(L.plate.replace('.png', '-light.png')) +
             '" alt="' + esc(L.plateCaption || L.title) + '" loading="lazy" decoding="async">' +
             '<span class="plate-zoom">' + icon('expand') + 'Enlarge</span></div>');
      if (L.plateCaption) h.push('<figcaption class="plate-caption"><span class="pl">Plate</span><span>' + esc(L.plateCaption) + '</span></figcaption>');
      h.push('</figure>');
    }

    /* 3 — READING, below the plate */
    if (L.reading && L.reading.length) {
      h.push('<div class="reading">');
      L.reading.forEach(function (p) { h.push('<p>' + gloss(esc(p), GU) + '</p>'); });
      h.push('</div>');
    }

    /* archive notes — the source's silences, kept out of the rule set */
    if (L.notes && L.notes.length) {
      h.push(banner('note', 'Archive note',
        L.notes.map(function (x) { return '<p>' + esc(x) + '</p>'; }).join('')));
    }

    /* 4 — APPROACH */
    if (L.approach && L.approach.length) {
      h.push(banner('info', 'How to approach it',
        '<ol class="num-list">' + L.approach.map(function (a) { return '<li>' + esc(a) + '</li>'; }).join('') + '</ol>'));
    }
    /* 5 — WATCHOUTS */
    if (L.watchouts && L.watchouts.length) {
      h.push(banner('warn', 'What invalidates it',
        '<ul class="x-list">' + L.watchouts.map(function (w) { return '<li>' + esc(w) + '</li>'; }).join('') + '</ul>'));
    }

    /* also covered in */
    if (L.seeAlso && L.seeAlso.length) {
      var rel = L.seeAlso.map(function (id) { return BY_ID[id]; }).filter(Boolean);
      if (rel.length) {
        h.push('<div class="seealso"><span class="seealso-label">Also covered in</span>' +
          rel.map(function (r) {
            return '<a href="#/l/' + esc(r.id) + '"><b>' + esc(r.number) + '</b>' + esc(r.title) + '</a>';
          }).join('') + '</div>');
      }
    }

    /* position in the archive */
    var pct = Math.round((L._i + 1) / ALL.length * 100);
    h.push('<div class="posbar"><div class="posbar-top"><span>Lesson <b>' + (L._i + 1) + '</b> of ' + ALL.length + '</span>' +
           '<span class="posbar-pct">' + pct + '%</span></div>' +
           '<div class="posbar-track"><span style="width:' + pct + '%"></span></div></div>');

    /* prev / next */
    h.push('<nav class="pager">');
    h.push(prev ? '<a class="pg" href="#/l/' + esc(prev.id) + '">' + icon('back') +
      '<span><small>Previous</small>' + esc(prev.title) + '</span></a>' : '<span></span>');
    h.push(next ? '<a class="pg pg-next" href="#/l/' + esc(next.id) + '"><span><small>Next</small>' +
      esc(next.title) + '</span>' + icon('next') + '</a>' : '<span></span>');
    h.push('</nav>');

    h.push('</div>');
    return h.join('');
  }

  /* ----------------------------------------------------------------------
     VIEW: module (all cards for one module)
     ---------------------------------------------------------------------- */
  function viewModule(id) {
    var M = (C.modules || []).filter(function (m) { return m.moduleId === id; })[0];
    if (!M) return viewMissing();
    var h = [];
    h.push('<div class="wrap">');
    h.push('<div class="crumbs"><a href="#/">All lessons</a><span>/</span><b>' + esc(M.title) + '</b></div>');
    h.push('<header class="module-head"><div class="module-numeral">Module ' + esc(M.numeral) + '</div>');
    h.push('<h1>' + esc(M.title) + '</h1>');
    if (M.subtitle) h.push('<div class="module-sub">' + esc(M.subtitle) + '</div>');
    if (M.overview) h.push('<p class="module-overview">' + esc(M.overview) + '</p>');
    if (M.sourceLabel) h.push('<div class="module-source">' + icon('doc') + esc(M.sourceLabel) + '</div>');
    h.push('</header>');
    h.push('<div class="cards">');
    M.lessons.forEach(function (L) { h.push(cardHTML(L)); });
    h.push('</div></div>');
    return h.join('');
  }

  /* ----------------------------------------------------------------------
     VIEW: approach / sessions / glossary / sources
     ---------------------------------------------------------------------- */
  function viewApproach() {
    var A = C.approach; if (!A) return viewMissing();
    var h = ['<div class="wrap">'];
    h.push('<div class="crumbs"><a href="#/">All lessons</a><span>/</span><b>' + esc(A.title) + '</b></div>');
    h.push('<header class="page-head"><h1>' + esc(A.title) + '</h1>');
    if (A.intro) h.push('<p>' + esc(A.intro) + '</p>');
    h.push('</header><div class="steps">');
    (A.steps || []).forEach(function (s, i, arr) {
      h.push('<div class="step" data-kind="step">');
      h.push('<div class="step-rail"><div class="step-n">' + esc(s.n) + '</div>' +
             (i < arr.length - 1 ? '<div class="step-line"></div>' : '') + '</div>');
      h.push('<div class="step-body"><h2>' + esc(s.title) + '</h2>');
      if (s.body) h.push('<p>' + esc(s.body) + '</p>');
      if (s.checks && s.checks.length) {
        h.push('<ul class="checks">' + s.checks.map(function (c) {
          return '<li>' + esc(c) + '</li>'; }).join('') + '</ul>');
      }
      var sl = BY_ID[STEP_LESSON[i]];
      if (sl) h.push('<a class="row-link" href="#/l/' + esc(sl.id) + '">' + esc(sl.number) + ' · ' +
                     esc(sl.title) + icon('next') + '</a>');
      h.push('</div></div>');
    });
    h.push('</div></div>');
    return h.join('');
  }

  var ROW_LESSON = {
    'Asia open': 'asia-reversal-pattern', 'Asia late': 'asia-reversal-pattern',
    'London': 'london-reversal-pattern', 'NY morning': 'ny-reversal-patterns',
    'Late NY': 'ny-reversal-patterns'
  };
  var STEP_LESSON = ['top-down-analysis', 'protected-and-failure-swings',
    'daily-profile-and-the-six-4h-candles', 'overnight-and-london-reversals', 'smt-divergence',
    '4h-m15-entries', '4h-m15-entries', 'continuation-entries-4h-m15'];

  function viewSessions() {
    var S = C.sessions; if (!S) return viewMissing();
    var h = ['<div class="wrap">'];
    h.push('<div class="crumbs"><a href="#/">All lessons</a><span>/</span><b>' + esc(S.title) + '</b></div>');
    h.push('<header class="page-head"><h1>' + esc(S.title) + '</h1></header>');
    h.push(banner('note', null, '<p>' + esc(S.note) + '</p>'));
    h.push('<div class="table-scroll"><table><thead><tr>');
    (S.columns || []).forEach(function (c) { h.push('<th scope="col">' + esc(c) + '</th>'); });
    h.push('</tr></thead><tbody>');
    (S.rows || []).forEach(function (r) {
      var key = r.some(function (c) { return /\bkey\b/i.test(String(c)); });
      h.push('<tr' + (key ? ' class="key-row"' : '') + '>');
      var label = String(r[0]).replace(/\s*—\s*KEY/i, '').trim();
      r.forEach(function (cell, i) {
        var v = String(cell);
        if (i === 0) {
          h.push('<td>' + esc(label) + (key ? ' <span class="chip">Key</span>' : '') + '</td>');
        } else if (i === r.length - 1 && ROW_LESSON[label] && BY_ID[ROW_LESSON[label]]) {
          h.push('<td>' + esc(v) + '<a class="row-link" href="#/l/' + esc(ROW_LESSON[label]) + '">' +
                 'Read the lesson' + icon('next') + '</a></td>');
        } else h.push('<td>' + esc(v) + '</td>');
      });
      h.push('</tr>');
    });
    h.push('</tbody></table></div></div>');
    return h.join('');
  }

  function viewGlossary() {
    var G = C.glossary || [];
    var h = ['<div class="wrap">'];
    h.push('<div class="crumbs"><a href="#/">All lessons</a><span>/</span><b>Glossary</b></div>');
    h.push('<header class="page-head"><h1>Glossary <span class="n">(' + G.length + ')</span></h1>' +
           '<p>Every term the three documents lean on, defined the way this framework uses it.</p></header>');
    h.push('<div class="field field-wide">' + icon('search') +
           '<input id="gq" type="search" placeholder="Filter terms…" autocomplete="off" aria-label="Filter glossary"></div>');
    h.push('<div class="glossary">');
    G.slice().sort(function (a, b) { return a.term.localeCompare(b.term); }).forEach(function (t) {
      h.push('<div class="gl-item" data-kind="term"><div class="gl-term">' + esc(t.term) + '</div>');
      if (t.full) h.push('<div class="gl-full">' + esc(t.full) + '</div>');
      h.push('<div class="gl-def">' + esc(t.def) + '</div>');
      if (t.seen) h.push('<div class="gl-seen"><b>Where it matters</b>' + esc(t.seen) + '</div>');
      h.push('</div>');
    });
    h.push('</div></div>');
    return h.join('');
  }

  function viewSources() {
    var h = ['<div class="wrap">'];
    h.push('<div class="crumbs"><a href="#/">All lessons</a><span>/</span><b>Sources &amp; notice</b></div>');
    h.push('<header class="page-head"><h1>Sources &amp; notice</h1></header>');
    h.push(banner('note', 'Source documents',
      '<p>All content is extracted from three documents by Eleven_Trades:</p>' +
      '<p>Module <b>I</b> (cited as <b>V1</b>) · <em>Building a Trading Model/Strategy</em> — 16 pages<br>' +
      'Module <b>II</b> (cited as <b>V2</b>) · <em>Profiling 4H Candles, Part Two</em> — 15 pages<br>' +
      'Module <b>III</b> (cited as <b>V3</b>) · <em>4H Candle Profiling: The Mechanical Way to Read Price Action</em> — 10 pages</p>' +
      '<p>The V-number on every card and lesson header refers to these documents, so "V3 · p.4–5" means pages 4 to 5 of the third document.</p>' +
      '<p>Plates are rendered from those documents and remapped for dark viewing. The author credits ICT, MMXM Trader, ' +
      'TTrades, AM Trades, Sniper Trades and Garret for the underlying concepts and does not claim ownership of them.</p>'));
    h.push(banner('ok', 'Set to indices',
      '<p>The forex session windows the third document gives alongside the indices ones are not carried through the ' +
      'lessons. Recorded here once: forex key candles run 1:00–5:00 AM, 5:00–9:00 AM and 9:00 AM–1:00 PM; the Asia ' +
      'reversal is expected within the 17:00 or 21:00 candle; and where the indices 6:00 candle would handle the ' +
      'reversal, forex uses the 5:00–9:00 candle, falling through to the 9:00 AM candle if that fails. The source also ' +
      'attaches the 12:00 PM close specifically to forex days carrying 10:00 AM news, whereas for indices it states it ' +
      'as a plain preference.</p>'));
    h.push(banner('caution', 'Times are New York time',
      '<p>The source documents give clock times without ever naming a timezone, but the sessions they describe — the ' +
      '8:30 and 9:30 driver times, the 12:00 lunch, the NY open — only line up under New York time. That is the reading ' +
      'used throughout; it is an inference from context, not a statement the documents make.</p>'));
    h.push(banner('warn', 'What this is, and what it is not',
      '<p>This is a study reference — an organised restatement of what the source documents say, with the mechanisms ' +
      'explained. It is not financial advice, not a recommendation, and not a claim that this framework works. Any ' +
      'performance figure quoted here (such as the 8–12% win-rate improvement attributed to SMT divergence) is the ' +
      "original author's claim, reproduced as such, and has not been verified.</p>" +
      '<p>Where the source documents are ambiguous, silent, or internally inconsistent, this archive says so rather ' +
      'than papering over the gap.</p>'));
    h.push('</div>');
    return h.join('');
  }

  function footerHTML() {
    return '<div class="wrap"><footer class="site-foot">' +
      '<div>Compiled from three source documents by Eleven_Trades · plates rendered at 200 dpi from the ' +
      'original vector artwork. A study reference, not financial advice.</div>' +
      '<div class="foot-links"><a href="#/">All lessons</a><a href="#/approach">How to approach it</a>' +
      '<a href="#/sessions">Session clock</a><a href="#/glossary">Glossary</a>' +
      '<a href="#/sources">Sources &amp; notice</a><a href="../">← Back to site</a></div></footer></div>';
  }

  function viewInvalidations() {
    var total = ALL.reduce(function (n, L) { return n + (L.watchouts || []).length; }, 0);
    var h = ['<div class="wrap">'];
    h.push('<div class="crumbs"><a href="#/">All lessons</a><span>/</span><b>Invalidations</b></div>');
    h.push('<header class="page-head"><h1>Invalidations <span class="n">(' + total + ')</span></h1>' +
           '<p>Everything in the archive that kills a read or a trade, gathered from all ' + ALL.length +
           ' lessons. Each item links back to the lesson it belongs to.</p></header>');

    /* the standing prohibitions are the ones that apply to every setup, so they
       lead — pulled from their own lesson rather than restated */
    var gate = BY_ID['4h-m15-entries'];
    if (gate) {
      /* the absolutes, phrased several ways in the source: "Take no…",
         "There must be no…", "No X, no trade" */
      var hard = (gate.rules || []).filter(function (r) {
        return /^(take no|no |there must be no)\b/i.test(r.trim());
      });
      if (hard.length) {
        h.push(banner('warn', 'Standing prohibitions',
          '<p>These are stated as absolutes rather than preferences, and they apply to every setup in the ' +
          'framework, not only the lesson they appear in.</p>' +
          '<ul class="x-list">' + hard.map(function (r) { return '<li>' + esc(r) + '</li>'; }).join('') + '</ul>' +
          '<p class="src-note">From <a href="#/l/' + esc(gate.id) + '">' + esc(gate.number) + ' · ' +
          esc(gate.title) + '</a>.</p>'));
      }
    }

    h.push('<div class="field field-wide">' + icon('search') +
           '<input id="iq" type="search" placeholder="Filter invalidations…" autocomplete="off" ' +
           'aria-label="Filter invalidations"></div>');

    (C.modules || []).forEach(function (M) {
      var lessons = (M.lessons || []).filter(function (L) { return (L.watchouts || []).length; });
      if (!lessons.length) return;
      var n = lessons.reduce(function (a, L) { return a + L.watchouts.length; }, 0);
      h.push('<div class="inv-group"><div class="group-head"><h2>' + esc(M.title) +
             ' <span class="n">(' + n + ')</span></h2><span class="group-meta">Module ' + esc(M.numeral) + '</span></div>');
      lessons.forEach(function (L) {
        h.push('<section class="inv way-' + L._way + '" data-kind="inv">');
        h.push('<a class="inv-head" href="#/l/' + esc(L.id) + '"><span class="inv-num">' + esc(L.number) + '</span>' +
               '<span class="inv-title">' + esc(L.title) + '</span>' +
               '<span class="inv-count">' + L.watchouts.length + '</span>' + icon('next') + '</a>');
        h.push('<ul class="x-list">' + L.watchouts.map(function (w) {
          return '<li>' + esc(w) + '</li>'; }).join('') + '</ul>');
        h.push('</section>');
      });
      h.push('</div>');
    });
    h.push('<p class="no-results is-hidden" id="inv-empty">Nothing matches that filter.</p>');
    h.push('</div>');
    return h.join('');
  }

  function viewMissing() {
    return '<div class="wrap"><header class="page-head"><h1>Not found</h1>' +
           '<p>That page does not exist. <a href="#/">Back to all lessons</a>.</p></header></div>';
  }

  /* ----------------------------------------------------------------------
     CHROME: rail + sidebar
     ---------------------------------------------------------------------- */
  function buildChrome() {
    var rail = [
      { href: '#/', ic: 'home', label: 'All lessons' },
      { href: '#/approach', ic: 'compass', label: 'How to approach it' },
      { href: '#/sessions', ic: 'clock', label: 'Session clock' }
    ];
    (C.modules || []).forEach(function (M) {
      rail.push({ href: '#/m/' + M.moduleId, txt: M.numeral, label: 'Module ' + M.numeral + ' — ' + M.title });
    });
    rail.push({ href: '#/invalidations', ic: 'alert', label: 'Invalidations' });
    rail.push({ href: '#/glossary', ic: 'book', label: 'Glossary' });
    rail.push({ href: '#/sources', ic: 'shield', label: 'Sources & notice' });
    $('#rail').innerHTML = rail.map(function (r) {
      return '<a class="rail-btn" href="' + r.href + '" data-href="' + r.href + '" aria-label="' + esc(r.label) + '">' +
             (r.txt ? '<span class="rail-txt">' + esc(r.txt) + '</span>' : icon(r.ic)) +
             '<span class="rail-tip">' + esc(r.label) + '</span></a>';
    }).join('');

    var h = [];
    h.push('<div class="nav-group"><div class="nav-label">Overview</div>');
    h.push('<a class="nav-link" href="#/" data-href="#/">' + icon('home') + '<span>All lessons</span><span class="badge">' + ALL.length + '</span></a>');
    if (C.approach) h.push('<a class="nav-link" href="#/approach" data-href="#/approach">' + icon('compass') +
      '<span>' + esc(C.approach.title) + '</span><span class="badge">' + C.approach.steps.length + '</span></a>');
    if (C.sessions) h.push('<a class="nav-link" href="#/sessions" data-href="#/sessions">' + icon('clock') + '<span>Session clock</span></a>');
    h.push('<a class="nav-link" href="#/invalidations" data-href="#/invalidations">' + icon('alert') +
           '<span>Invalidations</span><span class="badge">' +
           ALL.reduce(function (n, L) { return n + (L.watchouts || []).length; }, 0) + '</span></a>');
    h.push('</div>');

    (C.modules || []).forEach(function (M) {
      h.push('<div class="nav-group"><div class="nav-label">Module ' + esc(M.numeral) + '</div>');
      h.push('<div class="nav-row">' +
             '<a class="nav-link nav-major" href="#/m/' + esc(M.moduleId) + '" data-href="#/m/' + esc(M.moduleId) + '">' +
             icon('layers') + '<span>' + esc(M.title) + '</span><span class="badge">' + M.lessons.length + '</span></a>' +
             '<button class="nav-toggle" data-mod="' + esc(M.moduleId) + '" aria-expanded="true" ' +
             'aria-label="Collapse ' + esc(M.title) + '">' + icon('chev') + '</button></div>');
      h.push('<div class="tree" data-tree="' + esc(M.moduleId) + '">');
      M.lessons.forEach(function (L) {
        h.push('<a class="nav-link tree-item" href="#/l/' + esc(L.id) + '" data-href="#/l/' + esc(L.id) + '">' +
               '<span class="n">' + esc(L.number) + '</span><span>' + esc(L.title) + '</span>' +
               (L.plate ? '<span class="dot-plate" title="Has a diagram plate" aria-label="Has a diagram plate"></span>' : '') + '</a>');
      });
      h.push('</div></div>');
    });

    h.push('<div class="nav-group"><div class="nav-label">Reference</div>');
    h.push('<a class="nav-link" href="#/glossary" data-href="#/glossary">' + icon('book') + '<span>Glossary</span><span class="badge">' + STATS.terms + '</span></a>');
    h.push('<a class="nav-link" href="#/sources" data-href="#/sources">' + icon('shield') + '<span>Sources &amp; notice</span></a>');
    h.push('</div>');

    h.push('<div class="side-card"><div class="side-card-txt"><b>' + ALL.length + ' lessons</b>' +
           '<span>' + STATS.rules + ' rules · ' + STATS.plates + ' plates · ' + STATS.terms + ' terms</span></div>' +
           '<button class="btn-side" id="print-btn">' + icon('print') + 'Save as PDF</button></div>');
    h.push('<a class="side-foot" href="#/sources">' + icon('shield') +
           '<span><b>Eleven_Trades</b>Three source documents</span>' + icon('next') + '</a>');

    $('#nav').innerHTML = h.join('');
    $('#print-btn').addEventListener('click', function () { window.print(); });

    /* collapsible module trees */
    function collapsed() {
      try { return JSON.parse(localStorage.getItem('collapsed') || '[]'); } catch (e) { return []; }
    }
    function setCollapsed(list) {
      try { localStorage.setItem('collapsed', JSON.stringify(list)); } catch (e) {}
    }
    var shut = collapsed();
    shut.forEach(function (id) {
      var t = $('.tree[data-tree="' + id + '"]');
      var b = $('.nav-toggle[data-mod="' + id + '"]');
      if (t) t.classList.add('is-shut');
      if (b) { b.classList.add('is-shut'); b.setAttribute('aria-expanded', 'false'); }
    });
    $$('.nav-toggle').forEach(function (b) {
      b.addEventListener('click', function (e) {
        e.preventDefault();
        var id = b.dataset.mod;
        var t = $('.tree[data-tree="' + id + '"]');
        var now = t.classList.toggle('is-shut');
        b.classList.toggle('is-shut', now);
        b.setAttribute('aria-expanded', now ? 'false' : 'true');
        var list = collapsed().filter(function (x) { return x !== id; });
        if (now) list.push(id);
        setCollapsed(list);
      });
    });
  }

  /* ----------------------------------------------------------------------
     ROUTER
     ---------------------------------------------------------------------- */
  var app = $('#app');

  function route() {
    var hash = location.hash.replace(/^#/, '') || '/';
    var parts = hash.split('/').filter(Boolean);
    var html, key = '#' + hash;

    if (!parts.length)                      { html = viewHome(); key = '#/'; }
    else if (parts[0] === 'l' && parts[1])  { html = viewLesson(decodeURIComponent(parts[1])); }
    else if (parts[0] === 'm' && parts[1])  { html = viewModule(decodeURIComponent(parts[1])); }
    else if (parts[0] === 'approach')       { html = viewApproach(); }
    else if (parts[0] === 'sessions')       { html = viewSessions(); }
    else if (parts[0] === 'glossary')       { html = viewGlossary(); }
    else if (parts[0] === 'sources')        { html = viewSources(); }
    else if (parts[0] === 'invalidations')  { html = viewInvalidations(); }
    else                                    { html = viewMissing(); }

    document.body.dataset.view =
      parts[0] === 'l' ? 'lesson' : (parts[0] || 'home');
    app.innerHTML = html + footerHTML();
    app.scrollTop = 0;
    window.scrollTo(0, 0);

    /* active states — a lesson also lights its module */
    var L = parts[0] === 'l' ? BY_ID[decodeURIComponent(parts[1] || '')] : null;
    var modKey = L ? '#/m/' + L._module.moduleId : key;
    $$('#nav .nav-link').forEach(function (a) { a.classList.toggle('is-active', a.dataset.href === key); });
    $$('.rail-btn').forEach(function (a) {
      a.classList.toggle('is-active', a.dataset.href === key || a.dataset.href === modKey);
    });
    if (L) {
      var pm2 = $('#nav .nav-link[data-href="#/m/' + L._module.moduleId + '"]');
      if (pm2) pm2.classList.add('is-parent');
      var t2 = $('.tree[data-tree="' + L._module.moduleId + '"]');
      var b2 = $('.nav-toggle[data-mod="' + L._module.moduleId + '"]');
      if (t2 && t2.classList.contains('is-shut')) {
        t2.classList.remove('is-shut');
        if (b2) { b2.classList.remove('is-shut'); b2.setAttribute('aria-expanded', 'true'); }
      }
      var act = $('#nav .nav-link.is-active');
      if (act && act.scrollIntoView) act.scrollIntoView({ block: 'nearest' });
    }

    if (parts[0] !== 'l' && parts[0] !== 'm' && parts.length) document.title = '4H Candle Profiling — ' + parts[0];
    else if (L) document.title = L.title + ' — 4H Candle Profiling';
    else document.title = '4H Candle Profiling — Study Archive';

    wireView();
    closeMenu();
  }

  /* ----------------------------------------------------------------------
     PER-VIEW WIRING
     ---------------------------------------------------------------------- */
  function wireView() {
    /* home: search + filters */
    var q = $('#q');
    if (q) {
      var cards = $$('[data-kind="card"]');
      var groups = $$('.group');
      var empty = $('#no-results');
      var filter = 'all', cat = null;
      cards.forEach(function (c) {
        var L = BY_ID[(c.getAttribute('href') || '').replace('#/l/', '')];
        c.dataset.text = L ? L._hay : c.textContent.toLowerCase();
      });

      var run = function () {
        var v = (q.value || '').trim().toLowerCase()
                  .replace(/(^|[^\d:])(\d{1,2})\s*am\b/g, '$1$2:00 am')
                  .replace(/(^|[^\d])0(\d):00/g, '$1$2:00');
        var hits = 0;
        cards.forEach(function (c) {
          var ok = (filter === 'all' ||
                    (filter === 'plate' ? c.dataset.plate === '1' : c.dataset.module === filter)) &&
                   (!cat || c.dataset.cat === cat) &&
                   (!v || c.dataset.text.indexOf(v) !== -1);
          c.classList.toggle('is-hidden', !ok);
          if (ok) hits++;
        });
        groups.forEach(function (g) {
          g.classList.toggle('is-hidden', !$$('[data-kind="card"]', g).some(function (k) {
            return !k.classList.contains('is-hidden'); }));
        });
        empty.classList.toggle('is-hidden', hits > 0);
      };
      var t; q.addEventListener('input', function () { clearTimeout(t); t = setTimeout(run, 100); });
      $$('.seg').forEach(function (b) {
        b.addEventListener('click', function () {
          $$('.seg').forEach(function (x) { x.classList.remove('is-on'); x.setAttribute('aria-selected', 'false'); });
          b.classList.add('is-on'); b.setAttribute('aria-selected', 'true');
          filter = b.dataset.filter; run();
        });
      });
      $$('.cat').forEach(function (b) {
        b.addEventListener('click', function () {
          var on = b.classList.contains('is-on');
          $$('.cat').forEach(function (x) { x.classList.remove('is-on'); });
          if (on) { cat = null; } else { b.classList.add('is-on'); cat = b.dataset.cat; }
          run();
        });
      });
    }

    /* plate light/dark toggle */
    var pm = document.getElementById('plate-mode');
    if (pm) {
      pm.addEventListener('change', function () {
        var img = document.getElementById('plate-img');
        var mode = pm.checked ? 'dark' : 'light';
        setPlateMode(mode);
        if (img) img.src = mode === 'dark' ? img.dataset.dark : img.dataset.light;
        var f = img && img.closest('.plate-frame');
        if (f) f.dataset.full = mode === 'dark' ? img.dataset.dark : img.dataset.light;
        var ld = document.querySelector('.lab-dark'), ll = document.querySelector('.lab-light');
        if (ld) ld.classList.toggle('is-on', mode === 'dark');
        if (ll) ll.classList.toggle('is-on', mode !== 'dark');
      });
    }

    /* invalidations filter */
    var iq = $('#iq');
    if (iq) {
      var blocks = $$('[data-kind="inv"]');
      var igroups = $$('.inv-group');
      var iempty = $('#inv-empty');
      blocks.forEach(function (x) { x.dataset.text = x.textContent.toLowerCase(); });
      iq.addEventListener('input', function () {
        var v = iq.value.trim().toLowerCase();
        var hits = 0;
        blocks.forEach(function (x) {
          var ok = !v || x.dataset.text.indexOf(v) !== -1;
          x.classList.toggle('is-hidden', !ok);
          if (ok) hits++;
        });
        igroups.forEach(function (g) {
          g.classList.toggle('is-hidden', !$$('[data-kind="inv"]', g).some(function (k) {
            return !k.classList.contains('is-hidden'); }));
        });
        iempty.classList.toggle('is-hidden', hits > 0);
      });
    }

    /* glossary filter */
    var gq = $('#gq');
    if (gq) {
      var terms = $$('[data-kind="term"]');
      terms.forEach(function (t) { t.dataset.text = t.textContent.toLowerCase(); });
      gq.addEventListener('input', function () {
        var v = gq.value.trim().toLowerCase();
        terms.forEach(function (t) { t.classList.toggle('is-hidden', !!v && t.dataset.text.indexOf(v) === -1); });
      });
    }
  }

  /* ----------------------------------------------------------------------
     GLOBAL: lightbox, menu, shortcuts
     ---------------------------------------------------------------------- */
  var box = $('#lightbox'), lbImg = $('#lightbox-img'), lbCap = $('#lightbox-cap'), lastFocus = null;
  function lbOpen(src, cap) {
    lastFocus = document.activeElement;
    lbImg.setAttribute('src', src); lbImg.alt = cap || ''; lbCap.textContent = cap || '';
    box.classList.add('is-open'); document.body.style.overflow = 'hidden';
    var sh = $('.shell'); if (sh) sh.inert = true;
    $('#lightbox-close').focus();
  }
  function lbClose() {
    box.classList.remove('is-open'); document.body.style.overflow = ''; lbImg.removeAttribute('src');
    var sh2 = $('.shell'); if (sh2) sh2.inert = false;
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  document.addEventListener('click', function (e) {
    var f = e.target.closest ? e.target.closest('.plate-frame') : null;
    if (f) { lbOpen(f.dataset.full, f.dataset.cap); return; }
    if (e.target.id === 'lightbox' || e.target.id === 'lightbox-img' || (e.target.closest && e.target.closest('#lightbox-close'))) lbClose();
  });

  box.addEventListener('keydown', function (e) {
    if (e.key !== 'Tab') return;
    var f = box.querySelectorAll('button, [href]');
    if (!f.length) return;
    var first = f[0], last = f[f.length - 1];
    if (e.shiftKey ? document.activeElement === first : document.activeElement === last) {
      e.preventDefault(); (e.shiftKey ? last : first).focus();
    }
  });

  var side = $('.sidebar'), scrim = $('#scrim'), mbtn = $('#menu-btn');
  function setMenu(open) {
    side.classList.toggle('is-open', open);
    scrim.classList.toggle('is-open', open);
    mbtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    document.body.style.overflow = open && window.innerWidth <= 1100 ? 'hidden' : '';
  }
  function closeMenu() { setMenu(false); }
  mbtn.addEventListener('click', function () { setMenu(!side.classList.contains('is-open')); });
  scrim.addEventListener('click', closeMenu);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      if (box.classList.contains('is-open')) lbClose();
      else closeMenu();
    }
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (!$('#q')) { location.hash = '#/'; setTimeout(function () { var n = $('#q'); if (n) n.focus(); }, 60); }
      else { $('#q').focus(); $('#q').select(); }
    }
    var f = document.activeElement;
    if ((e.key === 'Enter' || e.key === ' ') && f && f.classList && f.classList.contains('plate-frame')) {
      e.preventDefault(); lbOpen(f.dataset.full, f.dataset.cap);
    }
  });

  /* ----------------------------------------------------------------------
     GO
     ---------------------------------------------------------------------- */
  /* the skip link must not drive the router */
  var skip = document.querySelector('.skip');
  if (skip) skip.addEventListener('click', function (e) {
    e.preventDefault();
    var m = document.getElementById('app');
    if (m) { m.focus(); m.scrollIntoView(); }
  });

  buildChrome();
  window.addEventListener('hashchange', route);
  route();

})();
