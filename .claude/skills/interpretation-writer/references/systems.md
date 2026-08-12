# Systems map

Where each body of interpretation content lives, what shape it takes, and what
grounds it. Read the target file's own header comment as well — these entries
are an index, not a substitute for it.

## Gene Keys — 13 sphere files

`gene-keys.html`, governed by `docs/GOLDEN-STANDARD-PSYCH.md`.

Each sphere is one file containing exactly one statement:

```js
DGKRoles.register('vocation', { "1": {...}, ... "64": {...} })
```

The object body is strict JSON, which is why `scripts/check.py` can read these
files directly.

| Sphere id | File | Lens |
|---|---|---|
| `lifesWork` | `js/gk-lifeswork.js` | the gift others already see |
| `evolution` | `js/gk-evolution.js` | the ground you keep returning to |
| `radiance` | `js/gk-radiance.js` | vitality, the body |
| `purpose` | `js/gk-purpose.js` | the quiet certainty underneath |
| `attraction` | `js/gk-attraction.js` | who enters your life, how deeply |
| `iq` | `js/gk-iq.js` | the signature of your mind |
| `eq` | `js/gk-eq.js` | the shape of your feeling life |
| `sq` | `js/gk-sq.js` | spiritual intelligence |
| `core` | `js/gk-core.js` | the wound read as identity |
| `vocation` | `js/gk-vocation.js` | that same wiring as working capability |
| `culture` | `js/gk-culture.js` | your effect on a group |
| `brand` | `js/gk-brand.js` | how you are recognised |
| `pearl` | `js/gk-pearl.js` | prosperity, simplicity |

Five fields per key: `wiring`, `root`, `defaultMode`, `blindSpot`,
`underusedStrength`. 2-4 sentences each.

**Core and Vocation are a hinge pair** sharing a key number: Core is the wound
read as inner life, Vocation is the same wiring read as what the person is
equipped to *do* because of it. Vocation stays outward and instrumental. Keeping
these two distinct is the hardest pairing in the set — read both before writing
either.

Supporting files: `js/gk-sphere-defs.js` (what a sphere means independent of
key — write here only when the sphere itself changes meaning), `js/gk-lines.js`
and `js/gk-sphere-lines.js` (line-level content), `js/gk-role-loader.js` (lazy
loading; adding a sphere means adding it to the `FILES` map).

**Grounding**: `js/gene-keys-content.js` holds the Shadow/Gift/Siddhi triad for
all 64 keys. That is the thematic source — the subject matter and the feeling
carry over, the spiritual-arc framing does not. Also `js/codon-rings.js` and
`js/hexagrams.js` for structural relationships between keys.

**Fallback behaviour worth knowing**: `js/gk-mandala-page.js` falls back to the
universal reading in `gene-keys-content.js` when a role hasn't registered. A
missing entry degrades to generic content rather than breaking — which means an
absent or half-written entry is invisible in the browser. Do not rely on the UI
to tell you a set is incomplete; run the checker.

## Destiny Matrix — topic content files

`DestinyMatrix-v1.html` and `index.html`, governed by `docs/GOLDEN-STANDARD.md`.

Each topic is an IIFE exposing a global (`DPurposeContent`, `DTalentContent`,
…) with a `get()` API. **Field shapes vary by file** — the four-field
title/tagline/mastery/shadow/invitation shape from the golden standard is the
baseline, but individual files extend or rename it, and the file header is the
authority:

- `js/purpose-content.js` — `heading · why · shadow · path · positive ·
  negative · synthesis`. `path` is written but never rendered. `synthesis` is
  unique to this file: it reads the arithmetic as psychology.
- `js/archetype-content.js` — `meaning · shadow · invitation`, six archetype
  buckets rather than 22 arcana. Coarser by design: it answers "what are you,
  overall" rather than "what does this position mean".

Others follow the same pattern: `about-content.js`, `career-paths-content.js`,
`chakra-content.js`, `compatibility-content.js`, `daily-reminder-content.js`,
`hidden-numbers-content.js`, `ideal-partner-content.js`, `karmic-debt-content.js`,
`micro-content.js`, `most-prominent-content.js`, `name-numbers-content.js`,
`past-life-content.js`, `pinnacles-challenges-content.js`,
`sexual-line-content.js`, `talent-content.js`.

**Grounding**: `js/matrix-engine.js` — position formulas, `ARCHETYPE_MAP`,
`mostProminentArcana()`. Never write a reading for a position without reading
what the engine actually computes for it.

**Note**: `js/` contains four files with a ` 2.js` suffix
(`chakra-content 2.js`, `hidden-numbers-content 2.js`, `micro-content 2.js`,
`purpose-content 2.js`). They differ from their originals and it is not
established which side is current. Do not write into either copy without
resolving that first — ask.

## Tree of Life · Tzolkin

`tree-of-life.html` / `js/tree-of-life-content.js`, `js/tree-path-content.js`;
`tzolkin.html` / `js/tzolkin-content.js`, `js/tzolkin.js`,
`js/tzolkin-page.js`.

Smaller sets, same voice. The golden standard's four-field shape applies unless
the file header says otherwise. Per PART-2's "keep systems separate" rule, these
have their own vocabulary — Tzolkin day-signs and Tree of Life sephirot are not
interchangeable with arcana language.

## Human Design — `human-design-reading` repo

Separate repo, no golden-standard doc. See `references/human-design.md`.

`content/cards/*.json`, blocks keyed by `blockId`, assembled server-side by
`server/src/assembly.ts` against slots in `content/slots.json` (142 slots: 64
gates, 36 channels, 18 centers, 12 profiles, 5 types, 7 authorities).

**Grounding**: `data/*.json` — `gates.json`, `channels.json`, `centers.json`,
`types.json`, `authorities.json`, `profiles.json`, `circuits.json`. Keynotes are
pre-joined per slot in `content/slots.json`, which is the convenient read.
