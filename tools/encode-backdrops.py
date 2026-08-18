"""Encode the backdrop photographs for the web.

   These arrive at 3840 to 9200 pixels wide, which is far past anything a
   screen will ask for and megabytes each. So the job here is the
   opposite of the old one: come DOWN carefully rather than up.

   A downscale needs only a light mask — Lanczos already carries the
   detail, and the halo-clamped 340% mask that rescued the old upscaled
   set would be violence here. Never enlarged past native: an image
   smaller than the target is left where it is rather than invented.
"""
import os, sys, json
from PIL import Image, ImageFilter

# 3024x1964 is a 14" MacBook at 2x. Cover that and there is nothing left
# to gain; the cap keeps the widest files from running to megabytes.
FIT_W, FIT_H, CAP_W = 2880, 1984, 3400

def process(src, dst, q=84):
    im = Image.open(src).convert('RGB')
    w, h = im.size
    scale = min(1.0, max(FIT_W / w, FIT_H / h))
    if w * scale > CAP_W:
        scale = CAP_W / w
    if scale < 1.0:
        im = im.resize((max(1, round(w * scale)), max(1, round(h * scale))), Image.LANCZOS)
    # Light, and on luma only, so a resample's softness comes back
    # without touching the colour.
    y, cb, cr = im.convert('YCbCr').split()
    y = y.filter(ImageFilter.UnsharpMask(radius=1.0, percent=70, threshold=2))
    im = Image.merge('YCbCr', (y, cb, cr)).convert('RGB')
    im.save(dst, 'JPEG', quality=q, optimize=True, progressive=True, subsampling=2)
    return im.size

if __name__ == '__main__':
    plan = json.load(open(sys.argv[1]))
    src_dir, out_dir = sys.argv[2], sys.argv[3]
    os.makedirs(out_dir, exist_ok=True)
    total = 0
    for bg_id, fname in plan:
        d = os.path.join(out_dir, bg_id + '.jpg')
        size = process(os.path.join(src_dir, fname), d)
        n = os.path.getsize(d); total += n
        print(f'  {bg_id:10} {size[0]:5}x{size[1]:<5} {n/1024:7.0f} KB')
    print(f'  total {total/1024/1024:.2f} MB')
