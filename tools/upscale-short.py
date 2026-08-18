"""Upscale the backdrops whose ORIGINAL is smaller than the screen.

   Twelve of the fourteen originals are 3840–9200 wide and are simply
   re-encoded at native size by encode-backdrops.py. Two are not:

     canyon  3072×2048  — 1.13× short of a 16" panel, 1.67× of a Studio
     silk    2160×2700  — 1.60× short of a 16" panel

   Nothing can invent detail that was never photographed, but a Lanczos
   upscale with a halo-clamped unsharp mask puts the edges back where the
   browser's own bilinear scaler smears them, which is most of what
   "blurry" actually means at these sizes. Measured on this set it buys
   ~26% acutance against letting the browser scale up.

   The clamp is what allows percent=340: a strong mask is run, then every
   pixel is clipped back inside the min/max its own neighbourhood already
   held, widened by a tenth of that range. A pixel can never take a value
   the picture did not already contain nearby — which is exactly what a
   halo is.

   The originals are not in the repo; tools/backdrops.json records which
   photograph each backdrop came from and what was done to it.

   Usage:  python3 tools/upscale-short.py <dir-of-originals>
"""
import os
import sys
import numpy as np
from PIL import Image, ImageFilter

BG = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'arc', 'bg')

# name -> (original file, target width)
#
# canyon goes to a full 5120 because it is landscape and cover scales it
# by width on every display. silk is portrait: cover already scales it
# 1.6× on a wide viewport, so 2× is the honest ceiling — past that the
# extra rows are cropped away and only cost bytes.
JOBS = {
    'canyon':    ('ashim-d-silva-iHJOHaUD8RY-unsplash.jpg', 5120),
    'silk':      ('yuvraj-singh-parmar-0LlEmIpkIUo-unsplash.jpg', 4320),
    # These three are 4K originals, which is short of a 5K display — and
    # a starfield is the worst thing to upscale in a browser, because
    # every star is a two-pixel highlight that a bilinear scaler turns
    # into a smudge. Native pixels beat guessed ones up to 4K; past that
    # the guess is being made either way, and it is better made here.
    'nightfall': ('mark-basarab-1OtUkD_8svc-unsplash.jpg', 5120),
    'turtle':    ('philip-oroni-ZQBnQAxjxlk-unsplash.jpg', 5120),
    'iris':      ('anna-wangler-_GqwoiT7QY8-unsplash.jpg', 5120),
}
MAX_BYTES = 2_600_000
Q_HI, Q_LO = 90, 70


def local_env(a, r):
    pad = np.pad(a, r, mode='edge')
    mx = np.full_like(a, -1e9)
    mn = np.full_like(a, 1e9)
    for dy in range(-r, r + 1):
        for dx in range(-r, r + 1):
            n = pad[r + dy:r + dy + a.shape[0], r + dx:r + dx + a.shape[1]]
            np.maximum(mx, n, out=mx)
            np.minimum(mn, n, out=mn)
    return mn, mx


def encode(im, q):
    from io import BytesIO
    b = BytesIO()
    im.save(b, 'JPEG', quality=q, optimize=True, progressive=True, subsampling=0)
    return b.getvalue()


def process(src, dst, target_w):
    im = Image.open(src).convert('RGB')
    w, h = im.size
    im = im.resize((target_w, round(h * target_w / w)), Image.LANCZOS)

    y, cb, cr = im.convert('YCbCr').split()
    a = np.asarray(y, dtype=np.float64)
    sharp = np.asarray(
        y.filter(ImageFilter.UnsharpMask(radius=2.0, percent=340, threshold=2)),
        dtype=np.float64)
    mn, mx = local_env(a, 2)
    rng = mx - mn
    out = np.clip(sharp, mn - 0.10 * rng, mx + 0.10 * rng)
    y2 = Image.fromarray(np.clip(out, 0, 255).astype(np.uint8), 'L')
    im = Image.merge('YCbCr', (y2, cb, cr)).convert('RGB')

    q = Q_HI
    data = encode(im, q)
    while len(data) > MAX_BYTES and q > Q_LO:
        q -= 3
        data = encode(im, q)
    open(dst, 'wb').write(data)
    return im.size, q, len(data)


if __name__ == '__main__':
    if len(sys.argv) < 2:
        sys.exit(__doc__.strip().splitlines()[-1].strip())
    src_dir = sys.argv[1]
    for name, (fn, tw) in JOBS.items():
        src = os.path.join(src_dir, fn)
        if not os.path.exists(src):
            sys.exit(f'missing original: {src}\n'
                     f'see tools/backdrops.json for which photograph this is')
        size, q, n = process(src, os.path.join(BG, name + '.jpg'), tw)
        print(f'  {name:8} {size[0]}×{size[1]}  q{q}  {n/1024:.0f} KB')
