export const meta = {
  name: 'fly-lab',
  description: 'Census every visual discontinuity in the camera flight, in and out',
  whenToUse: 'When the fly-in or fly-out is reported as shaky, or as making things disappear.',
  phases: [
    { title: 'Census', detail: 'six lenses on what changes during a flight' },
    { title: 'Rank', detail: 'order by what a person actually sees' },
  ],
}

/* Reported, after a round of perf work the user says fixed the lag:
   "the zoom in effect is still shaky and some things go invisible while
   it's zooming in ... not like a rocky going back and forth, things
   disappearing and then coming back. And also with the zoom out."

   So this lab is NOT about frame cost. It is about VISUAL CONTINUITY:
   what appears, disappears, jumps, reverses or restarts between the
   frame before a flight and the frame after it.

   Three of the disappearances are known and deliberate — #orLabels goes
   to opacity 0, the rim goes to display:none, and everything under
   #orNod has its animations paused — each bought a measured frame win
   that is documented in the CSS around it. Those wins must SURVIVE any
   fix. An agent that proposes "delete the rule" has not done the work:
   the rule is there because fourteen <text><textPath> cost 1.6ms of
   layout a frame. Propose something that keeps the win and loses the
   pop, or say plainly that you could not find one.

   THIS BOX CANNOT MEASURE RASTER OR FRAME RATE — software rasteriser,
   rAF throttled to about 20Hz, once timed a 3.9x zoom as faster than
   1x. It CAN measure, and these are what a finding must be built from:
   computed style and geometry sampled per frame from inside the camera's
   own rAF loop, screenshots of real frames, element counts, and Chrome's
   own CPU counters over CDP.

   A finding arrives with a repro and a measurement, or it does not
   arrive. That is the same contract sweep.js runs on and it is why
   neither of them has a verify phase. */

const LAB = '/tmp/fly-lab'
const REPO = '/home/user/niko-999.github.io'

const HOWTO = `
You are investigating VISUAL DISCONTINUITY in the camera flight of a single-file
SVG star-chart app: ${REPO}/orrery/index.html.

Read ${REPO}/CLAUDE.md first — the house rulebook. The sections "The passage",
"The ambient field" and "The field settles" are directly about this code, and the
long comments in the file around \`.or-fly\`, \`or-flying\`, \`#orLabels\`,
\`.or-rim-n\` and \`orZoom.hold\` document decisions you are about to question.
Question them anyway; just do it knowing what they bought.

DO NOT EDIT ANY FILE UNDER ${REPO}. Several of you run at once and you would
collide. Work only under ${LAB}/<yourlens>/ (mkdir -p it). If you need to try a
change, copy orrery/index.html into your own directory, serve YOUR copy, and say
so in your finding. Propose fixes as exact code and let the caller apply them.

THE REPORT, in the user's words: "the zoom in effect is still shaky and some
things go invisible while it's zooming in ... make sure nothing's disappearing,
nothing's invisible, everything is as proceeded, just a smooth transition, like a
fly, and not like a rocky going back and forth, things disappearing and then
coming back. And also with the zoom out as well."

So there are two distinct complaints and you should keep them apart:
  (A) THINGS DISAPPEAR AND COME BACK during a flight.
  (B) THE MOTION ITSELF IS SHAKY / rocks back and forth rather than flying.

WHAT A FLIGHT IS, mechanically. Clicking a star runs orDragEnd -> orOpen, which
fills the reading pane (a large innerHTML write that NARROWS THE STAGE), calls
orIndex() to turn #orRings one revolution over 2.1s, calls orPaint(), then
orOpen.reveal -> orZoom.fly -> orZoom.glide. glide adds .or-fly to #orView and
.or-flying to #orSvg, calls orZoom.hold(true) to mark every currently-animating
element with .or-held, opens the dust shells, spawns SMIL debris if the flight
gets closer, and then runs a per-frame rAF loop for FLY_MS = 880ms writing
#orView's transform attribute. On landing, orZoom.land removes the classes, rests
the dust, stops the debris and runs orPaintLabels (a getBBox per chip plus a
pairwise collision sweep). Zooming OUT happens through the same glide, called
from orClose (back to the fit) and from orZoom(0) / the orFit button.

KNOWN AND DELIBERATE, all three of which LOOK LIKE complaint (A):
  1. \`#orSvg.or-flying #orLabels { opacity: 0; transition: none }\` — every label
     chip vanishes for the whole flight and fades back in over .22s at the end.
     Reason: chips do not counter-scale, so they ballooned 2.38x with the camera
     and snapped back.
  2. \`#orSvg.or-flying .or-rim-n, .or-rim-c { display: none }\` — the rim type
     vanishes for the flight. Reason: 14 <text><textPath> = 374 glyphs re-shaped
     every frame because the camera changes the CTM scale factor; measured 1.6ms
     of layout per frame with them in, 0.3ms with them out.
  3. \`.or-held { animation-play-state: paused !important }\`, applied by
     orZoom.hold to everything animating under #orNod. Reason: anything still
     animating under a scaling ancestor is re-rasterised every frame.
Each is a real win. Your job is to find out WHICH of them the user is actually
seeing, how bad each looks, and whether there is a version that keeps the win.
And to find the ones nobody has noticed yet.

HOW TO MEASURE. Launch a browser with the repo's own helper:
  const { open } = require('${REPO}/tests/lib.js');
  const c = await open({ colorScheme: 'dark', deviceScaleFactor: 2 });
Serve the repo over http first — copy the tiny static server out of
${REPO}/.claude/workflows/look-render.js. USE YOUR OWN PORT, given below.
Go to http://127.0.0.1:<yourport>/orrery/ and wait for
  document.querySelectorAll('#orNodes .or-node').length > 0
then for state.alpha < SIM.floor so the simulation has settled.

Sampling per frame is the core technique and it must be done from INSIDE the
page's own rAF loop, not from a Playwright timer — a setInterval competing with
a live flight for the main thread starved for most of a second in testing here.
The shape that works:

  const trace = await c.page.evaluate(() => new Promise((res) => {
    const rows = [];
    let go = true;
    const sample = () => {
      if (!go) return;
      rows.push({ t: performance.now(), /* ... what you are watching ... */ });
      requestAnimationFrame(sample);
    };
    requestAnimationFrame(sample);
    const land = orZoom.land;
    orZoom.land = function (...a) { const r = land.apply(this, a);
      setTimeout(() => { go = false; res(rows); }, 700); return r; };
    orZoom.fly(['trading/models/cisd'], 'trading/models/cisd');
  }));

Real ids exist in state.notes — read them, do not invent them. Use a real mouse
(c.page.mouse.move/down/up over a node's bounding box) when the thing you are
testing is the CLICK path, because orOpen does several things orZoom.fly alone
does not.

Screenshots are legitimate evidence here and you should take them: c.page
.screenshot({ path, clip }) at chosen moments through a flight. To hold a flight
at a chosen point, drive it yourself — stub performance.now, or call orZoom.glide
and cancel its rAF at frame N, or simply screenshot every rAF tick into memory
and write the interesting ones. READ YOUR OWN SCREENSHOTS. An agent that only
writes numbers about pixels it never looked at returns something plausible.

Both themes and both directions. colorScheme 'dark' and 'light'. Fly IN (click a
star) and fly OUT (orClose, and the orFit button, and orZoom(0)).

WHAT A GOOD FINDING LOOKS LIKE:
  - A NAME for what a person sees. "The rim vanishes the instant you click and
    fades back 900ms later" — not "display:none is set".
  - WHERE: the exact selector, function and line.
  - A REPRO: the precise steps, and the code you ran, so the caller can
    reproduce it in thirty seconds.
  - A MEASUREMENT: a number with units. Frames it lasts, pixels it jumps,
    opacity it drops to, how many elements, the before and after values.
  - HOW BAD, honestly: is this a thing a person would notice at 880ms, or is it
    real but invisible? Say so. A true finding nobody can see is worth reporting
    AS a true finding nobody can see.
  - A FIX in exact code, and what the fix costs — especially whether it gives
    back one of the three measured wins above. If it does, say by how much.
  - Which of complaint (A) or (B) it explains.

Be ruthless with yourself. This app has had three rounds of confident
performance fixes; the user says the lag is now fine and the REMAINING problem is
visual. A speculative fourth round that trades continuity for nothing would be
worse than none. If your lens turns up nothing, "I measured X, Y and Z across
both themes and both directions and they are continuous" is a genuinely useful
result and you will not be penalised for it.

RETURN: your findings, worst first, plus an honest note on what you ruled OUT.
`

const SCHEMA = {
  type: 'object',
  properties: {
    findings: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          title: { type: 'string', description: 'what a person SEES, in plain words' },
          complaint: { type: 'string', enum: ['disappears', 'shaky', 'both'] },
          where: { type: 'string', description: 'selector / function / line' },
          repro: { type: 'string', description: 'exact steps and code to reproduce' },
          measurement: { type: 'string', description: 'a number with units, and how it was obtained' },
          visible: { type: 'string', enum: ['obvious', 'noticeable', 'subtle', 'invisible'] },
          fix: { type: 'string', description: 'exact replacement code' },
          cost: { type: 'string', description: 'what the fix gives back, in the same units the win was measured in' },
          direction: { type: 'string', enum: ['in', 'out', 'both'] },
          confidence: { type: 'string', enum: ['high', 'medium', 'low'] },
        },
        required: ['title', 'complaint', 'where', 'repro', 'measurement', 'visible', 'fix', 'direction', 'confidence'],
      },
    },
    ruledOut: { type: 'string', description: 'what you measured that turned out continuous' },
  },
  required: ['findings', 'ruledOut'],
}

const LENSES = [
  { key: 'vanish-in', port: 8931, prompt: `
YOUR LENS: THE VISIBILITY CENSUS, FLYING IN. Take a full census of what is
PAINTED before, during and after a fly-in, and report everything that changes.

Build it properly: walk every element under #orSvg once and record its id/class,
then sample each one's EFFECTIVE visibility across the flight — computed
display, visibility, opacity AND the product of every ancestor's opacity, since a
group at 0 hides children that individually read 1. Sample at rest, at the first
frame after the click, at roughly 10%/25%/50%/75%/95% of the flight, at the
landing frame, and 400ms after landing.

Report every element that is visible at rest and not visible at some point during
the flight, and every element that is not visible at rest and appears during it.
Group them — 60 nodes flickering together is one finding, not sixty. Weight by
how much of the frame each covers: use getBoundingClientRect area, and say what
fraction of the stage the vanished thing occupied.

Then LOOK at it: screenshot the frame before the click, three frames through the
flight and the frame after landing, and describe what actually changed in the
picture. The three known-deliberate disappearances are listed above — confirm or
deny each one from your own measurement, say how many frames each lasts, and
rank them against anything new you find.` },

  { key: 'vanish-out', port: 8932, prompt: `
YOUR LENS: THE VISIBILITY CENSUS, FLYING OUT — and the asymmetries between the
two directions. Same census technique as the in-bound case, but on every way the
camera goes OUT: orClose() from an open note, the orFit button, orZoom(0), and
pressing Escape.

Pay special attention to things that are order-dependent on the way out. When a
note closes, the reading pane hides and the stage WIDENS — find out whether that
happens before, during or after the camera glide, and whether the widening
re-centres the viewBox under a camera that is mid-flight. preserveAspectRatio is
"meet", so a change in the stage's aspect ratio moves everything on screen
without the camera having moved at all.

Also: orClose restores the cards (orOpen.chrome(false)) and re-runs orPaint.
Establish exactly what a full close does, in order, with timings, and find every
moment where two of those steps fight. Screenshot the sequence and read it.` },

  { key: 'trajectory', port: 8933, prompt: `
YOUR LENS: IS THE MOTION ITSELF SMOOTH. This is complaint (B) — "rocky going back
and forth" rather than a fly.

Sample from inside the page's rAF loop for the whole flight and record, per
frame: performance.now(), state.zoom, state.panX, state.panY, the parsed
#orView transform matrix, and the SCREEN position (getBoundingClientRect centre)
of (a) the star being flown to, (b) two other stars at different distances from
it, (c) the centre of the stage.

Then analyse the traces numerically:
  - Is the focused star's screen path MONOTONIC toward its destination, or does
    it reverse? Report any reversal in pixels and at what fraction of the flight.
  - Is d(ln z)/dt smooth? Compute it per frame and look for spikes,
    discontinuities and any sign change.
  - Does the pan follow the intended 1/z law, or does it overshoot? The code
    claims the target "slides to the middle EARLY" — verify that from the trace
    and say at what fraction of the flight it actually arrives.
  - Frame TIMING: how uniform are the intervals? A per-frame loop that misses a
    frame produces a position jump proportional to the miss. Report the interval
    distribution, and separate this box's known rAF throttling from real
    irregularity by comparing against a bare rAF loop doing nothing.
  - Is the first frame of the flight a JUMP? Compare the transform at the last
    pre-click frame against the first flight frame.
  - Same for the last: compare the final flight frame against the settled frame
    after orZoom.land. Any difference there is a snap at the end.
Do this for a fly-in and a fly-out, and for a long flight and a short one.` },

  { key: 'undercamera', port: 8934, prompt: `
YOUR LENS: THINGS THAT MOVE WHILE THE CAMERA IS MOVING. The camera aims at a
FIXED target computed once, at the start, from state.xy. If anything moves the
stars themselves during those 880ms, the camera is chasing a stale point and the
result reads as rocking.

Investigate, with numbers:
  - Does the force simulation (orSim) run during a flight? Does opening a note
    REHEAT it (look for state.alpha, SIM.floor, orSim.quiet, any reheat on
    selection or on orPaint)? Measure how far each node's state.xy moves between
    the first and last frame of a flight, in user units AND in screen pixels at
    the zoom reached.
  - The instrument's dial turn: orIndex() spins #orRings for 2.1s and starts at
    the same moment as the flight. Is it paused by .or-held? If it is, it stops
    partway and resumes on landing — measure the rotation angle per frame across
    the whole 2.1s and report where it stalls. If it is NOT paused, measure what
    a rotation composed with a scale does to the stars' screen paths.
  - orDust.open/step: the shells part during the flight. Measure their transform
    per frame and say whether the parting is monotonic and whether orDust.rest
    snaps them back.
  - orSignal, orLoose, orTwinkle, the surge: does anything repaint the map
    mid-flight? Watch for #orRings/#orNodes/#orLinks innerHTML being replaced
    during the flight window — use a MutationObserver and report every mutation
    with its timestamp relative to flight start.` },

  { key: 'stagejump', port: 8935, prompt: `
YOUR LENS: THE FRAME AT THE MOMENT OF THE CLICK, before the camera has moved at
all. There is a strong prior suspicion here and your job is to confirm it with
numbers or kill it.

orOpen sets the reading pane's hidden to false. The pane is a sibling of #orStage
in a flex row, so the stage NARROWS immediately. The SVG uses
preserveAspectRatio="meet" on a 1000-unit viewBox, so a change to the stage's
width or aspect ratio rescales and re-centres EVERYTHING on screen — with no
camera movement whatsoever. Measure exactly how far the star you clicked, and the
whole field, jump on screen at that instant. Report it in CSS pixels and as a
fraction of the stage width.

Then establish the ORDER of everything in the click-to-camera window, with
timestamps: orCloseCat, orReply.clear, orOpen.fill's innerHTML write, orIndex,
orPaint, the pane reveal, orOpen.chrome, orOpen.reveal, orZoom.fly's
getBoundingClientRect, orZoom.glide's first frame. Which of those happen before
the camera reads the stage's size, and which after?

Also check the reverse: closing a note WIDENS the stage. And check what happens
at narrow window widths where the layout may stack instead of sitting side by
side (there is a media query around 1417 in the CSS) — a stacked layout changes
the aspect ratio far more.

If the jump is real, propose a fix that keeps the pane's reveal instant: e.g.
compensating the camera by the same amount in the same frame, or flying from the
pre-reveal camera to a target computed in post-reveal geometry so the two
cancel. Give exact code.` },

  { key: 'restart', port: 8936, prompt: `
YOUR LENS: THINGS THAT STOP AND RESTART. orZoom.hold(true) walks
getAnimations({subtree:true}) at the moment the flight begins and marks every
element that is currently animating with .or-held, which pauses it. On landing
the class comes off and they resume.

Establish precisely what this covers and what it does to each thing:
  - Enumerate every element marked, by class/id, on a real click-open flight.
  - For each, what animation was running, how far through it was, and what a
    pause-then-resume LOOKS like for it. A twinkle frozen at half brightness for
    880ms then resuming is a visible artefact; a 40s dust rotation stalling is
    not. Measure, do not assume.
  - Anything that starts animating DURING the flight is not marked, because the
    walk happened once at the start. Find out what those are — orSignal's bead,
    a surge started by the open, orTwinkle's retry — and whether they animate
    through the flight while their neighbours are frozen.
  - orTwinkle early-returns and retries in 320ms while .or-flying. Measure the
    gap: how long is the map without twinkle, and does a halo get left at a
    non-resting opacity when it is interrupted?
  - The .or-tight threshold at zoom 1.6 is crossed DURING most flights and
    toggles a class that pauses the same things. Trace what happens when
    .or-tight and .or-flying overlap and when they come off in different frames —
    especially on the way OUT, where the camera crosses 1.6 downward and lands.
  - Check the CSS transitions too: what has a transition that is INTERRUPTED
    mid-flight, and does it restart from where it was or snap?` },
]

phase('Census')
const reports = await parallel(LENSES.map((l) => () =>
  agent(HOWTO + l.prompt + `\n\nYOUR LENS KEY: ${l.key}. YOUR PORT: ${l.port}.\nYour directory: ${LAB}/${l.key}`,
    { label: `fly:${l.key}`, phase: 'Census', schema: SCHEMA, effort: 'high' })
    .then((r) => ({ lens: l.key, ...(r || { findings: [], ruledOut: 'agent returned nothing' }) }))
))

const live = reports.filter(Boolean)
const all = live.flatMap((r) => (r.findings || []).map((f) => ({ lens: r.lens, ...f })))
const seen = { obvious: 0, noticeable: 1, subtle: 2, invisible: 3 }
all.sort((a, b) => (seen[a.visible] ?? 4) - (seen[b.visible] ?? 4))
log(`${all.length} findings across ${live.length} lenses`)

phase('Rank')
const plan = await agent(`Six agents have just measured every visual discontinuity in the camera
flight of ${REPO}/orrery/index.html. Their findings are below as JSON.

You are NOT verifying them — every one arrived with a repro and a measurement,
which is this repo's contract. You are turning them into an ORDER OF WORK for
the person who will now fix them, whose user said: the lag is fine now, but the
zoom "is still shaky and some things go invisible while it's zooming in", and
asked for the same on the way out.

Read ${REPO}/CLAUDE.md and the relevant part of the app before you rank, so you
can tell a finding that fights a documented decision from one that does not.

Produce:
  1. A ranked list. Rank by WHAT A PERSON SEES, not by how clever the finding is.
     Obvious-and-cheap first. For each: one sentence of what the user sees, the
     fix in one line, and what it costs.
  2. Duplicates merged — several lenses will have found the same thing from
     different angles. Say which lenses corroborated each item; corroboration
     across lenses is worth noting.
  3. Conflicts called out: any two fixes that pull against each other, or any fix
     that gives back a measured performance win. Name the trade explicitly with
     both numbers.
  4. The things that were ruled out, so the fixer does not go looking there.
  5. Your honest read on which single finding is MOST LIKELY to be the thing the
     user is actually complaining about, and why.

FINDINGS:
${JSON.stringify(all, null, 1)}

RULED OUT:
${JSON.stringify(live.map((r) => ({ lens: r.lens, ruledOut: r.ruledOut })), null, 1)}`,
  { label: 'rank', phase: 'Rank', effort: 'high' })

return { plan, findings: all, ruledOut: live.map((r) => ({ lens: r.lens, ruledOut: r.ruledOut })) }
