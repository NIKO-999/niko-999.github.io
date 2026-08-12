# 4H Candle Profiling — Study Archive

A static, hash-routed app built from three source PDFs by Eleven_Trades. No
build step and no runtime dependencies: open `index.html` and it works.

**Live:** `/4h-profiling/` on the site.

## What it is

Every rule, diagram and explanation from the three documents, organised so you
can find one thing quickly rather than scroll through all of it.

The home view is a card grid of all 23 lessons, grouped by module, with search
and category filters. Each card opens its own lesson page, where the structure
is always the same:

1. **Rule set** — the mechanical, checkable conditions, above the diagram
2. **Plate** — the original diagram from the PDF, click to enlarge
3. **Reading** — the explanation directly beneath the plate
4. **How to approach it** — the sequence to follow at the chart
5. **What invalidates it** — the failure conditions

Plus a daily approach sequence, a session-clock table, and a 24-term glossary.

There are deliberately no quizzes, scores or games.

## Routes

```
#/                  home — card grid, search, filters
#/l/<lesson-id>     a single lesson
#/m/<module-id>     one module's cards
#/approach          the 8-step daily sequence
#/sessions          the session clock table
#/glossary          24 terms
#/sources           sources, scope and notice
```

## Layout

```
index.html             app shell only — rail, sidebar, #app mount, lightbox
css/app.css            the whole theme
js/data.js             ALL content, as window.CONTENT — generated, see below
js/app.js              router, views, chrome, search/filter, lightbox
assets/                plates (v1-p05.png), card thumbs (-thumb.png), favicon
fonts/                 self-hosted Space Grotesk, Inter, JetBrains Mono
tools/extract_pdf.py   PDF → page text + cropped diagram plates
tools/darken_plates.py light plate → dark-theme plate
```

## Adding another PDF

```bash
pip install pymupdf pillow
python3 tools/extract_pdf.py ~/Downloads/deck.pdf --prefix v4
python3 tools/darken_plates.py assets/v4-*.png
```

`extract_pdf.py` writes `tools/out/v4-text.txt` (every page's text) and one
cropped PNG per diagram page into `assets/`. It finds diagram pages by counting
vector draw operations — these decks draw their charts as vectors rather than
embedding images, so a page with many draw ops is a chart slide. If a page is
misfiled, re-run with `--min-drawings`.

`darken_plates.py` remaps the plate to the dark theme. It snaps each pixel to
the nearest source colour rather than inverting, which keeps line art and label
text crisp and stops the bull/bear colours from swapping.

Card thumbnails are generated from the plates:

```bash
cd assets && python3 -c "
from PIL import Image; import glob
for f in glob.glob('v4-p*.png'):
    im=Image.open(f); w,h=im.size; t=w*9/16
    if h>t: im=im.crop((0,int((h-t)*0.32),w,int((h-t)*0.32+t)))
    im.thumbnail((760,760)); im.save(f.replace('.png','-thumb.png'),optimize=True)"
```

Then add a module to `window.CONTENT.modules` in `js/data.js`:

```js
{
  moduleId: "m4",
  numeral: "IV",
  title: "…",
  subtitle: "…",
  sourceLabel: "…",
  overview: "…",
  lessons: [{
    id: "kebab-slug",           // unique; becomes the #/l/<id> route
    number: "IV.1",
    title: "…",
    source: "V4 · p.3",
    rules: ["…"],               // renders ABOVE the plate
    plate: "assets/v4-p05.png", // or null
    plateCaption: "…",
    reading: ["…"],             // renders BELOW the plate
    approach: ["…"],
    watchouts: ["…"]
  }]
}
```

Everything else builds itself from that object — routes, the card grid, the
sidebar tree, counts, search, filters and the hero stats. The card's category
and colourway are derived from the lesson's title and rules by the `CATS` table
at the top of `app.js`; add a pattern there if a new lesson needs a new one.

## Design

The palette and component language are sampled from a set of reference UI
screenshots: page `#0E0F11`, sidebar `#0F1012`, card `#111214` — these sit
within two points of each other, so a card is read by its border and its colour
wash rather than by a lighter fill. Cards carry a top-right corner glow that
decays over their first 190px, with the lesson's own plate luminosity-blended
and masked beneath it. Active states are quiet raised pills, not saturated
fills.

## Content notes

- The source documents give clock times without ever naming a timezone. New
  York is the only reading under which their sessions line up, and the archive
  says so explicitly rather than quietly assuming it.
- The archive is **set to indices**. The source also gives forex windows, an
  hour earlier; those are recorded once under Sources and are not carried
  through the lessons.
- Performance figures from the source (such as the 8–12% win-rate improvement
  attributed to SMT divergence) are reproduced as the author's claims, not as
  established fact.
- Where the documents contradict each other — notably on which candle of the
  swing point reverses — the archive flags the discrepancy rather than
  resolving it.

## Credit

Source documents by Eleven_Trades, who credits ICT, MMXM Trader, TTrades,
AM Trades, Sniper Trades and Garret for the underlying concepts. This archive
is a study reference, not financial advice.
