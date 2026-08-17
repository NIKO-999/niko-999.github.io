"""Lanczos 2x, then a halo-clamped unsharp mask on luma only.

   The clamp is what makes the strength possible: a strong USM is run,
   then every pixel is clipped back into the min/max its own
   neighbourhood already held, widened by a tenth of that range. A pixel
   can therefore never take a value the picture did not already contain
   nearby, which is precisely what a halo is — so percent can go to 340
   without ringing where an ordinary mask ropes edges at 160.
"""
import os, sys
import numpy as np
from PIL import Image, ImageFilter

def local_env(a, r):
    pad = np.pad(a, r, mode='edge')
    mx = np.full_like(a, -1e9); mn = np.full_like(a, 1e9)
    for dy in range(-r, r + 1):
        for dx in range(-r, r + 1):
            n = pad[r + dy:r + dy + a.shape[0], r + dx:r + dx + a.shape[1]]
            np.maximum(mx, n, out=mx); np.minimum(mn, n, out=mn)
    return mn, mx

def process(src, dst, q=82):
    im = Image.open(src).convert('RGB')
    w, h = im.size
    im = im.resize((w * 2, h * 2), Image.LANCZOS)
    y, cb, cr = im.convert('YCbCr').split()
    a = np.asarray(y, dtype=np.float64)
    sharp = np.asarray(
        y.filter(ImageFilter.UnsharpMask(radius=2.0, percent=340, threshold=2)),
        dtype=np.float64)
    mn, mx = local_env(a, 2)
    rng = mx - mn
    out = np.clip(sharp, mn - 0.10 * rng, mx + 0.10 * rng)
    y2 = Image.fromarray(np.clip(out, 0, 255).astype(np.uint8), 'L')
    Image.merge('YCbCr', (y2, cb, cr)).convert('RGB').save(
        dst, 'JPEG', quality=q, optimize=True, progressive=True, subsampling=2)

if __name__ == '__main__':
    SRC = '/home/user/niko-999.github.io/arc/bg'
    OUT = sys.argv[1]; q = int(sys.argv[2]) if len(sys.argv) > 2 else 82
    os.makedirs(OUT, exist_ok=True)
    tot = 0
    for n in sorted(os.listdir(SRC)):
        if not n.endswith('.jpg'): continue
        d = os.path.join(OUT, n)
        process(os.path.join(SRC, n), d, q)
        sz = os.path.getsize(d); tot += sz
        print(f'  {n[:-4]:8} {sz/1024:6.0f} KB')
    print(f'  total {tot/1024/1024:.2f} MB')
