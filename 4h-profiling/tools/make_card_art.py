#!/usr/bin/env python3
"""
Draw card art for lessons that have no diagram plate.

The plates use a small fixed palette (dark ground, teal bullish bodies, slate
bearish bodies, light wicks and outlines). Cards without a plate previously
fell back to a flat SVG outline, which read as a different kind of object in
the grid. These are drawn in the plate palette at the same aspect so every card
in the grid looks like it belongs to the same family.

They are decorative card art only — never presented as source diagrams. The
"Plate" pill still appears only on lessons that carry a real one.

    python3 tools/make_card_art.py
"""
from PIL import Image, ImageDraw

W, H = 760, 400
BG      = (19, 22, 26)
BULL    = (95, 211, 188)
BEAR    = (57, 66, 76)
STROKE  = (201, 209, 217)

def draw(name, seq, pad=54):
    """seq: list of (open, high, low, close) in 0..1, bottom-up."""
    im = Image.new("RGB", (W, H), BG)
    d = ImageDraw.Draw(im)
    n = len(seq)
    slot = (W - pad * 2) / n
    bw = slot * 0.52
    def y(v): return H - pad - v * (H - pad * 2)
    for i, (o, hi, lo, c) in enumerate(seq):
        cx = pad + slot * (i + 0.5)
        d.line([(cx, y(hi)), (cx, y(lo))], fill=STROKE, width=3)
        top, bot = max(o, c), min(o, c)
        box = [cx - bw / 2, y(top), cx + bw / 2, y(bot)]
        d.rectangle(box, fill=BULL if c >= o else BEAR, outline=STROKE, width=3)
    im.save(f"assets/{name}", optimize=True)
    return name

# each sequence is chosen to suit its lesson rather than being generic filler
ART = {
  # bias — a clean higher-high / higher-low advance
  "art-establishing-market-direction.png":
    [(.20,.30,.16,.27),(.27,.38,.24,.35),(.35,.40,.29,.31),(.31,.52,.29,.49),
     (.49,.58,.45,.55),(.55,.60,.50,.52),(.52,.74,.50,.71),(.71,.80,.67,.77)],
  # top-down — one dominant candle with the finer ones that compose it
  "art-top-down-analysis.png":
    [(.22,.86,.18,.82),(.24,.34,.20,.31),(.31,.42,.28,.39),(.39,.48,.35,.45),
     (.45,.58,.42,.55),(.55,.66,.51,.63),(.63,.76,.60,.73),(.73,.84,.70,.81)],
  # continuation — a pullback that resolves in the original direction
  "art-continuation-entries-4h-m15.png":
    [(.30,.56,.27,.53),(.53,.58,.40,.43),(.43,.47,.36,.39),(.39,.44,.35,.42),
     (.42,.62,.40,.60),(.60,.74,.57,.72),(.72,.84,.69,.82)],
  "art-continuation-entries-1h-m5.png":
    [(.34,.52,.31,.49),(.49,.53,.41,.44),(.44,.48,.39,.41),(.41,.45,.38,.43),
     (.43,.58,.41,.56),(.56,.66,.53,.64),(.64,.78,.61,.76),(.76,.86,.73,.84)],
  # session — six candles, the day
  "art-daily-profile-and-the-six-4h-candles.png":
    [(.44,.50,.28,.32),(.32,.38,.22,.36),(.36,.54,.33,.52),(.52,.66,.49,.64),
     (.64,.76,.61,.74),(.74,.82,.70,.78)],
  "art-daily-range-structure.png":
    [(.40,.46,.30,.34),(.34,.40,.24,.38),(.38,.58,.35,.56),(.56,.70,.53,.68),
     (.68,.80,.65,.78),(.78,.84,.74,.80)],
  # structure — a swept high that fails and turns
  "art-protected-and-failure-swings.png":
    [(.34,.44,.31,.42),(.42,.56,.39,.54),(.54,.80,.51,.58),(.58,.62,.44,.47),
     (.47,.50,.36,.38),(.38,.42,.28,.30),(.30,.34,.20,.24)],
  # fractal — the same shape at two scales
  "art-fractal-thought-process.png":
    [(.26,.78,.22,.74),(.28,.36,.24,.33),(.33,.41,.30,.38),(.38,.52,.35,.50),
     (.50,.58,.46,.55),(.55,.70,.52,.68),(.68,.80,.65,.77)],
  # entry — a run of opposing closes broken by a single close back through
  "art-entry-ideas-cisd-and-orderblocks.png":
    [(.72,.75,.62,.65),(.65,.68,.55,.58),(.58,.61,.48,.51),(.51,.54,.42,.45),
     (.45,.70,.43,.68),(.68,.80,.65,.78)],
}

if __name__ == "__main__":
    for name, seq in ART.items():
        print("  ", draw(name, seq))
    print(f"{len(ART)} card-art images written to assets/")
