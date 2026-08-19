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
const APPS = ['trading/index.html', 'arc/index.html'];

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

/* ── 1. one name, declared twice in a file ─────────────────────── */
for (const file of APPS) {
  const seen = new Map();
  for (const { body, at } of scriptOf(read(file)))
    for (const [name, line] of topLevel(body, at))
      seen.set(name, (seen.get(name) || []).concat(line));

  const dupes = [...seen].filter(([, ls]) => ls.length > 1);
  ok(`${file}: no name declared twice at the top level`, dupes.length === 0,
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
for (const file of APPS) {
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
for (const file of APPS) {
  const src = read(file);
  const present = new Set([...src.matchAll(/\sid="([^"]+)"/g)].map(m => m[1]));
  const wanted = new Set([...src.matchAll(/getElementById\('([^']+)'\)/g)].map(m => m[1]));
  const missing = [...wanted].filter(id => !present.has(id));
  ok(`${file}: every id the script fetches is in the markup`, missing.length === 0,
     missing.map(id => `#${id}`).join(', '));
}

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
