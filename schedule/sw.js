/* ═══════════════════════════════════════════════════════════════
   The offline shell.

   Five files and a font — the whole app — cached on install, served
   from cache first so opening it costs no network at all, and quietly
   refreshed in the background so the next open is current. This is the
   only reason to have a service worker here: the schedule itself lives
   in localStorage and was never going over a wire.

   Scoped to /schedule/ by sitting in /schedule/. A worker registered
   higher up the site cannot take these pages while this one is
   installed, because the most specific scope wins.
   ═══════════════════════════════════════════════════════════════ */

var CACHE = 'schedule-v1';

var SHELL = [
  './',
  './index.html',
  './app.css',
  './app.js',
  './manifest.json',
  './icon.svg',
  './fonts/Inter.woff2'
];

self.addEventListener('install', function (ev) {
  ev.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(SHELL); }));
  self.skipWaiting();
});

self.addEventListener('activate', function (ev) {
  ev.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.map(function (k) {
      return k === CACHE ? null : caches.delete(k);
    }));
  }));
  self.clients.claim();
});

/* Cache first, then revalidate. A schedule has to open on a bus with no
   signal, and it must never be a version behind for longer than one
   open — so the cached copy is served immediately and replaced in the
   background for next time. */
self.addEventListener('fetch', function (ev) {
  var req = ev.request;
  if (req.method !== 'GET') return;
  if (new URL(req.url).origin !== self.location.origin) return;

  ev.respondWith(
    caches.match(req).then(function (hit) {
      var live = fetch(req).then(function (res) {
        if (res && res.ok) {
          var copy = res.clone();
          caches.open(CACHE).then(function (c) { c.put(req, copy); });
        }
        return res;
      }).catch(function () { return hit; });
      return hit || live;
    })
  );
});
