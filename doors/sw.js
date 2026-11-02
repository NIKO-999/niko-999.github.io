/* Encounters opens with no signal, and never runs a version behind.

   NETWORK FIRST, which is cadence/'s rule for cadence/'s reason:
   schedule/ served its document cache first and every deploy landed one
   open late. Here the network is always asked first and the cache only
   answers when it cannot be reached — so with a signal this is the app
   with no service worker at all, and on a street with none it is
   the last copy that loaded. Same origin and GET only. */
var CACHE = 'doors-v3';
var SHELL = ['./', 'index.html', 'manifest.json', 'icon.svg', 'icon-180.png', 'icon-192.png', '../arc/fonts/Inter.woff2'];
self.addEventListener('install', function (e) {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(function (c) {
    return Promise.all(SHELL.map(function (u) { return c.add(u).catch(function () {}); }));
  }));
});
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (ks) {
    return Promise.all(ks.filter(function (k) { return k.indexOf('doors-') === 0 && k !== CACHE; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});
self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
  e.respondWith(fetch(req).then(function (res) {
    if (res && res.ok && res.type === 'basic') {
      var copy = res.clone();
      caches.open(CACHE).then(function (c) { return c.put(req, copy); }).catch(function () {});
    }
    return res;
  }).catch(function () {
    return caches.match(req, { ignoreSearch: req.mode === 'navigate' }).then(function (hit) {
      if (hit) return hit;
      if (req.mode === 'navigate') return caches.match('./').then(function (h) { return h || caches.match('index.html'); });
      return Response.error();
    });
  }));
});
