/* Cadence's reminders, and the app with no signal.

   A push arrives already decrypted by the browser: the phone sealed it
   with this device's own push keys before it went to the server, so
   the server carried words it could not read. This shows it.

   THE FETCH HANDLER IS NETWORK FIRST, AND THAT IS THE WHOLE OF THE
   DESIGN. schedule/ served its document cache first and every deploy
   landed one open late — you opened the app, got yesterday's markup,
   and the fresh copy went into the cache for next time. Here the
   network is always asked first and the cache is only what answers when
   it cannot be reached, so with a signal this is exactly the app with
   no service worker at all, and without one it is the last copy that
   loaded. Same origin and GET only: the sync server is never cached,
   because a stale answer from it is a wrong answer. */
var CACHE = 'cadence-v1';
var SHELL = ['./', 'manifest.json', 'icon.svg', 'icon-180.png', 'icon-192.png', 'fonts/GeistMono.woff2', '../arc/fonts/Inter.woff2'];
self.addEventListener('install', function (e) {
  self.skipWaiting();
  /* Filled on install so the first open without a signal works, not only
     the second. One missing file must not stop the rest being kept. */
  e.waitUntil(caches.open(CACHE).then(function (c) {
    return Promise.all(SHELL.map(function (u) { return c.add(u).catch(function () {}); }));
  }));
});
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (ks) {
    return Promise.all(ks.filter(function (k) { return k.indexOf('cadence-') === 0 && k !== CACHE; }).map(function (k) { return caches.delete(k); }));
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
    /* A push opens ./?from=push#tick=…, so the document is matched with
       its query ignored, and './' and './index.html' are one page. */
    return caches.match(req, { ignoreSearch: req.mode === 'navigate' }).then(function (hit) {
      if (hit) return hit;
      if (req.mode === 'navigate') return caches.match('./').then(function (h) { return h || caches.match('./index.html'); });
      return Response.error();
    });
  }));
});

self.addEventListener('push', function (e) {
  var d = {};
  try { d = e.data ? e.data.json() : {}; } catch (err) { d = {}; }
  e.waitUntil(self.registration.showNotification(d.t || 'Cadence', {
    body: d.b || '',
    tag: d.g || undefined,
    icon: 'icon-192.png',
    data: { u: d.u || '' }
  }));
});

/* A tap opens the app, or brings the open one to the front. A "did you
   do it?" reminder carries the block it is about, handed over as a
   message to an open app and as a hash to a cold one, so either way the
   press lands on the ask for that block. */
self.addEventListener('notificationclick', function (e) {
  e.notification.close();
  var u = (e.notification.data && e.notification.data.u) || '', tick = /^#tick=(.+)$/.exec(u);
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (ws) {
    for (var i = 0; i < ws.length; i++) if ('focus' in ws[i]) {
      if (tick) ws[i].postMessage({ tick: decodeURIComponent(tick[1]) });
      return ws[i].focus();
    }
    return self.clients.openWindow ? self.clients.openWindow('./' + u) : null;
  }));
});
