export const meta = {
  name: 'raster-lab',
  description: 'A/B every candidate for the lag that three rounds of fixes have not removed',
  whenToUse: 'When the orrery still reports as laggy after the cheap wins are gone.',
  phases: [
    { title: 'Ablate', detail: 'six lenses, each A/B-ing one suspect' },
    { title: 'Rank', detail: 'order by measured cost, not by plausibility' },
  ],
}

/* FOURTH ROUND. Read this before anything else.
   Three rounds of confident performance work have shipped and the user
   still says "still looks laggy I want that fixed". So the prior on any
   NEW theory being right is low, and the prior on a theory that was
   never actually MEASURED is lower still. Every round so far found real
   things and none of them was the thing.
      Round 1: animations and CSS filters running under a moving camera.
      Round 2: four measured cuts — click-to-camera 274ms to 34ms,
               reading cost 75.3 to 14.1 ms/s, flight layout 23.8 to
               9.8ms, a whole-subtree style invalidation per flight.
      Round 3: the stage re-letterboxing 252px on the frame the pane
               opens, and the camera's scale rounded to 2dp freezing
               13-23% of a flight's frames.
   All four of those were real and all four are fixed. The report
   survives all of them.

   WHAT WAS NEVER MEASURED, in three rounds, and is stated in the house
   rulebook as a limitation rather than treated as a task: RASTER. This
   box renders through a software rasteriser and throttles rAF to about
   20Hz. Every previous round said "this box cannot measure raster" and
   moved on to what it could measure. That is why this round exists and
   it is the whole point of it.

   TWO TOOLS MAKE IT MEASURABLE ANYWAY AND NOBODY HAS USED THEM HERE:

   1. CDP Emulation.setCPUThrottlingRate. Slowing the CPU 4-8x makes
      main-thread and raster cost that is invisible here dominate, and
      makes the SAME work reproducible run to run. It converts "I cannot
      see a difference" into "with X it drops N frames, without X it
      drops M".
   2. CDP Tracing, the real Chrome trace. Categories
      'disabled-by-default-devtools.timeline' and
      'disabled-by-default-devtools.timeline.frame' give you Paint,
      RasterTask, CompositeLayers, DrawFrame and dropped frames as
      actual trace events with durations and arguments.

   ABLATION IS THE METHOD AND IT IS NOT OPTIONAL. An absolute number
   from a software rasteriser means nothing. A RATIO between the same
   interaction with and without one suspect means everything, and it
   transfers to a machine this box is nothing like. So every finding is
   a pair: with the suspect, without the suspect, same interaction, same
   seed, several runs. If you cannot produce the pair, you do not have
   a finding. */

const LAB = '/tmp/raster-lab'
const REPO = '/home/user/niko-999.github.io'

const HOWTO = `
You are hunting the REMAINING lag in a single-file SVG star-chart app:
${REPO}/orrery/index.html. Read ${REPO}/CLAUDE.md first — it is the house
rulebook and it already documents three rounds of performance work, what each
found, and what each cost. Do not re-file anything it says is fixed; go and
check that it IS fixed if you doubt it, but say so with numbers.

DO NOT EDIT ANY FILE UNDER ${REPO}. Several of you run at once and you would
collide. Work under ${LAB}/<yourlens>/ (mkdir -p it). To ablate, COPY the repo
into your own directory and serve YOUR copy:
  cp -r ${REPO}/orrery ${LAB}/<yourlens>/repo-a/ && ... patch repo-b ...
Serve with the tiny static server in ${REPO}/.claude/workflows/look-render.js
(copy it, point ROOT at your own copy). USE YOUR OWN PORT, given below.

WHAT THE USER SAYS, in full: "Still looks laggy I want that fixed." Earlier, in
more detail: on a Mac, clicking a note is not instant, the fly-in "glitches its
way to the star", and they want every interaction — click, zoom, flight, the
instrument's spin, opening and closing a note — smooth with no perceptible lag
or stutter. They have a Retina display; assume 2x device pixels and assume the
panel may be 120Hz ProMotion.

THE MEASUREMENT RULES, and this part is the whole design of this lab:

THIS BOX CANNOT MEASURE FRAME RATE DIRECTLY. Software rasteriser, rAF throttled
to about 20Hz even when idle; it has previously timed a 3.9x zoom as FASTER than
1x. Any finding whose evidence is a wall-clock frame time is worthless.

SO YOU ABLATE. Every finding must be a PAIR of measurements on the same
interaction — with the suspect present, and with it removed or disabled — over
several runs, and reported as both numbers plus the ratio. Absolute numbers here
are meaningless; ratios are not.

The two tools that make this work, and that no previous round used:

  const cdp = await c.page.context().newCDPSession(c.page);
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 6 });   // 4-8
  await cdp.send('Performance.enable');
  // Chrome's own counters, diffed across an interaction:
  const m = async () => Object.fromEntries(
    (await cdp.send('Performance.getMetrics')).metrics.map((x) => [x.name, x.value]));

  // and the real trace:
  await cdp.send('Tracing.start', { traceConfig: { includedCategories: [
    'devtools.timeline', 'disabled-by-default-devtools.timeline',
    'disabled-by-default-devtools.timeline.frame', 'blink', 'cc' ] } });
  // ... drive the interaction ...
  const chunks = [];
  cdp.on('Tracing.dataCollected', (d) => chunks.push(...d.value));
  await new Promise((r) => { cdp.on('Tracing.tracingComplete', r); cdp.send('Tracing.end'); });
  // then attribute chunks by e.name: 'Paint', 'RasterTask', 'CompositeLayers',
  // 'UpdateLayerTree', 'DrawFrame', 'CommitLoad', 'Layout', 'UpdateLayoutTree'.
  // Sum dur per name, count them, and read args for paint rects and layer ids.

Launch the browser with the repo's own helper, at 2x:
  const { open } = require('${REPO}/tests/lib.js');
  const c = await open({ colorScheme: 'dark', deviceScaleFactor: 2 });
deviceScaleFactor 2 multiplies anything raster-bound by four and is the closest
this box gets to the panel the complaint came from.

Drive REAL interactions with a real mouse where the path matters (orDragEnd
decides click vs drag, and orOpen does several things orZoom.fly alone does
not). Real note ids are in state.notes — read them, do not invent them.

WHAT A GOOD FINDING LOOKS LIKE:
  - What a person would feel, in plain words.
  - The exact code: selector, function, line.
  - THE PAIR: with N, without M, ratio, how many runs, what varied.
  - The mechanism in terms of style, layout, paint, raster, composite or
    main-thread blocking — and specifically why it costs MORE at 2x device
    pixels or at 120Hz, if it does.
  - The fix, as exact code, and what it costs — visually and in the terms the
    house rulebook already measures things in (contrast ratios, the continuous
    motion budget, the documented wins from earlier rounds).
  - Your confidence that this is a real contributor on a Retina Mac, and what
    you could not verify from here.

Be ruthless with yourself. Three rounds of plausible fixes have already shipped
without solving this. A fourth round of plausible-but-unmeasured changes is
worse than none: it burns the user's trust and buries the real cause deeper.
"I ablated X, Y and Z and none of them changes the numbers" is a genuinely
valuable result and you will not be penalised for returning it. Say plainly when
your lens comes up empty.

RETURN: findings worst first, and an honest note on what you ruled OUT.
`

const SCHEMA = {
  type: 'object',
  properties: {
    findings: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          title: { type: 'string', description: 'what a person feels, in plain words' },
          where: { type: 'string', description: 'selector / function / line' },
          mechanism: { type: 'string', description: 'style, layout, paint, raster, composite or main thread — and why 2x or 120Hz makes it worse' },
          withIt: { type: 'string', description: 'the measurement WITH the suspect present: number, units, runs' },
          withoutIt: { type: 'string', description: 'the measurement with it ABLATED: number, units, runs' },
          ratio: { type: 'string', description: 'the ratio, and how stable it was across runs' },
          fix: { type: 'string', description: 'exact replacement code' },
          cost: { type: 'string', description: 'what the fix costs, visually and against the documented wins' },
          confidence: { type: 'string', enum: ['high', 'medium', 'low'] },
        },
        required: ['title', 'where', 'mechanism', 'withIt', 'withoutIt', 'ratio', 'fix', 'confidence'],
      },
    },
    ruledOut: { type: 'string', description: 'what you ablated that changed nothing' },
  },
  required: ['findings', 'ruledOut'],
}

const LENSES = [
  { key: 'blur', port: 8961, prompt: `
YOUR LENS: BACKDROP-FILTER, the strongest untested suspect in the file.

orrery/index.html carries \`backdrop-filter: blur(26px) saturate(160%)\` in two
places (around lines 683 and 887) and shell.css carries \`blur(20px)
saturate(.9) brightness(...)\` on .glass. At least one of those elements — the
Categories card — sits DIRECTLY OVER THE MAP, top-left of the stage. A backdrop
blur must re-evaluate whenever anything behind it changes, and during a flight
everything behind it changes every frame. At 2x device pixels that is a 26px
blur over the card's area, 53 to 106 times, per flight.

Establish, by ablation:
  - What a flight costs with the card's backdrop-filter present vs replaced by
    the solid fallback the file ALREADY defines for browsers without it (there
    is an \`@supports not\` block right there — read it, it is the designed
    contrast-safe appearance and it is the natural candidate fix).
  - Whether \`opacity: 0\` actually spares it. orOpen.chrome(true) sets the
    legend to opacity 0 when a note is open, so a fly-IN may already be free
    while a fly-OUT — where orOpen.chrome(false) restores the card BEFORE the
    880ms glide — pays full price. If that asymmetry is real it is a strong
    match for the user reporting the zoom-out as bad too. Measure it, do not
    assume it: an opacity-0 element can still be a backdrop root.
  - The top bar and any other glass surface: is the map ever behind them?
  - Whether blur RADIUS matters superlinearly here (try 26, 12, 6, 0).
Report the pairs. If backdrop-filter turns out to cost nothing measurable even
at CPU throttle 6-8 and 2x, say so loudly — that kills the best remaining
theory and that is worth knowing.` },

  { key: 'trace', port: 8962, prompt: `
YOUR LENS: THE REAL CHROME TRACE. You own the Tracing domain. Nobody in three
rounds has actually looked at a trace of this app.

Capture a full trace of: (a) an idle second, (b) a click-to-open with its flight
and landing, (c) a close with its flight, (d) the instrument's spin. At 2x and
at CPU throttle 1, 4 and 6.

Then attribute it properly. Sum duration and count per event name — Paint,
RasterTask, CompositeLayers, UpdateLayerTree, DrawFrame, Layout,
UpdateLayoutTree, FunctionCall, TimerFire. Read the args: paint rects and their
AREA, layer ids, how many layers exist, which ones are re-rastered and how
often. Find the frames that are far more expensive than the median and say what
is IN them.

The output that matters most is an ATTRIBUTION: of the total main-thread and
raster work in one click-to-settled interaction, what fraction is paint, what is
raster, what is style, what is layout, what is script — and which single element
or subtree is responsible for the largest share. Everything else this lab does
is guesswork without that table.` },

  { key: 'drawcost', port: 8963, prompt: `
YOUR LENS: WHAT IS EXPENSIVE TO DRAW, ABLATED ONE LAYER AT A TIME.

The map is roughly 866 elements under #orView. Among them: about 60 stars each
with a ten-stop radialGradient, halos, ~90 field stars, link paths, three dust
shells, the ring system, and the rim's text-on-path. Every one of them is
re-rasterised each frame of a flight because the camera changes the CTM scale.

Ablate them ONE AT A TIME on your own copy and measure a flight each time:
remove the star gradients (flat fill), remove the halos, remove the field stars,
remove the links, remove the dust shells, remove the rim, remove the ring
system. Build a table of what each layer costs as a fraction of a flight.

The point is not to remove any of them — it is to find out whether ONE of them
dominates. If the stars' gradients are 60% of the raster cost then there is a
real fix available (one shared gradient, or a pre-rendered sprite via <use>, or
fewer stops) and if they are 5% there is not. Say which.

Also: is anything drawn that CANNOT be seen? Off-screen at high zoom, behind
the reading pane, at opacity 0, under an isolate that has dimmed it to .12.
Culling invisible work is the one lever that helps a raster-bound case, and
this is the lens that has to find it.` },

  { key: 'window', port: 8964, prompt: `
YOUR LENS: HOW LONG IS THE MAP IN MOTION AT ALL, and is the answer to the whole
complaint simply "too long"?

Clicking a note starts an 880ms camera flight AND orIndex(), a 2.1s full
revolution of #orRings — and the flight rule pauses the dial until the camera
lands, so they run in SERIES: about 3 seconds of continuous motion for one
click. The spin was added recently, at the user's request, on every interaction
with a note. It is entirely possible that the app got slower-feeling at exactly
the moment it got that feature, and that "laggy" is partly "it will not settle".

Measure, with ablation:
  - The true total motion window per interaction, end to end, for: clicking a
    star, closing a note, changing formation, pressing the spin button.
  - What the dial turn costs while it runs — it rotates a large subtree, and a
    rotation re-rasterises everything under it every frame just as a scale
    does. Ablate orIndex entirely and measure a click-to-settled.
  - Whether the dial and the flight overlap anywhere despite the pause rule.
  - What it would cost to run the dial CONCURRENTLY with the flight instead of
    after it, or to shorten it, or to make it turn only #orRings' cheapest
    layer.
Give the caller a straight answer to: if orIndex did not exist, how much of the
reported problem goes away?` },

  { key: 'throttle', port: 8965, prompt: `
YOUR LENS: REPRODUCE THE JANK, THEN BISECT IT. You own
Emulation.setCPUThrottlingRate.

Nobody has yet made this box actually stutter on demand. Do that first: find the
throttle rate at which a flight visibly drops frames — measure it by sampling
from inside the page's own rAF loop and looking at the INTERVAL distribution,
and by counting DrawFrame/dropped-frame events in a trace. Establish a stable
metric: something like "at throttle 6, a fly-in drops N of its frames and the
worst gap is M ms", repeatable to within a few percent over five runs.

Then bisect with that metric. Ablate, in turn: the backdrop-filtered cards, the
star gradients, the dust shells, the rim, the ambient trickle, orIndex, the
reading pane's mask-image, the surge animation, the debris. Rank them by how
much each one improves your metric.

You are the lens that can answer "what actually costs frames when frames are
scarce", which is the condition a Retina panel at 120Hz puts the machine in even
when it is fast. Be rigorous about run-to-run variance — report a median of at
least five runs and the spread, and do not report a difference smaller than the
spread.` },

  { key: 'input', port: 8966, prompt: `
YOUR LENS: IS "LAGGY" ACTUALLY LATENCY RATHER THAN STUTTER? The word covers
both and the fixes are opposite.

Measure END TO END, with a real mouse and at CPU throttle 1 and 6:
  - pointerdown to the first visual change anywhere on screen.
  - pointerup to the first frame in which the camera has moved.
  - pointerup to the reading pane being painted.
  - hover over a star to the chip appearing.
  - hover over a Categories row to the map dimming.
  - keypress in the search box to the map filtering.
  - the spin button to the first frame of rotation.
Use a trace, or a MutationObserver plus a rAF stamp, or
requestAnimationFrame inside the event handler — whatever gives a defensible
number — and say exactly how you obtained each one.

Then attribute anything over about 100ms. orDragEnd, orOpen's innerHTML write,
orPaint, orPaintLabels, the debounce on the search box, orPin's timer. Note that
round 2 already cut click-to-camera from 274ms to 34ms, so if you find a large
number now it is either somewhere else or a regression — say which.

Also look for the thing that makes an app feel laggy without being slow: work
done in a handler that could be deferred a frame, a synchronous layout read
between writes, or a visual response that waits on something it does not need.` },
]

phase('Ablate')
const reports = await parallel(LENSES.map((l) => () =>
  agent(HOWTO + l.prompt + `\n\nYOUR LENS KEY: ${l.key}. YOUR PORT: ${l.port}.\nYour directory: ${LAB}/${l.key}`,
    { label: `raster:${l.key}`, phase: 'Ablate', schema: SCHEMA, effort: 'high' })
    .then((r) => ({ lens: l.key, ...(r || { findings: [], ruledOut: 'agent returned nothing' }) }))
))

const live = reports.filter(Boolean)
const all = live.flatMap((r) => (r.findings || []).map((f) => ({ lens: r.lens, ...f })))
const rank = { high: 0, medium: 1, low: 2 }
all.sort((a, b) => (rank[a.confidence] ?? 3) - (rank[b.confidence] ?? 3))
log(`${all.length} findings across ${live.length} lenses`)

phase('Rank')
const plan = await agent(`Six agents have just ABLATED every candidate for the lag remaining in
${REPO}/orrery/index.html. Each finding is a pair of measurements — with the
suspect and without it — on the same interaction.

Context you must hold: three rounds of performance work have already shipped and
the user still says "still looks laggy I want that fixed". Read ${REPO}/CLAUDE.md
for what those rounds did. The failure mode to avoid is recommending another
plausible change that has not been shown to matter.

Produce, for the person who will now fix this:
  1. A ranked list, ordered by MEASURED effect size — the ratio, not the
     cleverness. For each: one sentence of what the user would feel, the fix in
     one line, the measured improvement, and what it costs.
  2. Duplicates merged, noting which lenses corroborated each. A suspect that
     two lenses independently measured as costly is worth far more than one.
  3. An explicit statement of what was RULED OUT, so nobody looks there again.
  4. The honest bottom line: is there a single dominant cause, or is this death
     by a thousand cuts? If the latter, say so plainly — it changes the advice
     from "fix this one thing" to "here is the budget and here is what buys the
     most of it back".
  5. If the measurements do NOT support any confident fix, say that too. It is a
     legitimate outcome and the user is better served by "we measured and the
     remaining cost is structural, here is what it would take" than by a fourth
     speculative round.

FINDINGS:
${JSON.stringify(all, null, 1)}

RULED OUT:
${JSON.stringify(live.map((r) => ({ lens: r.lens, ruledOut: r.ruledOut })), null, 1)}`,
  { label: 'rank', phase: 'Rank', effort: 'high' })

return { plan, findings: all, ruledOut: live.map((r) => ({ lens: r.lens, ruledOut: r.ruledOut })) }
