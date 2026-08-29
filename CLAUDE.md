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

**A later rule in the same file is the live one, and that has bitten
three times.** `.prime` kept a microphone's 13px radius from the bar it
replaced, so the add control drew as a rounded square after being
written as a circle. `.ghost svg circle` filled the view icon's ring
into a blob. And `.bar` had a whole second copy of itself at the foot of
`schedule/app.css` — 554 lines of that file were duplicated verbatim —
imposing the previous bar's padding over the padding the live rule's own
comment explained. That third one is the worst, because the numbers it
forced were themselves measured, just for a different bar, so nothing on
screen ever looked wrong. **A dead rule that still cascades is not
dead.**

Unlike `.live` and `.grid`, this IS statically decidable: it asks
whether one selector, spelled identically, is written twice in one file,
and the answer is in the text. `tests/names.js` checks it. Eleven pairs
were already standing in four other screens when it was written and are
baselined by name — a debt written down, not an approval, and each is a
place where editing the first rule does nothing. **The baseline is
checked in both directions**: a named pair that has gone fails too,
because otherwise the list rots into an inventory of things that do not
exist and quietly waves through the duplicate that replaced them.

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

## The history a row opens

The tally is five ROWS now, not five cells across, and the layout turned
because the space was measured first: across, each cell was 66px and
there was nowhere to put half a year of anything. Down, the ring and its
two lines take 131 of the 354 the page has and the rest is a 26-week
strip. **A row is two press targets** — the card logs, the strip beside
it opens the record — and they are SIBLINGS, because a `<button>` inside
a `<button>` is invalid and collapses to one press while looking exactly
right.

**The glow is ONE filter, not one hundred and eighty-two.** Every lit
day is drawn into a `<g>`, the group is duplicated and blurred, and the
copy goes behind. Each block gets its own falloff at the cost of one
filter pass over a panel that does not move. The sketch before it put a
larger low-alpha rect behind each cell: same idea, hard edges, and a
hard edge is what makes a glow read as cartoon.

**Two passes, because one is not a glow** — a tight bright core hugging
each block AND a wide faint one under all of them, which is what a light
source does. And a wider halo was measured and rejected: at blur 3.2
grown 14% the falloff reaches into the gaps and greys the unlit days
out, and losing the misses is the one thing a record of showing up must
never do.

**It is polarity-dependent and that is the design.** In a dark palette
`--ink` is near-white, so the blurred copy is a genuine emissive bloom;
in a light one it is a contact shadow. Ink on paper under a lamp glows
by casting. Seven of the thirteen palettes are dark, so both halves are
the real product — and the only literal glow available on a white page
is painting the marks in the accent, which costs the rule that one mark
means one thing at all three sizes it is drawn.

**The first sheet was judged on a wall.** 168 of 182 days lit is one
solid mass, and a per-block glow can then only show around the OUTSIDE
of it — every interior block's falloff is painted over by its
neighbours. A per-block treatment judged on a shape with no interior
gaps measures nothing.

**The veil was tuned DOWN four times, and the crop is what hid it.**
22px of blur under a 46% wash took the page away; so did 14 under 14; so
did 8 under 26; 5 under 22 lost the words. It sits at 3 under 18, where
the title, the streak figure and the tab bar are all still readable and
all still obviously behind something. Every one of the first four was
judged on a screenshot cropped to the panel — with the page out of the
frame there is nothing for the blur to be measured against. **A veil is
a statement about the thing behind it, so it can only be judged on a
frame that contains it.**

**The three figures are not the same three for every item**, and cannot
be: two of the five are ticks and three are numbers. A tick has no
average, so it gets shape — longest streak, days on now, days a week.
**And Fuel is the one number you do not want more of**: "your best" on a
calorie count calls your biggest day a win, so it says "your highest" —
the same figure, named without the praise. The unit rides the figure
rather than the caption, because `2,631` and `2.7` are unreadable side
by side without one.

It is **streak** everywhere, never "run" — the panel and the foot of the
same screen using two names for one idea in one glance.

## The head says which day, and how much of it is left

**The name, then the date and the clock.** It went in as a bare 30px
figure with the day name taken off it, on the argument that today's
card in the deck already prints the name in the accent. That argument
was right about the COLOUR and wrong about the line: a lone number
over a title reads as a count, not as a date. It is a sentence now —
"Saturday 29th · 16:19" — and the day name is repeated from the card
below on purpose, because what makes this a date is the three parts
together. What is not repeated is the ordinal and the clock.

**And the rule the name broke is intact.** The head's copy is plain
`--dim`, never the accent, so the red still marks exactly one day name
on the screen — `tests/schedule.js` holds both halves.

**The clock runs on the LIVE pass, not the render.** The minute
changes and the date does not. Half a minute of lag on a display that
only shows minutes is a clock that is never more than one minute
wrong, which is the trade for not standing a second timer up beside
the one that already runs. 24-hour, matching the span below it — a
meridiem beside an axis written in 24-hour figures is two clocks on
one screen.

**The subtitle is gone, not emptied.** It only ever held "Up at 6:00 ·
down at 22:45" — which the span below now DRAWS, with a dot on it
saying where in that window you are. A sentence and a picture of the
same fact, one under the other, is the duplication this project keeps
having to take back out. The field, its Settings row and the tap to
edit went with it, and `scClean` drops the stored key rather than
carrying it: a string nothing renders and nothing can edit is not
preserved data, it is a key that outlives everyone who knows what it
was for.

**AND THERE IS NOTHING UNDER THE SPAN BUT THE SPAN.** There was a
hero: a state, a 44px clock time and a sentence, then a 10px label
riding the dot. Each round of taking one out made the next one look
like what it was — the running block is already the one row on the
open card wearing the accent and a sweep, four inches below, and the
dot already says where in the day that is. A head that repeats the
card is a head you stop reading. `scLive` now does two things: mark
the rows behind you, and move the dot.

Asserted as the ABSENCE of the elements, never of their text — an
emptied node still reserves its line — and by measuring where the head
ends, so a rule that merely hid the hero would not pass.

**The span is the divider.** The hero used to hang off a 3px black
rule, which was the loudest object above the fold and carried nothing.
The same line is now the day's own first minute to its last — never
midnight to midnight — with the spent half in `--ink` and a dot at the
clock. 24-hour figures, because a meridiem on an AXIS says what the
dot's position already says.

**The mark casts.** Two shadows on the dot and the order is the
design: a hard ring of `--paper` first, which is what keeps it a dot
where it lands on the boundary between the spent half and the rest,
then a soft bloom of the accent outside that. Without the ring the
bloom washes the join and the mark reads as a smudge. Polarity-
dependent the way the tally's glow is — emissive on a dark palette, a
cast light on paper — and measured on composited pixels rather than
read off the declaration, as redness against the other two channels so
the check holds either way round.

**It is `role="img"` with a written label, never `aria-hidden`.** The
first and last block are the only facts up here that nothing else
repeats, so hiding it from a screen reader throws them away.

**A day with one instant on it divides by zero**, and the dot then
lands at `NaN%`, which renders at the track's left edge and looks
deliberate. The span is floored at one minute. The dot is CLAMPED to
the ends rather than the whole thing being hidden outside them: before
the first block and after the last, a dot parked on the end is the
honest picture, and a head that goes blank at 23:00 is a head that
goes blank at the hour you are most likely to be looking at it.

**`scDeckFit` has to run AFTER the head is put back.** It reads
`#scDeckWin`'s own `top`, and coming back to the week from any other
tab the hero was still hidden when it ran — so the deck was measured
against a head three registers shorter than the one it would be a
frame later, and came out that much too tall. Nothing about the deck
looked wrong, because it is a window with cards clipped inside it; the
whole visible symptom was the page dots missing, having gone under the
bar and then off the bottom of the screen. It survived for as long as
the error was exactly the hero's height and the dots had that much
slack to give. The span put another 35px on the head and spent it.

**And a ratio a change to a DIFFERENT screen can push under the bar
was never clearing it.** `.ty-hint` is 11px on the history glass —
`--g0` at 82% over a blurred page — and it sat at `--spent`, which is
4.74:1 on flat paper. Twenty-odd pixels of the page moving down behind
the veil took it to **4.43:1**. That is the tell, and it is the row
time's lesson twice: `--spent` is the LIGHTER token, and 4.74 is a
rounding error above the bar rather than a margin.

## The ring is gone

It drew today as a dial with the running span lit, and it was the app's
second view. What killed it is the head: the span is the same day drawn
the same way, on the screen you are already on, and the ring's own
middle said what the label under the dot now says. A whole tab you had
to leave the week to reach, for a picture the week now carries.

**A stored view has to fall through.** `sched.view.v1` outlives the
code that wrote it, so `VIEWS.indexOf(sv)` failing has to mean the
week rather than a blank page with a bar on it. `tests/schedule.js`
plants `ring` in the key, reloads, and measures that the deck has a
real box.

**Deleting the first arm of an if/else chain is not deleting a
statement.** `if (ring) {...} else if (tal) ... else if (fr) ... else
scLive()` sat directly under `if (save) {...}`. Taking the first line
out joined the whole chain onto the SAVE branch, so every view painted
only when it was not being saved — clicking a tab stopped painting it.
Nothing threw, the tabs still lit, and it surfaced four hundred lines
later as the friends board never claiming a code.

## The week is a deck

**Seven cards side by side, one open.** It was a single column of seven
stacked day cards, and the whole week was then one very long page on
which the boundary between Sunday night and Monday morning — the least
meaningful gap in the list — got the same treatment as the gap between
work and sleep. A day is a UNIT, so moving between days is a different
gesture from moving within one.

**Every card carries its rows; only the open one draws them.** The
first design rendered rows for the open day alone and needed a
re-render on every swipe. This way a swipe moves one class and the
browser does the rest, and the whole week is in the document for
anything that needs to read it. The shut cards collapse to bars —
length is duration, gaps are the session breaks, no words, because at
76px a name is a clipped fragment and a clipped word reads as a
rendering fault.

**MONDAY FIRST, and it used to be today first.** A rail that began on
today was right for a scrolling column: the thing you want is at the
top and the week runs away from it. A deck cannot do that — its
leftmost card would move every morning, so the week would have no shape
to remember and Thursday would sit somewhere different each time you
looked. You scroll to today instead, and where today sits is itself
information.

**A deck must not skip an empty day.** The rail drew only days with
something on them, because a column of empty cards was furniture. Seven
cards are the week's spine: a Tuesday that vanishes because you cleared
it leaves six cards and no way to put anything back on the day that
went.

**The bleed needs a scroller, and that is not a detail.** The cards run
past the poster's padding so the neighbours are cut by the SCREEN — a
peek that stops short of the edge reads as a small card rather than a
deck that continues. Bled without `overflow-x`, the page overflows
horizontally and mobile Chromium answers by zooming the whole page out:
measured at 390x844, `innerHeight` went **844 to 992**, so every
measurement was taken in a coordinate space 844/992 of the one being
photographed and the card ran off the bottom of the screen while the
numbers said it fitted.

**The height is measured, never set.** The gap from the top of the rail
to the top of the fixed bar, less what the dots take — including their
MARGIN, which is not in `getBoundingClientRect().height` and whose
omission left the dots sitting inside the bar. A constant here is the
same number written where it cannot see the hero reflow, the notch
change, or the type scale move.

**Overflow that ESCAPES its box is the kind a narrow column never warns
you about.** The day's committed hours sit opposite its name; on a 76px
shut card, with `white-space: nowrap` in a space-between head, it did
not wrap and did not clip — it ran out of the card and printed itself
over the open one beside it. `tests/schedule.js` measures every
descendant of every shut card against the card's own right edge.

**`[hidden]` HAS TO BE SAID ONCE A VIEW TAKES A `display`.** The app
puts a view away by setting the `hidden` attribute, which works only
because of the browser's own `[hidden] { display: none }` — and any
author rule outranks it. The rail was a plain block for its whole life,
so `hidden` did what it looked like it did; the day it became `display:
flex` for the deck the attribute stopped meaning anything and the week
stayed on screen underneath the friends board and the tally. Nothing
threw, the property was still being set, and it had quietly stopped
working. The dots went the same way for a different reason: they are a
SIBLING of the rail rather than a child — a page indicator that scrolls
sideways with the cards it indicates is not an indicator — so they are
a second thing to hide and were the half left behind.

**The check that missed it read the property.** `!scRail.hidden` was
true throughout the bug. It measures the LAYOUT now — on each view,
exactly one of the four has a real box on screen — because what is
drawn is the only thing the attribute was ever a proxy for.

**A CARD IS OPENED BY BEING PRESSED, and that replaced a pile of
arithmetic.** It opened by being nearest the middle of the scroller
after a swipe, which is geometry standing in for an intention, and the
geometry could not be made to work:

- A scroller stops at `scrollLeft` 0, and with the open card at 268px
  against 76px neighbours the middle of the rail at that point sits
  over the THIRD card. Monday and Sunday were not awkward to open, they
  were **impossible**.
- Special-casing the two ends made them reachable and left Tuesday
  needing two swipes, because opening a card takes it 76px to 268px and
  the deck reflows around the thing just centred — the next pass then
  finds a different card under the middle and opens that one instead.
- A lead-in equal to half the difference between the rail and a card
  fixed all of it, and had to be measured off a SHUT card rather than
  an open one, since the card is chosen while it is still shut and the
  open one is mid-transition whenever you measure it.
- Underneath all three, `scrollLeft` is measured from the scroller's
  content box and `offsetLeft` from the offsetParent, which for a bled,
  unpositioned rail is neither. Mixing them biased every comparison,
  self-consistently — the centring used the same wrong arithmetic and
  landed where the picker expected — so it only surfaced once something
  else moved the deck.

Four fixes, each correct, for a mechanism that should not have existed.
A press says which day you meant and none of that has to be right. The
whole picker, the end clamp and the lead-in went with it.

**The press target is a real BUTTON over the shut card**, not a
listener on the list item: focusable, named, and reachable from a
keyboard, so every day of the week is available to somebody who is not
swiping at all. It is a SIBLING of the rows rather than their ancestor
— a button inside a button is invalid and collapses to one press while
looking exactly right — and it is `display: none` on the open card,
where a transparent button over the rows would swallow every press
meant for a block.

**IT IS A WINDOW AND A TRACK, NOT A SCROLLER — and that was four
fixes too late.** Centring a card inside a horizontal scroller took
four attempts, each of which worked on this machine and not on the
phone. `scrollLeft` stops at 0, so the first card could never reach the
middle. Padding either side fixed that here — and Safari does not count
a scroll container's TRAILING padding in its scrollable width, so the
end of the week sat off-centre and clipped. Flex spacers fixed that,
and then the gap between a spacer and the first card was lead-in as
well. Written as `flex: 0 0 max(...)`, a math function in a SHORTHAND,
Safari's parser could drop the whole declaration and leave no spacer at
all.

A transform has none of it. The track is laid out once, a window clips
it, and the open card is centred by moving the track a number of pixels
— the same number in every engine. Nothing clamps and nothing is
silently dropped. The scroller, the snap, the end clamp, the padding
and the spacers all went.

**And the position is WORKED OUT, never read off the page.** The first
transform read `offsetLeft` and `offsetWidth` the instant the class
moved — but the card's width is transitioned, so the read describes the
layout BEFORE it and the deck centred each card where the previous one
had been. It measured 96px out on every day of the week, with the
applied transform at -551 where -455 was right: a constant error, which
is what an off-by-one layout looks like when every card is the same
size. The shut width, the open width and the gap are all tokens now,
and the deck's position is arithmetic on the three — index, then shut
cards and gaps before it, then half an open card. There is nothing left
to be stale.

The rail is `position: relative` regardless, so a card's `offsetLeft`
is a coordinate inside the track rather than inside whatever ancestor
happens to be positioned.

**`[hidden]` HAS TO BE SAID ONCE A VIEW TAKES A `display`.** The app
puts a view away by setting the `hidden` attribute, which works only
because of the browser's own `[hidden] { display: none }` — and any
author rule outranks it. The rail was a plain block for its whole life,
so `hidden` did what it looked like it did; the day it became `display:
flex` for the deck the attribute stopped meaning anything and the week
stayed on screen underneath the friends board and the tally. Nothing
threw, the property was still being set, and it had quietly stopped
working. The dots went the same way for a different reason: they are a
SIBLING of the rail rather than a child — a page indicator that scrolls
sideways with the cards it indicates is not an indicator — so they are
a second thing to hide, and they were the half left behind.

**The check that missed it read the property.** `!scRail.hidden` was
true throughout the bug. It measures the LAYOUT now — on each view,
exactly one of the four has a real box on screen — because what is
drawn is the only thing the attribute was ever a proxy for.

**Nearest-to-centre cannot reach the ends.** A scroller stops at
`scrollLeft` 0, and with the open card at 268px against 76px
neighbours the middle of the rail at that point sits over the THIRD
card: Monday and Sunday were not awkward to open, they were impossible.
At either end the answer is the end card, which is also what somebody
swiping to the end means.

**And opening a card moves it.** 76px to 268px, so the deck reflows
around the thing that was just centred and it is no longer centred —
the picker's next pass then finds a different card under the middle and
opens that one, and the deck walks sideways a card at a time without
settling. `scDeckCentre` runs after the class moves; the scroll that
causes runs the picker once more, which finds the same card and returns
at the equality check. A test driving the scroller by hand has to do
the same thing twice for the same reason.

**`scrollLeft` and `offsetLeft` are not the same origin.** One is
measured from the scroller's content box and the other from the
offsetParent, which for a bled, unpositioned rail is neither. Mixing
them put a constant bias in every comparison, and it was
self-consistent — the centring used the same wrong arithmetic and
landed where the picker expected to find it, so it only showed once
something else moved the deck. Two viewport rects need no origin at
all.

**The card OPENS rather than jumping open, and the re-centre is smooth
only when it is a correction.** A whole card's width appearing in one
frame, with the deck shuffling in the same frame to keep it centred,
read as a snap on the end of your own swipe. Width is a layout property
and animating one is usually the wrong answer — here there are seven
boxes, all siblings of a fixed-height scroller, so the reflow is
bounded, and a transform cannot do the job because scaling a 76px card
to 268px stretches its type. **Both states must be a length**: between
`auto` and a number there is nothing to interpolate, and a transition
naming `width` over an `auto` does nothing while looking identical in
the stylesheet — which is what the test asserts rather than the
declaration. Arriving at the screen stays instant: a week that appears
already mid-animation looks like it was left running while you were
somewhere else.

## The card has a back

**The objectives live on the back of the day's own card**, because they
are the same day seen from the other side. The schedule says when
things happen; this says which two or three of them actually matter. A
second screen for three lines would be a tab you stop opening.

**AND EVERY CARD IS ITS OWN DATE, which it was not.** `scObjBack`
resolved a card through `scDateOfDow` — the TICK path's resolver,
which looks back over the two-day backfill window and then returns
TODAY so `scTallyOpen` can refuse a day that has shut. That is right
for a tick and silently wrong for this: every card more than two days
behind, and every day still ahead, read and WROTE today's objectives.
Friday's card showed today's list, and adding one to Friday added it
to today. `scObjDay` is its own resolver — the Monday-first week
containing today, which is what the deck is — and a day still to come
simply has none yet, because you decide an objective on the day.

**A card's own column check has to read the rows that DRAW a time.**
Narrowing the running-row check for the finished blocks left the
per-card one comparing a box that is not drawn, which reports 0,
against a real column. It passed for months and then failed on the
hour, because the real clock has to put a block behind you AND the
file has to reach that line — which is the shape of a check that only
sometimes runs. It also had to move from `=== 1` to `<= 1` plus a card
that actually has times: a shut card now contributes an empty list
rather than a column of zeros, and `<= 1` alone would pass on a screen
with no times drawn anywhere.

**PER DATE, not per weekday.** The schedule repeats — every Monday has
the same shape, which is what makes it a shape. An objective does not:
"the thing that matters today" is a decision you take on the day, and
one that repeated every Monday would be a routine wearing an
objective's clothes. Kept to a ninety-day window, because this is one
record per date and an objective from March is not something anybody
wants back.

**A SENTENCE, and there is no field for how much.** "Call a hundred
clients" is the objective. A second box for the amount would make you
take a decision apart in order to type it in, and then keep the two
halves in step. The glyph is worked out from the same sentence through
the app's own keyword table, so nothing is set twice.

**The glyph is a MARKER, not a picture.** It went in at 30px and was
the loudest object on a face whose whole job is the words — a drawing
that competes with the text it labels has stopped labelling it. 15px,
beside 13px type, with no rules between the rows: a hairline under each
makes it a table, and a table is a thing you scan for a value rather
than a list of things you have decided.

**Position is priority and the first is the frog** — the one you would
rather not start. It takes one step of weight on its words and a
heavier stroke on its glyph, and NOT a rank number: a column of figures
down the side of five short sentences is a second ordering drawn over
the one the list already has. Re-ranking is one move and always the
same move, *make this first*, because up-and-down arrows on five rows
is four presses to do what one should.

**EVERY glyph takes the accent, and that cost the frog its colour.**
They were `--dim` with only the first in red, and marking one of five
as important said the other four were not — the list is the important
thing. What it costs is real and is written down rather than papered
over: the frog is now told apart by stroke weight and type weight
alone, which is quieter than a colour. `tests/schedule.js` asserts both
halves — every glyph the same accent, and the first still heavier.

**The face names itself in that same accent.** `MAIN OBJECTIVES` is the
sessions' treatment from the front — small caps, a hairline running off
it — but in `--red` rather than `--spent`, because a grey heading over
red marks reads as a caption for something else. Drawn only over a list
that exists.

**The turn control is in the SAME CORNER on both faces.** It sat
between the day and the hours on the front and at the end on the back,
so you pressed one place to turn the card over and a different one to
come back. Asserted in LAYOUT coordinates, not client rects: the front
lives inside a 180° rotation while the card is turned, so its rects
come back mirrored — a control 11px from its own right edge reported
227px from the card's right, which is 238 minus 11, the same corner
seen from behind.

**THE TURN CONTROL WEARS WHAT IT OPENS.** It was a bare 19px glyph on
the card's own ground and it read as a decoration rather than a
control. Six affordances were rendered over the real card first — a
hairline pill, a tint chip, the glyph plus a word, the accent, a
folded corner, and a card-with-an-arrow glyph — and what settled it is
that none of the six said anything about the BACK. The pill carries
the objectives face's own two marks instead: the sheen, mixed from the
palette exactly as the back's is, and a rim that travels. The thing
you press looks like the thing it turns to.

**IT IS ON ALL SEVEN CARDS, and it was on one.** It was built `if
(isOpen)`, and the deck opens a card by moving a class rather than by
re-rendering — so the control existed only on whichever day happened
to be open when the rail was last built. Press any other day and there
was no way to reach its objectives at all; worse, the one that did
exist stayed drawn on that card once it shut, clipped at the edge of a
76px bar. Built for all seven now and put away by CSS on the shut
ones, the same way `.wk-face` is put away on the open one.

**AND IT IS HIDDEN WHILE THE CARD IS TURNED.** `backface-visibility`
held for everything on the front except this: the foil's turning
square is an animated transform, so it is promoted to its own
compositor layer, and a composited descendant of a backface-hidden
ancestor is not reliably culled with it. On iOS the pill drew straight
through the back — MIRRORED, because the back is a 180-degree
rotation, so a control 11px from the front's right edge landed on top
of the day name on the left. It reported as "the objective icon inside
the title", and Chromium does not reproduce it. The rule is therefore
about the ELEMENT rather than aimed at the bug: a face turned away has
no control to press, so there is nothing to draw whichever way an
engine would have culled it.

**A TURNED FACE IS NOT DRAWN, and `backface-visibility` alone does
not do that.** The running row's sweep is an infinite animation on
`transform`, so it is promoted to its own compositor layer — and a
composited descendant of a backface-hidden ancestor is not reliably
culled with it. On iOS the whole running row came through the
objectives face MIRRORED, over the card you were reading. It is the
pill's bug a second time, from a different element, which is why the
rule is now about the FACE: `.day.is-flipped .wk-front` goes
`visibility: hidden`, so the next animated thing added to the front is
covered on the day it is added.

**Hidden HALFWAY through the turn, not at the start of it.** The front
is the thing rotating away and you are still looking at it for the
first half. `visibility` transitions as a discrete property, so a
delay of half the flip is the whole mechanism; coming back it is
immediate, because by then the front is what you are turning to.

**The face is headed whether or not it has a list.** `MAIN OBJECTIVES`
was drawn only over objectives that existed, on the argument that a
heading over nothing names something that is not there. That was right
about headings and wrong about which nothing this is: an empty card is
not a card with no heading, it is a card with no objectives YET, and
the heading is what says so. Without it the face opens on a plus and a
sentence floating in a gradient, anchored to nothing.

**One box, two skins.** The two faces' controls have to land on the
same pixel, so the box is shared and only the surface differs. Written
as two boxes with two sets of margins they came out 1px apart across
and 3px down — which is what the same-corner check is for.

**The turning square is sized off the pill's HEIGHT**, which is its
smaller dimension, at 340% — enough to clear the diagonal of a box
three times as wide as it is tall. A non-square leaves the ends unlit
for part of every turn, which reads as a fault rather than a
highlight; it is the card's own lesson at a different aspect ratio.

**And it stops when its face turns away.** That check was written
first as "paused on every card that is not open", which found nothing
and failed for it — the control is built for the open card alone, so a
shut card has no rim to pause. The case that exists is the flip: the
front stays in the document with the schedule turned away from you,
and a conic gradient turning behind it costs a compositor pass a frame
to draw what nobody can see. **A check that finds nothing must not
pass**, so the count is asserted beside the state.

**The glyph's ground moved, so its contrast was re-measured.** `--dim`
went from flat paper to four layers of wash. Measured on composited
pixels to 3:1, because a glyph is a graphic — the arithmetic only
knows about `--paper` and this repo has already shipped one thing that
passed the arithmetic and read 2.92:1 on screen.

**The mark is a checklist and a target, reduced.** The reference had
four ticked rows and a target with an arrow through it, which at the
19px this is drawn at is a smudge with a hole in it. Two rows, one ring
and a centre. The page's outline BREAKS where the target crosses it —
drawn through, the two shapes merge into one blob. And the ring is r5
around a dot at r1.2, leaving 3.8 units of the 24 box between them:
above the 3.4 this repo measured as the floor before a closed shape
fills in. Two rings, as the reference has, leaves 3 and closes up.

**The plus is nearly nothing.** A full-width dashed box was a second
object on the card, competing with the objectives it was meant to sit
behind. It is a small mark in the glyph's own column now, and the press
target is still the 44px everything else holds to — only the drawing is
small.

**The back is the rare one.** A sheen rather than a colour: two washes
of the accent and one of the ink, angled across the same paper the
front is. It is the only surface in this app that is not flat, and that
is the point — the objectives are the one thing on the screen you chose
rather than scheduled. **Mixed from the palette, never a literal**:
thirteen themes move `--red` and `--ink` together, so a gradient in hex
would be somebody else's card on twelve of them. The alphas stay low
enough that it is a sheen and not a ground the words have to fight, and
`tests/schedule.js` measures a line of it on composited pixels.

**The rim is a foil edge, and it LOOPS.** A light that keeps going
round the card — the only thing on this screen that moves while you are
not doing anything, which is what makes the card read as something you
would keep rather than a panel. **Two boxes**: the outer one is the
ring, a border-width mask with the middle excluded, and the inner one
is a conic gradient turning at its own centre. A mask applies to an
element AND its content, which is what confines the turn to the band —
and it is why the turning box cannot be the masked one, since rotating
the ring swings a rounded rectangle round on its corner.

**The turning box is SQUARE, sized off the card's height.** A
200%-by-200% box is not square, and at 45° a non-square leaves the
ring's corners unlit for part of every turn: a gap crossing a corner
reads as a fault rather than as a highlight.

**And it is PAUSED unless the face is towards you.** Both faces of all
seven cards are in the document at all times, so left running that is
seven rotating conic gradients, each in its own masked layer, costing a
compositor pass a frame to draw something nobody can see. Reduced
motion stops the travelling and keeps the rim — the rim is the thing
that was asked for.

**`getBoundingClientRect` reports a box whether or not an ancestor is
hiding it.** The shut-card overflow check walks children now and STOPS
at anything that clips: the foil's turning square is 578px inside a
76px card and draws none of it, and a flat `querySelectorAll('*')`
reported six cards bleeding when nothing was.

**Two faces, one of them turned away** — `backface-visibility: hidden`
is what makes it a card with a back rather than two panels that swap,
and without it the schedule reads through the objectives mirror-imaged.
The turn is NOT remembered: an objective is for today, and a card found
face-down tomorrow morning is the app having kept the wrong half of a
decision.

**The back's title is `.ob-day`, not `.day-name`.** The front already
owns that class, and a second one per card made every query for the
week's day names return two — the deck read as "Tuesday, Tuesday" and
today counted twice against the rule about what the accent is spent on.

## Morning, afternoon, evening

**Noon and five o'clock**, which is where the words already sit in
English rather than anywhere this app decided.

**A RULE, not a panel and not a tint.** The card already has a heading,
a border and a shadow; three tinted blocks inside it is a frame inside
a frame inside a frame. Rendered and looked at: the tinted version put
a red wash under eight greyed-out past rows and read muddier than the
hairline, and it cost enough vertical space to lose most of a session.
This is one line of 9.5px type and one hairline.

**A session with nothing in it is not drawn.** An "Afternoon" heading
over no rows is furniture, and on a real week at least one of the three
is empty most days — the seeded Tuesday has no shift on it, which is
what makes that testable rather than merely stated. **Both directions
are checked**: watching a heading disappear would pass on code that
never drew an afternoon at all, so the test puts a block after noon,
sees the heading appear in its right place, then takes it away again.

**The headings are interleaved with the rows, not wrapping them.** A
row's own grid aligns the glyph, the time and the name; nesting each
session in a box of its own gives three separate grids that agree only
by luck.

**The session you are in takes the accent** — a fourth use of the red
on this screen, after today's name, the running block and a place. It
is the same fact as the running block seen one level up, never a
different one.

## The week's rows

**The time is ABOVE the name, and the row lost a column for it.** It sat
in a third track at the right margin, so reading a row was a movement
out to the edge and back for every line, and the name — squeezed by a
column it could never collide with — wrapped on anything long. The rows
are taller (six blocks fill the screen where seven used to) and that is
the trade: the full width for the name, and one direction of travel.

**The time is `--dim`, and `--spent` was a real regression.** It went in
as `--spent` on the reasoning that the smallest type wants the quieter
token, which has the two backwards: `--spent` is the LIGHTER one at
4.74:1, and 4.74 is a rounding error above the bar rather than a margin.
The suite caught it from an angle nothing anticipated — the running
row's sweep lays a 13% wash of the accent across that line, and a wash
over 4.74:1 is under 4.5:1.

**A glyph per row, worked out from the name, with nothing to set.** A
schedule you have to decorate is a schedule you stop keeping. It has
the gutter to itself and sits centred against the pair of lines.

**The deck did NOT reverse any of this, and it nearly did.** The lab
mock the card layout was chosen from put the time in a right-hand
column beside the name, on one line — which is exactly the arrangement
the paragraphs above record replacing, for reasons that were measured.
What was being chosen in that mock was the SESSION treatment; the row
underneath it was a lab construction nobody had opinions about, and
shipping it would have undone a decision by way of a mock that happened
to be drawn differently. The gutter narrowed from `--meas` at 52px to
30px, because 52 was the left margin of a full-width row and is a fifth
of a 268px card — the glyph is the only thing in there now, so the
column is sized to the glyph. Nothing else about the row moved.

**Tap edits; a long press ticks.** The week is where you CHANGE the
schedule, so the tap keeps doing what it always did. The long press is
550ms and cancels on any movement over 10px — without the move guard
every scroll of the deck that begins on a row fires it, because the
finger is on a row for the whole gesture and the gesture is a scroll. A
scroll inside `.day-card` does not reliably cancel the pointer on the
row it began in, so the guard is a `moved` flag rather than
`pointercancel`. The click that follows a fired press is swallowed by
an explicit flag, never by inferring from the timer: the timer is null
after an ordinary tap too, so a check on it swallows every click.

It is deliberately not the only way to tick a block — the tally does
the same thing with a plain press and always did. A long press reaches
neither a keyboard nor a screen reader, so it is a shortcut from the
row the block is on, not a feature that lives here.

**The measure is gone.** It was a rule as long as the block is — the one
thing this design added, and the reason the layout was picked. What
killed it is that the row PRINTS the range now: with `10:00–18:00` on
the line above, a bar saying the same thing is the tally-card titles all
over again. And on a real morning almost every block is under an hour,
so the rule was a 3px stub beside the glyph, reading as a stray dash
rather than as a length. Its three assertions were replaced rather than
deleted — the printed range has to be each block's real start and end,
and more than one distinct value, because a constant string is "present"
too.

**It was also the only mark for a block the tally had counted**, so
removing it silently would have made a finished block identical to an
untouched one — and the two records agreeing about one morning is why
the link between them runs both ways. That state is a tick beside the
glyph now, drawn only when the block is done: a mark that APPEARS rather
than one that changes, so an ordinary row's gutter still holds one
thing. It is `--ink`, never the accent, because the accent already means
the block running now.

**NOTHING IS DRAWN BETWEEN THE ROWS.** There was a hairline under
every one of them, and the session heading had a rule running off it
and a count of what was under it — on a full day, seventeen marks
carrying nothing. A line between every two items in a list is what
makes it a table, and a table is a thing you scan for a value rather
than a list of things you are going to do. Space does the same work
and draws nothing to do it. Six other treatments were rendered over
the real card first: one line a block with the glyph gone, the start
time only, ghosted glyphs, a vertical spine through the gutter. The
spine was the best picture and the wrong answer — it removes six rules
and adds one, which is a different ornament rather than less of one.

**A FINISHED BLOCK HAS NO TIME.** The figure is what you plan against
and there is nothing left to plan about a morning that has happened,
so the card empties out behind you as the day goes and what is left on
it is what is left of the day. Only TODAY's card: `is-past` is set by
`scLive` on `.day.is-today .row` alone, and a Monday with its mornings
rubbed out would be the deck claiming the week only runs forwards. It
costs a screen reader nothing — the row's `aria-label` carries the
full range through `scRangeLong`, drawn or not.

Measured as a BOX, never as a class or a computed `display`, and both
sides of it: "no past row draws a time" passes on a rule that hid
every time on the card, and on a day with nothing behind you it passes
by finding nothing at all.

**And the column check had to be narrowed for it.** `.t`'s left edge
is one number down the card — but a box that is not drawn reports 0,
so a finished row was being compared against a real column. It reads
the rows that DRAW a time now. The GLYPH is still every row, because
every row has one and that is the column the narrowing could have
hidden. Proven by shifting the running row's time 8px and watching it
fall over.

**The name went 16/700 to 15/600 with the rules.** The hairlines were
carrying the separation and the name was carrying the emphasis; with
them gone the name is the only thing on the row at full strength, and
16/700 sixteen times down a card reads as a wall. Three steps still —
800 running, 600 ahead, 500 done.

**A CSS comment cannot quote a close-comment marker.** Writing one in
prose ends the comment there, and every line after it becomes
declarations the parser throws away along with the next rule. This
happened twice in one edit: the comment lost its terminator, the `.ic`
rule vanished and the unsized `<svg>` filled its parent at 300x150 —
and the replacement comment, which was explaining that exact trap, broke
the same rule again by naming the marker.

**Judged at 22px, which is the size a row draws them.** Not a
formality: the first sheet had `drive` and `rest` as the same silhouette
(a body with no wheels under it is a sofa), `clean` reading as a pencil
with a plus beside it, and eat, coffee and cook as three bowls of steam
told apart only by which way a handle pointed. All four looked fine at
88px. **Two glyphs with one silhouette is worse than a glyph missing,
because the row is then confidently wrong.**

**A closed shape inside a glyph needs 3.4 units of the 24 box, or it
fills in.** The sneaker was drawn five times with a midsole as its own
band — four units deep, a 1.8 stroke on each edge, so 2.2 units of white
between them, which is about two device pixels on the row. All five
closed into a solid slab and read WORSE than the flat shoe they were
meant to beat. Anything inside an outline at this size is a single
stroke; the shape has to come out of the silhouette. The lace flap, the
heel counter and the swoosh each went the same way.

**The ORDER of the keyword table is the whole mechanism.** First hit
wins, so every pair where one phrase contains another is listed the long
way round — `walk the dog` before `walk`, `work out` before `work`,
`school run` before `run`, `water plants` before `water`, `meal prep`
before `meal`. Each was a real collision before it was a line. Matching
is on word boundaries: a substring match looked perfect on the seed and
mislabels the moment anybody types a sentence.

**And "Train" is the gym, not the railway.** It is genuinely both; this
app's own schedule ships a Train block that is a gym session, so the gym
wins and the railway is reached by commute, travel or flight. A word
that means two things has to be DECIDED, and the decision belongs in the
open where a test can hold it.

The glyphs are anonymous paths, so the icon's key is written onto the
element — without it there is no way to assert from outside that "walk
the dog" reached the paw and not the walker, which is the only thing the
ordering exists to do. `tests/schedule.js` also holds both directions of
coverage: a keyword pointing at a glyph that does not exist draws an
empty box, and a glyph nothing can reach is dead weight that looks like
coverage.

**`tests/gauntlet.js` does not visit `schedule/` at all.** Known, not
fixed here. Its twelve standing faults are all RADIUS in `jade/`.

## An invitation is a link, and the link carries the server

**A code alone names nothing.** `K7PQ2M4X` is a row in one KV
namespace, so handing it to somebody is only an invitation if their app
is already pointed at the same worker — and nothing in their app knows
whether it is. It worked because every copy shares one `HOME`, which is
a coincidence of there being one deployment rather than a property of
the design. Deploy a second and every code is ambiguous with no error
to show for it: the read misses and the app says *nobody has that
code*, which is indistinguishable from a typo.

So the invitation is a URL carrying both, and `at` is written **only
when the server is not HOME**. A link that names the default is a link
that breaks the day the default moves, and pinning every invitation to
today's address is how a rename becomes a dead link in everybody's
messages.

**It is the fragment, never the query.** Both survive GitHub Pages, but
a query string is sent in the request line and a fragment never leaves
the browser. A friend code in somebody's access log is a small thing,
and it is the only kind of thing this app has spent every other
decision not doing.

**Read at boot, redeemed at the tab.** Reading a hash costs nothing and
reaches nothing; the join and the add happen through the same
`scArriveFriends` every ordinary visit takes. An invitation that joined
a server from the wiring would be the single hole in *no request until
you are on that screen*, which is the assertion the whole friends half
is built to keep.

**The link decides the server only for somebody who has not joined.**
Once you are on one, your record and every code on your list live
there, and letting a link move you would orphan both silently — every
existing friend would then read as *nobody has that code*. A link to
another server is refused with a sentence, not followed.

**And the hash is stripped the moment it is read.** Spent, it adds
nothing on a reload; left in the bar, a bookmark of the page is
somebody else's invitation for as long as it exists. `replaceState`,
not `location.hash =`, which pushes a history entry and turns Back into
a no-op that looks broken.

**The invitation is cleared BEFORE the request, not in the callback.**
A fetch that fails offline must not leave a pending add that fires
again on the next repaint — and `scAddFriend` refuses a duplicate
politely enough that the second attempt would look like it had worked.

**The test is a second phone, and it is the only thing that can hold
this.** Every part of the feature is invisible from the sending device:
the hash being read, the server arriving from the link rather than the
build, the add happening untyped, the bar being clean afterwards. A
fresh context with nothing in `localStorage` and one URL is the whole
check. **The live worker is routed to a refusal in it** — if the link
is not read, `HOME` is the fallback, and the test would otherwise make
a real request to the deployed server and could pass while doing it.
Breaking the arrival on purpose fired that guard exactly as intended.

`navigator.share` is stubbed to record rather than open, because
Chromium has none: without it the button falls to the clipboard branch,
the link is only readable through a permission grant, and the branch a
phone actually takes goes untested.

## The one browser this is developed on is not the one it runs on

**Four fixes for one bug went out on a model of it rather than a
measurement.** The edit sheet's two time fields overflowed their row on
iOS and on nothing else, and every attempt was about track sizing —
`minmax(0, 1fr)` for the `1fr`, `min-width: 0`, `max-width: 100%`,
`margin: 0`. All four were reported back as still clipping.

It was never the track. **A natively-appearing form control in Safari
keeps its own metrics and does not take the author's.** Measured on the
phone: tracks 191px each and correct, the field's `width` computed to
191px as told, and its border box 221px — `box-sizing` came back
CONTENT-BOX in spite of the `*` reset at the top of the file. 191 of
content plus 28 padding plus 2 border is 221, and two of those overflow
by 30. `-webkit-appearance: none` is what hands the box back, and
`box-sizing` then has to be said again locally, because the universal
selector is where it was being taken from. The picker is not the cost:
tapping still opens the iOS wheel.

The tell was in the same sheet and was read past three times: `.grid2
.field` sets `min-width` and `max-width` in ONE rule, and the phone
reported `max-width: 100%` applied while `min-width` came back as
**45px**. One rule, half of it landing, is never a specificity story.

**Chromium is the only browser on this machine, and it sizes
`input[type=time]` to fit.** So every layout assertion written for this
passed identically whether the fix was there or not. A check that cannot
fail is worse than none, because it is what made three of the four
claims of "fixed" sound verified. The tests were green the entire time
the app was broken.

**What ended it was a page that took the measurement on the device.**
`schedule/probe.html` drew the row and printed its own computed tracks,
box-sizing, appearance, min-width and overflow — one screenshot, and the
cause was in it. Then the same page drew the row twice, as shipped and
with the native box forced back, so a second screenshot confirmed the
fix rather than another round of reasoning. It was deleted the moment it
had answered, which is the whole shape of the thing: **a probe is
written to be thrown away, and leaving it in is how it rots into a page
nobody dares delete.**

Only then is a test worth writing. Forcing `appearance: auto` reproduces
the phone's numbers exactly in Chromium, so the assertion is a
measurement — the fields are sized by their border box, the native
appearance is gone, and nothing draws wider than its track — and it was
proven to bite by reverting the fix and watching it fall over. **A
source-text check for the declaration would have passed on a stylesheet
that had the line and no effect.**

If a phone reports something the suite says is fine, the suite is
measuring the wrong machine. Ship a probe, read a number off the device,
and only then reason.

## "Now" is a time, and it brings an hour

The one time word with no digits in it. It resolves to the clock and
defaults to sixty minutes, for the same reason a bare "at 9" gets an
hour: that is the length of the block you would have typed, and it is
the one thing about "now" you can be wrong about without losing the
sentence.

**It is scanned whatever else the sentence carries, and used for the
TIME only if nothing else set one.** An explicit clock beats it —
somebody who says both is correcting themselves and the digits are the
correction. But the word is struck out either way and supplies the day
either way: "read now at 3" was landing a block called "Read Now" that
still did not know which day it was on, which is the app hearing the
word and using none of it.

**Two patterns, not one with an optional tail.** An optional group
after `\bnow\b` makes "now" and "now for 2 hours" the same match at
the same index, and which one wins is then the engine's backtracking
rather than a decision.

**Clamped to the end of the day, never rolled over.** A block that
starts at 23:40 and ends at 00:40 is on two days, and this app's whole
record is one day per row.

## The clock is the phone's, not the app's

Every time a PERSON reads now follows the device: 24-hour where the
phone is, 12-hour with a meridiem where it is not. `scHHMM` stays
strict 24-hour and is not part of that — it is the value an `<input
type="time">` takes and the format the parser reads back, and a sweep
that reached those fields would break the edit sheet on exactly the
phones this was written for. `scT` is what a person sees.

**Asked by FORMATTING a known afternoon time and looking for letters**,
never by reading a locale off `Intl`. The 24-Hour Time switch in iOS
Settings changes what `toLocaleTimeString` draws while the locale stays
whatever it was, so the only reliable question is what the device
actually renders. `Intl` is the fallback for an engine that says
nothing, and 24-hour is the last resort because it is the reading that
cannot be ambiguous. Resolved ONCE at boot: it cannot change without a
reload, and a locale lookup per row is sixteen a render.

**The meridiem is once per range, on the end.** A row reading
"9:00 AM–11:00 AM" spends the column the name needs, and with an end
time known and a block under twelve hours the start has one reading
anyway. The span's ends are the exception in the other direction: on a
24-hour phone an axis needs no letters, but "5:45" and "11:00" without
them are two times that could be either half of the day.

**THE SUITE'S LOCALE IS PINNED, and that is not tidiness.** With the
output following the device, an unpinned context measures the machine:
the same assertion reads "09:00–11:00" here and "9:00–11:00 AM" on a
box set to en-US, and the one that fails is the box. `PHONE` is en-GB,
and the 12-hour half is measured on its own en-US context at the foot
of the file — a format that follows the device cannot be checked on
one device.

## Nobody is called "You"

`scJoin` defaulted the name to `'You'` and PUSHED it, so every person
who had not set one was literally called that on the server. Add a
friend and the board reads "You" twice. "You" is a label for your own
row, decided when the row is drawn; it is not a name and must not
leave the browser.

Records already out there carry it, so a peer named "You" is read as
unset and falls through to their CODE — unique, and the string you
typed to add them. Nobody picks it as a nickname, and the one person
it could honestly belong to is the one row that is not drawn from peer
data.

**A profile is offered before a friend is.** Before a nickname there
is nothing to add anybody to: your row says "You", which is a label
rather than a name, and a friend who adds you back sees a code. So the
thing to do first is offered first — and it stops being offered the
moment it is done, because a "create a profile" that never leaves is a
task you can never finish. Both states are measured, since each passes
on the other's bug.

**And your own row opens you.** Rows were pressable only when there
was a friend behind them, on the rule that a name you can press which
opens nothing is worse than a name you cannot. Your own row was the
one that opened nothing — and the setting it needed was three taps
away behind a link called "Your code". A board that says "You" twice
is somebody who could not find the place to fix it.

## The first minute

**The seed was one person's real week, and it was the default.** Wake,
Train and Walk around an actual shift pattern and actual trading hours,
taken from `routine/data.js`. Every stranger sent the link opened it and
found somebody else's life filled in, down to which days they worked.
It shipped because a file that made a good default for the person who
wrote it was never asked whether it made a good default for anybody
else — it was doing two jobs, fixture and first run, and only one of
them was a default.

The app ships a generic starter now — five blocks a day most people
recognise, at times most people could live with — and the specific week
moved into `tests/schedule.js`, which is where a fixture belongs. The
argument for having a seed at all survives: a first open should be a
week with a shape rather than an empty frame with instructions in it.

**The app names its server, and the promise moved rather than went.**
`HOME` in `schedule/app.js` carries the `.workers.dev` address, so
nobody is handed a URL to type and mistype. What used to be checked —
friends is off until you turn it on — has become something stricter and
truer: **the week, the ring and the tally reach nothing at all**, and a
single request off origin before the Friends tab is opened fails the
suite. Arriving at that tab claims a code; drawing it still only draws,
which is the same split that stopped the first version recursing.

**The sentence about what leaves has to live where nobody presses
through it.** It was on the turn-on sheet, on the argument that a
paragraph you press through is a decision and one you merely arrive at
is a disclaimer. With the sheet gone that argument inverts: it sits on
the board now, visible every time instead of once.

**An init script runs on every navigation.** `tests/schedule.js` seeds
`sched.net.v1` so it never touches the live server, and written
unconditionally it put the record back to `on:false` with no code after
the page reloaded halfway through — throwing away the claim the test had
just made. It surfaced four hundred lines later as a log post that never
landed. Seed only when the key is absent.

**And a test that points the app at a dead end must answer it.** Left to
the static server a POST gets 405; answered 404 it is still a failed
fetch, and Chromium logs any failed fetch as a console error — which the
last assertion in that file counts, and whose text carries no URL, so it
cannot be filtered by path either. The stand-in answers 200.

## The worker

`worker/` is the one thing in this repository that is not a static file
in a browser: a Cloudflare Worker over one KV namespace, and the server
for the friends half of `schedule/`. It exists because a leaderboard
between two phones cannot be done inside one of them. Nothing else
reaches it and nothing else may — the promise that a screen keeps its
data on the device is still the promise everywhere the worker is not,
and `schedule/` is the only app that has a URL for it.

**It cannot tell you who anybody is, and the friend list is the reason.**
There are no accounts, no email and no sessions; identity is two strings
the client generates — a short public `code` that reads, and a secret
32-hex `key` that writes, stored only as its SHA-256. **The friend list
lives on the client**, so there is no `/friends` endpoint and the server
holds no graph. That absence is load-bearing: the endpoint that would
make it convenient is one line shorter and hands the whole social graph
to somebody else's machine for nothing. `tests/worker.js` asserts the
door is not there, which is the only kind of check a missing feature can
have.

**Thirty days is the shape of the data, not a policy note**, and the
window runs two days AHEAD of the server. That is not slack. The worker
runs on UTC and the client files a day under its OWN local date — which
is what stops a tick taken at 9pm in London landing on yesterday — so
east of Greenwich the two disagree for part of every day. A window that
stopped at the server's today would drop the day being lived in, on
write, and answer 200.

**A Worker is a function from a Request to a Response**, so `tests/
worker.js` runs the real file in Node against a Map standing in for KV:
no account, no network, a second and a half, and it goes second in the
suite behind `names`. Everything it checks fails SILENTLY in production
— a day filed under the wrong date, a write accepted without a key, a
picture id that dedupes nothing. Two of those three were in the first
draft, and the second is the sharpest lesson in the folder: the id was
hashed from `Date.now()` under a comment that said "stored by content
hash, so posting the same picture twice costs one entry". It reads
identically, it dedupes nothing, and the comment was the only place the
intent ever existed. **That happened twice in one day** — the client
pushed each log's `local` field, the whole data URL of its own
photograph, under a comment saying "this is never sent".

**The CORS allowance is a pattern, not a list.** It named three origins,
one of them a hardcoded dev port, and the app's own suite could not talk
to it: `tests/run.js` finds a FREE port at run time, so it is never on
any list written in advance. It surfaced as "could not reach that
address" — a CORS rejection wearing a network error. Loopback on any
port is allowed now, because a local port number was never a security
boundary; the production origin is still exact, and `*` never.

**The client half is inert until you turn it on, and that is measured.**
`scApi` returns before it builds a request when there is no URL, so
`tests/schedule.js` can keep counting every request the main page makes
and failing on one that leaves the origin — the app's whole promise.
The friends section runs on its OWN page for exactly that reason:
relaxing that filter to let the section through would quietly relax it
for everything else.

**Both clocks have to be frozen together.** The page files a day under
its own local date and the worker trims to a window from its own clock.
Freeze only the page and you are measuring a five-day skew rather than
the app — the first run of the round trip reported an empty board and
looked like a bug in the client.

**A paint must not fetch.** The first version refreshed from inside
`scPaintFriends` and repainted from inside the fetch. That is a loop,
and it did not even need a server to close it: with nobody on your list
`scPullAll` has nothing to wait for and calls back synchronously, so the
first paint recursed until the stack went — and came out as a board with
its buttons and no rows, which reads as an empty leaderboard rather than
as a crash. Arriving at the screen fetches; drawing it only draws.

**A friend's accent is a colour your page never agreed to.** Thirteen
themes each way is 169 pairings, and every crown measurement before this
was of your own accent on your own page — the one case a palette cannot
get wrong. `scCrown` mixes their colour toward your ink and stops at the
first step that clears 3:1 for a graphic. All 169 were measured on
composited pixels: aiming at a bare 3.0 puts **26 of them under 3:1 on
screen, worst 2.92:1**, because the page draws three washes over `--g0`
and the arithmetic only knows about `--g0`. At 3.4 the worst measured is
3.25:1 and **97 of the 169 never move at all**. The suite measures the
six that came out worst, and dropping the constant is what it catches.

That measurement was itself wrong twice before it was right: the first
harness reloaded a page whose `addInitScript` re-seeded the peer record,
so all 169 pairings measured the same black accent; the second planted
the accent only in the client's cache, and arriving at the screen
re-fetched the peer and overwrote it before a pixel was read. **A
measurement that produces a plausible sheet of numbers is not evidence
that it measured the thing.**

**Options came from lenses on the friends screen too**, and the pattern
held: five ways to take things OFF the board, four for a friend's page,
three for the state before you turn it on — each rendered over the real
app at 390x844, which is the phone rather than a grid cell. What shipped
was the one nobody would have converged on: **two stops**, so the board
and the feed are never on screen together and the CONTROL is the
heading. A label naming a section beside the thing that takes you to
that section is the same word twice.

**Nothing on that screen is a filled block any more.** Two solid accent
rectangles for things done about once a week each, sitting under a
three-row list, were louder than the board they were about. A line of
type with a glyph is the same 44px tap. **The glyph carries meaning**:
`+` for the actions that make something exist, a chevron for `Your
code`, which shows you a string you already have — given the plus as
well it read as a fourth thing to create, on the row directly under the
one that adds people.

**The friend's week is discs whose SIZE says how many, and that is a
correction.** The first cut varied the ALPHA of their accent from .42 to
1, which measured **1.30:1 on the white page for solar's amber** — and
the same pass established that opacity was never the lever, because that
amber is about 1.9:1 on white at FULL strength. Diluting a colour that
already fails only makes the number worse. Size costs no contrast at
all: every disc is drawn at the one strength `scCrown` has already
solved to clear 3:1 on your page, and the count moves the diameter.
A day with none is a flat neutral, never a red one — the habits screen's
rule, for the habits screen's reason.

**A polarity-agnostic measurement, or none.** The pass that caught the
disc also reported the unlit stop's label at **1.05:1**, which was the
measurement and not the control: it took the 3rd percentile as ink and
the 90th as ground, and seven of the thirteen themes are dark, so on
those it compared the track against itself. Measured from the most
common pixel outward it is **7.64:1**. This repo has now made the
light-on-dark assumption in three separate harnesses.

**The friend's week became a MONTH, and the mark changed with it.**
The record already holds thirty days and both figures above the strip
are about thirty, so seven of them was hiding three quarters of what
is there. Two things fell out of the count and both are the same
arithmetic: the two-letter day labels went, because nine pixels a cell
does not take two characters — and they were telling a Tuesday from a
Thursday, which is a question about a WEEK — and the disc went back to
a BAR. A disc's diameter is bounded by the cell's width, so at thirty
the smallest is about four pixels and antialiasing alone took it to
**1.18:1** on the white page. A bar's height is free of the count, so
it holds its colour at any width. The note saying a chart of seven
numbers between 0 and 5 is more apparatus than the numbers deserve was
written about SEVEN; thirty of them is a shape, and a shape is what
you came to read.

**And the contrast check has to sample a LIT bar.** An unlit day is
deliberately the flat neutral — a day with none is never a red one —
so it makes no colour claim, and holding it to 3:1 measures a mark
that is not breaking the rule. Over thirty days the first cell is
usually empty, which is how a passing design started reporting 1.18:1.

**A post is a card.** A hairline and a 16px radius, so a feed is a
stack of things rather than one column of text with photographs in it
— the boundary between two posts was carried by nothing but a gap,
which is enough between two lines and not between two pictures. A
border and never a shadow: the tally earned this app's one exception
to "nothing rounded or shadowed" by making the photograph the card,
and here the photograph is IN the card, so the card only has to be an
edge. The radius nests — 16 outside, 12 on the image — because two
rounded rectangles at one radius read as a mistake.

**Inside the friend's sheet the post is BARE**, because there the frame
is the sheet and a card in a card is the frame-inside-a-frame this
project keeps taking out.

**Deleting a log ASKS, and there is no bin.** The rule here is that
nothing deletes without a way back, and the written exception is the
reminders — a bin protects a record you cannot rebuild, and a reminder
you have dealt with is not a record of anything. A log is the other
way round: a photograph and a line about a day, and the photograph is
the half you cannot get back. There is no bin on this screen, so the
ask stands in for one. Nothing sweeps the picture and nothing needs
to: the worker puts every image under a TTL two days past its own
window, so a blob nothing points at expires by itself. The push is the
whole record, so the delete reaches every friend's feed on their next
fetch. And the control is drawn ONLY on your own posts — one that
exists and refuses is worse than one that is not there.

**And `.sheet .fp-k` rather than `.fp-k`.** `.label` and `.menu-item` are
defined further down `schedule/app.css`, so at equal specificity they
win however the new rule is written: the friend sheet shipped one round
with two red capital headings and a hairline under Remove, with the new
classes sitting on the elements doing nothing. That is the fourth time.

**The tally cards are glyphs now, and the glyph IS the name.** Each
card carried its title at 17px bold in one corner and nothing in the
other; with a mark opposite it the two said the same thing, and the
word was the half that could go. What did NOT go is the name in the
card's accessible name — without that, a screen reader arriving at the
grid is handed five buttons called "logged" and "Tap", so the check is
in two halves: nothing draws the word, every card still says it.

**An inline `<svg>` with no width or height falls back to 300x150 and
fills its parent.** It happened the moment the sizing moved off the
markup and into a sheet, and it is silent — the glyph is still there
and still correct, just enormous. Measured rather than assumed.

**Steps is two prints and both are the same path scaled.** Drawing a
small footprint by hand a second time lost the taper that makes the
first one read, and two shapes nearly the same but not quite look like
a mistake rather than a pair. The first cut placed them at .55 and they
came out as SPECKS on the real card — the 4x sheet said they were fine.
That is the second time an enlargement has lied about a treatment; a
glyph is judged at the size it is drawn, full stop.

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

## The work is not on the main thread

Three rounds of performance work shipped and the report survived all
three. Each round found something real — animations under a moving
camera, four measured cuts to the interaction paths, a 252px stage jump
and a camera frozen for a fifth of every flight — and none of them was
the thing.

A real Chrome trace, which nobody had taken in three rounds, says why.
Of a click-to-settled interaction: **script 4.4%, layout 1.8%, style
1.5%, paint 1.1% — and 86% compositing, tile management and raster.**
Throttling the renderer's main thread 6x changes the frame cost by
**1.00x**. The interaction does not live where every previous round was
working, and the three fixes above were between them optimising about
6% of the problem.

**The dominant cost was `backdrop-filter` on `.app`** — the panel that
is the ancestor of every app's content, including the orrery's camera.
A backdrop pass is redone whenever the FILTERED ELEMENT'S OWN SUBTREE
repaints, not only when what is behind it changes, so an 880ms flight
re-blurred four megapixels every frame to arrive at the same pixels
each time. The backdrop is a photograph. It does not move.

Measured, frames delivered in a fixed window, six runs each way with
the order alternated: **flight 1.9x, click 2.6x, close 2.4x**, ranges
non-overlapping in all three. Median frame gap on a real click:
**66.7ms to 16.7ms** — four vsyncs to one, in 6/6 runs. The repo's own
test suite ran 195s against 243s with the live blur restored.

So the photograph is blurred ONCE on a static underlay and composited
from then on. Three things about that fix are load-bearing and each was
found by screenshot rather than by reading the cascade:

- **The tint is drawn twice, on `.app` and on `.app::after`.** An
  element's own background paints BELOW its negative z-index children,
  so the one on `.app` is hidden wherever the underlay reaches — but
  `overflow` clips descendants to the PADDING box, so no pseudo-element
  can paint the 1px ring under the border and only the element itself
  can. Dropping it left a bright hairline right around the panel,
  measured at 210/255 in one channel in light mode.
- **Radius was never the lever.** blur(4), blur(10) and blur(20) all
  cost the same, and even blur(0) still paid two thirds. Two thirds of
  the cost is the render pass existing. Thinning the blur would have
  spent the panel's contrast for nothing.
- **Moving it to a pseudo-element with `backdrop-filter` still on it
  does not work** — built and measured at 16 frames against 17. It has
  to stop being a backdrop pass.

**The Categories card KEEPS its backdrop-filter and that is not an
oversight.** Four lenses measured removing it and `* { backdrop-filter:
none }` came out **2.1x WORSE** — raster tasks 1972 to 4549, no overlap
over five runs — because the filter is what promotes the card to its
own composited layer, and without it the card's region falls back into
the same layer as the moving stage. The glass is paying for itself. The
contrast argument in this file remains the only argument that applies
to it.

**The suite has a blind spot that explains all three failed rounds.**
`tests/orrery.js` measures element counts, paint rects and pixel
colours, and none of those move when the compositor is the bottleneck.
Its continuous-motion budget counts ANIMATED ELEMENTS at `< 12%`, and
it measured 9 of 956 — **0.9%, thirteen times under the ceiling, while
the display compositor ran at 95%.** The unit is wrong. What costs is
not how many elements animate, it is whether anything forces a
compositor property to be recomputed per frame over a large area.

**And a test that samples a spring at a fixed wall-clock moment is
measuring the frame rate.** "A stretched link brightens on its way
home" read 260ms after a fling and required every link to be bright. It
passed only because the main thread was too loaded to tick the
simulation far in that time: with the blur gone the sim runs about four
times as far in the same wall clock — 492 units from home at t+480ms
before, 128 after — so the flung node's neighbours have time to follow
it and a link to a neighbour that came along is genuinely slack. It
asserts the mechanism now: sample every frame, and hold every link that
IS stretched to being bright.

## Two things measured in CSS pixels, so they transfer

The blur's SIZE does not transfer — it was measured on a software
rasteriser with no GPU, where every absolute millisecond is untrustable.
The mechanism transfers unchanged; the multiple will not. These two do
transfer, because they are main-thread work measured in CSS pixels:

**The link surge ran three passes and dammed up behind the flight.**
`stroke-dashoffset` is neither transform nor opacity, so it can never be
composited, and in Blink it dirties SVG layout as well as paint. Three
passes is 3.9s, held for the flight, so it was still going 4.9s after
the click. Over a 3s band starting once the camera lands: 96 paints
against 24, 32 layouts against 14, 1532ms of main thread against 474.
One pass. The stagger came down from -.17s to -.05s with it, because a
negative `animation-delay` can only truncate — at the old step the
worst-placed link got 0.28s of its only 1.3s pass.

**And `orOpen` kept working for 100-170ms after the pane was already on
screen.** `orPaint` rebuilds every ring, link, node and label, and each
layer is written and then READ BACK, so style and layout flush for the
whole drawing several times over, synchronously, inside the pointerup
handler — and none of it can paint until the handler returns. Deferred
to one `requestAnimationFrame`: 133/208/147/120/130ms against
52/53/43/48/43ms on a 312-note vault. It is the only cost here that
GROWS with the vault — 63ms at 52 notes, 78 at 156, 134 at 312.

`orZoom.reframe` stays synchronous inside that handler and must: it is
what stops the stage jump above, and deferring it by a frame is the
snap. The deferred half re-reads `state.sel` rather than closing over
it — a second click inside the deferred frame has already moved the
selection on, and painting the previous one would be a frame of the
wrong note.

**The dial was shortened rather than skipped.** Its 2.1s turn is paused
at zero for the whole flight and released the instant the camera lands
at 2.4x, with the rings, three dust shells and the rim re-rasterised
every frame for as long as it runs: 63.1ms of raster CPU in the 2.6s
after landing against 28.5ms, five runs each way with no overlap. The
measured-better fix was to not turn the dial for a note that is already
on the map — and that is a feature removal wearing a performance
argument, because the turn is what says the instrument was used and
opening a note is the main way you use it. 1.15s, on a curve that does
not spend a fifth of itself turning less than two degrees.

## The stage is a frame, and it moves

The reading pane is `flex: none` at `clamp(380px, 42%, 620px)` and it
comes and goes with `hidden`, so opening or closing a note resizes
`#orStage` by about 490px in a single layout pass. The svg is
`preserveAspectRatio="xMidYMid meet"`, so a change to the stage
re-letterboxes the whole 1000-unit viewBox into whatever box it now
has — and **every star on screen moves while the camera sits
perfectly still**.

Measured on a close at 1512x950, dark and light identical to 0.1px:
the svg goes 673.8 to 1161.6 CSS px, the base scale .674 to .758, and
the 59 stars move a **median of 252px, max 317**, with `state.zoom` at
2.4 throughout. The biggest step the 880ms passage that follows ever
takes in one frame is **20.6px**. So the jump is 12.3x the fastest
legitimate frame of the flight — and it is in the OPPOSITE direction:
the map snaps left, then the flight travels back right. That is what
was reported as the zoom rocking rather than flying, and no easing on
the camera could ever have hidden it, because the camera is not what
moved.

`orZoom.reframe` re-expresses the camera in the new stage's terms
before the flight starts: the picture holds exactly where it is and
the passage absorbs the difference over its own 880ms, which is what
it is for. Both callers capture the frame **before any layout change**
— at the very top of `orOpen`, because `orCloseCat` runs first and the
list and the note share the column. It is all one task and the browser
paints once at the end, so the only geometry that matters is what was
on screen when the function was called.

**Written as two scalars, not as a matrix inversion**, and the reason
is exactness. `T' = V1⁻¹·V0·T` is the same thing and was the first
version; it left `state.zoom` at 0.9999999999999999 on a stage that
had only moved sideways, because `(1/a)·a` is not 1 in floating point.
`z' = z·a0/a1` **is** exactly z when the base scale did not change.
A residue that compounds over a session of opening and closing notes
is not a rounding detail, it is a slow leak.

**It only fires when a flight will follow.** At the fit, the
re-letterboxing IS the desirable behaviour — `meet` is what keeps the
whole field inside the narrower stage — so cancelling it with nothing
to absorb the difference would leave you cropped with only the fit
button to get back.

**And it changes what the arithmetic means.** A stacked close nearly
doubles the stage, so the reframed camera can come out BELOW 1 and the
glide home is then an INCREASE in `state.zoom` — measured at .45 after
zooming to the floor with the pane open. Left to `z > z0`, closing a
note throws eleven debris streaks at you and parts the field.
`orZoom.glide` takes `back` and `orClose` passes it: a return is not a
passage, said outright rather than inferred. The test asserts `z < 1`
first, because without that it passes vacuously in any layout where
the stage does not change.

## The camera needs more decimals than everything else

`orLayout.N` rounds to 2dp. That is right for every number in this app
that is drawn once and then sits still, and wrong for the one that is
written 60 to 120 times a second. A .01 quantum of **scale** is worth
about 4 screen px for a star half the viewBox out, so the camera spent
whole frames re-writing the number it wrote last frame: the map does
not move, and then it jumps.

Counted over the real velocity profile: **13-15% of a flight's frames
are frozen at 60Hz, 20-23% at 120Hz**. Nearly a quarter of the flight,
stuttering harder the better the display — which is why it reported
from a Mac, and why this repo's own test browser can never reproduce
it by watching: rAF is throttled to about 20Hz here, where the steps
are far too big to ever collide. At 4dp it is 0-2 frames of the whole
flight.

**So the test asserts the mechanism, not the symptom.** The camera has
to write a number it was given rather than a rounded one — set
`state.zoom` to 1.2345, sync, and read `scale(1.2345)` back off the
attribute. Reverting `orPan` to `orLayout.N` makes it `scale(1.23)`
and the assertion falls over. A frame-timing threshold measured here
would prove nothing about the machine the bug was reported on.

This is the third time a number that looked like a formatting choice
turned out to be load-bearing, and the pattern is the same each time:
the value is fine everywhere it is read by a person and wrong in the
one place it is read by the compositor.

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
