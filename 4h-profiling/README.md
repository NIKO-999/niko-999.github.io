# 4H Candle Profiling — Study Archive

A static reference site built from three source PDFs by Eleven_Trades. No build
step, no dependencies at runtime: open `index.html` and it works.

**Live:** `/4h-profiling/` on the site.

## What it is

Every rule, diagram and explanation from the three documents, laid out so the
same structure repeats in every lesson:

1. **Rule set** — the mechanical, checkable conditions, above the diagram
2. **Plate** — the original diagram from the PDF, click to enlarge
3. **Reading** — the explanation directly beneath the plate
4. **How to approach it** — the sequence to follow at the chart
5. **What invalidates it** — the failure conditions

Plus a daily approach sequence, a session-clock table that keeps the indices
and forex windows separate, and a 24-term glossary.

There are deliberately no quizzes, scores or games.

## Layout

```
index.html          page shell and framing copy
css/app.css         the whole theme
js/data.js          ALL content, as window.CONTENT — generated, see below
js/app.js           renders data.js; nav, search, scroll-spy, lightbox
assets/             diagram plates (v1-p05.png …), hero image, favicon
fonts/              self-hosted Cormorant Garamond, Spectral, Inter, JetBrains Mono
tools/extract_pdf.py   PDF → text + cropped diagram plates
```

## Adding another PDF

```bash
pip install pymupdf pillow
python3 tools/extract_pdf.py ~/Downloads/deck.pdf --prefix v4
```

This writes `tools/out/v4-text.txt` (every page's text) and one cropped PNG per
diagram page into `assets/`. It finds diagram pages by counting vector draw
operations — these decks draw their charts as vectors rather than embedding
images, so a page with many draw ops is a chart slide. If a page is misfiled,
re-run with `--min-drawings`.

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
    id: "kebab-slug",          // must be unique; becomes the anchor
    number: "IV.1",
    title: "…",
    source: "V4 · p.3",
    rules: ["…"],              // renders ABOVE the plate
    plate: "assets/v4-p05.png",// or null
    plateCaption: "…",
    reading: ["…"],            // renders BELOW the plate
    approach: ["…"],
    watchouts: ["…"]
  }]
}
```

The nav, search index, scroll-spy and hero counts all build themselves from
that object — nothing else needs touching.

## Content notes

- The source documents give clock times without ever naming a timezone. New
  York time is the only reading under which their sessions line up, and the
  archive says so explicitly rather than quietly assuming it.
- Indices and forex run on **different** session windows. They are never
  merged, and every time is labelled with the instrument it belongs to.
- Performance figures from the source (such as the 8–12% win-rate improvement
  attributed to SMT divergence) are reproduced as the author's claims, not as
  established fact.

## Credit

Source documents by Eleven_Trades, who credits ICT, MMXM Trader, TTrades,
AM Trades, Sniper Trades and Garret for the underlying concepts. This archive
is a study reference, not financial advice.
