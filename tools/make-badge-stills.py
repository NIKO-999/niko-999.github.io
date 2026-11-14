#!/usr/bin/env python3
"""Turns the pictures tools/badge-stills-render.js collected into the files the shelf shows.

THE SHELF DRAWS NOTHING ON THE PHONE. Every badge's picture is made here, with the same code that draws
the badge when it is opened, and shipped as lift/bd/<id>.webp (earned) and <id>-l.webp (locked). Drawing
them on each phone, one at a time with the page let go between, left the shelf full of blank discs for a
while, and the blank ones all looked alike until you opened one. Run after any change to a badge's art or
look, bump BD_VER and the ?v= below, and commit lift/bd/.

  1. start a static server on :8977 in the repo root
  2. node tools/badge-stills-render.js earned ; node tools/badge-stills-render.js locked   (writes sweep/*.json)
  3. python3 tools/make-badge-stills.py <dir holding earned.json and locked.json>
"""
import base64, io, json, os, re, sys
from PIL import Image

src = sys.argv[1]
root = os.path.join(os.path.dirname(__file__), '..', 'lift')
out = os.path.join(root, 'bd')
os.makedirs(out, exist_ok=True)
ids = []
for mode, suffix in (('earned', ''), ('locked', '-l')):
    for k, u, *_ in json.load(open(os.path.join(src, mode + '.json'))):
        if not u:
            continue
        im = Image.open(io.BytesIO(base64.b64decode(u.split(',', 1)[1]))).convert('RGBA').resize((300, 300), Image.LANCZOS)
        im.save(os.path.join(out, k + suffix + '.webp'), 'WEBP', quality=82, method=6)
        if suffix == '':
            ids.append(k)
ids.sort()
p = os.path.join(root, 'index.html')
s = open(p).read()
s = re.sub(r"/\*BD_STATIC\*/\[[^\]]*\]/\*END\*/", "/*BD_STATIC*/" + json.dumps(ids, separators=(',', ':')) + "/*END*/", s)
open(p, 'w').write(s)
print(len(ids), 'badges,', sum(os.path.getsize(os.path.join(out, f)) for f in os.listdir(out)) // 1024, 'KB')
