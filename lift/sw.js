/* Lift opens with no signal, and never runs a version behind.

   NETWORK FIRST, which is cadence/'s rule for cadence/'s reason:
   schedule/ served its document cache first and every deploy landed one
   open late. Here the network is always asked first and the cache only
   answers when it cannot be reached — so with a signal this is the app
   with no service worker at all, and in a gym basement with none it is
   the last copy that loaded. Same origin and GET only. */
var CACHE = 'lift-v161';
var SHELL = ['./', 'index.html', 'manifest.json', 'icon.svg', 'icon-180.png', 'icon-192.png', '../arc/fonts/Inter.woff2', 'three.min.js'];
self.addEventListener('install', function (e) {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(function (c) {
    return Promise.all(SHELL.map(function (u) { return c.add(u).catch(function () {}); }));
  }));
});
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (ks) {
    return Promise.all(ks.filter(function (k) { return k.indexOf('lift-') === 0 && k !== CACHE; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});
self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
  /* THE PAGE ITSELF SKIPS THE BROWSER'S OWN CACHE. GitHub Pages tells it
     to keep a page ten minutes, so "network first" could still answer
     with a ten-minute-old copy, and the reload that a new version asks
     for brought the old one back. The page is checked with the server
     every time; everything else may ride the browser's cache. */
  var doc = req.mode === 'navigate' || /\/(index\.html)?$/.test(new URL(req.url).pathname);
  e.respondWith((doc ? fetch(req.url, { cache: 'no-cache', credentials: 'same-origin' }) : fetch(req)).then(function (res) {
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

/* A REST ALERT FROM THE SERVER, for when the phone is locked: it was
   sealed on the phone and opened here. Tagged, so a second rest replaces
   the first instead of stacking. */
self.addEventListener('push', function (e) {
  var d = {};
  try { d = e.data ? e.data.json() : {}; } catch (err) { d = {}; }
  e.waitUntil(self.registration.showNotification(d.t || 'Lift', { body: d.b || '', tag: d.g || 'lift', renotify: true, icon: 'icon-192.png' }));
});
self.addEventListener('notificationclick', function (e) {
  e.notification.close();
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (ws) {
    for (var i = 0; i < ws.length; i++) if ('focus' in ws[i]) return ws[i].focus();
    return self.clients.openWindow ? self.clients.openWindow('./') : null;
  }));
});
