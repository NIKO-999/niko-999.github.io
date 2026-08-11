#!/usr/bin/env python3
"""
Extract a source PDF into the two things this archive is built from:
  1. the text of every page (so lessons can be written from it), and
  2. a cropped, high-resolution PNG "plate" for every page that is a diagram.

Usage
-----
    pip install pymupdf pillow
    python3 tools/extract_pdf.py path/to/deck.pdf --prefix v4

Writes:
    tools/out/<prefix>-text.txt        every page's text, page-numbered
    assets/<prefix>-pNN.png            one plate per diagram page

A page counts as a diagram page when it contains more vector drawing
operations than --min-drawings (default 40). The slide decks this archive was
built from draw their charts as vectors rather than embedding images, so
counting draw ops separates chart slides from prose slides reliably. Check the
report it prints and re-run with a different threshold if a page is misfiled.

Plates are cropped to their content bounding box with a small padding, which
removes the large empty margins these decks leave around their artwork.
"""

import argparse
import os
import sys

try:
    import pymupdf
except ImportError:
    sys.exit("pymupdf is required:  pip install pymupdf")
try:
    from PIL import Image, ImageChops
except ImportError:
    sys.exit("pillow is required:  pip install pillow")

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)


def crop_to_content(path, pad=40, threshold=12):
    """Trim the uniform border around a rendered page, in place."""
    im = Image.open(path).convert("RGB")
    bg = Image.new("RGB", im.size, im.getpixel((5, 5)))
    diff = ImageChops.difference(im, bg).convert("L")
    bbox = diff.point(lambda p: 255 if p > threshold else 0).getbbox()
    if bbox:
        box = (
            max(0, bbox[0] - pad),
            max(0, bbox[1] - pad),
            min(im.width, bbox[2] + pad),
            min(im.height, bbox[3] + pad),
        )
        im = im.crop(box)
    im.save(path, optimize=True)
    return im.size


def main():
    ap = argparse.ArgumentParser(description=__doc__,
                                 formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("pdf", help="path to the source PDF")
    ap.add_argument("--prefix", required=True,
                    help="short id used to name the outputs, e.g. v4")
    ap.add_argument("--dpi", type=int, default=200, help="plate render dpi (default 200)")
    ap.add_argument("--min-drawings", type=int, default=40,
                    help="vector draw ops above which a page is treated as a diagram")
    args = ap.parse_args()

    assets = os.path.join(ROOT, "assets")
    outdir = os.path.join(HERE, "out")
    os.makedirs(assets, exist_ok=True)
    os.makedirs(outdir, exist_ok=True)

    doc = pymupdf.open(args.pdf)
    text_lines = [f"SOURCE: {os.path.basename(args.pdf)}  ({len(doc)} pages)", "=" * 72]
    plates = []

    for i, page in enumerate(doc):
        n = i + 1
        text_lines.append(f"\n[page {n}]")
        text_lines.append(page.get_text().strip())

        ops = len(page.get_drawings())
        if ops >= args.min_drawings:
            out = os.path.join(assets, f"{args.prefix}-p{n:02d}.png")
            page.get_pixmap(dpi=args.dpi).save(out)
            size = crop_to_content(out)
            plates.append((n, ops, os.path.relpath(out, ROOT), size))

    text_path = os.path.join(outdir, f"{args.prefix}-text.txt")
    with open(text_path, "w") as fh:
        fh.write("\n".join(text_lines))

    print(f"text   → {os.path.relpath(text_path, ROOT)}  ({len(doc)} pages)")
    print(f"plates → {len(plates)} diagram pages detected\n")
    for n, ops, rel, size in plates:
        print(f"  p{n:02d}  {ops:4d} draw ops   {rel}   {size[0]}x{size[1]}")
    if not plates:
        print("  (none — lower --min-drawings if this deck's charts were missed)")

    print("\nNext: write the lesson entries into js/data.js, pointing each")
    print("lesson's \"plate\" at the relevant file above.")


if __name__ == "__main__":
    main()
