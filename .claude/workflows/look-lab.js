export const meta = {
  name: 'look-lab',
  description: 'Propose and render divergent visual treatments for the orrery map itself',
  whenToUse: 'When the ask is how the map LOOKS standing still — how stars are drawn, what the image is made of — rather than what a flight feels like.',
  phases: [{ title: 'Lenses', detail: 'six visual angles, each rendered over the real vault in both themes' }],
}

/* Six angles, deliberately far apart — see CLAUDE.md, "Options come from
   lenses, not from one mind". Each is forbidden the others' vocabulary,
   and each has to READ ITS OWN SCREENSHOT: an agent that only writes SVG
   returns something plausible. */

const LAB = '/tmp/look-lab'
const REPO = '/home/user/niko-999.github.io'
const HARNESS = `${REPO}/.claude/workflows/look-render.js`

const HOWTO = `
You are designing HOW A STAR CHART LOOKS. It is a map of a personal note vault:
${REPO}/orrery/index.html. Read ${REPO}/CLAUDE.md first — it is the house
rulebook and binding. Then look at what is actually drawn today: the function
orPaintRings (the rings and the rim), orPaintLinks, orPaintNodes (grep for
where .or-halo and .or-corec are built), and the CSS around ".or-node".

DO NOT EDIT ANY FILE IN ${REPO}. Work only under ${LAB}/<yourlens>/ (mkdir -p it).

WHAT IT LOOKS LIKE NOW. Roughly sixty notes as points, each a small solid core
with one soft radial-gradient bloom behind it, coloured by which of seven
folders it is in. Links between related notes are plain hairline paths. Around
them: faint concentric rings, two slowly turning arcs, about ninety static
field-star specks, and a rim of small type naming each folder. There are NO SVG
filters in this app at all — no blur, no glow beyond that one gradient, no
grain, no depth cue. Constellation figures have never existed. The whole thing
sits over one of fourteen full-bleed backdrop photographs, and it has to work
over all of them in two themes.

THE ASK, from the person who owns this app: they want MORE VISUAL EFFECT, and
they were explicit that it is "literally just visual" — this is about how it
LOOKS, not about new information, new controls, or new behaviour. They want to
be shown options. Do not propose a feature. Propose a look.

THIS IS NOT ABOUT MOTION. A separate lab is already doing effects during the
camera flight. Yours must be worth looking at STANDING STILL. You may use
motion only if it is genuinely incidental to a static idea, and the app has a
hard budget against it: under 12% of its SVG elements may sit inside a running
animation at rest, and existing work has FIVE elements of headroom left. In
practice: add no animation. Static is the brief.

HOW TO RENDER. Write ${LAB}/<yourlens>/<name>.js assigning:

  globalThis.LOOK = {
    css: '...',            // injected once into <head>
    paint: (help) => {},   // optional: add SVG, or restyle what is already there
  }

Read the header comment of ${HARNESS} for the exact contract. \`help\` hands you
\`nodes\` (every star, laid out, with its folder, tier and link count) and
\`links\` (every edge with both endpoints) in the map's own 0-1000 user units,
plus two empty groups that survive a repaint: \`under\` (behind the whole
drawing) and \`layer\` (over it).

Then:  node ${HARNESS} ${LAB}/<yourlens> <name> <YOURPORT>
It writes <name>-dark.png and <name>-light.png (the whole map) and
<name>-dark-close.png / <name>-light-close.png (clipped tight to one real
constellation, rendered at 2x so detail is judged at the size it is actually
drawn). READ ALL FOUR WITH THE READ TOOL AND LOOK AT THEM. The close-ups are
where your idea either has craft or does not. Iterate until it is actually
good. A proposal you have not looked at is not a proposal.

HARD RULES, all of them from the house rulebook:
  - No literal colours, ever. var(--or-star-core) for light, var(--or-hair) for
    ink, var(--or-cat-<id>) for a folder's own colour, color-mix() to blend.
    Fourteen backdrops and two themes; a hex works in one of them. Colour says
    WHICH, never whether — a folder's colour is its identity, never a rating.
  - It MUST read in both themes. Look at both images every time. Light theme is
    where a design tuned on black falls apart, and this repo has shipped a
    1.02:1 contrast ratio before by not checking.
  - No Math.random — help.rng(seed) only. The map must draw the same twice.
  - Do not put a <style> in <defs>: orPaintRings overwrites <defs> wholesale on
    every repaint. Put CSS in the \`css\` field. Anything you draw belongs in
    \`under\` or \`layer\`, never inside #orRings / #orLinks / #orNodes, which are
    rebuilt on every filter keystroke.
  - Keep it affordable. This repaints on every keystroke in the filter box.
    Under about 600 added elements, and prefer one <path> with many subpaths
    over many separate elements. An SVG filter over a large area is the one
    thing here that can genuinely cost frames — if you use one, keep its
    region tight and say so.
  - It sits UNDER READING. A note opens in a column beside the map. Nothing
    here may make the text harder to read or pull the eye off it.
  - Do not touch the layout. Where a star sits is decided by a physics
    simulation and is not yours to move.

WHAT MAKES A PROPOSAL GOOD HERE. It has to be recognisably its own idea rather
than "the same picture with more glow". It has to survive being looked at every
day — the test is not "is it striking in a screenshot", it is "would a person
still want this on the twentieth note they opened today". And it has to look
like it belongs to THIS object: an instrument, a chart, a thing that measures
something, not a screensaver.

RETURN 1 OR 2 proposals, your best. For each: the name, one line on what it IS,
two or three sentences on why it belongs on this object, the complete final JS
(the whole file contents, working, as you rendered it), the four absolute PNG
paths, the element count the harness printed, and anything you saw that is a
genuine drawback. Be honest about a weak one — one strong proposal beats two
padded.
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
          shots: { type: 'array', items: { type: 'string' }, description: 'the four PNG paths: dark, dark-close, light, light-close' },
          elements: { type: 'string', description: 'the element count the harness printed' },
          drawback: { type: 'string' },
        },
        required: ['name', 'what', 'why', 'code', 'shots', 'drawback'],
      },
    },
    tried: { type: 'string', description: 'what you rendered and rejected, and why' },
  },
  required: ['proposals', 'tried'],
}

const LENSES = [
  { key: 'optics', port: 8971, prompt: `
YOUR LENS: REAL OPTICS. Right now a star is a dot with one soft bloom, which is
how a diagram draws a star. Make it how a LENS sees one: diffraction spikes
from the aperture blades, halation bleeding into the surrounding dark, a tight
airy core with a long faint skirt, the brightest ones flaring while the faint
ones stay clean points. The app has no SVG filters at all, so feGaussianBlur,
feColorMatrix and friends are entirely unused ground — but a filter over the
whole map is the one genuinely expensive thing you can do here, so keep regions
tight and say what you measured. The prize: the map stops looking drawn and
starts looking photographed through something. Note the existing bloom is a
ten-stop radial gradient tuned against a real reference chart's falloff — read
it before you replace it, because that curve is already right and your job may
be what happens AROUND it rather than instead of it.` },

  { key: 'figures', port: 8972, prompt: `
YOUR LENS: CONSTELLATION FIGURES. A real star chart does not leave stars as a
scatter — it JOINS them, and the joined shape is what you remember. Each of the
seven folders is a constellation waiting to be drawn: give it a figure. The
honest way to pick the lines is the data itself (a minimum spanning tree over
the folder's own notes, or its strongest links) rather than an arbitrary chain,
so the shape a person learns is telling them something true about their vault.
Then it is a drawing problem: weight, whether the line touches the star or
stops short of it, whether it sits under the links that already exist or
replaces them, how it reads when one folder has fourteen notes and another has
two. This is the lens most likely to change what the map IS rather than how it
is finished, and it has never been tried in this app.` },

  { key: 'depth', port: 8973, prompt: `
YOUR LENS: IT IS A VOLUME, NOT A PLANE. Everything is currently drawn at
exactly one distance. Give the image a near and a far: atmospheric perspective
so distant things go cooler, fainter and lower-contrast; a focal plane so
something is genuinely sharp and something genuinely is not; occlusion so a
near thing eats a far one instead of both being visible through each other.
You have real data to hang depth on — every node carries a link count and a
tier, and the field-star specks are already meant to read as "further away"
than the notes. Beware the obvious trap: blurring things is not depth, it is
blur. What sells a volume is CONSISTENCY — size, contrast, colour temperature
and sharpness all agreeing about the same ordering.` },

  { key: 'plate', port: 8974, prompt: `
YOUR LENS: IT IS A PHYSICAL ARTEFACT. Not an image on a screen — a plate, a
print, something that was MADE and has a surface. Photographic grain that sits
in the image rather than on it. The warmth and slight unevenness of emulsion.
A vignette from the optics that took it. Registration, plate edges, the faint
tooth of paper in the light theme where it should read as a print and the fog
of a glass plate in the dark theme where it should read as an exposure. The
whole map is currently perfectly clean, which is what makes it read as
software; the argument for this lens is that every star chart worth looking at
is an object with a history. The risk is that grain over type makes the rim
unreadable and grain over a photograph backdrop reads as compression noise —
your close-ups will tell you, and you must check the rim type specifically.` },

  { key: 'links', port: 8975, prompt: `
YOUR LENS: THE LINKS ARE THE POINT, AND THEY ARE HAIRLINES. Sixty notes and
their connections is a GRAPH, and right now the connections are the least
considered thing on screen — plain thin paths of one weight. Give them
material. A link between two notes of the same folder could read differently
from one that crosses between folders. A link into a hub could thicken toward
it. Many links converging could pool into something denser rather than
overlapping into noise. They could carry their two endpoints' colours along
their own length instead of picking one. They could be drawn as bundles that
braid where they run together, which is what a real graph drawing does to stop
being a hairball. You have every edge with both endpoints and both folders in
\`help.links\` and \`help.nodes\`. Whatever you do must still read at sixty edges
without becoming a net the eye reads instead of the notes.` },

  { key: 'weather', port: 8976, prompt: `
YOUR LENS: THE SKY REPORTS THE VAULT. The backdrop is currently a photograph
with a drawing on top, and the two know nothing about each other. Make the
space between the stars respond to what is in it: nebulosity pooling where a
folder's notes are dense, thinning to clean void where nothing has been
written, the faint structure of a real deep-sky image following the actual
distribution rather than being decoration. This is the only lens that treats
the EMPTY parts of the map as a subject, and the map has a great deal of empty.
Seeded noise (help.rng) so it is the same every time but never regular. Watch
the element budget hard — a field of four thousand dots is out; find the
version that reads as nebulosity with a few hundred elements, or with a small
number of large soft shapes. And it must stay UNDER the drawing: this is the
thing furthest from the reader, and if it competes with a note's title you have
lost.` },
]

phase('Lenses')
const reports = await parallel(LENSES.map((l) => () =>
  agent(HOWTO + l.prompt + `\n\nYOUR LENS KEY: ${l.key}. YOUR PORT: ${l.port}.\nYour directory: ${LAB}/${l.key}`,
    { label: `look:${l.key}`, phase: 'Lenses', schema: SCHEMA, effort: 'high' })
    .then((r) => ({ lens: l.key, ...(r || { proposals: [], tried: 'agent returned nothing' }) }))
))

const live = reports.filter(Boolean)
const all = live.flatMap((r) => (r.proposals || []).map((p) => ({ lens: r.lens, ...p })))
log(`${all.length} rendered proposals across ${live.length} lenses`)
return { proposals: all, tried: live.map((r) => ({ lens: r.lens, tried: r.tried })) }
