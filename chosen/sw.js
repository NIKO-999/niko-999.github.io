// Chosen — offline support. It may share its origin with other apps (e.g. on niko-999.github.io),
// so it only ever touches caches named chosen-*.
// Bump VERSION whenever the page changes so phones pick up the new copy.
const VERSION = "chosen-v15";
const CORE = ["./", "./index.html", "./manifest.webmanifest", "./icon-192.png", "./icon-512.png", "./apple-touch-icon.png"];

self.addEventListener("install", e => e.waitUntil(caches.open(VERSION).then(c => c.addAll(CORE)).then(() => self.skipWaiting())));
self.addEventListener("activate", e => e.waitUntil(
  caches.keys().then(keys => Promise.all(keys.filter(k => k.startsWith("chosen-") && k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim())
));
// Page: network first, so an update shows on the next open; the cache when offline.
// Everything else (fonts, icons): cache first.
self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  e.respondWith(req.mode === "navigate"
    ? fetch(req).then(r => { const copy = r.clone(); caches.open(VERSION).then(c => c.put(req, copy)); return r; })
        .catch(() => caches.match(req).then(hit => hit || caches.match("./index.html")))
    : caches.match(req).then(hit => hit || fetch(req).then(r => {
        if (r.ok || r.type === "opaque") { const copy = r.clone(); caches.open(VERSION).then(c => c.put(req, copy)); }
        return r;
      })));
});
