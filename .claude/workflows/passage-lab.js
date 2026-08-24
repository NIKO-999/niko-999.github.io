export const meta = {
  name: 'passage-lab',
  description: 'Propose and render divergent "passing through" effects for the orrery camera flight',
  whenToUse: 'When the ask is for what a flight FEELS like — debris, asteroids, speed, arrival — rather than a permanent ambient layer.',
  phases: [{ title: 'Lenses', detail: 'six angles on travel, each filmed during a real flight' }],
}

/* Six angles, deliberately far apart — see CLAUDE.md, "Options come from
   lenses, not from one mind". The failure mode this exists to dodge is
   six variations on "more streaks, but bigger".

   Every proposal is FILMED, not drawn: the harness flies the same real
   flight once per sample offset and screenshots a true frame of each.
   An agent that only writes SVG returns something plausible; an agent
   that has to look at five frames of its own effect returns something
   that works. */

const LAB = '/tmp/passage-lab'
const REPO = '/home/user/niko-999.github.io'
const HARNESS = `${REPO}/.claude/workflows/passage-render.js`

const HOWTO = `
You are designing what it FEELS LIKE TO TRAVEL in a star-chart view of a note
vault: ${REPO}/orrery/index.html. Read ${REPO}/CLAUDE.md first — it is the house
rulebook and binding. Pay particular attention to the sections "The passage"
and "The ambient field". Then read, in the app file: the function orZoom.glide
(the camera flight), the object orDebris (the streaks that already fire on a
flight), the object orDust (the three depth shells that part for one), and
orAmbient (the permanent field that always drifts).

DO NOT EDIT ANY FILE IN ${REPO}. Work only under ${LAB}/<yourlens>/ (mkdir -p it).

WHAT ALREADY HAPPENS ON A FLIGHT. Click a star and the camera flies to it over
880ms on a geometric zoom law with an explicit accelerate/cruise/decelerate
profile. Three things currently answer that: the dust shells part and dim
(orDust), eleven bright streaks rush outward from the target (orDebris), and
the labels drop out. That is the whole of it.

THE ASK, from the person who owns this app, verbatim: "More particles and
asteroids. What else can we add for effects like passing through show me some
options." So: this is about the PASSAGE — the feeling of moving through a
volume rather than a picture being rescaled. Asteroids are named explicitly
and one lens takes them literally; the rest of you are answering "what else".

THE BUDGET IS DIFFERENT HERE, AND THIS IS THE IMPORTANT PART. The permanent
ambient field is capped hard — the app asserts that under 12% of its SVG
elements sit inside a running animation AT REST, and the existing dust already
spends nearly all of it. YOUR EFFECT IS NOT SUBJECT TO THAT. It exists only
during an 880ms flight and is removed when the camera lands, so it is measured
by nothing at rest. You have real room: dozens of elements is fine, where the
ambient field could only afford a handful. Spend it. An effect that is too
timid to notice is the failure mode here, not one that is too rich.

HOW TO RENDER. Write ${LAB}/<yourlens>/<name>.js assigning:

  globalThis.PASSAGE = {
    css: '...',                            // injected once into <head>
    replaceDebris: false,                  // true = suppress orDebris's own streaks
    spawn: (ox, oy, help) => [elements],   // called at the START of a zoom-IN flight
  }

Read the header comment of ${HARNESS} for the exact contract — it documents
every field of \`help\` and two bugs that have already cost this repo real time.
Set replaceDebris:true only if your idea REPLACES the existing streaks rather
than joining them; say which you chose and why.

Then:  node ${HARNESS} ${LAB}/<yourlens> <name> <YOURPORT>
It writes five dark stills at 120ms, 300ms, 500ms, 700ms (the pull-away, early
cruise, mid-cruise, the berth) and 1080ms (200ms AFTER landing), plus one light
still at 500ms. READ ALL SIX WITH THE READ TOOL AND LOOK AT THEM. Check in
order: does anything visible happen at all; does it CHANGE between 120 and 700
(if the five frames look identical, nothing is moving and you have the SMIL bug
below); is the 1080 frame clean, because anything still on screen after landing
is litter; does it read in the light theme. Iterate until it is actually good.
A proposal you have not looked at across all five frames is not a proposal.

HARD RULES, all of them from the house rulebook:
  - NOTHING PER FRAME. No requestAnimationFrame, no setInterval driving
    motion. Declarative only: SMIL (<animateMotion>, <animate>) or a CSS
    @keyframes animation, both of which the browser's compositor owns once
    spawned. The one existing exception, orDust.step, is driven by the camera's
    own loop and is not yours to add to. "It is only 880ms" is not an argument
    that has ever worked here.
  - SMIL \`begin\`, INCLUDING THE IMPLICIT DEFAULT OF 0s, is measured against
    the SVG document's animation clock, NOT against when you inserted the
    element. On a page open longer than your \`dur\`, "0s" already passed and
    the browser jumps your animation to its frozen end state: no motion, no
    error, nothing in the console. Use begin="indefinite" plus
    el.beginElementAt(offsetSeconds). The harness holds the page open four real
    seconds before flying so this bites you and not the user. If your five
    frames look identical, this is why.
  - No literal colours, ever. var(--or-star-core) for light, var(--or-hair)
    for ink, var(--or-cat-<id>) for a category, color-mix() to blend. Eleven
    backdrops, two themes; a hex works in one of them.
  - No Math.random — help.rng(seed) only. The map must draw the same twice.
  - Do not put a <style> in <defs>. orPaintRings overwrites <defs>.innerHTML
    wholesale on every repaint. Put CSS in the \`css\` field. A <linearGradient>
    in <defs> is fine for a flight-scoped effect (you are inside one flight),
    but creating it fresh per spawn is safer than assuming it survived.
  - It must not outlive its flight. Return every element you create; the
    harness removes them on landing and prints how many leaked. That number
    must be 0.
  - Reduced motion needs no check from you: orZoom.glide returns before
    spawning anything when prefers-reduced-motion is set. Do not add one.
  - It sits under reading. A note opens in a column beside the map — this is
    allowed to be dramatic for 880ms, but it must not leave the reader
    flinching every time they open a note. You will see the pane in your own
    stills; judge it there.

WHAT MAKES A PROPOSAL GOOD HERE. It has to make the flight feel like MOVEMENT
THROUGH SOMETHING rather than a zoom. It has to be recognisably its own idea
rather than orDebris with the numbers turned up. And it has to survive being
seen fifty times a day: the test is not "is it impressive once", it is "would
a person still want this on the twentieth note they opened today".

RETURN 1 OR 2 proposals, your best. For each: the name, one line on what it IS,
two or three sentences on why it belongs on THIS flight, the complete final JS
(the whole file contents, working, as you rendered it), the six absolute PNG
paths, the leaked-element count the harness printed, whether you replaced the
existing debris, and anything you saw that is a genuine drawback. Be honest
about a weak one — one strong proposal beats two padded.
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
          why: { type: 'string', description: 'why it belongs on this flight' },
          code: { type: 'string', description: 'the complete final .js file contents' },
          stills: { type: 'array', items: { type: 'string' }, description: 'the six PNG paths, in time order' },
          leaked: { type: 'string', description: 'the leaked-element count the harness printed; must be 0' },
          replacedDebris: { type: 'boolean' },
          drawback: { type: 'string' },
        },
        required: ['name', 'what', 'why', 'code', 'stills', 'leaked', 'drawback'],
      },
    },
    tried: { type: 'string', description: 'what you rendered and rejected, and why' },
  },
  required: ['proposals', 'tried'],
}

const LENSES = [
  { key: 'asteroids', port: 8961, prompt: `
YOUR LENS: ASTEROIDS. Bodies, not sparks. Irregular seeded silhouettes that
TUMBLE as they pass — nothing on this map rotates about its own centre, so a
body turning end over end while it sweeps by is a kind of motion the screen has
never shown. Real parallax is the whole point: a near one crosses the entire
frame in a third of a second, huge and dark against the star field with a lit
edge; a far one barely drifts. That spread of size and speed IS the depth cue.
This lens is the literal reading of the ask, so do it properly rather than
safely: solid or near-solid shapes with silhouette, not outlines, and enough of
them at enough different distances that the eye reads a volume being crossed.` },

  { key: 'medium', port: 8962, prompt: `
YOUR LENS: THE MEDIUM. You are not passing THINGS, you are passing THROUGH
something. Space here is not empty: sheets of haze, a nebula wall that swells
and washes over the view and thins out behind, banks of luminous gas parting
around the camera. The distinction that matters is discrete versus continuous —
every existing effect on this flight is countable objects, and a medium is not
countable. Think large soft forms with real scale, radial or linear gradients
swelling and clearing, something that briefly OCCLUDES part of the field and
then is behind you. If you get this right the flight stops being through a
vacuum with debris in it and becomes a dive through weather.` },

  { key: 'stretch', port: 8963, prompt: `
YOUR LENS: THE FIELD ANSWERS — ADD NOTHING. No new objects at all. The stars
and dust that are ALREADY on the map report the speed themselves: they elongate
into streaks along the axis of travel while the camera accelerates, and relax
back to points at the berth. The velocity profile is already computed and
explicit (see flyS, ACC, DEC in the app) — an effect keyed to acceleration
rather than to position is something none of the others can do. You may
transform or filter existing elements (#orDustA/B/C and their circles are fair
game) as long as you restore them; the harness only removes what you RETURN, so
if you mutate something existing you must hand back an object with a .remove()
that puts it right. This is the most restrained lens and the one most likely to
feel like the app itself is moving rather than like something was added to it.` },

  { key: 'arrival', port: 8964, prompt: `
YOUR LENS: ARRIVAL, NOT JOURNEY. The effect is at the DESTINATION and it pays
off at the end of the flight, not the start. The star you asked for resolves as
you close on it: a corona blooming out of nothing, a shockwave ring expanding
away from it as you berth, its own neighbours lighting in sequence as the
constellation assembles around it. Everything else on this flight fires at t=0
and is over by the cruise; yours should be building through the deceleration
and land ON the landing. Note the harness's 1080ms frame is 200ms AFTER the
camera stops — that frame is normally checked for litter, but for you it may be
the most important one, so long as whatever is there is deliberate and gone
shortly after. Getting somewhere should feel like getting somewhere.` },

  { key: 'instrument', port: 8965, prompt: `
YOUR LENS: THE GLASS, NOT THE WORLD. The effect is on the instrument you are
looking THROUGH, not on anything out there. A vignette that tightens as the
camera accelerates and opens as it berths. A faint chromatic fringe at the
edges under speed. The frame itself reacting — an aperture, a shutter, the
subtle barrel of a lens. The map already reads as an instrument (that is the
entire design), so the honest version of "you are moving" might be that the
optics respond rather than that more objects appear. This is the only lens
where the answer can be ONE element covering the whole stage, which also makes
it the cheapest thing here by a wide margin. Restraint is your advantage: make
the case that the flight feels faster with nothing new in the world at all.` },

  { key: 'nearmiss', port: 8966, prompt: `
YOUR LENS: ONE THING, VERY CLOSE. Not a field, not a system — a SINGLE body,
once per flight, crossing the frame at extreme parallax. It enters from an edge
and it is gone in under half a second, big enough and near enough that it
briefly darkens or occludes part of the view as it goes. Every other lens here
adds a population; you are adding an EVENT. The strengths are that it is nearly
free (one element), that a single near object sells depth better than fifty
distant ones because the eye reads the speed differential directly, and that it
can be genuinely startling. The risks are that it reads as a glitch, or that
being identical every flight makes it stale by the tenth note — seeded variety
in its size, path and entry edge is what you have to get right. Consider
whether it should fire on EVERY flight or only sometimes.` },
]

phase('Lenses')
const reports = await parallel(LENSES.map((l) => () =>
  agent(HOWTO + l.prompt + `\n\nYOUR LENS KEY: ${l.key}. YOUR PORT: ${l.port}.\nYour directory: ${LAB}/${l.key}`,
    { label: `passage:${l.key}`, phase: 'Lenses', schema: SCHEMA, effort: 'high' })
    .then((r) => ({ lens: l.key, ...(r || { proposals: [], tried: 'agent returned nothing' }) }))
))

const live = reports.filter(Boolean)
const all = live.flatMap((r) => (r.proposals || []).map((p) => ({ lens: r.lens, ...p })))
log(`${all.length} filmed proposals across ${live.length} lenses`)
return { proposals: all, tried: live.map((r) => ({ lens: r.lens, tried: r.tried })) }
