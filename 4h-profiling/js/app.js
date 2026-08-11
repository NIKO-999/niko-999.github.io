/* ==========================================================================
   4H Candle Profiling — Study Archive
   Renders the archive from CONTENT (js/data.js). No quizzes, no games.
   ========================================================================== */
(function () {
  'use strict';

  var C = window.CONTENT;
  if (!C) { console.error('CONTENT missing'); return; }

  var $  = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
  function el(html) {
    var t = document.createElement('template');
    t.innerHTML = html.trim();
    return t.content.firstElementChild;
  }

  /* ----------------------------------------------------------------------
     RENDER: lesson  — rule set ABOVE, plate in the middle, reading BELOW
     ---------------------------------------------------------------------- */
  function lessonHTML(L) {
    var h = [];

    h.push('<article class="lesson" id="' + esc(L.id) + '" data-kind="lesson">');

    /* header */
    h.push('<header class="lesson-head">');
    h.push('<div class="lesson-num">' + esc(L.number) + '</div>');
    h.push('<h3>' + esc(L.title) + '</h3>');
    if (L.source) h.push('<div class="lesson-src">' + esc(L.source) + '</div>');
    h.push('</header>');

    /* 1 — RULE SET (above the image, as specified) */
    if (L.rules && L.rules.length) {
      h.push('<section class="ruleset">');
      h.push('<div class="ruleset-label">Rule Set</div><ol>');
      L.rules.forEach(function (r) { h.push('<li>' + esc(r) + '</li>'); });
      h.push('</ol></section>');
    }

    /* 2 — PLATE */
    if (L.plate) {
      h.push('<figure class="plate">');
      h.push('<div class="plate-frame" role="button" tabindex="0" ' +
             'data-full="' + esc(L.plate) + '" ' +
             'data-cap="' + esc(L.plateCaption || L.title) + '" ' +
             'aria-label="Enlarge plate: ' + esc(L.plateCaption || L.title) + '">');
      h.push('<img src="' + esc(L.plate) + '" alt="' + esc(L.plateCaption || L.title) + '" loading="lazy" decoding="async">');
      h.push('<span class="plate-zoom">Click to enlarge</span>');
      h.push('</div>');
      if (L.plateCaption) {
        h.push('<figcaption class="plate-caption"><span class="pl">Plate</span><span>' + esc(L.plateCaption) + '</span></figcaption>');
      }
      h.push('</figure>');
    }

    /* 3 — READING (below the image, as specified) */
    if (L.reading && L.reading.length) {
      h.push('<div class="reading">');
      L.reading.forEach(function (p) { h.push('<p>' + esc(p) + '</p>'); });
      h.push('</div>');
    }

    /* 4 — APPROACH */
    if (L.approach && L.approach.length) {
      h.push('<section class="approach-box">');
      h.push('<div class="approach-label">How to approach it</div><ol>');
      L.approach.forEach(function (a) { h.push('<li>' + esc(a) + '</li>'); });
      h.push('</ol></section>');
    }

    /* 5 — WATCHOUTS */
    if (L.watchouts && L.watchouts.length) {
      h.push('<section class="watchouts">');
      h.push('<div class="watchouts-label">What invalidates it</div><ul>');
      L.watchouts.forEach(function (w) { h.push('<li>' + esc(w) + '</li>'); });
      h.push('</ul></section>');
    }

    h.push('</article>');
    return h.join('');
  }

  function moduleHTML(M) {
    var h = [];
    h.push('<section class="module" id="' + esc(M.moduleId) + '" data-kind="module">');
    h.push('<div class="wrap">');
    h.push('<header class="module-head">');
    h.push('<div class="module-numeral" aria-hidden="true">' + esc(M.numeral) + '</div>');
    h.push('<h2>' + esc(M.title) + '</h2>');
    if (M.subtitle) h.push('<div class="module-sub">' + esc(M.subtitle) + '</div>');
    if (M.overview) h.push('<p class="module-overview">' + esc(M.overview) + '</p>');
    if (M.sourceLabel) h.push('<div class="module-source">Source · ' + esc(M.sourceLabel) + '</div>');
    h.push('</header>');
    (M.lessons || []).forEach(function (L) { h.push(lessonHTML(L)); });
    h.push('</div></section>');
    return h.join('');
  }

  /* ----------------------------------------------------------------------
     RENDER: approach / sessions / glossary
     ---------------------------------------------------------------------- */
  function approachHTML(A) {
    if (!A) return '';
    var h = [];
    h.push('<section class="section" id="approach" data-kind="section">');
    h.push('<div class="wrap">');
    h.push('<div class="section-head"><div class="rule-line"></div>');
    h.push('<h2>' + esc(A.title) + '</h2>');
    if (A.intro) h.push('<p>' + esc(A.intro) + '</p>');
    h.push('</div><div class="steps">');
    (A.steps || []).forEach(function (s) {
      h.push('<div class="step" data-kind="step">');
      h.push('<div class="step-n" aria-hidden="true">' + esc(s.n) + '</div>');
      h.push('<div><h3>' + esc(s.title) + '</h3>');
      if (s.body) h.push('<p>' + esc(s.body) + '</p>');
      if (s.checks && s.checks.length) {
        h.push('<ul class="checks">');
        s.checks.forEach(function (c) { h.push('<li>' + esc(c) + '</li>'); });
        h.push('</ul>');
      }
      h.push('</div></div>');
    });
    h.push('</div></div></section>');
    return h.join('');
  }

  function sessionsHTML(S) {
    if (!S) return '';
    var h = [];
    h.push('<section class="section" id="sessions" data-kind="section">');
    h.push('<div class="wrap">');
    h.push('<div class="section-head"><div class="rule-line"></div>');
    h.push('<h2>' + esc(S.title) + '</h2>');
    if (S.note) h.push('<p>' + esc(S.note) + '</p>');
    h.push('</div>');
    h.push('<div class="table-scroll"><table><thead><tr>');
    (S.columns || []).forEach(function (c) { h.push('<th scope="col">' + esc(c) + '</th>'); });
    h.push('</tr></thead><tbody>');
    (S.rows || []).forEach(function (r) {
      var isKey = r.some(function (cell) { return /\bkey\b/i.test(String(cell)); });
      h.push('<tr' + (isKey ? ' class="key-row"' : '') + '>');
      r.forEach(function (cell) { h.push('<td>' + esc(cell) + '</td>'); });
      h.push('</tr>');
    });
    h.push('</tbody></table></div>');
    if (S.footnote) h.push('<p class="table-note">' + esc(S.footnote) + '</p>');
    h.push('</div></section>');
    return h.join('');
  }

  function glossaryHTML(G) {
    if (!G || !G.length) return '';
    var h = [];
    h.push('<section class="section" id="glossary" data-kind="section">');
    h.push('<div class="wrap">');
    h.push('<div class="section-head"><div class="rule-line"></div>');
    h.push('<h2>Glossary</h2><p>Every term the three documents lean on, defined the way this framework uses it.</p>');
    h.push('</div><div class="glossary">');
    G.slice().sort(function (a, b) { return a.term.localeCompare(b.term); }).forEach(function (t) {
      h.push('<div class="gl-item" data-kind="term">');
      h.push('<div class="gl-term">' + esc(t.term) + '</div>');
      if (t.full) h.push('<div class="gl-full">' + esc(t.full) + '</div>');
      h.push('<div class="gl-def">' + esc(t.def) + '</div>');
      if (t.seen) h.push('<div class="gl-seen"><b>Where it matters</b>' + esc(t.seen) + '</div>');
      h.push('</div>');
    });
    h.push('</div></div></section>');
    return h.join('');
  }

  /* ----------------------------------------------------------------------
     MOUNT
     ---------------------------------------------------------------------- */
  var mount = $('#content');
  var html = [];
  html.push(approachHTML(C.approach));
  html.push(sessionsHTML(C.sessions));
  (C.modules || []).forEach(function (M) { html.push(moduleHTML(M)); });
  html.push(glossaryHTML(C.glossary));
  mount.innerHTML = html.join('');

  /* ----------------------------------------------------------------------
     SIDEBAR NAV
     ---------------------------------------------------------------------- */
  (function buildNav() {
    var nav = $('#nav');
    var h = [];

    h.push('<div class="nav-group">');
    h.push('<div class="nav-label">Start here</div>');
    if (C.approach) h.push('<a class="nav-link" href="#approach"><span class="n">→</span><span>' + esc(C.approach.title) + '</span></a>');
    if (C.sessions) h.push('<a class="nav-link" href="#sessions"><span class="n">→</span><span>' + esc(C.sessions.title) + '</span></a>');
    h.push('</div>');

    (C.modules || []).forEach(function (M) {
      h.push('<div class="nav-group">');
      h.push('<div class="nav-label">Module ' + esc(M.numeral) + '</div>');
      h.push('<a class="nav-link nav-major" href="#' + esc(M.moduleId) + '"><span>' + esc(M.title) + '</span></a>');
      (M.lessons || []).forEach(function (L) {
        h.push('<a class="nav-link" href="#' + esc(L.id) + '"><span class="n">' + esc(L.number) + '</span><span>' + esc(L.title) + '</span></a>');
      });
      h.push('</div>');
    });

    h.push('<div class="nav-group">');
    h.push('<div class="nav-label">Reference</div>');
    h.push('<a class="nav-link" href="#glossary"><span class="n">§</span><span>Glossary</span></a>');
    h.push('<a class="nav-link" href="#sources"><span class="n">§</span><span>Sources &amp; Notice</span></a>');
    h.push('</div>');

    nav.innerHTML = h.join('');
  })();

  /* ----------------------------------------------------------------------
     SCROLL SPY
     ---------------------------------------------------------------------- */
  (function spy() {
    var links = $$('#nav .nav-link');
    var map = {};
    links.forEach(function (a) {
      var id = a.getAttribute('href').slice(1);
      map[id] = a;
    });
    var targets = Object.keys(map)
      .map(function (id) { return document.getElementById(id); })
      .filter(Boolean);
    if (!targets.length || !('IntersectionObserver' in window)) return;

    var visible = new Set();
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) visible.add(e.target.id); else visible.delete(e.target.id);
      });
      // highlight the first visible target in document order
      var current = targets.filter(function (t) { return visible.has(t.id); })[0];
      if (!current) return;
      links.forEach(function (a) { a.classList.remove('is-active'); });
      if (map[current.id]) {
        map[current.id].classList.add('is-active');
        var side = $('.sidebar');
        if (side && window.innerWidth > 1020) {
          var r = map[current.id].getBoundingClientRect();
          if (r.top < 90 || r.bottom > window.innerHeight - 40) {
            map[current.id].scrollIntoView({ block: 'center', behavior: 'smooth' });
          }
        }
      }
    }, { rootMargin: '-10% 0px -70% 0px', threshold: 0 });

    targets.forEach(function (t) { io.observe(t); });
  })();

  /* ----------------------------------------------------------------------
     LIGHTBOX
     ---------------------------------------------------------------------- */
  (function lightbox() {
    var box = $('#lightbox');
    var img = $('#lightbox-img');
    var cap = $('#lightbox-cap');
    var lastFocus = null;

    function open(src, caption) {
      lastFocus = document.activeElement;
      img.src = src;
      img.alt = caption || '';
      cap.textContent = caption || '';
      box.classList.add('is-open');
      document.body.style.overflow = 'hidden';
      $('#lightbox-close').focus();
    }
    function close() {
      box.classList.remove('is-open');
      document.body.style.overflow = '';
      img.src = '';
      if (lastFocus) lastFocus.focus();
    }

    document.addEventListener('click', function (e) {
      var frame = e.target.closest ? e.target.closest('.plate-frame') : null;
      if (frame) { open(frame.dataset.full, frame.dataset.cap); return; }
      if (e.target.id === 'lightbox' || e.target.id === 'lightbox-img' || e.target.id === 'lightbox-close') close();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && box.classList.contains('is-open')) close();
      var frame = document.activeElement;
      if ((e.key === 'Enter' || e.key === ' ') && frame && frame.classList && frame.classList.contains('plate-frame')) {
        e.preventDefault();
        open(frame.dataset.full, frame.dataset.cap);
      }
    });
  })();

  /* ----------------------------------------------------------------------
     MOBILE MENU
     ---------------------------------------------------------------------- */
  (function menu() {
    var side = $('.sidebar');
    var scrim = $('#scrim');
    var btn = $('#menu-btn');
    function set(open) {
      side.classList.toggle('is-open', open);
      scrim.classList.toggle('is-open', open);
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.style.overflow = open && window.innerWidth <= 1020 ? 'hidden' : '';
    }
    btn.addEventListener('click', function () { set(!side.classList.contains('is-open')); });
    scrim.addEventListener('click', function () { set(false); });
    side.addEventListener('click', function (e) {
      if (e.target.closest('.nav-link') && window.innerWidth <= 1020) set(false);
    });
    window.addEventListener('keydown', function (e) { if (e.key === 'Escape') set(false); });
  })();

  /* ----------------------------------------------------------------------
     SEARCH — filters lessons, steps and glossary terms
     ---------------------------------------------------------------------- */
  (function search() {
    var input = $('#search');
    if (!input) return;
    var units = $$('[data-kind="lesson"], [data-kind="term"], [data-kind="step"]');
    var modules = $$('[data-kind="module"]');
    var sections = $$('[data-kind="section"]');
    var empty = $('#no-results');

    units.forEach(function (u) { u.dataset.text = u.textContent.toLowerCase(); });

    var t;
    input.addEventListener('input', function () {
      clearTimeout(t);
      t = setTimeout(run, 120);
    });

    function run() {
      var q = input.value.trim().toLowerCase();
      if (!q) {
        units.forEach(function (u) { u.classList.remove('is-hidden'); });
        modules.concat(sections).forEach(function (s) { s.classList.remove('is-hidden'); });
        empty.classList.add('is-hidden');
        return;
      }
      var hits = 0;
      units.forEach(function (u) {
        var match = u.dataset.text.indexOf(q) !== -1;
        u.classList.toggle('is-hidden', !match);
        if (match) hits++;
      });
      // hide a module/section whose children are all hidden
      modules.concat(sections).forEach(function (s) {
        var kids = $$('[data-kind="lesson"], [data-kind="term"], [data-kind="step"]', s);
        if (!kids.length) return;
        var anyVisible = kids.some(function (k) { return !k.classList.contains('is-hidden'); });
        s.classList.toggle('is-hidden', !anyVisible);
      });
      empty.classList.toggle('is-hidden', hits > 0);
    }
  })();

  /* ----------------------------------------------------------------------
     STATS in hero
     ---------------------------------------------------------------------- */
  (function stats() {
    var lessons = 0, plates = 0, rules = 0;
    (C.modules || []).forEach(function (M) {
      (M.lessons || []).forEach(function (L) {
        lessons++;
        if (L.plate) plates++;
        rules += (L.rules || []).length;
      });
    });
    var n = $('#stat-lessons'); if (n) n.textContent = lessons;
    var p = $('#stat-plates');  if (p) p.textContent = plates;
    var r = $('#stat-rules');   if (r) r.textContent = rules;
    var g = $('#stat-terms');   if (g) g.textContent = (C.glossary || []).length;
  })();

})();
