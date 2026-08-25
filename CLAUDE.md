# Working on this repo

Single-file apps that share a design system:

- `trading/index.html` — the ledger, calendar, log, metrics, risk,
  backtesting, resources and the check-in
- `days/index.html` — habits and reminders
- `orrery/index.html` — the star chart over an Obsidian vault
- `shell.css` + `shell.js` at the root — the shared shell they all
  consume. A rule that only two of them need belongs in the two, not
  in the file every one of them loads.

**`arc/` is not an app any more.** It held a vision board and a
long-term timeline and both are gone, along with its five test files.
What is left in that folder is not optional and must not be tidied
away: `arc/bg/` holds the fourteen backdrop photographs that
`shell.css` names by path, and `arc/fonts/` holds the face every app
preloads. Delete the folder and every screen loses its wallpaper.

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

## The sweep

`.claude/workflows/sweep.js` drives the orrery across every state —
flying, zoomed to both clamps, mid-drag, both themes, every palette,
damaged input — and reports what it measured. Run it with the Workflow
tool by name before shipping anything that touches the map, or when
something is reported as glitchy and hand-measurement has not found it.

It earns its keep. Its first run filed 21 findings and all 21 were
real — including the chip ballooning 2.38x through a camera flight,
which was the cause of a "glitchy when it zooms in" report that had
been chased by hand three times and missed.

**It has no verify phase, deliberately.** There was one: a panel told
to REFUTE each finding, defaulting to refuted when uncertain. Across
two runs it dismissed about sixteen findings that were real and
correctly killed almost nothing. Gating on it would have shipped none
of the fixes. The failure is structural rather than bad luck — an
agent asked to argue will always find words, and one that could not
reproduce something writes a confident essay instead of saying so. It
also cost about half the run's agents.

What validates a finding is reproducing it, which takes about thirty
seconds because every finding carries its steps and its numbers. That
contract is the whole design: **a finding arrives with a repro and a
measurement, or it does not arrive.**

If a verify stage is ever wanted back, it must be told to REPRODUCE
and report what it measured, never to argue. A verifier that must
produce a number either confirms it or reports that it could not, and
both of those are worth having.

## The review skill

`.claude/skills/review/` writes the weekly review into the Obsidian
vault. The intelligence lives in a session and never in the apps —
which is the only way they keep the promise that nothing leaves the
browser. No model, no key, no network call goes into `trading/` or
`orrery/` to make this work.

**It only runs where the vault is.** A cloud session cannot see a folder
on the user's machine, and the workaround does not exist: this
repository is **public**, served at niko-999.github.io, so a note
committed here is a note published. The skill says so and stops rather
than improvising.

The backup is its input, which is why the copy now carries `checkin`
and `risk` alongside the events. It said "a copy" and did not carry the
mornings — silent, because the file wrote and restored without
complaint. A trade can be rebuilt off a broker statement; how you felt
before you took it cannot.

## The map's chrome

**One card, and it is glass.** There were two: Categories top-left and
The field bottom-left — notes, links, categories, loose ends. Four
figures that do not change while you look at them, parked over a corner
of the thing that does. They are answers now: ask Jarvis and he says all
four, which is where a number you want once an hour belongs.

The card that stayed is translucent over the backdrop photograph, blurred
and desaturated. **The alpha is not free.** It is mixed off `--menu`
rather than `--glass` — near .75 in both themes — because the rows are
6pt type over a photograph, and an unblurred or thinner card puts them
at a contrast ratio that looks deliberate and is not. `tests/orrery.js`
measures every row on real pixels at every backdrop; thin it and the
measurement is what says so. It also proves the glass IS glass: `--menu`
does not move with the backdrop, so anything inside the card that
changes when the photograph changes got there by being seen through.

**Jarvis lives in the field he is asked in.** A labelled button in the
top bar made him read as a mode you put the app into, and it was a sixth
control on a row that had five. Icon only, named by `aria-label` and
`title`, accent when he speaks.

**His answer strip sits at z-index 40, and that is measured.** The strip
is anchored in the top bar and the cards in the stage, so the two meet
in the root stacking context: at 4 the Categories card at 5 painted
straight over the answer. The answer was still there underneath, which
is worse than no answer.

## The rim

**The rim says what the vault is ABOUT.** Three registers of type round
the limb: the region's name, and its contents ranked the way the vault
ranks them, most-linked first. It replaced four atmosphere hairlines, a
hundred and eighty identical ticks and a dotted ring — three hundred-odd
marks of even weight carrying nothing. The map answers what is near what
brilliantly and answers what is in here nowhere; that gap is the rim's
job.

**The old rule said NO RIM TYPE** and the reasoning was sound as far as
it went: the poster this came from is a print, and a print has to say
what it is because nothing else on the page will. That argument only
holds against type that says what the thing IS. Type carrying
information the map cannot is not furniture competing with the notes.
The rule still stands for a title, a legend, or a sentence about the
instrument.

**Type on a path runs the way the path is drawn**, so the bottom half of
the circle is drawn backwards or every word down there is upside down.
Nothing about the bounding box tells you which — `tests/orrery.js` reads
the path's first point and compares it against both ends.

**The colour is mixed toward `--ink`, and the number is measured.** Drawn
in the raw category colours at the opacities it was designed at, the rim
ran **1.40:1 to 3.67:1** over three backdrops in two themes and looked
deliberate — the failure this repo has shipped before. 65% of the
category over 35% ink clears 4.5:1 everywhere with margin and still
reads as that category's hue; past 75% it loses the bar again.

**Size did more of that work than opacity.** Below about 5 CSS pixels
antialiasing alone caps what is reachable, so no opacity rescues type
that is too small. A third register held a census — *n* notes, *n*
links — and it is gone, but not for contrast: the Categories card is on
screen with exactly those counts, so the rim was repeating the loudest
thing next to it.

**Each register is named on the element** (`or-rim-n`, `or-rim-c`). The
tests keyed off `font-size` for one round; a type change then silently
stops finding what it was watching, and a check that finds nothing
passes.

**It dims with the isolate**, through the same `orPaint.hubMatch` every
hub uses. A rim naming all seven regions at full weight while the map
shows one is the loudest contradiction on the screen.

## Options come from lenses, not from one mind

The first six rim proposals were six variations on *instrument bezel*
and read as one idea shown six times, because they came from one pass of
one mind converging. The second round put six agents on deliberately
distant lenses — an old sea chart, a clock of the vault, a machined
object seen edge-on, language, something grown or eroded, and absence —
each forbidden the others' vocabulary. Four returned something nobody
had proposed; the one that shipped came from the lens that had to argue
its way past a house rule to exist.

**Every proposal was rendered in the real app before it was shown.**
`.claude/workflows/` has the harness: an agent writes a generator, the
harness injects it into the live page over the real vault and
screenshots both themes, and the agent has to READ ITS OWN SCREENSHOT.
An agent that only writes SVG returns something plausible. The round
before this one was rejected as "too cartoonish" because the drawings
looked better than the thing did.

## The field settles

Switching formations, or letting go of a dragged note, used to make the
field visibly ring — a note would arrive at its new home, overshoot,
and swing back, which read as a spider web being shaken rather than a
diagram forming. One constant, `SIM.damp`, decayed every node's
velocity by the same fraction every tick, tuned by eye against
Orrery's own home spring — the softest one there is. Terraces and
Chord hold a note up to 3.4x harder, a hub sits on top of that again,
and the SAME constant left over that stiffness underdamped: the
stiffer the pull, the more it rang.

Fixed by deriving each node's damping from its OWN spring rate rather
than reading one constant off `SIM`: `orSim.DP[i] =
exp(-2·ζ·√HK[i])`, the standard figure for a critically damped spring
of rate `HK[i]` at a one-tick timestep, computed once in `orSim.seed`
alongside `HK` itself. `ζ` sits at .9, just under critical — 1 kills
the overshoot but also reads as inert, like a diagram snapping into
place rather than a thing that had somewhere to be. Measured on the
stiffest real case in the seed vault (Orrery → Chord, the note that
moves farthest): the overshoot past its own home fell from roughly a
fifth of the distance it had to travel to under a tenth.

`SIM.damp` still exists — it is what a HELD node bleeds its
pointer-given velocity down by while your hand is still on it, which
is a different question from how a released spring settles, and nudging
one must not silently nudge the other.

**The test is the mechanism, not a threshold on a noisy multi-second
trace.** A node's damping compared under Orrery and under Chord has to
come out different; reverting `orSim.DP` to the old flat constant
makes them equal, which is what `tests/orrery.js` actually asserts.
The behavioural trace underneath it — watch the worst-case note settle
after a real formation switch — carries a wide margin on purpose: the
exact figure jitters run to run, and catching a damping constant
reverted to flat is the assertion above's job, not this one's.

## The passage

Clicking a star used to move the camera on a CSS transition — linear
in `transform`, which moves the SCALE linearly. What the eye reads as
speed is d(ln z)/dt, not dz/dt: going 1→1.2 and 2→2.4 are the same
amount of travel, and a flight in to 2.4x always read as giving up
halfway, whatever easing curve was bent over the linear ramp.

The camera is driven per FRAME now, on `z(t) = z0·(z1/z0)^S(t)` — ln z
moves at a rate S sets, not the raw scale — with pan following the 1/z
law so the star you asked for slides to the middle EARLY and the back
half of the flight is closing on something you are already looking at.
S is an explicit velocity profile — pull away, cruise, berth, with
smoothstep shoulders — three numbers you can hold an opinion about,
which a cubic-bezier is not.

**`state.zoom` is now wherever the camera actually is, every tick.**
It used to hold the flight's DESTINATION for the whole trip, with the
visible position catching up underneath — which is why the old wheel-
mid-flight test asserted `after < claimed`: `claimed` was the stale
2.4, and the fix was proven by the multiplied result landing under it.
Under the passage `claimed` is already the true position, so the same
interruption naturally gives `after ≈ claimed × 1.25` — a bigger
number, correctly. A test asserting the old inequality is testing the
old bug's symptom, not the invariant; asserting `zooms 1.25x from
where the camera IS` is what survives the rewrite.

**Debris rushes outward from the star you are flying to, for a flight
that gets CLOSER only** — orClose's glide back to the fit is a return,
not a passage, and spawns none. Eight-odd streaks, `<animateMotion>` +
`<animate>` on `opacity`, the same declarative bead orSignal already
sends down a link: dies with the element, nothing per frame once it is
spawned. Measured at under a millisecond of synchronous JS per streak
and zero ongoing cost — the motion runs on the browser's own SMIL
timeline, never through the camera's rAF loop.

**`begin`, including the IMPLICIT default of 0s, is measured against
the SVG document's own animation clock — never against when the
element joined it.** A dynamically inserted `<animateMotion>` with no
`begin` looks like it starts "now"; on a page open more than about
`dur` seconds, "0s" on the document's clock has already passed, and
the browser resolves it straight to its frozen end state on arrival.
No motion, no error, nothing to catch by looking at the element a
moment after creating it. **orSignal's own bead has carried this since
it shipped** — a dot that lands on the right point of the right path
and vanishes 950ms later reads as a dot doing its job, not as one that
never moved, which is exactly how it went unnoticed. Known, not fixed
here: fixing it is one line the same shape as the one below, but it
was not what this pass was asked to touch.

The fix is the SMIL API built for this: `begin="indefinite"` turns off
the automatic clock-relative start, and `beginElementAt(offset)`
schedules it `offset` seconds from NOW, genuinely relative to
insertion. `tests/orrery.js` proves it the only way that means
anything — its own browser, held open several REAL seconds before the
first flight, so the assertion is running in the exact window the bug
needed. Sampled from inside the camera's own rAF loop, not a separate
timer: a `setInterval` competing with a live flight for the main
thread starved for most of a second in testing, which is a measurement
artefact worth knowing about on its own, not a verdict on the frame
cost — the actual synchronous cost of a tick, measured directly, is a
fraction of a millisecond.

## The ambient field

Asked for "debris and particles... always there, not just event-
triggered," which is two words and was built as two mechanisms —
`orAmbient.trickle` answering "debris," `orAmbient.wander` answering
"particles" — rather than one setting tuned two ways. **Only the
trickle is left**; see the end of this section for where the particle
half went and why it is not worth reviving as it was. **Options came from lenses again**: four
agents (a straight-line parallax drift, the flight debris run as a
permanent trickle, the existing dust breathing in place, and motes
ambling on a curved path) each rendered their proposal in the real app
across three moments of its own loop, not a single still — motion is
the entire subject, so a still is not a proposal. `.claude/workflows/
particle-lab.js` and `particle-render.js` are the harness, mirroring
`rim-lab`/`rim-render`. The trickle and the wander were the two that
survived; the honest write-up on the breathing-dust one said so itself
— "this may genuinely be too little to answer the ask."

**It is built once, at boot, and lives outside `#orRings`** — same
reasoning as `orDebris`: a filter keystroke or a re-file repaints
`#orRings` wholesale, and content that lived inside it would be rebuilt
or wiped on every one of those. `#orAmbient` sits as a sibling instead.

**A generated `<style>` must never go in `<defs>`.** Nothing generates
one any more — the wander was the only thing that did — but the trap is
worth keeping, because `<defs>` is right there and is where `orDebris`
puts ITS gradient. `orPaintRings` owns `<defs>` and overwrites its
`innerHTML` wholesale on every repaint, for reasons that have nothing to
do with the ambient field, and the failure is silent: the elements
survive (they are not inside `#orRings`), only their `@keyframes` do
not, so the field looks correct in a screenshot and is frozen the moment
anyone touches the map. A `<style>` is document-wide regardless of where
it sits, so `<head>` is both safe and free. Whatever tests this has to
measure MOTION across a real `orPaint()` and not element counts — a
count is exactly what this bug sails through, since nothing about the
count ever changes.

**It is a handful, on purpose, and the number is not a taste call — it
is a budget.** `tests/orrery.js` already asserted "almost nothing on
the map is in continuous motion" (`< 12%` of every SVG element sitting
inside a running animation), written after the old precession bug
animated the ancestor of the entire drawing. The existing dust shells
already spend most of that budget — 10.8% before this shipped. The
first cut of this field (5 trickle streaks, 9 wander motes, each
trickle streak wrapped in an extra `<g>` for no reason that survived
scrutiny) landed at exactly 12.0%, which is not under 12. Dropping the
redundant wrapper and trimming the counts brought it under — the fix was
making the feature cheaper, not moving the ceiling: the ceiling is
correct and the budget was almost entirely spent already. Every later
attempt to add to this field ran into the same wall, which is the
honest reason there is so little of it.

**Reduced motion does not freeze this field — it is never built.** The
trickle is entirely a property of its own animation: its line has no
opacity outside its keyframes, so `animation: none` under
`prefers-reduced-motion` would leave a static line at full strength —
worse than absent. `orAmbient.boot` checks the media query itself and returns
before building anything, the same shape as `orDebris.spawn`'s own
check.

**Eleven particle fields were rendered and none of them shipped.** The
ask was for visible drifting particles; the options ran from bokeh and
motes through embers, fireflies, streams and a depth swarm, then a
second set varying silhouette (spikes, angular flecks, hollow rings),
colour (tinted by the nearest note's folder) and distribution (clumped
flocks). Flecks were picked, built, tested, deployed — and then looked
at for a day and removed. They are worth knowing about rather than
re-deriving: `.claude/workflows/look-render.js` renders any of them
over the real vault in both themes, and the generators are small.

**What the exercise actually settled** is that the map does not want
another scatter of light in it. It already has ninety-odd field stars,
sixty gradient-haloed notes and a photograph behind all of it; a new
particle layer either disappears into that or competes with the notes,
and flecks were the version that competed. If this comes up again, the
thing to try is not another texture — it is motion the map does not
already have, or something that carries information the notes do not.

**The wander motes went with them, and stay gone.** They were cut to
pay for the flecks' budget, and the reason they were the right thing to
cut outlived the feature: they cost six elements, and they carried the
only CSS filter in the app — the six `blur(.35px)` motes that were the
cause of the flight stuttering on a Retina Mac. There are now no CSS
filters anywhere on this map and `orAmbient` no longer generates a
`<style>` at all, which is worth more than the motes were.

**A comparison sheet has to show a treatment at ITS OWN SIZE.** The
eleven particle options were rendered at the stage's real 758px and
then laid out in a grid at 372px a cell, so every one of them was
judged at half scale. The choice was made on an image that understated
how loud the winner is. Render the grid at whatever size, but send the
pick at 1:1 before building on it.

**And it stops dead while the camera is flying — which it did not, and
that shipped.** Everything the map draws sits inside `#orView`, so a
flight rescales all of it every frame, and anything still animating
through that cannot be cached: it is re-rasterised at each new scale.
There was already a rule pausing exactly that, and a comment above it
explaining why. It named `.or-turn` and the three dust shells — the
three layers that existed when it was written — so the ambient field,
added later and sitting in the same subtree, animated straight through
every flight and carried the app's only CSS filter (six `blur(.35px)`
motes) while it did. It reported as **"the fly-in glitches its way to
the star on a Mac"**, which is where it would surface first: a Retina
panel renders each of those frames at four times the pixels this box
does.

The fix is stated as a property of the subtree rather than a list of
its members — `#orSvg.or-flying #orView * { animation-play-state:
paused }` — so the next layer is covered on the day it is added. Two
things that fall out of that and are worth knowing:

**It has to be `!important`, and that is load-bearing.** `orAmbient.
wander` gives every mote its own keyframes through an INLINE
`animation` shorthand, and `orTwinkle` writes `style.animation` onto a
halo. An inline shorthand beats any selector however specific, and
resets `animation-play-state` to `running` on the way past. Without
`!important` the rule covers only what happens to be styled from a
sheet — the same shape of failure as the list it replaced.

**SMIL does not read `animation-play-state`, which is the only reason
the rule is allowed to be this blunt.** The flight debris is
`<animateMotion>` and MUST run in exactly this window. That is a claim,
and `tests/orrery.js` measures both halves in the same window: zero CSS
animations under `#orView` mid-flight, and the debris demonstrably
still moving.

**The old check had the rule's own blind spot**, which is why it caught
nothing: it read `animationPlayState` off `#orNod`, `#orDustA` and
`.or-turn` by name. A layer added afterwards passed it without ever
being looked at. It counts every element under `#orView` now. Twice
now, a hardcoded list of what to check has silently skipped what was
not in it — the other time was `tests/run.js` — and both times the
symptom was a green suite that had not run the assertion that mattered.

## Jarvis

A librarian, not an oracle. Every branch of `orAsk` answers out of the
index already in memory — a category, a folder, a title, what links to
what — so a question costs a lookup and reaches nothing. `tests/
orrery.js` watches every request the page makes across the whole Jarvis
pass and fails if one leaves the origin. That assertion IS the feature:
it is what refuses a model, a key or a lookup added later to make him
cleverer.

**He refuses exactly one thing, deliberately: a view.** Ask what he
makes of a note and he says he cannot, opens it, and puts a written
prompt on your clipboard for the session on your machine that reads the
files — the review skill's job, not his. A model pretending to have
read your vault from inside a static file would be wrong in a way that
sounds right, and you would have no way to audit it.

The prompt is rendered BEFORE the clipboard write and upgraded to
`copied` afterwards. Rendering only inside the promise callback left
the strip showing the answer to the previous question for as long as
the write was pending, which reads as him ignoring you.

**Typed in, spoken back.** Speech synthesis is local and free.
Dictation is not — `SpeechRecognition` in this browser uploads the
microphone to a server — so there is no listen button and there will
not be one.

**No voice that leaves the machine is ever chosen for you.** Chrome
lists "Google UK English Male" beside the OS voices; it is the best
thing in the list and it synthesises on Google's servers, so speaking
with it uploads the sentence — your note titles, your folder names — to
be spoken. Nothing automatic reaches those: `orVoice.list` is
local-only, filtered on `localService` and by name as a backstop for a
browser that leaves the flag unset.

**But refusing on your behalf was the wrong shape, and shipping that was
a mistake.** A stock Mac has exactly one local British voice and it is
the compact MacinTalk one, so "local only" quietly meant "sound like a
railway announcement, permanently". The promise here is that nothing
leaves without you saying so — not that you may never say so. The cloud
voices are listed, marked on the chip (an arrow and a dashed edge, never
colour: the accent moves with the palette and a warning that changes
with the wallpaper is not a warning), and taken only on a press.

The consent is stored **beside** the name, not folded into it. A
remembered cloud voice whose flag is gone falls back to a local voice
rather than quietly resuming an upload on the next reload. While one is
in use the mic button's own label says so — it is the only thing on
screen that is always there to say it.

Playwright's request interception cannot see speech traffic, so these
assertions are the only thing guarding any of it. Prove them by making
the remote voice outrank the local one: an earlier version pitted a
cloud voice against a `WANT`-listed local one that already beat it on
rank, so it passed with the filter deleted.

**Then locale, then tier, then warmth.** macOS ships "Daniel" and
"Daniel (Enhanced)" as two entries sharing a base name; the plain one is
the compact MacinTalk voice and it is what "extremely robotic" sounds
like. Ranking by name first picked it whenever both were installed.
Locale outranks tier — a premium American is still American, and the
accent was the ask.

If the best available is still base-tier, he says so and gives the
macOS path to download an Enhanced or Premium voice. On that machine the
fix is a download, not code, and pretending otherwise wastes your time.

**The voice is chosen by asking, not by a control.** `voices` lists the
local ones as chips; pressing one switches and leaves the list up,
because you are auditioning. `use Serena` does the same by name. It is a
thing you set once — a seventh button on a bar that just lost two would
be the wrong trade.

The list is populated asynchronously in every browser that has one, so
the pick is deferred to the first thing he says and cleared on
`voiceschanged`. Your choice is stored by name and re-resolved, never
held as an object across that event. The toggle costs the voice and
nothing else: the strip under the box is written either way.

**NOT `orVoice.name`.** Every function already owns a non-writable
`name`, and assigning to it fails silently outside strict mode. That
field held the voice you chose; the `localStorage` write beside it
succeeded, so the choice was durable and simply never applied — read
back as the string `"orVoice"`, matched nothing, defaulted every time.
`tests/names.js` now refuses `name`, `length`, `caller` and `arguments`
as state on any top-level function. Namespacing onto a function is the
pattern this whole codebase uses (`orSearch.t`, `orPaint.match`,
`orLoose.miss`); this is the one square on that board that is mined.

**Speech can never take the answer down with it.** Assigning a voice
throws if the object came from a `getVoices()` batch the browser has
since replaced. `orReply` writes first and speaks second, and the speak
is wrapped — a throw on the way to the speaker would otherwise come back
out through `orAsk` and lose the sentence you asked for.

**The grammar is ordered and the order is load-bearing.** `review` is a
word in the advice branch and the title of a note in the seed, so "what
links to the review" has to reach backlinks first. There is an
assertion holding that order.

**The answer never outlives the question.** Typing again clears the
strip — a reply left up under a box that now says something else reads
as a reply to what you are typing now. Escape takes the answer first
and the filter second, and BOTH branches call `preventDefault`:
Chromium clears a `type="search"` input on Escape by itself, and that
native clear emptied the box without touching `state.q`, leaving the
map filtered by a word no longer on screen with no visible way to clear
it. Enter cancels the pending `orSearch` debounce for the same reason —
without it the filter lands 140ms later carrying the whole question.

## Git

Develop on the designated feature branch. Deploy by fast-forwarding
`main` — only when the suite is green. Never open a pull request unless
asked.
