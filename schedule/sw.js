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
   signal, so the cached copy is served immediately and replaced in the
   background for next time.

   EXCEPT THE DOCUMENT, and that exception is the whole point of the
   rest. app.css and app.js are requested with a ?v= fingerprint of
   their own contents, so a new build is a new URL and can never be
   served stale — but the only thing that KNOWS the new fingerprints is
   index.html, and served cache-first it was itself a build behind. So
   every deploy landed one open late: you opened the app, got
   yesterday's markup pointing at yesterday's assets, and the fresh
   copy went into the cache for next time. The comment here used to say
   "never a version behind for longer than one open", which is a fair
   description of a bug.

   The document goes to the network first and falls back to the cache,
   which is a few kilobytes on a connection you have and the cached
   copy on one you do not. Offline is unchanged; the first open after a
   deploy is the new build. */
function scDoc(req) {
  return req.mode === 'navigate'
    || /(^|\/)$|\.html$/.test(new URL(req.url).pathname);
}

self.addEventListener('fetch', function (ev) {
  var req = ev.request;
  if (req.method !== 'GET') return;
  if (new URL(req.url).origin !== self.location.origin) return;

  var store = function (res) {
    if (res && res.ok) {
      var copy = res.clone();
      caches.open(CACHE).then(function (c) { c.put(req, copy); });
    }
    return res;
  };

  if (scDoc(req)) {
    ev.respondWith(
      fetch(req).then(store).catch(function () {
        return caches.match(req).then(function (hit) {
          /* './' and './index.html' are one page and the cache holds
             both, but a navigation to the folder does not match the
             file. Falling through to the shell's own entry is what
             makes an offline open work whichever URL it started from. */
          return hit || caches.match('./index.html');
        });
      })
    );
    return;
  }

  ev.respondWith(
    caches.match(req).then(function (hit) {
      var live = fetch(req).then(store).catch(function () { return hit; });
      return hit || live;
    })
  );
});
