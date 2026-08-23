export const meta = {
  name: 'rim-lab',
  description: 'Propose and render genuinely divergent outer-rim treatments for the orrery',
  whenToUse: 'When the safe variations have been rejected and the ask is for something unique.',
  phases: [{ title: 'Lenses', detail: 'six creative angles, each rendering what it proposes' }],
}

/* Six angles chosen to be far apart on purpose. The first round of
   options was six variations on "instrument bezel" and read as one
   idea shown six ways — which is the failure mode of generating
   options from a single mind converging. Each lens below is told to
   stay in its own world and is forbidden the others'.

   Every proposal must be RENDERED before it is returned. An agent that
   only writes SVG returns something plausible; an agent that has to
   look at its own screenshot returns something that works. The harness
   makes that cost about forty seconds. */

const LAB = '/tmp/rim-lab'
const REPO = '/home/user/niko-999.github.io'

const HOWTO = `
You are designing the OUTER RIM of a star-chart view of a note vault:
${REPO}/orrery/index.html. Read ${REPO}/CLAUDE.md first — it is the house
rulebook and binding — then read the function orPaintRings in that file to see
what is drawn now.

DO NOT EDIT ANY FILE IN ${REPO}. Work only under ${LAB}/<yourlens>/ (mkdir -p it).

WHAT YOU ARE DESIGNING. Only the annulus from radius 330 out to about 490, in
the map's own units (the drawn field is a 0-1000 viewBox centred at 500,500).
Everything inside 330 is somebody else's and you must not touch it. Two things
in your band are FIXED and will be composited over whatever you return: the
three dust shells, and two heavy arcs at r 352 that turn slowly. Design around
them.

HOW TO RENDER. Write ${LAB}/<yourlens>/<name>.js assigning a function:

  globalThis.RIM = (sec, h) => { /* return an SVG string */ }

  sec  one entry per category in draw order: {id, a0, a1, mid, n} —
       angles in degrees, n = how many notes are in it.
  h    { N(v) round to 2dp, P(r,a) polar to [x,y], arc(r,a,b) arc path,
         hair(r,o,w) a circle string, rng(seed) a seeded PRNG, H the ink
         token } — read ${LAB}/render.js for the exact contract.

Then:  node ${LAB}/render.js ${LAB}/<yourlens> <name> <YOURPORT>
It writes <name>-dark.png and <name>-light.png. READ BOTH IMAGES WITH THE READ
TOOL AND LOOK AT THEM. Iterate until it is actually good. A proposal you have
not looked at is not a proposal.

HARD RULES, all of them from the house rulebook:
  - No literal colours, ever. var(--or-hair) for ink, var(--or-cat-<id>) for a
    category, var(--or-star-core) for light, color-mix() to blend. There are
    eleven backdrops and two themes and a hex works in one of them.
  - It must read in BOTH themes. Look at both images every time.
  - No Math.random — the same vault must draw the same twice. Use h.rng(seed).
  - Nothing new may MOVE. The user asked for stillness everywhere except the
    two heavy arcs; a rim that animates will be rejected on sight.
  - It sits under reading. A note opens in a column beside the map and the rim
    must not pull the eye off the text.
  - Vanilla SVG in one string. No dependency, no build step, no external asset.
  - Keep it cheap: this repaints on every filter keystroke. Under about 600
    elements, and prefer one <path> with many subpaths over many elements.
  - Colour says WHICH, never whether. A category's colour is its identity.

WHAT MAKES A PROPOSAL GOOD HERE. It has to be recognisably ITS OWN IDEA rather
than a setting on the existing one. The rejected round was: a graduated bezel,
four cardinal marks, a soft vignette, crossing ellipses, coloured sector bands,
and paired hairlines. Do not send those back. Go further than feels safe — the
brief is literally "something unique and different" — but it still has to be
something a person could look at every day.

RETURN 2 OR 3 proposals, your best. For each: the name, one line on what it IS,
two or three sentences on why it belongs on THIS object, the complete final JS
(the whole file contents, working, as you rendered it), the absolute paths of
its two PNGs, and anything you saw that is a genuine drawback. Be honest about
weak ones — returning one strong proposal beats three padded.
`

const SCHEMA = {
  type: 'object',
  properties: {
    proposals: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          what: { type: 'string', description: 'one line: what it IS' },
          why: { type: 'string', description: 'why it belongs on this object' },
          code: { type: 'string', description: 'the complete final .js file contents' },
          dark: { type: 'string', description: 'absolute path to the dark png' },
          light: { type: 'string', description: 'absolute path to the light png' },
          drawback: { type: 'string' },
          elements: { type: 'string', description: 'roughly what it draws, counted' },
        },
        required: ['name', 'what', 'why', 'code', 'dark', 'light', 'drawback'],
      },
    },
    tried: { type: 'string', description: 'what you rendered and rejected, and why' },
  },
  required: ['proposals', 'tried'],
}

const LENSES = [
  { key: 'chart', port: 8961, prompt: `
YOUR LENS: THE OLD CHART. Not instruments — MAPS. Portolan rhumb-line networks
radiating from wind roses on the rim; graticules; the ruled scale bar; the
cartouche; the way a sea chart's margin is dense in one quadrant and empty in
another because that is where the coast was. The vault has seven sectors of
wildly different size and a real link graph — a chart margin that responded to
which quadrant is crowded would be doing what a portolan does.` },

  { key: 'time', port: 8962, prompt: `
YOUR LENS: THE RIM AS A CLOCK OF THE VAULT. Every note carries an mtime
(state.notes[i].mtime, ms, 0 when unknown — the seed has real ones, check).
Design a rim that shows WHEN rather than what: a year as a circle, a note as a
mark at its date, the months you wrote nothing showing as gaps you can see. The
map already answers "what is near what" and answers "when" nowhere. This is the
lens most likely to produce something genuinely new, because it puts information
on the rim that exists nowhere else on the screen. Read the notes out of the
page (state.notes) inside your RIM function if you need more than sec gives
you — it runs in the real page and everything is in scope.` },

  { key: 'thing', port: 8963, prompt: `
YOUR LENS: THE RIM AS A PHYSICAL OBJECT, seen edge-on. An iris diaphragm's
overlapping blades. A film sprocket. A turbine's stator ring. A lens barrel's
knurling. A bearing race. A camera shutter caught part-open. These have
STRUCTURE — repeated shapes that overlap and interlock — rather than lines, and
none of the six rejected options had any structure at all. Make the edge feel
manufactured and heavy without making it loud.` },

  { key: 'type', port: 8964, prompt: `
YOUR LENS: THE RIM MADE OF LANGUAGE. Not a label — the rim's substance is
glyphs. Category names set as an arc of tiny wide-tracked type around their own
sector. A ring of the vault's most-linked note titles, so the edge tells you
what the vault is ABOUT before you have opened anything. Numerals as scale.
Beware: the house rulebook forbids rim type on the grounds that a print has to
say what it is and this does not — so if you propose type you must beat that
argument, and the way to beat it is for the type to carry information the map
does not otherwise show. Text in SVG needs font-family:var(--mono) and a real
letter-spacing to work at 6-8px.` },

  { key: 'grown', port: 8965, prompt: `
YOUR LENS: NOT DRAWN — GROWN, OR ERODED. The rim as a field rather than a line:
an interference pattern, a corona, a diffraction ring, dendrites reaching in
from the edge, a coastline eroded by where the notes are dense. Seeded noise
(h.rng) so it is the same every time but not regular. The whole map is a
simulation already; a rim that looks computed rather than ruled would be honest
about that. Watch the element budget — a field of 4000 dots is out; find the
version that reads as a field with a few hundred.` },

  { key: 'absence', port: 8966, prompt: `
YOUR LENS: THE RIM AS ABSENCE. Not something added, something taken away. The
sky cut off by a horizon. A shadow falling across the field from one side. The
edge as the boundary of a lit region rather than a drawn circle. A torn or
burnt margin. A single very long slow gradient that makes the field feel domed.
The most restrained of the rejected six still ADDED marks; you are looking for
the version where the rim is where something stops.` },
]

phase('Lenses')
const reports = await parallel(LENSES.map((l) => () =>
  agent(HOWTO + l.prompt + `\n\nYOUR LENS KEY: ${l.key}. YOUR PORT: ${l.port}.\nYour directory: ${LAB}/${l.key}`,
    { label: `rim:${l.key}`, phase: 'Lenses', schema: SCHEMA, effort: 'high' })
    .then((r) => ({ lens: l.key, ...(r || { proposals: [], tried: 'agent returned nothing' }) }))
))

const live = reports.filter(Boolean)
const all = live.flatMap((r) => (r.proposals || []).map((p) => ({ lens: r.lens, ...p })))
log(`${all.length} rendered proposals across ${live.length} lenses`)
return { proposals: all, tried: live.map((r) => ({ lens: r.lens, tried: r.tried })) }
