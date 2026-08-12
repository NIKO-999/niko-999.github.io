---
name: interpretation-writer
description: Write or revise interpretation content for the esoteric systems in this repo — Destiny Matrix arcana readings, Gene Keys sphere profiles (js/gk-*.js), Tree of Life, Tzolkin, and the human-design-reading card decks — in the voice fixed by docs/GOLDEN-STANDARD*.md. Use this whenever the user asks to write, draft, fill in, finish, rewrite, audit, or check any reading, card, interpretation, entry, or content field for a key, gate, arcana, sphere, position, line, or channel, including bulk work like "write the 64 entries for the culture sphere" or "the vocation file needs finishing" — even if they never mention the golden standard by name.
---

# Interpretation writer

The written content is the product here. The calculation engines are small and
mostly finished; what people actually read is prose, and its quality is the
whole value of the site. That prose is governed by three specs in `docs/` that
took a long time to settle. This skill is the procedure for writing against
them — the specs stay in `docs/`, not duplicated here, so they can't drift.

## The specs are the authority — read them first

| File | Governs |
|---|---|
| `docs/GOLDEN-STANDARD.md` | Destiny Matrix voice, four-field shape, prohibitions |
| `docs/GOLDEN-STANDARD-PART-2.md` | Address, the validate→illuminate→invite arc, the 85/15 ratio — applies to **both** systems |
| `docs/GOLDEN-STANDARD-PSYCH.md` | Gene Keys psychological-profile voice, five-field shape |

Read the one that governs your target plus PART-2 before drafting a single
sentence. Do not work from this skill's summary of them — it is deliberately
incomplete, because a summary that competes with the spec is how the spec rots.

The `human-design-reading` repo has no equivalent doc. Its conventions are
reconstructed in `references/human-design.md`; read that instead when working
there.

## Where things live

`references/systems.md` maps every system to its file, its registry call, its
field shape, and — most importantly — where its *grounding* comes from. Read it
when you need to locate a target or find source material. The short version:

- **Gene Keys spheres** — `js/gk-<sphere>.js`, one `DGKRoles.register()` call,
  64 numbered keys, five fields each. 13 spheres.
- **Destiny Matrix** — `js/<topic>-content.js`, an IIFE exposing a `D*Content`
  global. Field shapes **vary per file** and are documented in each file's own
  header comment.
- **Human Design** — `content/cards/*.json` in the other repo, blocks keyed by
  `blockId`, grounded by `content/slots.json`.

## Workflow

### 1. Locate the target and learn its actual shape

Read the target file's header comment before anything else. Those headers are
not decoration — they record the field shape, which fields render and which are
written-but-unrendered, the formula the content sits on, and the decisions
already made. `js/purpose-content.js` carries a `synthesis` field no other file
has, and a `path` field that is deliberately never rendered. You cannot infer
either from the golden standard.

Then read two or three neighbouring entries in the same file. The spec sets the
rules; the neighbours set the register you have to match.

### 2. Find the grounding — never invent

Both specs forbid inventing a formula, a position, or a meaning. Every claim
traces to something already in the codebase:

- Gene Keys → the Shadow/Gift/Siddhi triad in `js/gene-keys-content.js` is the
  thematic source. The subject matter carries over; only the framing changes
  from spiritual arc to psychological profile.
- Destiny Matrix → `js/matrix-engine.js` for what a position actually computes,
  and the file header for the formula.
- Human Design → `data/gates.json`, `channels.json`, `centers.json` keynotes,
  surfaced per-slot in `content/slots.json`.

If the source doesn't specify something, the honest move is to say so and stop.
A "still being written" note is correct; generic filler is a defect. This is the
one rule where doing less is doing better.

### 3. Check what the same key already says elsewhere

This is the step most likely to be skipped and the most expensive to skip. Every
Gene Key appears in all 13 spheres; an Arcana appears in many Destiny Matrix
positions. The spec requires each to be written **fresh for that position's
lens** — never reworded across positions.

Before writing key N for sphere X, read key N in two or three other spheres:

```bash
python3 .claude/skills/interpretation-writer/scripts/check.py --show 39 js/gk-*.js
```

You are reading for what to *avoid repeating*, not for a template to adapt. If
your draft could be moved to another sphere with only nouns changed, it has
failed the position rule and needs rewriting from the sphere's lens, not
editing.

### 4. Draft into a JSON scratch file

Write to a scratch file rather than editing the target directly. It keeps the
big files intact while you iterate, and it is what the checker reads:

```json
{ "39": { "wiring": "...", "root": "...", "defaultMode": "...",
          "blindSpot": "...", "underusedStrength": "..." } }
```

Draft in whole sets where you can — a sphere's 64 keys, a position's 22 arcana.
The duplicate-opener rule and the "distinct facets" rule are both properties of
the *set*, and neither is visible one entry at a time.

### 5. Run the checker

```bash
python3 .claude/skills/interpretation-writer/scripts/check.py \
  --profile gene-keys draft.json
```

It reads a JSON draft, a `js/gk-*.js` role file, or a Human Design card deck.
It checks field presence, sentence counts, hedging, third-person address, list
markers, forbidden question marks, the Destiny Matrix "You are allowed to" line
and its closing What/When/Where/If question, leftover spiritual vocabulary,
prediction language, duplicate openers across the set, and Root/Default Mode
near-duplication.

**Pass the target alongside the other files carrying the same keys.** Given
more than one file, it also runs the cross-position check — the same key
compared field-by-field across spheres, which is the only automated grip on the
"written fresh for each lens, never reworded" rule:

```bash
python3 .claude/skills/interpretation-writer/scripts/check.py \
  --profile gene-keys draft.json js/gk-*.js
```

`--profile generic` runs voice checks only, for files whose field shape isn't
one of the two canonical ones.

Errors are things a spec states flatly. Warnings need your judgement — the
checker cannot tell a genuine near-duplicate from two fields that legitimately
share vocabulary. Read each warning and decide; don't reword purely to silence
one.

### Auditing what already exists

The same command audits shipped content, and the corpus is not clean — a sweep
of all 13 sphere files reports several hundred errors, concentrated in three
systematic patterns: fields written as one sentence where the spec asks for
2-4, `blindSpot` entries templated on a shared opener, and keys reworded across
Core/Vocation rather than written fresh.

If you are asked to fix these, fix them as writing, one set at a time, with the
grouped counts as the map. Do not chase the error count down — a mechanical
edit that satisfies the sentence rule by splitting a sentence in half passes the
checker and makes the prose worse, which is the opposite of the point.

### 6. Do the pass the checker cannot do

Everything above is necessary and nowhere near sufficient. A draft can pass every
mechanical check and still be worthless. The spec's own test is to read the card
aloud: if it sounds like a reference entry, a horoscope, or a personality quiz
result, it has failed.

Four failure modes survive the checker, in rough order of how often they appear:

- **One trait restated four times.** Mastery wants 3-4 genuinely distinct
  capacities; Shadow wants 3-4 distinct failure modes of the *same* energy. A
  field that circles one idea in different words hits the sentence count and
  fails the field.
- **Explaining the mechanism.** Opening with what the number measures or how it
  was calculated. At most 15% of any write-up is position or geometry; if you
  are explaining the chart, stop and write about the person.
- **Uniform sentence rhythm.** All-long reads as a lecture, all-short as a list.
  The alternation is what makes it sound spoken.
- **Shadow as rebuttal.** Shadow opens fresh, never as a "but" continuation. It
  is not a counterargument to Mastery — it is the same energy seen from its cost
  side.

### 7. Merge into the target

Match the surrounding formatting exactly — indentation, key ordering, quote
style. Then re-run the checker against the real file to confirm the merge landed
cleanly and the whole-set rules still hold with your entries in place.

## Two judgement calls that come up constantly

**Certainty.** Hedge the *system*, never the *person*. Mastery and Wiring are
stated flatly, present tense, no "can" or "tends to" — you are describing a
capacity the reader can recognise in themselves. The symbolic framing lives in
the app's chrome and in the tension-only systems (Past Life, Karmic Debt), which
legitimately use "may suggest." Prediction — "you will meet someone in June" —
is never acceptable anywhere, in any system, at any confidence.

**Systems stay in their lanes.** Past Life speaks in symbolic origin imprints,
Karmic Debt in present-life behaviour, Career and Money stay material,
Relationship stays relational. Two positions carrying the same number still get
two entirely separate readings. Borrowing one system's vocabulary to save effort
on another is the single most common way this content goes wrong, and it reads
as obviously lazy to anyone who opens both cards.
