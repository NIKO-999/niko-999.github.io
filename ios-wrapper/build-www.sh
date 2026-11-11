#!/bin/sh
# Copies the app into www/ the way the wrapper expects it: the app in lift/,
# and the font it loads from ../arc/fonts beside it. Run from this folder.
set -e
rm -rf www
mkdir -p www/lift www/arc/fonts
cp -R ../lift/. www/lift/
cp ../arc/fonts/* www/arc/fonts/
# the service worker is for the website; the app shell does not use one
rm -f www/lift/sw.js
printf '<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta http-equiv="refresh" content="0;url=lift/index.html"><body style="background:#000">' > www/index.html
echo "www/ is ready"
