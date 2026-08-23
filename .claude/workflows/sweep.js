export const meta = {
  name: 'sweep',
  description: 'Drive the whole star chart across every state and report real defects',
  whenToUse: 'Before shipping anything that touches the map, or when something is reported as glitchy and hand-measurement has not found it.',
  phases: [{ title: 'Sweep', detail: 'six lenses driving the real app' }],
}

/* ─── why there is no verify phase ──────────────────────────────────
   There was one, and it was worse than useless. It ran a panel of
   agents told to REFUTE each finding, defaulting to refuted when
   uncertain. Across two runs it dismissed roughly sixteen findings
   that were real and correctly killed almost nothing — in this
   workflow's own first run it refuted three of the eight it got to,
   all three genuine. Gating on it would have shipped none of the
   fixes.

   The reason is structural rather than bad luck. An agent asked to
   argue will always find words; an agent that could not reproduce
   something writes a confident essay instead of admitting it. It also
   cost about half the run's agents.

   What actually validated the findings was reproducing them — which
   the repro steps below make cheap enough to do by hand, in about
   thirty seconds each. So the finders carry the whole burden, and the
   contract is that a finding arrives with steps and numbers or it does
   not arrive. If a verify stage ever comes back, it must be told to
   REPRODUCE and report what it measured, never to argue: a verifier
   that must produce a number either confirms it or reports that it
   could not, and both of those are useful.
   ─────────────────────────────────────────────────────────────────── */

const REPO = '/home/user/niko-999.github.io'
const SCRATCH = '/tmp/orrery-sweep'

const HOWTO = `
You are auditing a single-file vanilla-JS app: ${REPO}/orrery/index.html — a
star-chart view of an Obsidian-style note vault. Read ${REPO}/CLAUDE.md first;
it is the house rulebook and it is binding.

DO NOT EDIT ANY FILE IN ${REPO}. You are auditing, not fixing. Write scratch
files only under ${SCRATCH}/<yourlens>/ (mkdir -p it).

RUNNING THE APP. Start your OWN static server on YOUR OWN PORT (below) — the
other lenses run at the same time and will collide with you otherwise:

  mkdir -p ${SCRATCH}/<yourlens>
  cat > ${SCRATCH}/<yourlens>/serve.js <<'EOF'
  const http=require('http'),fs=require('fs'),path=require('path');
  const ROOT='${REPO}', PORT=Number(process.argv[2]);
  const T={'.html':'text/html','.js':'text/javascript','.css':'text/css',
           '.json':'application/json','.svg':'image/svg+xml','.png':'image/png'};
  http.createServer((q,s)=>{let p=decodeURIComponent(q.url.split('?')[0]);
    if(p.endsWith('/'))p+='index.html';const f=path.join(ROOT,p);
    if(!f.startsWith(ROOT)||!fs.existsSync(f)||fs.statSync(f).isDirectory()){s.writeHead(404);return s.end('no');}
    s.writeHead(200,{'content-type':T[path.extname(f)]||'application/octet-stream'});
    fs.createReadStream(f).pipe(s);}).listen(PORT,'127.0.0.1',()=>console.log('up'));
  EOF
  (node ${SCRATCH}/<yourlens>/serve.js <PORT> &) ; sleep 1.5

Then drive it with Playwright via the repo's own helper, which finds Chromium:

  const { open } = require('${REPO}/tests/lib.js');
  const BASE = 'http://127.0.0.1:<PORT>';
  const { browser, page, errs } = await open();   // errs collects pageerror + console.error
  await page.goto(BASE + '/orrery/');

Useful globals in the page: state (sel, zoom, panX/panY, xy, notes, edges, only,
catPane, form, pin), orLayout (catOf, deg, tier, note, home, cats()), orSim
(raf, lines, el, drag, S), orKin(id), orOpen(id), orClose(), orOpenCat(cat),
orForm(id), orZoom(f,px,py), orZoom.fly(ids), orPin(id), orPaint(), SEED,
orAsk(q) and its helpers (seek, back, cat, folder, folders, byTitle, brief),
orReply(html, spoken) / orReply.clear(), orVoice(on) / orVoice.pick(), orLoose().
Theme: localStorage 'arc.theme' = 'dark' | 'light' | 'system', palette
'arc.palette', then reload. Wait for quiet with:
  await page.waitForFunction(() => !orSim.raf, null, {timeout:20000}).catch(()=>{});
Park the pointer with page.mouse.move(4,4) before measuring node brightness —
hover drift dims everything not under the cursor and will fool you.

WHAT COUNTS AS A FINDING. Something you REPRODUCED and MEASURED. Numbers, not
impressions: composited rects, resolved styles, attribute values read back,
pixel samples off a screenshot, console errors. "Looks a bit off" is not a
finding. Neither is a design preference — the visual treatment was chosen
deliberately off comparison sheets.

YOUR REPORT IS THE ONLY THING THAT HAPPENS. Nothing downstream re-checks your
work, so a finding has to carry everything a person needs to reproduce it in
about thirty seconds: the smallest exact steps, the numbers you actually read,
and what you expected instead. A finding without those is not usable and should
not be filed. If your lens is clean, say so and return an empty list — do not
invent findings to look thorough.

DELIBERATE, and NOT bugs:
  - chips/labels appear only on hover and on the selection (a resting map has none)
  - a selected note mutes strangers to opacity .55 and unmatched ones to .12
  - no ring is drawn on connected stars; exactly one hairline marks the selection
  - dashed tethers from notes to their folder hub appear only while something is selected
  - a surge runs down the open note's links; a resting map carries none
  - the camera flight caps at zoom 2.4; the hand zoom clamps 1–4
  - only the heavy arc and the three dust shells move; nothing else drifts
  - a stored pin is clamped into the viewBox on read, on purpose
  - there is exactly ONE card on the map. The field card — notes, links,
    categories, loose ends — was deliberately removed; Jarvis answers all four
    on request. Its absence is not a regression.
  - that card is translucent glass over the backdrop photograph on purpose. It
    still has to clear 4.5:1 on every row, at every palette — that part IS
    yours to check.
  - the voice control lives inside the search field, icon-only, and is named
    only by aria-label and title. That is deliberate, not a missing label.
  - Jarvis never reaches a network and never has an opinion. Being told he
    cannot form a view is the designed answer, not a failure.
  - nothing AUTOMATIC ever selects a voice with localService === false, or a
    "Google ..." voice by name, because those synthesise on a server. They are
    listed and marked and taken only on a press, and that press is the consent.
    Him telling you to download an Enhanced voice is the app working.
  - the gauntlet test reports 11 pre-existing faults across the repo
`

const FINDINGS = {
  type: 'object',
  properties: {
    findings: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          severity: { type: 'string', enum: ['major', 'minor'] },
          repro: { type: 'string', description: 'smallest exact steps' },
          measured: { type: 'string', description: 'the numbers you read back' },
          expected: { type: 'string' },
          where: { type: 'string', description: 'file:line if known' },
        },
        required: ['title', 'severity', 'repro', 'measured', 'expected'],
      },
    },
    coverage: { type: 'string', description: 'what you actually exercised' },
  },
  required: ['findings', 'coverage'],
}

/* Six lenses. Five are proven; jarvis is new with the feature. The
   two obvious gaps, if this is ever widened: keyboard-only navigation
   end to end, and the vault ingest path — drop, pick, reconnect,
   forget — both of which got thin coverage. */
const LENSES = [
  { key: 'flight', port: 8931, prompt: `
YOUR LENS: THE CAMERA FLIGHT. Click nodes of every tier (hub, major, minor, leaf)
and watch what the flight does. Does the field tear mid-flight — elements painted
at different times, or anything that changes size and snaps back? Do links stay
attached to their nodes at every instant of the 620ms transition — measure the
gap in SCREEN pixels between a path endpoint and the node's .or-corec centre,
during and after. Does the camera ever land with the selection off-stage or
crossing into the reading column? What happens if you drag, wheel, press Escape
or open a second note DURING a flight — does any class or timer get stranded?` },

  { key: 'zoom', port: 8932, prompt: `
YOUR LENS: THE ZOOM EXTREMES. Drive to both clamps by wheel and by the +/-
buttons, and at each: are chips legible and correctly counter-scaled (they must
NOT grow with the zoom), do they overlap (measure composited rects), does
anything clip at the stage edge, do nodes or links disappear, does the map cross
into the reading column? Check zoom-about-a-point: the user-space point under
the cursor must stay under the cursor — measure it, at several moments. Check
the chip edge-flip against the true VIEWPORT edge, not the viewBox's. Check zoom
with a note open, with a category panel open, and in every formation.` },

  { key: 'drag', port: 8933, prompt: `
YOUR LENS: MOVING NOTES. Drag nodes of every tier, at the zoom floor, at 1x and
at 3x, in several formations. Measure at every stage — during, at release, mid
spring-back, settled: does every link touching the dragged node stay visually
attached (screen-pixel gap to the node core), and stay VISIBLE while stretched?
Does the dashed tether? Does a chip follow it? Does the field always settle
(watch orSim.raf)? Does a repaint mid-drag drop the hold? Does a second pointer
landing mid-drag do anything? Does drag work with a note open, a panel open, a
filter active, under prefers-reduced-motion? Do positions survive reload, and
can a pin end up somewhere the default camera cannot reach?` },

  { key: 'errors', port: 8934, prompt: `
YOUR LENS: ERRORS AND STATE MACHINE. Collect page errors and console errors
across EVERY path: load, open/close notes, wiki-links, backlinks, the re-file
select, search (including regex-special characters and a very long string), the
legend, the category panel and its isolate, the formation picker, Escape
everywhere, keyboard navigation and pinning, the vault view, Forget this vault,
Reset layout, +/-/Fit, theme and palette switching, and reload with each of
those states stored. Look for: functions called before definition, listeners
bound to elements a repaint replaced, state that survives when it should not,
and stored shapes that break on reload. Feed it damaged input on purpose — a
torn orrery.v1, a torn cached index in IndexedDB, an out-of-range pin, an
unknown theme or formation — and confirm each is REPAIRED rather than throwing
or blanking the map.` },

  { key: 'jarvis', port: 8936, prompt: `
YOUR LENS: JARVIS. He is a librarian over the in-memory index and he must be
right or silent. Drive orAsk with the real input — type into #orSearch and press
Enter, do not only call the function — across: every category by id, by label
and by folder alias; every folder at every depth, by full path and by leaf name;
notes by exact title, by basename, by a frontmatter alias and by a substring
that matches several; "what links to X" in each of its phrasings; orphans; loose
ends; "how many" in each phrasing; advice intents; help; empty input; a name
that does not exist; and adversarial input — a very long string, regex-special
characters, HTML and a script tag, a leading "jarvis,", trailing punctuation.

RECOMPUTE EVERY FIGURE HE STATES from state.notes / state.edges / orBacklinks
and compare. A wrong number stated confidently is the worst defect this feature
can have. Check the ordering of the grammar holds (a backlink question that
contains an advice word must still reach backlinks). Check nothing he renders
can inject markup. Check the reply strip: is it ever left showing the answer to
a previous question, is it ever painted over by another element (measure with
elementFromPoint), does Escape take it before the filter, does the box and
state.q ever disagree. Check the voice toggle costs the voice and nothing else,
survives reload, and that orVoice.pick prefers a named en-GB voice — stub
speechSynthesis.getVoices to test it. Finally, record EVERY request the page
makes across the whole pass and report any that leaves the origin.` },

  { key: 'visual', port: 8935, prompt: `
YOUR LENS: VISUAL INTEGRITY, BOTH THEMES, EVERY PALETTE. Sample REAL PIXELS off
screenshots and read resolved styles — do not reason from source. Check every
text run in the reading pane, the category panel, the cards and the chips has
>= 4.5:1 against what is actually composited behind it, in dark and light, and
in each palette — the pane has no card, so the photograph composites straight
through and the accent moves with the PALETTE rather than the theme. Check the
selection mark is visible on both grounds; that muted nodes stay distinguishable
from the background; that every var(--token) resolves (an invalid declaration
inherits rather than falling back, so it looks deliberate); that the category
colours stay >= 20 apart in CIE Lab in both themes; and that nothing overlaps or
clips at 1512, 1280, 1100, 800, 520 and 380 px wide — especially controls that
share a corner. Screenshot anything you flag.` },
]

phase('Sweep')
const reports = await parallel(LENSES.map((l) => () =>
  agent(HOWTO + l.prompt + `\n\nYOUR LENS KEY: ${l.key}. YOUR PORT: ${l.port}.`,
    { label: `sweep:${l.key}`, phase: 'Sweep', schema: FINDINGS, effort: 'high' })
    .then((r) => ({ lens: l.key, ...(r || { findings: [], coverage: 'agent returned nothing' }) }))
))

const live = reports.filter(Boolean)
const all = live.flatMap((r) => (r.findings || []).map((f) => ({ lens: r.lens, ...f })))
log(`${all.length} findings across ${live.length} lenses`)
return {
  findings: all.sort((a, b) => (a.severity === b.severity ? 0 : a.severity === 'major' ? -1 : 1)),
  coverage: live.map((r) => ({ lens: r.lens, covered: r.coverage })),
  note: 'Nothing has verified these. Reproduce each one before fixing it — the '
    + 'repro steps are there so that costs about thirty seconds.',
}
