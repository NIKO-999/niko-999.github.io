#!/usr/bin/env python3
"""
Remap a light-background diagram plate to the archive's dark theme.

The source decks draw their charts on near-white with a small fixed palette
(teal bullish bodies, dark bearish bodies, black outlines, orange labels), so
each colour maps cleanly to a dark-theme counterpart. Every pixel is snapped to
its nearest source colour and replaced, which keeps line art and label text
crisp rather than muddying them the way a luminance inversion would.

Usage:  python3 tools/darken_plates.py assets/v4-p05.png [...]   (edits in place)
"""
from PIL import Image
import numpy as np, glob, os, sys
# source palette -> dark-mode target
MAP = [
 ((250,250,250),(19,22,26)),   # paper -> ground
 ((255,255,255),(19,22,26)),
 ((  0,  0,  0),(201,209,217)),# ink outline -> light
 (( 61, 66, 65),( 57, 66, 76)),# bearish body -> slate
 ((111,204,189),( 95,211,188)),# bullish body -> teal
 (( 91, 93,114),(166,174,196)),# heading slate -> light slate
 ((255,144, 77),(255,164, 99)),# label orange
 ((117,117,117),(138,146,155)),
 (( 87, 87, 87),(122,130,139)),
 (( 65,120,111),( 62,143,128)),
 (( 84,156,144),( 79,176,158)),
]
SRC=np.array([m[0] for m in MAP],dtype=np.float32)
DST=np.array([m[1] for m in MAP],dtype=np.uint8)

def convert(path,out):
    im=Image.open(path).convert('RGB')
    a=np.asarray(im).astype(np.float32)
    h,w,_=a.shape
    flat=a.reshape(-1,3)
    # nearest palette entry per pixel
    d=((flat[:,None,:]-SRC[None,:,:])**2).sum(axis=2)
    idx=d.argmin(axis=1)
    outp=DST[idx].reshape(h,w,3)
    Image.fromarray(outp).save(out,optimize=True)
    return im.size

if __name__=='__main__':
    if len(sys.argv)<2:
        sys.exit("usage: darken_plates.py <plate.png> [more.png ...]   (edits in place)")
    for f in sys.argv[1:]:
        print(f, convert(f, f))
