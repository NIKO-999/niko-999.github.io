# Working on this repo

Two single-file apps that share a design system:

- `trading/index.html` — the ledger, calendar, log, metrics, risk, backtesting, resources
- `arc/index.html` — the vision board and long-term timeline
- `shell.css` + `shell.js` at the root — the shared shell both consume

No build step, no framework, no CDN. Vanilla JS, everything inline, one
file per app.

---

## Layout

**Side by side means the same box.** Anything sitting on one row —
panels, cards, figures, halves of a split — is the same width, the same
height, and top-aligned. Two things of the same kind at different
heights read as a mistake, because they are one. In practice:

- The container stretches its children (`align-items: stretch`), it does
  not let each take its own height.
- Give the drawings the same viewBox and the same drawn scale, not just
  the same frame. A matching card around a visibly smaller picture still
  reads as mismatched.
- Make the part that varies absorb the difference: let the figure grow
  into whatever height the row settles on and centre inside it, so a
  caption wrapping to two lines on one card and one on the other cannot
  push the two pictures out of line.
- One exception, and only one: a **folded** panel is a title bar and
  opts out with `align-self: start`. Stretching it to an open
  neighbour's height leaves a title bar on 300px of nothing, which is
  worse than the mismatch.

`gauntlet.js` measures this on every view. It reports `SIBLINGS` when
two boxes share a row and disagree.

**Folding panels** follow the gate's alignment table: a `<button>`
inside the `<h3>` (never an `<h3>` inside a button — invalid, and it
loses the heading for screen readers), `aria-expanded` / `aria-controls`,
the shared `chev` icon rotated **180°** when open (90° lays it on its
side), and the state remembered per panel in localStorage. Default shut:
a reference you cannot put away stops being a reference and becomes
furniture.

---

## Names

Three functions and two CSS classes have been silently clobbered by
generic names in this file's history — `clock()`, `pick()`, `.live`,
`.grid`. A collision here does not throw; it replaces, and the symptom
turns up screens away.

- Prefix anything a screen owns: `bt*` for backtesting, `cp-*` for the
  candle panel, `rs-*` for resources.
- Before adding a top-level function or a CSS class, grep for the name.
- Descendant-scoping (`.bt-fig .cell`) is not enough on its own: a later
  global rule still supplies every property yours does not name.

## Data

Everything lives in this browser and is never uploaded. `ledger.v1`
holds trades and capital; `backtest.v1`, `ledger.res.v1` and the rest
keep to their own keys.

**Backtests never reach the money.** The equity curve, win rate, capital
and drawdown are summed by walking `state.events`, so a rehearsal that
risked nothing must not be in it. R is allowed on a run you wrote up —
it is one figure on one row and nothing aggregates it.

**Nothing deletes without a way back.** Removals go through a bin: 30
days, 50 records, the chart blob swept with the record. The one delete
that asks first is emptying the bin, because that is the one that is
final.

Chart images live in IndexedDB (`SHOTS`), keyed by record id, never in
localStorage — two screenshots would blow the 5MB quota and take the
ledger with them. Backtest charts use a `bt-` prefix so the two stores
cannot collide.

## Writing

House voice: terse, declarative, second person. Say what a thing is and
what it is for, not what was built.

- **No instrument or pair names anywhere** in written-up content — no
  gold, silver, NQ, YM, RTY, ES, GBP. The models are the point, not what
  somebody traded them on. The ledger's own `sym` field is exempt: that
  is the user typing what they traded.
- **An order block is a CISD.** Use the account's terminology, not the
  source's, even where the source disagrees.
- No peer references, no Instagram, no dialogue from transcripts.
- Comments explain *why*, at the place the decision lives. A comment
  that restates the code is noise; one that records what was tried and
  rejected is the only copy of that.

## Verifying

    npm install     # once
    npm test        # everything, ~4 minutes
    npm test bt     # one file

`tests/run.js` owns the server: it finds a free port, serves the repo,
waits for it, runs every file and tears it down. It used to be a server
you started by hand in another terminal, and the failure mode was ugly —
the server dies, thirteen files report connection refused, and the output
is indistinguishable from thirteen regressions.

`tests/lib.js` finds a browser. Prefer it over hardcoding a path:
playwright-core resolves Chromium by the build number it was compiled
against, so asking the disk what is actually installed is what makes the
suite survive a different machine. Override with `CHROME=/path npm test`.

Add to the suite rather than checking by eye. Measure the composited box,
sample real pixels, read values back out of the page. "Looks fine" has
been wrong about the font axis, an upscaling image viewer, a 1.02:1
contrast ratio and two class collisions.

`tests/names.js` runs first and needs no browser: duplicate top-level
declarations, duplicate ids, ids the script fetches that are not in the
markup, and the IIFE wrapper in `shell.js` that is the only thing
stopping its `KEY` / `readStore` / `mode` from colliding with both apps.

`tests/gauntlet.js` reports faults rather than passes, and runs last.
When it names something, either fix the layout or narrow the check —
but only narrow it when the thing it compared genuinely cannot be
ragged, and prove the narrowing by breaking something on purpose and
watching it still bite.

**The apps have no dependencies.** `package.json` exists for the test
suite alone. No build step, no framework, no CDN; both apps are still
plain static files you can open off the disk.

## Git

Develop on the designated feature branch. Deploy by fast-forwarding
`main` — only when the suite is green. Never open a pull request unless
asked.
