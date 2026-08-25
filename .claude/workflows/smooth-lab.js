export const meta = {
  name: 'smooth-lab',
  description: 'Hunt every source of lag and jitter in the orrery interaction paths',
  whenToUse: 'When the map is reported as laggy or janky and hand-measurement has not found it.',
  phases: [{ title: 'Hunt', detail: 'six lenses on what costs frames' }],
}

/* Reported: the fly-in, the transitions and the spin are janky on a
   Retina Mac. Two rounds of hand-fixing have removed real causes
   (animations and CSS filters running under a moving camera) and the
   report persists.

   THE MEASUREMENT PROBLEM IS THE WHOLE DESIGN OF THIS LAB. This box
   renders through a software rasteriser and throttles rAF to ~20Hz even
   when idle; it once timed a 3.9x zoom as FASTER than 1x. So wall-clock
   frame times here are worthless and every agent is told so. What IS
   trustworthy: Chrome's own CPU counters over CDP (RecalcStyleDuration,
   LayoutDuration, ScriptDuration and their counts), synchronous
   execution time measured inside a callback, counts of elements and
   forced reflows, and reading the code for patterns that are expensive
   by construction.

   Findings must be CPU-measurable or structural. "This looks slow" is
   not a finding. */

const LAB = '/tmp/smooth-lab'
const REPO = '/home/user/niko-999.github.io'

const HOWTO = `
You are hunting sources of LAG AND JITTER in a single-file SVG star-chart app:
${REPO}/orrery/index.html. Read ${REPO}/CLAUDE.md first — it is the house
rulebook and it already documents several performance decisions and their
history. Pay attention to "The passage", "The ambient field" and the comments
around ".or-fly", "#orNod" and "or-flying" in the app itself.

DO NOT EDIT ANY FILE UNDER ${REPO}. You are investigating, not fixing — several
of you are running at once and you would collide. Work only under
${LAB}/<yourlens>/ (mkdir -p it). Propose fixes as a diff-shaped description
plus the exact code, and let the caller apply them.

WHAT THE USER SEES. On a Retina Mac: clicking a note is not instant, the fly-in
"glitches its way to the star", and transitions generally are not clean. They
want every interaction — click, zoom, flight, the instrument's spin, opening and
closing a note — to be smooth with no perceptible lag or stutter.

WHAT HAPPENS WHEN YOU CLICK A NOTE, roughly: orDragEnd decides it was a click →
orOpen fills a reading pane (a large innerHTML write) → orZoom.fly computes a
target → orZoom.glide runs an 880ms per-frame camera loop writing #orView's
transform → on landing, orZoom.land runs orPaintLabels, which does a getBBox per
chip and a pairwise collision sweep. Separately orIndex turns #orRings one full
revolution over 2.1s, which the flight rule holds paused until the camera lands.

HOW TO MEASURE, and this part is not optional:

THIS BOX CANNOT MEASURE RASTER OR FRAME RATE. It renders through a software
rasteriser and throttles requestAnimationFrame to about 20Hz even when nothing
is running. It has previously timed a 3.9x zoom as faster than 1x. Any finding
whose evidence is "frames took N ms" or "it felt slow" is worthless here and
will be rejected.

What you CAN trust:
  1. Chrome's own counters, over CDP. This is the strongest tool you have:
       const cdp = await c.page.context().newCDPSession(c.page);
       await cdp.send('Performance.enable');
       const m = await cdp.send('Performance.getMetrics');
     Diff RecalcStyleDuration / RecalcStyleCount / LayoutDuration / LayoutCount /
     ScriptDuration / TaskDuration across an interaction. These are CPU work and
     they mean the same thing here as on a Mac.
  2. Synchronous execution time measured INSIDE a callback (performance.now()
     around the body of a rAF tick, an event handler, a paint function).
  3. Forced synchronous layout: any read of getBBox, getBoundingClientRect,
     getComputedStyle, offsetWidth/Height, getTotalLength, getPointAtLength
     that is INTERLEAVED with DOM writes. Each interleave is a reflow. Find
     them by reading the code AND by counting LayoutCount across the
     interaction.
  4. Element and node counts, gradient counts, filter counts, text-on-path
     counts — anything expensive by construction at 2x device pixels.
  5. Whether an animation can be composited at all: only transform and opacity
     can. Anything animating another property repaints every frame.

Launch a browser with ${REPO}/tests/lib.js:
  const { open } = require('${REPO}/tests/lib.js');
  const c = await open({ colorScheme: 'dark', deviceScaleFactor: 2 });
You must serve the repo over http first — copy the tiny static server out of
${REPO}/.claude/workflows/look-render.js. Use YOUR OWN PORT, given below.
deviceScaleFactor: 2 matters — it is the closest this box gets to a Retina panel
and it multiplies anything raster-bound by four.

WHAT A GOOD FINDING LOOKS LIKE:
  - It names the exact code (function, line, what it does).
  - It carries a NUMBER from one of the trustworthy sources above, with the
    before figure and how you obtained it.
  - It explains the mechanism — why this costs frames — in terms of style,
    layout, paint, composite or main-thread blocking.
  - It proposes a specific fix, with the actual replacement code, and says what
    the fix would NOT solve.
  - It says how confident you are that this is a real contributor on a Retina
    Mac specifically, and what you could not verify from here.

Be ruthless about your own findings. This app has had two rounds of confident
performance fixes that did not solve the reported problem, and a third round of
plausible-but-unverified changes is worse than none: it burns the user's trust
and makes the real cause harder to find. If your lens turns up nothing solid,
say so plainly — "I measured X, Y and Z and they are not the problem" is a
genuinely useful result and you will not be penalised for it.

RETURN: your findings, worst first, and an honest note on what you ruled OUT.
`

const SCHEMA = {
  type: 'object',
  properties: {
    findings: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          where: { type: 'string', description: 'function / selector / line' },
          mechanism: { type: 'string', description: 'why it costs frames: style, layout, paint, composite, main thread' },
          evidence: { type: 'string', description: 'the number, and how it was obtained' },
          fix: { type: 'string', description: 'the actual replacement code or precise change' },
          notFixed: { type: 'string', description: 'what this would not solve' },
          confidence: { type: 'string', enum: ['high', 'medium', 'low'] },
          retinaSpecific: { type: 'boolean', description: 'does this get worse at 2x device pixels' },
        },
        required: ['title', 'where', 'mechanism', 'evidence', 'fix', 'confidence'],
      },
    },
    ruledOut: { type: 'string', description: 'what you measured that turned out fine' },
  },
  required: ['findings', 'ruledOut'],
}

const LENSES = [
  { key: 'flightloop', port: 8901, prompt: `
YOUR LENS: THE PER-FRAME CAMERA LOOP. orZoom.glide runs a requestAnimationFrame
tick for 880ms. Account for every single thing that happens inside one tick, and
inside anything it calls (orPan, orDust.step). Measure the synchronous cost of a
tick directly. Is anything in there reading layout? Writing more than it needs
to? Recomputing something invariant? Does state.zoom/panX/panY churn cause work
elsewhere? Look hard at orPan's class toggle crossing the 1.6 threshold mid-flight
and what a class change on #orSvg costs in style recalc across a thousand
descendants.` },

  { key: 'layoutthrash', port: 8902, prompt: `
YOUR LENS: FORCED SYNCHRONOUS LAYOUT. Find every read-after-write in an
interaction path. The prime suspect named in the app's own comments is
orPaintLabels — "a getBBox per chip and then a pairwise collision sweep" — which
runs on every landing. Also look at orDust.rest (there is a deliberate
void getBoundingClientRect in it), orDragStart.lit, orSignal, orLoose, and
anything using getTotalLength or getPointAtLength on link paths. Count
LayoutCount across a click-to-settled interaction and attribute the layouts to
specific call sites. A reflow of a thousand-element SVG is not cheap anywhere,
and it is the classic cause of JITTER as opposed to uniform slowness.` },

  { key: 'openpath', port: 8903, prompt: `
YOUR LENS: THE CLICK-TO-OPEN CRITICAL PATH. Trace everything from pointerup to a
settled map, in order, with a cost against each step. orOpen writes a whole
reading pane via innerHTML AT THE SAME MOMENT the flight starts — measure that
write, and measure whether the pane's own layout and paint lands inside the
flight's first frames. Consider whether work can be deferred past the flight, or
started earlier, or made incremental. Also: orPin's 240ms setTimeout means a
single click waits a quarter second before anything happens at all — quantify
what that costs the perception of responsiveness and whether the open can start
optimistically.` },

  { key: 'compositing', port: 8904, prompt: `
YOUR LENS: WHAT CANNOT BE COMPOSITED. Only transform and opacity animate on the
compositor; everything else repaints. Audit every animation and transition in the
file for the property it actually animates — including .or-surge
(stroke-dashoffset), the chip transitions, the halo transitions, the pane
transitions and anything using stroke, fill, r, cx, width or filter. Separately:
the camera writes #orView's transform as an SVG ATTRIBUTE every frame; determine
whether that path can be composited at all, whether will-change or a CSS
transform would promote it, and whether promotion actually helps SVG content or
just moves the cost. Be careful and honest here — promoting a large SVG subtree
can trade re-rasterisation for blurry upscaling, and the caller needs to know
which.` },

  { key: 'drawcost', port: 8905, prompt: `
YOUR LENS: WHAT IS EXPENSIVE TO DRAW AT ALL, at 2x device pixels. Count and
characterise: how many elements, how many radial-gradient fills (each star has a
ten-stop one), how much text on a path (the rim has three registers), how many
strokes, how large the painted areas are. Work out which of these dominate and
whether any are being drawn when they are not visible — off-screen at high zoom,
behind the reading pane, at opacity 0, or under a filter that has been dimmed.
Culling invisible work is the one lever that helps raster-bound cases and it is
the one thing this box cannot measure directly, so reason structurally and
measure element counts and painted area rather than time.` },

  { key: 'interplay', port: 8906, prompt: `
YOUR LENS: THINGS THAT COLLIDE. The user's complaint is about the WHOLE
interaction, and this app now has several mechanisms that fire at once: the
camera flight, the dial turn (orIndex, 2.1s on #orRings), the debris (SMIL), the
dust shells parting (orDust), the link surge, the reading pane opening, the force
simulation reheating, and the label pass on landing. Map out exactly what
overlaps with what on a single click, on a timeline. Find the moments where two
or three expensive things run in the same frames. Measure the CPU counters for a
click with each mechanism disabled in turn, to attribute cost. The most valuable
output here is a ranked attribution: which mechanism actually costs what, so the
caller can spend the budget where it matters instead of guessing.` },
]

phase('Hunt')
const reports = await parallel(LENSES.map((l) => () =>
  agent(HOWTO + l.prompt + `\n\nYOUR LENS KEY: ${l.key}. YOUR PORT: ${l.port}.\nYour directory: ${LAB}/${l.key}`,
    { label: `smooth:${l.key}`, phase: 'Hunt', schema: SCHEMA, effort: 'high' })
    .then((r) => ({ lens: l.key, ...(r || { findings: [], ruledOut: 'agent returned nothing' }) }))
))

const live = reports.filter(Boolean)
const all = live.flatMap((r) => (r.findings || []).map((f) => ({ lens: r.lens, ...f })))
const rank = { high: 0, medium: 1, low: 2 }
all.sort((a, b) => (rank[a.confidence] ?? 3) - (rank[b.confidence] ?? 3))
log(`${all.length} findings across ${live.length} lenses`)
return { findings: all, ruledOut: live.map((r) => ({ lens: r.lens, ruledOut: r.ruledOut })) }
