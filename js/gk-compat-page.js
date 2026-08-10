/**
 * ═══════════════════════════════════════════════════════════════════════════
 *  GENE KEYS — COMPATIBILITY MODE CONTROLLER
 * ═══════════════════════════════════════════════════════════════════════════
 *  Two-person comparison screen (#compatView, gene-keys.html), toggled from
 *  #hdr's "Compatibility" link. Self-contained — parameterized copies of
 *  the birth-data parsing/timezone-fill logic from js/gk-mandala-page.js
 *  (which closes over the single global dob/tob/tzEl, so isn't reusable for
 *  a two-person form) rather than reaching into that file's internals.
 *
 *  The comparison itself is entirely delegated to js/gk-compat.js
 *  (DGKCompat.compare) and the profile computation to js/gk-profile.js
 *  (DGKProfile.profile) — both pure, both already proven by the rest of
 *  this site. This file is UI glue only: two input forms -> two profiles ->
 *  one compare() call -> a clickable results list, reusing the same reading-
 *  panel infra (#panel, openPanelFor-style content) already on the page for
 *  the "open a fuller reading" interaction.
 *
 *  URL scheme: ?bA=&tzA=&bB=&tzB= alongside the existing ?b=&tz= — a link
 *  without the A/B params is unaffected, so every existing single-profile
 *  link keeps working exactly as before.
 * ═══════════════════════════════════════════════════════════════════════════
 */
(function () {
  'use strict';

  const PLACES = [
    ['New South Wales', [
      ['Australia/Sydney', 'Sydney'],
      ['Australia/Broken_Hill', 'Broken Hill'],
      ['Australia/Lord_Howe', 'Lord Howe Island'],
    ]],
    ['Victoria', [['Australia/Melbourne', 'Melbourne']]],
    ['Queensland', [
      ['Australia/Brisbane', 'Brisbane'],
      ['Australia/Lindeman', 'Lindeman Island'],
    ]],
    ['South Australia', [['Australia/Adelaide', 'Adelaide']]],
    ['Western Australia', [
      ['Australia/Perth', 'Perth'],
      ['Australia/Eucla', 'Eucla'],
    ]],
    ['Tasmania', [
      ['Australia/Hobart', 'Hobart'],
      ['Antarctica/Macquarie', 'Macquarie Island'],
    ]],
    ['Northern Territory', [['Australia/Darwin', 'Darwin']]],
    ['Australian Capital Territory', [['Australia/Sydney', 'Canberra']]],
    ['External territories', [
      ['Indian/Christmas', 'Christmas Island'],
      ['Indian/Cocos', 'Cocos (Keeling) Islands'],
    ]],
    ['New Zealand', [
      ['Pacific/Auckland', 'Auckland · Wellington · Christchurch'],
      ['Pacific/Chatham', 'Chatham Islands'],
    ]],
  ];
  const PLACE_ZONES = [];
  function fillZones(sel) {
    const blank = document.createElement('option');
    blank.value = ''; blank.textContent = '— select —';
    sel.appendChild(blank);
    PLACES.forEach(([group, rows]) => {
      const g = document.createElement('optgroup');
      g.label = group;
      rows.forEach(([zone, label]) => {
        const o = document.createElement('option');
        o.value = zone; o.textContent = label;
        g.appendChild(o);
        if (PLACE_ZONES.indexOf(zone) === -1) PLACE_ZONES.push(zone);
      });
      sel.appendChild(g);
    });
  }
  function validZone(z) {
    if (!z || PLACE_ZONES.indexOf(z) === -1) return false;
    try { new Intl.DateTimeFormat('en-US', { timeZone: z }); return true; }
    catch (e) { return false; }
  }
  function parseDate(v) {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(v || '');
    if (!m) return null;
    const y = +m[1], mo = +m[2], d = +m[3];
    if (y < 1900 || y > 2100 || mo < 1 || mo > 12 || d < 1 || d > 31) return null;
    const probe = new Date(Date.UTC(y, mo - 1, d));
    if (probe.getUTCMonth() !== mo - 1 || probe.getUTCDate() !== d) return null;
    return { y, mo, d };
  }
  function parseTime(v) {
    const m = /^(\d{2}):(\d{2})/.exec(v || '');
    if (!m) return null;
    const h = +m[1], mi = +m[2];
    return (h < 24 && mi < 60) ? { h, mi } : null;
  }
  function esc(s) { const d = document.createElement('div'); d.textContent = s == null ? '' : s; return d.innerHTML; }

  const dobA = document.getElementById('dobA'), tobA = document.getElementById('tobA'), tzA = document.getElementById('tzA');
  const dobB = document.getElementById('dobB'), tobB = document.getElementById('tobB'), tzB = document.getElementById('tzB');
  if (!dobA || !dobB) return; // markup not present — nothing to wire up

  fillZones(tzA);
  fillZones(tzB);

  function computeProfile(dobEl, tobEl, tzEl) {
    const d = parseDate(dobEl.value), t = parseTime(tobEl.value), z = (tzEl.value || '').trim();
    if (!d || !t || !validZone(z)) return null;
    if (!(window.DAstroTime && window.DGKProfile)) return null;
    const inst = DAstroTime.localToInstant({ y: d.y, mo: d.mo, d: d.d, h: t.h, mi: t.mi, tz: z });
    return DGKProfile.profile({ ms: inst.ms });
  }

  const NODE_LABELS = {
    lifesWork: "Life's Work", evolution: 'Evolution', radiance: 'Radiance', purpose: 'Purpose',
    attraction: 'Attraction', iq: 'IQ', eq: 'EQ', sq: 'SQ', core: 'Core', vocation: 'Vocation',
    culture: 'Culture', brand: 'Brand', pearl: 'Pearl',
  };
  function label(id) { return NODE_LABELS[id] || id; }

  function ringLabel(ring) {
    return ring.name || ('the Ring of ' + (ring.amino || 'this codon'));
  }

  function render() {
    const results = document.getElementById('compatResults');
    const profA = computeProfile(dobA, tobA, tzA);
    const profB = computeProfile(dobB, tobB, tzB);
    if (!profA || !profB) {
      results.innerHTML = '<div class="compatEmpty">Enter both people\'s birth date, time, and birthplace to see how their charts connect.</div>';
      return;
    }
    if (!window.DGKCompat) {
      results.innerHTML = '<div class="compatEmpty">Compatibility engine unavailable.</div>';
      return;
    }
    const cmp = DGKCompat.compare(profA.spheres, profB.spheres);
    const cards = [];

    function card(who, what, onOpen) {
      cards.push({ who, what, onOpen });
    }

    cmp.exact.forEach(m => {
      card(
        'Key ' + m.key + ' · your ' + esc(label(m.idA)) + ' and their ' + esc(label(m.idB)),
        'Exact match — you both carry this key',
        () => openReading('Key ' + m.key + ' · Shared', window.DGKCompatContent ? DGKCompatContent.get(m.key) : null)
      );
    });
    cmp.partners.forEach(m => {
      card(
        'Key ' + m.keyA + ' (your ' + esc(label(m.idA)) + ') & Key ' + m.keyB + ' (their ' + esc(label(m.idB)) + ')',
        'Programming partners between you',
        () => openReading('Key ' + m.keyA + ' & ' + m.keyB + ' · Partners', window.DGKPartners ? DGKPartners.get(m.keyA) : null)
      );
    });
    cmp.rings.forEach(m => {
      card(
        'Key ' + m.keyA + ' (your ' + esc(label(m.idA)) + ') & Key ' + m.keyB + ' (their ' + esc(label(m.idB)) + ')',
        'Share ' + ringLabel(m.ring),
        () => openReading(ringLabel(m.ring),
          'Key ' + m.keyA + ' and Key ' + m.keyB + ' both belong to ' + ringLabel(m.ring) +
          ' — the same underlying material, running through two different people instead of one. ' +
          'That shared root tends to make this specific connection feel immediately familiar, ' +
          'like the two of you are already speaking a dialect nobody had to teach either of you.')
      );
    });

    if (!cards.length) {
      results.innerHTML = '<div class="compatEmpty">No direct key connections this time — every one of your 13 keys is running independently of theirs.</div>';
      return;
    }

    let html = '';
    if (cmp.exact.length) html += '<h3>Shared Keys</h3>' + cmp.exact.map((m, i) => cardHtml(cards[i])).join('');
    let off = cmp.exact.length;
    if (cmp.partners.length) html += '<h3>Programming Partners</h3>' + cmp.partners.map((m, i) => cardHtml(cards[off + i])).join('');
    off += cmp.partners.length;
    if (cmp.rings.length) html += '<h3>Shared Rings</h3>' + cmp.rings.map((m, i) => cardHtml(cards[off + i])).join('');

    function cardHtml(c) {
      const idx = cards.indexOf(c);
      return '<div class="compatCard" data-idx="' + idx + '"><div class="compatWho">' + c.who + '</div><div class="compatWhat">' + esc(c.what) + '</div></div>';
    }

    results.innerHTML = html;
    results.querySelectorAll('.compatCard').forEach(el => {
      el.addEventListener('click', () => cards[Number(el.dataset.idx)].onOpen());
    });
  }

  const compatView = document.getElementById('compatView');

  function openReading(title, body) {
    const panel = document.getElementById('panel');
    const content = document.getElementById('pcontent');
    if (!panel || !content) return;
    content.innerHTML = '<div class="eyebrow">compatibility</div><h2>' + esc(title) + '</h2>' +
      '<section><div class="card" data-noclick="1"><p>' + esc(body || 'Reading not available yet.') + '</p></div></section>';
    if (compatView) compatView.style.display = 'none';
    panel.classList.add('on');
  }

  document.getElementById('closeBtn').addEventListener('click', () => {
    if (document.body.classList.contains('compatMode') && compatView) compatView.style.display = '';
  });

  [dobA, tobA, tzA, dobB, tobB, tzB].forEach(el => el.addEventListener('change', render));

  document.getElementById('compatToggle').addEventListener('click', () => {
    document.body.classList.add('compatMode');
    if (compatView) compatView.style.display = '';
    render();
  });
  document.getElementById('compatClose').addEventListener('click', () => {
    document.body.classList.remove('compatMode');
    const panel = document.getElementById('panel');
    if (panel) panel.classList.remove('on');
  });

  // URL round-trip: ?bA=&tzA=&bB=&tzB=, additive to the existing ?b=&tz= scheme.
  const params = new URLSearchParams(location.search);
  function bootPerson(param, tzParam, dobEl, tobEl, tzEl) {
    const b = params.get(param) || '';
    const m = /^(\d{4}-\d{2}-\d{2})T(\d{2}):(\d{2})$/.exec(b);
    if (m) { dobEl.value = m[1]; tobEl.value = m[2] + ':' + m[3]; }
    const z = params.get(tzParam);
    if (validZone(z)) tzEl.value = z;
  }
  bootPerson('bA', 'tzA', dobA, tobA, tzA);
  bootPerson('bB', 'tzB', dobB, tobB, tzB);
  if (params.get('bA') && params.get('bB')) {
    document.body.classList.add('compatMode');
    render();
  }

  function writeCompatURL() {
    const p = new URLSearchParams(location.search);
    const dA = parseDate(dobA.value), tA = parseTime(tobA.value), zA = (tzA.value || '').trim();
    const dB = parseDate(dobB.value), tB = parseTime(tobB.value), zB = (tzB.value || '').trim();
    if (dA && tA && validZone(zA)) {
      p.set('bA', dobA.value + 'T' + String(tA.h).padStart(2, '0') + ':' + String(tA.mi).padStart(2, '0'));
      p.set('tzA', zA);
    }
    if (dB && tB && validZone(zB)) {
      p.set('bB', dobB.value + 'T' + String(tB.h).padStart(2, '0') + ':' + String(tB.mi).padStart(2, '0'));
      p.set('tzB', zB);
    }
    try { history.replaceState(null, '', location.pathname + '?' + p.toString()); } catch (e) { /* ignore */ }
  }
  [dobA, tobA, tzA, dobB, tobB, tzB].forEach(el => el.addEventListener('change', writeCompatURL));
})();
