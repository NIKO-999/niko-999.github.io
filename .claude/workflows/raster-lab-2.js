export const meta = {
  name: 'raster-lab-2',
  description: 'What is left of the lag now the panel no longer re-blurs itself every frame',
  whenToUse: 'After the .app backdrop-filter fix, to re-measure the remaining candidates at the new operating point.',
  phases: [
    { title: 'Ablate', detail: 'four lenses at the new operating point' },
    { title: 'Rank', detail: 'order by measured effect, and flag anything visual' },
  ],
}

/* ROUND FIVE, and the operating point has moved.
   Round four found the thing three rounds had missed: `backdrop-filter`
   on `.app` re-blurred four megapixels every frame because a backdrop
   pass is redone whenever the FILTERED ELEMENT'S OWN SUBTREE repaints.
   That shipped, along with three main-thread cuts. Measured after, five
   runs each way, ranges non-overlapping: frames delivered in a fixed
   1600ms window, opening a note 24 → 48, closing 28 → 62; median frame
   gap 66.7ms → 33.3ms and 66.6ms → 16.7ms.

   Round four's own rank agent said explicitly: re-measure before
   touching items 5-8, because the wins stack multiplicatively and the
   operating point moves under you — the further gains it measured at
   baseline came out at 1.51x once fix 1 was in. So nothing from that
   list is to be taken on trust here. Re-measure it.

   THE USER'S CONSTRAINT, and it is a hard one: keep going until the
   smoothness is right, but NO VISUAL CHANGES without their approval.
   So every proposal must be labelled: does this change what the app
   LOOKS like, at all, in any state? A fix that culls something nobody
   can see is not a visual change. A fix that stops an animation the
   user can watch IS one, however small, and must be flagged so it can
   be put to them rather than shipped. When in doubt, call it visual. */

const LAB = '/tmp/raster-lab-2'
const REPO = '/home/user/niko-999.github.io'

const HOWTO = `
You are measuring what is LEFT of the lag in a single-file SVG star-chart app:
${REPO}/orrery/index.html, after a large compositing fix has already shipped.

Read ${REPO}/CLAUDE.md first. The sections "The work is not on the main thread"
and "Two things measured in CSS pixels, so they transfer" are round four's
write-up and describe exactly what changed and what it bought. Do not re-file
any of it.

DO NOT EDIT ANY FILE UNDER ${REPO}. Four of you run at once and you would
collide. Work under ${LAB}/<yourlens>/ (mkdir -p it). To ablate, COPY the repo
into your own directory and serve YOUR copy. Serve with the tiny static server
in ${REPO}/.claude/workflows/look-render.js (copy it, point ROOT at your copy).
USE YOUR OWN PORT, given below.

THE COMPLAINT, in the user's words, and it is now specific: the fly-in "moves
in jerky steps". Not input latency, not the length of the animation, not general
heaviness — they were asked and they picked that one. They are on a MacBook Pro
built-in display, so assume 2x device pixels and assume 120Hz, where a frame is
8.3ms rather than 16.7.

THE USER'S CONSTRAINT: no visual changes without their approval. Every finding
MUST set \`visual\` honestly. Culling something that is off-screen is not
visual. Changing a duration, a colour, an opacity, whether something animates at
all, or anything a person could notice IS visual, however small — flag it, do
not quietly bank it. When in doubt, call it visual.

MEASUREMENT RULES, learned the hard way in round four and not optional:

  1. THIS BOX HAS NO GPU. Software rasteriser, rAF throttled, every absolute
     millisecond untransferable. Only RATIOS transfer.
  2. ABLATE. Every finding is a PAIR — with the suspect, without it, same
     interaction, several runs, ranges reported. No pair, no finding.
  3. FRAMES DELIVERED in a fixed wall-clock window, and MEDIAN INTER-FRAME GAP,
     are what tracked the positive controls. The gap quantises cleanly onto the
     16.67ms vsync grid, which makes it readable. Summed RasterTask milliseconds
     are a trap in BOTH directions: they are renderer-side only so Viz-process
     cost is invisible, AND they go UP for a faster variant because more frames
     get produced in the same window.
  4. Trace \`dur\` is unusable under contention — four agents on four cores swung
     baseline raster 200-460ms run to run. Use \`tdur\`, counts, or frame counts.
  5. Emulation.setCPUThrottlingRate BUSY-SPINS in this container: an idle page
     burns 0.84s of CPU per second at rate 6, and Performance.getMetrics
     ProcessTime is then ~95% the throttle's own spin. Use rate 1, or use counts.
  6. Screenshot before trusting a number. Round four had a lab spend a whole run
     blurring a flat colour because an injected stylesheet resolved var(--photo)
     against the wrong base and 404'd — and it still timed as a big win.

Launch with the repo's own helper at 2x:
  const { open } = require('${REPO}/tests/lib.js');
  const c = await open({ colorScheme: 'dark', deviceScaleFactor: 2 });

The frame-count harness that produced round four's headline numbers is at
/tmp/claude-0/-home-user-niko-999-github-io/2401e1ad-89b7-530f-a187-fc03279f66cd/scratchpad/frames.js
— read it and reuse its shape rather than inventing another one, so your numbers
are comparable to the ones already in CLAUDE.md.

WHAT A GOOD FINDING LOOKS LIKE: what a person feels; the exact code; the PAIR
with ranges and run count; the mechanism; the fix as exact code; what it costs;
whether it is VISUAL; and your confidence that it matters on a 120Hz Retina Mac.

Be ruthless with yourself. Four rounds have shipped. The remaining items are
small by construction — round four's own rank agent called items 5 and 6
"correct but disputed in size" and items 7 and 8 "real with no proven fix, and
the right response is to stop rather than hand over a plausible patch". If your
lens confirms that, SAY SO. "I measured it at the new operating point and it is
inside the noise floor" is the most useful thing you can return, because it lets
the caller stop.

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
          where: { type: 'string' },
          mechanism: { type: 'string' },
          withIt: { type: 'string', description: 'measurement WITH the suspect: number, units, runs, range' },
          withoutIt: { type: 'string', description: 'measurement ABLATED: number, units, runs, range' },
          ratio: { type: 'string', description: 'the ratio and whether the ranges overlap' },
          visual: { type: 'boolean', description: 'does this change what the app looks like, in any state, at all' },
          visualNote: { type: 'string', description: 'if visual: exactly what a person would see change' },
          fix: { type: 'string', description: 'exact replacement code' },
          cost: { type: 'string' },
          confidence: { type: 'string', enum: ['high', 'medium', 'low'] },
        },
        required: ['title', 'where', 'mechanism', 'withIt', 'withoutIt', 'ratio', 'visual', 'fix', 'confidence'],
      },
    },
    ruledOut: { type: 'string' },
  },
  required: ['findings', 'ruledOut'],
}

const LENSES = [
  { key: 'hold', port: 8981, prompt: `
YOUR LENS: DOES A PAUSED ANIMATION STILL COST? Two labs measured this in round
four and disagreed by a factor of five. Settle it at the new operating point.

orZoom.hold(true) marks every currently-animating element under #orNod with
\`.or-held\`, whose rule is \`animation-play-state: paused !important\`. The claim
is that pausing does NOT release the composited layer the animation caused, so
the flight still pays for 53 layers where it could pay for 33. One lab measured
composited layers 53 → 33, composited pixels 16.38M → 13.99M per frame, CPU per
produced frame 38.5 → 31.2ms, frames delivered +21%. The other built the same
fix and got 43 frames against 40 and called it marginal.

Measure it properly, now that the panel is no longer re-blurring itself:
  - The clean pair, several runs, ranges, on a real click-open flight.
  - Layer counts and composited pixels per frame, from a trace.
  - Then build the actual fix and measure THAT, not the ablation: replace the
    pause with \`animation: none\`, pinning the frame the animation was on, and
    restore phase on release through a negative \`animation-delay\`. The whole
    risk is a visible snap when it resumes — measure the largest single-frame
    angle change of \`.or-turn\` across a real flight, before and after, and say
    whether it moves. Round four measured 1.1543° against 1.1542°.
  - Say plainly whether this is worth shipping at the new operating point.

Note for your fix: \`tests/orrery.js\` has an assertion requiring
\`animationPlayState === 'paused'\` mid-flight. Under this change the element
reports \`animationName === 'none'\`, and an element with no animation reports
'running'. Give the caller the exact rewritten assertion.` },

  { key: 'cull', port: 8982, prompt: `
YOUR LENS: THE 56% OF THE DRAWING THAT IS OFF SCREEN. This is the one remaining
item with a big number and no proven fix, and it is the one that is NOT a visual
change if it is done correctly — culling something nobody can see cannot be seen.

Round four measured: at 2.4x zoom, 56% of the drawing is outside the frame and
costs 1.40x of a parked frame (16.75 against 12.0 ms/frame, non-overlapping). It
also measured that the obvious cheap version does NOT work — halving the
satellite retinue (297 → 152 elements) bought 2.3% against a 1.1% noise floor,
because the cost is painted AREA, not element count.

So build the real thing and measure it:
  - Cull by POSITION, inside orZoom.glide's own per-frame tick. orSim.el is the
    hook round four identified. Work out the visible rectangle in user units
    from state.zoom/panX/panY, and hide what is outside it plus a margin.
  - The margin matters: too tight and things pop in at the edge of the frame
    during a flight, which is a visual change and a bad one. Measure what margin
    is needed for nothing to pop, and PROVE it with screenshots through a whole
    flight at several zooms, both themes.
  - Hiding must itself be cheap. \`display: none\` on 300 elements per frame may
    cost more than it saves — measure the hiding, not just the result. Consider
    doing it once at the start of a flight for the union of the start and end
    frames rather than per frame.
  - Watch for what must NEVER be culled: anything the tests measure, the rim,
    the selected node and its kin, anything mid-animation.
  - If it turns out the cull costs more than it saves, say so and stop. That is
    a genuinely useful answer and round four predicted it might be.` },

  { key: 'idle', port: 8983, prompt: `
YOUR LENS: WHAT KEEPS THE COMPOSITOR AWAKE WHEN NOTHING IS HAPPENING, now the
blur is gone.

Round four measured 38-40 composited frames in a 2s idle window with nothing on
screen changing, and the Viz thread 94-97% busy at rest — then found that the
cheap half of the fix WAS the blur fix (idle frame 50.1ms → 16.5ms without
touching any animation). So re-measure at the new operating point first and find
out how much is actually left.

Then attribute what remains, one at a time, with pairs: the three \`infinite\`
dust rotations, the 26s rim wrapper, the ambient trickle, the always-on
\`.or-turn\`, and anything else holding a per-vsync frame request open forever.

This is the lens most likely to produce VISUAL proposals, so be scrupulous about
labelling them. Stopping a rotation the user can watch is a visual change even
if it is slow enough that they would never consciously notice — flag it, give
the caller the exact numbers, and let them put it to the user. Do NOT recommend
shipping any of it silently.

The genuinely non-visual version, if it exists, is the interesting result: an
animation that is running but produces no visible change (below a pixel of
movement per frame, or on an element that is transparent, or outside the frame)
is one that could stop without anybody seeing. Find out whether any of these
qualify, with numbers — degrees per frame, pixels of movement per frame at the
current zoom, measured rather than reasoned.` },

  { key: 'loose', port: 8984, prompt: `
YOUR LENS: FOUR LOOSE ENDS, three of which are correctness bugs with performance
consequences. All four came out of round four in passing and none was measured.

1. THE HEAVY ARC RESTARTS FROM ZERO ON EVERY NOTE YOU OPEN. orPaint() inside
   orOpen() rebuilds #orRings wholesale, so the heavy arc and the three dust
   shells are brand-new elements every time — and their rotation restarts from
   0, a jump of up to a full turn on the boldest stroke on the map, hidden under
   the same frame as the pane opening. Round four found this present in the
   shipped tree and in every patched variant, so it is not a regression. VERIFY
   it, measure the size of the jump in degrees, and find the fix. Note that
   fixing a JUMP is removing a glitch, not adding a visual change — but say so
   explicitly and describe exactly what a person would see differ.

2. AN ANIMATION FRAME LOOP THAT OUTLIVES ITS OWN CAP. With orIndex ablated, one
   formation switch in three left orSim.raf alive past a 7-second cap. A rAF
   loop that never stops is permanent cost on every frame forever. Reproduce it,
   find out whether it happens in the SHIPPED tree too (round four only saw it
   in an ablated build, which may be an artefact of the ablation), and if it is
   real, find the leak.

3. \`.or-tight\` MAKES THE SAME MISTAKE AS \`.or-held\`, and it lasts for as long
   as you are reading a note rather than for 880ms. Round four flagged this as
   INFERRED and explicitly not measured as a pair — 51 layers / 17.28 Mpx at
   2.4x against 37 / 13.42 at the fit, but no time saving measured. Measure the
   pair properly. The trap it flagged: routing .or-tight through orZoom.hold
   gives that function two owners and the release is not idempotent — a flight
   ending above 1.6x would release a hold that .or-tight still wants. Write the
   two-caller case before writing the fix.

4. A FORCED LAYOUT ON EVERY PRESS FOR NOTHING. orDragStart calls orToUser even
   when the press landed on a node, where its result is not used. Round four
   measured getScreenCTM caching as a dead end — the cost is the style+layout
   flush the read forces, and that flush has to happen anyway — so check whether
   this one is real before proposing it, and be willing to report it as noise.` },
]

phase('Ablate')
const reports = await parallel(LENSES.map((l) => () =>
  agent(HOWTO + l.prompt + `\n\nYOUR LENS KEY: ${l.key}. YOUR PORT: ${l.port}.\nYour directory: ${LAB}/${l.key}`,
    { label: `r2:${l.key}`, phase: 'Ablate', schema: SCHEMA, effort: 'high' })
    .then((r) => ({ lens: l.key, ...(r || { findings: [], ruledOut: 'agent returned nothing' }) }))
))

const live = reports.filter(Boolean)
const all = live.flatMap((r) => (r.findings || []).map((f) => ({ lens: r.lens, ...f })))
const rank = { high: 0, medium: 1, low: 2 }
all.sort((a, b) => (rank[a.confidence] ?? 3) - (rank[b.confidence] ?? 3))
log(`${all.length} findings across ${live.length} lenses`)

phase('Rank')
const plan = await agent(`Four agents have re-measured the remaining lag candidates in
${REPO}/orrery/index.html at a NEW operating point — round four's compositing fix
has shipped and roughly doubled the frames delivered on every interaction.

Read ${REPO}/CLAUDE.md, especially "The work is not on the main thread", so you
know what has already been done and must not be re-proposed.

The user's constraint is hard: keep improving smoothness, but NO VISUAL CHANGES
without their approval. So your output has TWO lists, and the split is the most
important thing you produce:

  A. SHIP NOW — measured, worth it, and changes nothing a person can see.
  B. ASK FIRST — measured and worth it, but changes appearance, however
     slightly. For each of these give the caller a one-sentence, non-technical
     description of what the user would actually see differ, so it can be put to
     them in plain English. The user has no coding experience.

Within each list, rank by measured effect size, and give: what a person feels,
the fix in one line, the measured improvement with its ranges, and the cost.

Then:
  3. What was ruled out at the new operating point, so nobody looks again.
  4. THE STOPPING QUESTION, and answer it honestly. Round four's rank agent
     predicted items 5-8 would be small or unfixable. Is there anything left
     that is worth the risk of touching, or is the right answer now "this is as
     smooth as it gets without changing what it looks like"? A clear "stop here"
     is a valuable answer and the caller has explicitly asked to be told when
     that point is reached. Do not manufacture work.

FINDINGS:
${JSON.stringify(all, null, 1)}

RULED OUT:
${JSON.stringify(live.map((r) => ({ lens: r.lens, ruledOut: r.ruledOut })), null, 1)}`,
  { label: 'rank', phase: 'Rank', effort: 'high' })

return { plan, findings: all, ruledOut: live.map((r) => ({ lens: r.lens, ruledOut: r.ruledOut })) }
