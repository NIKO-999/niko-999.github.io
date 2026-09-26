/* Cadence's reminders, and nothing else.

   A push arrives already decrypted by the browser: the phone sealed it
   with this device's own push keys before it went to the server, so
   the server carried words it could not read. This shows it.

   THERE IS NO fetch HANDLER, ON PURPOSE. A service worker that
   intercepts requests is a cache, and a cache is a way for the phone to
   run yesterday's app. schedule/ shipped exactly that bug. This one
   only answers pushes. */
self.addEventListener('install', function () { self.skipWaiting(); });
self.addEventListener('activate', function (e) { e.waitUntil(self.clients.claim()); });

self.addEventListener('push', function (e) {
  var d = {};
  try { d = e.data ? e.data.json() : {}; } catch (err) { d = {}; }
  e.waitUntil(self.registration.showNotification(d.t || 'Cadence', {
    body: d.b || '',
    tag: d.g || undefined,
    icon: 'icon-192.png',
    data: { u: './' }
  }));
});

/* A tap opens the app, or brings the open one to the front. */
self.addEventListener('notificationclick', function (e) {
  e.notification.close();
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (ws) {
    for (var i = 0; i < ws.length; i++) if ('focus' in ws[i]) return ws[i].focus();
    return self.clients.openWindow ? self.clients.openWindow('./') : null;
  }));
});
