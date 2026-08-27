/* ═══════════════════════════════════════════════════════════════
   NAMES — the collision guard.

   Three functions and two CSS classes have been silently clobbered in
   this project's history: clock(), pick(), .live and .grid. None of them
   threw. A duplicate declaration REPLACES, so the symptom turns up
   screens away from the cause — pick() shipped broken across five
   deploys before anybody clicked a vision tile.

   CLAUDE.md answers this with "grep before adding a name", which is a
   discipline. These are the checks. Static, no browser, run first.

   ON WHAT IS NOT HERE. The CSS half of that history — .live and .grid —
   is not statically decidable. Both are real shared classes; the bug was
   the backtesting screen reusing the NAME for something else, and no
   parser can tell an intended instance of a component from a collision
   with it. What catches that is measuring the rendered box, which is
   what the gauntlet's geometry checks and bt.js's swatch assertion do.
   A static check here that tried would have to flag every legitimate
   reuse of .side, .metric and .drop, and a check that cries wolf on
   correct code is worse than no check.
   ═══════════════════════════════════════════════════════════════ */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
let pass = 0, fail = 0;
const ok = (name, cond, extra) => {
  if (cond) { pass++; console.log('  ok  ' + name); }
  else { fail++; console.log('FAIL  ' + name + (extra ? '\n      ' + extra : '')); }
};

const read = (f) => fs.readFileSync(path.join(ROOT, f), 'utf8');

/* An app is its markup plus whatever script it loads beside it. Four of
   these are a single file with the code inline; schedule/ is a folder,
   because it is standalone rather than a consumer of the shell and its
   script is not something the other apps could ever share. Listing the
   FILES rather than the file is what lets a check see all of an app —
   a hardcoded list has silently skipped what was not in it twice in
   this repo's history, and both times the suite went green. */
const APPS = [
  ['trading/index.html'],
  ['days/index.html'],
  ['jade/index.html'],
  ['orrery/index.html'],
  ['schedule/index.html', 'schedule/app.js'],
];
const NAMED = (app) => app[0];
const MARKUP = (app) => app.filter(f => f.endsWith('.html'));

/* The inline <script> only, so markup containing the word "function" is
   not mistaken for code. */
const scriptOf = (src) => {
  const out = [];
  const re = /<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g;
  let m;
  while ((m = re.exec(src))) out.push({ body: m[1], at: src.slice(0, m.index).split('\n').length });
  return out;
};

/* Column zero only. A `const x` inside a function is a local and shadows
   nothing; one at the left margin is the file's only x, and a second
   silently wins. */
const topLevel = (body, at) => {
  const found = [];
  body.split('\n').forEach((ln, i) => {
    const m = ln.match(/^(?:async\s+)?function\s+([A-Za-z_$][\w$]*)/)
           || ln.match(/^(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=/);
    if (m) found.push([m[1], at + i]);
  });
  return found;
};

/* Every run of code an app carries: the inline <script>s of its markup,
   and the whole of any .js file it loads. */
const codeOf = (app) => app.flatMap(f =>
  f.endsWith('.js') ? [{ body: read(f), at: 1, file: f }]
                    : scriptOf(read(f)).map(s => ({ ...s, file: f })));

/* ── 1. one name, declared twice in a file ─────────────────────── */
for (const app of APPS) {
  const seen = new Map();
  for (const { body, at } of codeOf(app))
    for (const [name, line] of topLevel(body, at))
      seen.set(name, (seen.get(name) || []).concat(line));

  const dupes = [...seen].filter(([, ls]) => ls.length > 1);
  ok(`${NAMED(app)}: no name declared twice at the top level`, dupes.length === 0,
     dupes.map(([n, ls]) => `${n} declared at lines ${ls.join(' and ')} — `
       + 'the second silently replaces the first').join('\n      '));
}

/* ── 2. the shell stays wrapped ─────────────────────────────────
   shell.js is a classic script, so anything it declared at the true top
   level would share one global scope with both apps — and both apps
   already declare KEY, readStore, writeStore and mode. Two `const KEY`
   in that scope is not a subtle bug, it is a SyntaxError that takes the
   whole page down.

   What makes that safe today is one line: the file's body lives inside
   an IIFE. That wrapper is load-bearing and looks like decoration, which
   is exactly the kind of thing somebody tidies away. */
{
  const shell = read('shell.js');
  const body = shell.replace(/\/\*[\s\S]*?\*\//g, '').trim().replace(/^'use strict';/, '').trim();
  const wrapped = /^\(\s*function\s*\(/.test(body) || /^\(\s*\(\s*\)\s*=>/.test(body);
  const closed = /\}\s*\)\s*\(\s*\)\s*;?\s*$/.test(body);
  ok('shell.js keeps its IIFE wrapper', wrapped && closed,
     'Without it, KEY / readStore / writeStore / mode collide with both apps '
     + '— a SyntaxError, not a subtle bug.');

  /* And the names that WOULD collide are still the ones we think. */
  const inner = new Set(topLevel(body, 1).map(([n]) => n));
  const shared = ['KEY', 'readStore', 'writeStore', 'mode'].filter(n => inner.has(n));
  ok('the names the wrapper is protecting are still in there', shared.length >= 3,
     'shell.js no longer declares ' + shared.join('/') + ' — if it has been '
     + 'restructured, this check needs rethinking rather than deleting.');
}

/* ── 3. one id, once ────────────────────────────────────────────
   getElementById returns the FIRST match and says nothing about the
   second. Every screen in this app is addressed by id, and the two apps
   now carry 400-odd of them between them. */
for (const file of APPS.flatMap(MARKUP)) {
  const src = read(file);
  const seen = new Map();
  for (const m of src.matchAll(/\sid="([^"]+)"/g)) {
    const line = src.slice(0, m.index).split('\n').length;
    seen.set(m[1], (seen.get(m[1]) || []).concat(line));
  }
  const dupes = [...seen].filter(([, ls]) => ls.length > 1);
  ok(`${file}: no id used twice`, dupes.length === 0,
     dupes.map(([n, ls]) => `#${n} at lines ${ls.join(' and ')} — `
       + 'getElementById returns the first and ignores the rest').join('\n      '));
}

/* ── 4. every id the code reaches actually exists ───────────────
   A renamed element leaves getElementById returning null, and the throw
   lands wherever the value is finally used rather than where it was
   fetched. */
for (const app of APPS) {
  const present = new Set(MARKUP(app).flatMap(f =>
    [...read(f).matchAll(/\sid="([^"]+)"/g)].map(m => m[1])));

  const wanted = new Set();
  for (const f of app) {
    const src = read(f);
    for (const m of src.matchAll(/getElementById\('([^']+)'\)/g)) wanted.add(m[1]);

    /* schedule/ reaches its markup through a one-character alias, and a
       check that only knows the long spelling passes an app it never
       looked at. The alias is only trusted in a file that actually
       DEFINES it as a getElementById wrapper — read anywhere else, $ is
       as likely to be a querySelector alias, and $('div') would be
       reported as a missing id. */
    if (/\$\s*=\s*function\s*\(\s*\w+\s*\)\s*\{\s*return\s+document\.getElementById/.test(src))
      for (const m of src.matchAll(/(?:^|[^\w$.])\$\('([A-Za-z][\w-]*)'\)/g)) wanted.add(m[1]);
  }

  const missing = [...wanted].filter(id => !present.has(id));
  ok(`${NAMED(app)}: every id the script fetches is in the markup`, missing.length === 0,
     missing.map(id => `#${id}`).join(', '));
}


/* ── 5. names the language took first ────────────────────────────
   Every function already owns `name`, `length`, `caller` and
   `arguments`, and they are non-writable. Hanging state off one of them
   fails SILENTLY outside strict mode: the assignment does nothing, the
   read comes back with the built-in value, and the property looks set
   everywhere you inspect it in a debugger.

   orVoice.name cost an afternoon on exactly this. It stored the voice
   you chose; the write beside it into localStorage succeeded, so the
   choice was durable and simply never applied — read back as the string
   "orVoice", matched nothing, and fell through to the default voice
   every time.

   Namespaced onto a function is the pattern this whole codebase uses
   (orSearch.t, orPaint.match, orLoose.miss), so this is not exotic — it
   is the one square on that board that is mined. */
const RESERVED = ['name', 'length', 'caller', 'arguments'];
for (const app of APPS.concat([['shell.js']])) {
  const file = NAMED(app);
  const bodies = codeOf(app);
  const hits = [];
  for (const { body, at } of bodies) {
    /* An assignment TO the property, not a read of it: `f.name =` but
       not `f.name ===`, and not a declared object literal key. */
    const re = new RegExp(
      '(^|[^\\w$.])([A-Za-z_$][\\w$]*)\\.(' + RESERVED.join('|') + ')\\s*=(?!=)', 'g');
    let m;
    while ((m = re.exec(body))) {
      const owner = m[2];
      /* Only when the owner is a function declared at the top level of
         this file — an element's .name or a plain object's is fine. */
      if (!new RegExp('(?:^|\\n)(?:async\\s+)?function\\s+' + owner + '\\s*\\(').test(body)
        && !new RegExp('(?:^|\\n)(?:const|let|var)\\s+' + owner + '\\s*=\\s*(?:async\\s*)?(?:function|\\()').test(body))
        continue;
      hits.push(`${owner}.${m[3]} at line ${at + body.slice(0, m.index).split('\n').length - 1}`);
    }
  }
  ok(`${file}: nothing hangs state off a function's own name or length`,
     hits.length === 0,
     hits.join('\n      ') + '\n      these assignments do nothing and throw nothing');
}

/* ── one selector, one rule ──
   THREE TIMES NOW a rule later in the same file has silently been the
   live one. `.prime` carried a microphone's 13px radius left over from
   the bar it replaced, so the add control drew as a rounded square
   after being written as a circle. `.ghost svg circle` filled the view
   icon's ring into a blob. And `.bar` kept a whole second copy of
   itself at the foot of schedule/app.css, imposing the previous bar's
   padding over the padding the live rule's own comment explained — the
   worst of the three, because the numbers it forced were themselves
   measured, just for a different bar, so nothing on screen looked
   wrong. It came with 554 lines of the file duplicated verbatim around
   it.

   THIS IS DECIDABLE and the .live / .grid case above is not, which is
   why one gets a check and the other does not. That one asks whether
   two different elements were meant to share a class name, which no
   parser can answer. This asks whether ONE selector, spelled
   identically, is written twice in one file — and the answer is in the
   text.

   A later rule overriding an earlier one is legal CSS and sometimes
   meant, so what is already in the tree is named here one by one
   rather than the check being loosened to wave it through. Eleven of
   these were standing the day it was written, in four screens this
   pass was not asked to touch. Baselining them is a debt written down,
   NOT an approval: each is a place where editing the first rule does
   nothing, and each wants a look from whoever is next in that file.

   The baseline is checked in both directions. A named pair that is no
   longer there fails too — otherwise the list rots into an inventory
   of things that do not exist, quietly waving through the new
   duplicate that took its place. */
{
  const KNOWN = {
    /* `.dot` takes --accent, then a themed swatch rule supersedes it
       with `var(--sw, var(--accent))`. The fallback IS the earlier
       value, so this one is deliberate and cannot change what an
       unthemed dot draws. The other two are not triaged. */
    'shell.css': [
      '.dot { background }',
      '.fab { position }',
      '.pal-back { min-height }', '.pal-back { color }',
      '.pal-back { font-size }', '.pal-back { font-weight }',
    ],
    'trading/index.html': ['.cp-ny { color }'],
    /* Same shape as .dot: the later value falls back to the earlier. */
    'jade/index.html': ['.jt-tk { color }'],
    /* The first two are the SAME value written twice, which is the
       harmless end of this; .or-idx is a genuine override. */
    'orrery/index.html': [
      '#orNote { position }', '#orCatPane { position }',
      '.or-idx { gap }', '.or-idx { font-size }',
    ],
  };

  /* @media and @supports bodies come out first: a rule inside one is
     an override BY CONSTRUCTION, and flagging it would flag every
     responsive stylesheet ever written. */
  const flatten = (css) => {
    let s = css.replace(/\/\*[\s\S]*?\*\//g, ' '), prev;
    do {
      prev = s;
      s = s.replace(/@[a-z-]+[^{]*\{(?:[^{}]|\{[^{}]*\})*\}/gi, ' ');
    } while (s !== prev);
    return s;
  };

  const styleOf = (f) => f.endsWith('.css') ? read(f)
    : [...read(f).matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].map(m => m[1]).join('\n');

  for (const f of ['shell.css', 'schedule/app.css', 'trading/index.html',
                   'days/index.html', 'jade/index.html', 'orrery/index.html']) {
    const s = flatten(styleOf(f));
    const by = new Map();
    for (const m of s.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
      const line = s.slice(0, m.index).split('\n').length;
      const props = new Map();
      for (const d of m[2].split(';')) {
        const c = d.indexOf(':');
        if (c > 0) props.set(d.slice(0, c).trim(), d.slice(c + 1).trim());
      }
      /* Split on commas at DEPTH ZERO only. A plain `.split(',')` cuts
         `:not(a, b)` in half and reports the fragment `:focus-visible)
         .or-halo` as a selector — which is how this check first read
         the orrery, and a check that misquotes the file is worse than
         no check because its output cannot be acted on. */
      const parts = [];
      let depth = 0, buf = '';
      for (const ch of m[1]) {
        if (ch === '(') depth++;
        else if (ch === ')') depth--;
        if (ch === ',' && depth === 0) { parts.push(buf); buf = ''; }
        else buf += ch;
      }
      parts.push(buf);
      for (const one of parts.map(x => x.trim().replace(/\s+/g, ' ')).filter(Boolean)) {
        if (one.startsWith('@') || /^\d/.test(one)) continue;
        if (!by.has(one)) by.set(one, []);
        by.get(one).push({ line, props });
      }
    }
    const seen = new Set(), fresh = [];
    for (const [sel, list] of by) {
      if (list.length < 2) continue;
      for (let a = 0; a < list.length; a++) {
        for (let b = a + 1; b < list.length; b++) {
          for (const [p, v] of list[a].props) {
            if (!list[b].props.has(p)) continue;
            const id = `${sel} { ${p} }`;
            seen.add(id);
            if ((KNOWN[f] || []).includes(id)) continue;
            fresh.push(`${id} line ${list[a].line} says ${v}, `
              + `line ${list[b].line} says ${list[b].props.get(p)} and wins`);
          }
        }
      }
    }
    ok(`${f}: no NEW selector sets the same property twice`, fresh.length === 0,
       fresh.slice(0, 8).join('\n      '));
    const gone = (KNOWN[f] || []).filter(id => !seen.has(id));
    ok(`${f}: the baseline still describes the file`, gone.length === 0,
       gone.join(', ') + ' — fixed? then delete the line, do not leave it here');
  }
}

/* ── every var() points at a token that exists ──
   Three declarations in trading/index.html asked for `var(--bg)`, which
   no stylesheet defines. An invalid custom property does not fall back
   to the previous declaration — it makes the whole declaration invalid
   at COMPUTED-VALUE time — so each one silently inherited something
   plausible instead: a tick at 1.59:1, a chip's month at 1.74:1, and a
   halo that was never drawn. A colour that is wrong rather than absent
   is the hardest kind to see, so it gets a static check rather than an
   eye. */
{
  /* days/index.html joined this list the day it shipped with an
     undefined --ink-on that this check would have caught in 0.1s and
     a browser test caught four minutes later. A third app is a third
     place for a token to go missing. */
  /* jade/index.html defines every token it uses in its own :root — it
     loads no shell.css — so it is checked against itself and the union
     is harmless. A fourth app is a fourth place for a token to go
     missing. */
  /* schedule/app.css is the same case as jade — it defines every token
     it uses in its own :root and loads no shell.css — so it is checked
     against itself and the union is harmless. A fifth app is a fifth
     place for a token to go missing. */
  const SRC = ['shell.css', 'trading/index.html', 'days/index.html',
               'jade/index.html', 'orrery/index.html', 'schedule/app.css'];
  const text = SRC.map(f => read(f)).join('\n');
  /* Defined anywhere: a stylesheet, an inline style attribute, or a
     template literal that sets one. All three are legitimate. */
  const defined = new Set([...text.matchAll(/(--[\w-]+)\s*:/g)].map(m => m[1]));
  /* var(--x, fallback) is fine by construction — the fallback is what
     the declaration uses when --x is missing. */
  const used = new Map();
  for (const f of SRC) {
    /* Comments out first. This file's own note ABOUT the bug mentions
       the dead token, and a check that fails on the explanation of a
       fix is a check nobody will keep. */
    const body = read(f).replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/<!--[\s\S]*?-->/g, ' ');
    for (const m of body.matchAll(/var\(\s*(--[\w-]+)\s*\)/g)) {
      if (!defined.has(m[1])) used.set(m[1], (used.get(m[1]) || new Set()).add(f));
    }
  }
  const bad = [...used.entries()].map(([k, v]) => `${k} (${[...v].join(', ')})`);
  ok('every var() points at a token something defines', bad.length === 0, bad.join('; '));
}

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
