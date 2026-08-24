export const meta = {
  name: 'particle-lab',
  description: 'Propose and render genuinely divergent persistent ambient particle fields for the orrery',
  whenToUse: 'When the ask is a permanent, always-on layer of drifting debris/particles, not a one-off event effect.',
  phases: [{ title: 'Lenses', detail: 'four divergent takes, each rendered in the live app across time' }],
}

/* Four angles chosen to be far apart on purpose — see CLAUDE.md's "Options
   come from lenses, not from one mind": the first pass on any open visual
   brief converges on one idea shown several ways unless each lens is
   explicitly forbidden the others' vocabulary. Every proposal must be
   RENDERED — across THREE moments of its own loop, not one still, because
   motion is the entire subject here — before it is returned. */

const LAB = '/tmp/particle-lab'
const REPO = '/home/user/niko-999.github.io'
const HARNESS = `${REPO}/.claude/workflows/particle-render.js`

const HOWTO = `
You are designing a PERSISTENT AMBIENT PARTICLE FIELD for a star-chart view
of a note vault: ${REPO}/orrery/index.html. Read ${REPO}/CLAUDE.md first — it
is the house rulebook and binding. Then read the CSS around "#orDustA,
#orDustB, #orDustC" and the JS object "orDust" and the function "orDebris" in
that file (grep for them) — those are what exists today: 95 static field-star
specks that rotate in three slow shells (the whole ambient field there is),
and a burst of shooting-star debris that fires ONLY during a zoom-in flight.

THE ASK, from the person who owns this app: "I want in general for there to
be debris and particles" — expanded, on being asked, into "a persistent
ambient field... a handful of particles drift on their own even at rest,
like the existing dust shells but more visible/varied — always there, not
just event-triggered." You are proposing what that field IS, not tuning the
existing dust rotation — it has to be recognisably its own thing, on screen
permanently, whether the user is looking at it or not.

DO NOT EDIT ANY FILE IN ${REPO}. Work only under ${LAB}/<yourlens>/ (mkdir -p
it).

HOW TO RENDER. Write ${LAB}/<yourlens>/<name>.js assigning:

  globalThis.PARTICLES = (help) => ({ css: '...', svg: '...' })

  help.N(v) round to 2dp · help.rng(seed) a seeded PRNG (Math.random is
  forbidden — the field must draw the same twice) · help.CX/help.CY the
  viewBox centre (500,500) · help.polar(r,a) -> [x,y], a in degrees.

  css is arbitrary CSS TEXT including @keyframes, injected into a <style> in
  <head> — NOT scoped, so prefix every rule/keyframe name with something
  unique to your lens (e.g. .plens-sunbeam-mote). svg is markup injected as
  the children of a fresh <g> appended as the LAST child of #orView (same
  tier as #orDebris — never touched by a #orRings repaint).

Then:  node ${HARNESS} ${LAB}/<yourlens> <name> <YOURPORT>
It writes <name>-dark-0.png, <name>-dark-2.png, <name>-dark-5.png (your loop
at three moments ~2.5s apart) and <name>-light-2.png, and prints an element
count plus a flag if any @keyframes block touches a property other than
transform/opacity. READ ALL FOUR IMAGES WITH THE READ TOOL. Compare the three
dark stills side by side — if they look identical, nothing is actually
moving; iterate until it is actually good. A proposal you have not looked at,
across time, is not a proposal.

HARD RULES, all of them from the house rulebook and this brief specifically:
  - CSS-ONLY MOTION. Every @keyframes block may only animate transform and/or
    opacity — the compositor-only properties. This layer runs FOREVER,
    unconditionally, on every load — "the dust survives because it's cheap:
    2% of the drawing" is the whole justification for anything ambient
    existing in this app at all, and it stops being cheap the moment a
    keyframe touches cx/cy/width/x/y/d or anything JS has to drive per frame.
    Nothing here may use requestAnimationFrame or setInterval to move
    anything — if it needs a JS clock, it is not ambient, it is the debris
    system, and that already exists.
  - No literal colours. var(--or-star-core) for light, color-mix() to blend,
    var(--or-hair) for ink. Two themes, eleven backdrops.
  - Must read in BOTH themes — look at both images every time.
  - No Math.random — help.rng(seed) only, so the field draws the same twice.
  - Under about 60 new elements. The existing dust is already 95 circles;
    this is additive, permanent, and must stay a "handful," per the ask.
  - Respect that #orDebris and #orDust already own their names — pick a
    lens-specific prefix for every class, id and keyframe you add.
  - It sits under reading. A note opens in a column beside the map; nothing
    here may be bright or fast enough to pull the eye off the text.
  - Loop duration in the range of about 6-40 seconds. The existing dust
    rotates over 210-440s specifically so you have to WATCH for it; the ask
    was for something you notice without staring, so faster than that, but
    "shooting stars," not "snow."

WHAT MAKES A PROPOSAL GOOD HERE. Recognisably its OWN idea, not a setting on
the existing dust rotation or a paler copy of the flight debris. Go further
than feels safe, but it still has to be something a person wants running
forever in the background of an app they open every day, not something that
wears out its welcome in an hour.

RETURN 1 OR 2 proposals, your best. For each: the name, one line on what it
IS, two or three sentences on why it belongs on this object PERMANENTLY (not
just once), the complete final JS (the whole file contents, working, as you
rendered it), the four absolute PNG paths, the element count and the
compositor-only-css flag the harness printed, and anything you saw that is a
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
          why: { type: 'string', description: 'why it belongs on this object permanently' },
          code: { type: 'string', description: 'the complete final .js file contents' },
          darkStills: { type: 'array', items: { type: 'string' }, description: 'the three dark PNG paths, in time order' },
          light: { type: 'string', description: 'absolute path to the light PNG' },
          elements: { type: 'string', description: 'element count the harness printed' },
          cssClean: { type: 'boolean', description: 'true if the harness reported transform/opacity only, false if it flagged something' },
          drawback: { type: 'string' },
        },
        required: ['name', 'what', 'why', 'code', 'darkStills', 'light', 'drawback'],
      },
    },
    tried: { type: 'string', description: 'what you rendered and rejected, and why' },
  },
  required: ['proposals', 'tried'],
}

const LENSES = [
  { key: 'sunbeam', port: 8951, prompt: `
YOUR LENS: A SHAFT OF LIGHT. Motes drifting in near-straight parallax lines
across the field, the way dust reads when a window lights a room — not
radial, not orbital, genuinely TRANSLATING across the frame, several depth
layers so near ones move faster and larger than far ones, each looping back
to re-enter once it drifts off. This is the most literal reading of
"particles" and its risk is looking like generic snow; the way to beat that
is restraint — sparse, faint, slow enough to read as depth rather than
weather.` },

  { key: 'trickle', port: 8952, prompt: `
YOUR LENS: THE FLIGHT DEBRIS, RUN AS A TRICKLE. orDebris already draws a
bright directional streak with a trailing gradient when you fly to a star —
reuse exactly that visual language (a short bright-to-faint streak on a
straight path) but at ambient scale: rare, slow, one streak crossing the
field every several seconds rather than eleven at once, at a fraction of the
flight version's brightness. This is the most direct answer to "debris... in
general" — extending what already exists to run all the time instead of only
on a flight. The risk is it reading as a bug (something almost-there,
occasionally) rather than a deliberate rhythm; stagger enough of them, softly
enough, that absence never looks broken.` },

  { key: 'breath', port: 8953, prompt: `
YOUR LENS: THE FIELD ALREADY THERE, BREATHING. No new geometry — the
existing 95 dust specks (#orDustA/B/C, already in the page) gain a slow,
staggered opacity pulse, so the field itself seems to breathe rather than
sit at a fixed brightness while it silently rotates. This is the cheapest
possible answer and the most conservative — your job is to make the case
that restraint IS the idea, not a lesser one: read the existing #orDustA/B/C
markup and CSS in the real file, and design keyframes that layer onto what
is already drawn rather than adding a single new element. If this reads as
too little to be "in general debris and particles," say so honestly in your
drawback — do not oversell it.` },

  { key: 'wander', port: 8954, prompt: `
YOUR LENS: NOT STRAIGHT, NOT RADIAL — WANDERING. Every motion already in this
app is a straight line (debris), a rotation (dust shells, precession) or a
1/z camera law. Nothing drifts on a curve. Design particles that meander —
CSS offset-path (a motion path drawn once, seeded per particle, looped) so
each one ambles rather than travels in a fixed geometric way, more like a
mote of light finding its way than a mechanism turning. This is the
strangest lens on purpose: if it does not work, say so, but a field that
moves in a way nothing else on this screen does is the most likely place to
find something genuinely new rather than a variation on what is already
there.` },
]

phase('Lenses')
const reports = await parallel(LENSES.map((l) => () =>
  agent(HOWTO + l.prompt + `\n\nYOUR LENS KEY: ${l.key}. YOUR PORT: ${l.port}.\nYour directory: ${LAB}/${l.key}`,
    { label: `particle:${l.key}`, phase: 'Lenses', schema: SCHEMA, effort: 'high' })
    .then((r) => ({ lens: l.key, ...(r || { proposals: [], tried: 'agent returned nothing' }) }))
))

const live = reports.filter(Boolean)
const all = live.flatMap((r) => (r.proposals || []).map((p) => ({ lens: r.lens, ...p })))
log(`${all.length} rendered proposals across ${live.length} lenses`)
return { proposals: all, tried: live.map((r) => ({ lens: r.lens, tried: r.tried })) }
