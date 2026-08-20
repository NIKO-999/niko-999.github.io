# Working on this repo

Three single-file apps that share a design system:

- `trading/index.html` — the ledger, calendar, log, metrics, risk,
  backtesting, resources and the check-in
- `arc/index.html` — the vision board and long-term timeline
- `days/index.html` — habits and reminders
- `shell.css` + `shell.js` at the root — the shared shell all three
  consume. A rule that only two of them need belongs in the two, not
  in the file every one of them loads.

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

**Habits never reach the money either** — which is why they are not in
that app any more. `habits.v1` holds only its own days, and `days/`
reads no ledger key at all. Both screens keep their IIFE wrappers:
`renderHabits` and `renderReminders` are the only names that escape,
and the two would otherwise collide with each other over `due`,
`rate`, `chain` and `state`.

**The check-in did NOT go with them.** It reads the ledger in three
places — it locks once the day has a trade on it, and it colours both
the pad and its log by what that day made. It is a trading instrument
that happens to ask about you, so it stays with the thing it reads.

**The habit list is code, not data.** Only the days are saved. It used
to be written alongside them and read back in preference to the file,
so any browser that had ever ticked a box kept whatever the list was
when it first saved: reordering did nothing and a new habit never
arrived at all. Nothing in the app can edit it, so there was never
anything to preserve — and the one array in `DEFAULT` decides the rows,
the pips in every cell, and the arms of the radar, in that order.

**Colour on that screen says WHICH, never whether.** The screen had
none on purpose: a wash of red across a week you missed is a judgement
about you, and that is what makes you stop opening it. A habit's colour
is an identity, so a kept mark takes it and a missed one stays hollow.
The six are never an accent (the accent moves with the palette) and
stay ΔE ≥ 12 from the four split colours, which are on the same screen.
`tests/days.js` measures this in Lab rather than comparing hex.

A damaged stored shape is **repaired, not discarded**. Rejecting the
whole object because the definitions list is broken throws a year of
days away with it, and the two are independent: the days are what you
cannot get back.

**Backtests never reach the money.** The equity curve, win rate, capital
and drawdown are summed by walking `state.events`, so a rehearsal that
risked nothing must not be in it. R is allowed on a run you wrote up —
it is one figure on one row and nothing aggregates it.

**Reminders are their own screen and their own key** (`reminders.v1`),
not part of habits: a habit is a shape you are keeping, a reminder is
one thing on one date that stops existing once it has happened, and
sharing a part of life is not enough to share a page.

They are also the one exception to the rule below. Delete is final there
and there is no bin, deliberately: a bin protects a record you cannot
rebuild, and a reminder you have dealt with is not a record of anything.
Everything else keeps its bin.

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

`tests/run.js` also refuses to run if `tests/` holds a file the SUITE
list does not name. The list is ordered on purpose so it cannot be a
directory scan — but a hardcoded list silently skips what is not in it,
and it did: a new file was added, the suite reported all green, and none
of its assertions had run. Nothing is more expensive than a test that is
not running and looks like it is.

`tests/names.js` runs first and needs no browser: duplicate top-level
declarations, duplicate ids, ids the script fetches that are not in the
markup, `var(--token)` where the token is defined nowhere, and the IIFE
wrapper in `shell.js` that is the only thing stopping its `KEY` /
`readStore` / `mode` from colliding with the apps.

**Add a new app to that file's list the day you create it.** `days/`
shipped with a `var(--ink-on)` whose token it had not brought across —
an invalid declaration does not fall back, it inherits, so the chip ran
at 1.74:1 and looked deliberate. The static check would have found it
in a tenth of a second; a browser test found it four minutes later.

**A check only sees what is on screen.** The habits "nothing is red"
scan ran at a point where the month was up, so the week strip was empty
and its marks were never looked at — painting every missed pip in the
week red passed it cleanly. It now drives the scale switch itself and
scans both. If a screen has two renderers, visit both.

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
