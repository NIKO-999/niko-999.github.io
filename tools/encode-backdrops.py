"""Encode the backdrop photographs for the web.

   Two rules, in this order.

   RESOLUTION FIRST. A backdrop is drawn with `background-size: cover`
   across the whole window, so the browser will resample it to whatever
   the display asks for — 3024 device pixels on a 14" MacBook, 3456 on a
   16", 3840 on a 4K external at 2x, 5120 on a Studio Display. Ship less
   than that and the browser upscales, which is the whole reason the
   first set looked soft. So: as large as the original allows, capped at
   5120, and never enlarged past native.

   BYTES SECOND, and only as quality. Once the pixels are right, a file
   that is still too big loses quality rather than size — a slightly
   softer 5120px image beats a pristine 2976px one that then gets
   stretched. The cap is per image, so the one heavily detailed
   photograph does not set the budget for the thirteen smooth ones.
"""
import os, sys, json, io as _io
from PIL import Image, ImageFilter

CAP_W = 5120          # a Studio Display at 2x, and nothing sensible is wider
MAX_BYTES = 2_600_000 # per image; only one is ever loaded at a time
Q_HI, Q_LO = 90, 70

def encode(im, q):
    buf = _io.BytesIO()
    im.save(buf, 'JPEG', quality=q, optimize=True, progressive=True, subsampling=2)
    return buf.getvalue()

def process(src, dst):
    im = Image.open(src).convert('RGB')
    w, h = im.size
    if w > CAP_W:
        im = im.resize((CAP_W, round(h * CAP_W / w)), Image.LANCZOS)
    # A resample costs a little acutance; a light mask on luma only puts
    # it back without touching the colour.
    y, cb, cr = im.convert('YCbCr').split()
    y = y.filter(ImageFilter.UnsharpMask(radius=1.0, percent=70, threshold=2))
    im = Image.merge('YCbCr', (y, cb, cr)).convert('RGB')
    q = Q_HI
    data = encode(im, q)
    while len(data) > MAX_BYTES and q > Q_LO:
        q -= 3
        data = encode(im, q)
    open(dst, 'wb').write(data)
    return im.size, q, len(data)

if __name__ == '__main__':
    plan = json.load(open(sys.argv[1]))
    src_dir, out_dir = sys.argv[2], sys.argv[3]
    os.makedirs(out_dir, exist_ok=True)
    total = 0
    for bg_id, fname in plan:
        size, q, n = process(os.path.join(src_dir, fname), os.path.join(out_dir, bg_id + '.jpg'))
        total += n
        print(f'  {bg_id:10} {size[0]:5}x{size[1]:<5} q{q:<3} {n/1024:7.0f} KB')
    print(f'  total {total/1024/1024:.1f} MB')
