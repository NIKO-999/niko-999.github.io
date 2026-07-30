// Minimal service worker: caches the static app shell so it's installable and
// works offline. Never caches or intercepts anything user-entered — all
// personal data (name, DOB, partner DOB) stays purely client-side in memory,
// same as the rest of the app.
const CACHE_NAME = 'destiny-matrix-v2';
const APP_SHELL = [
  './DestinyMatrix-v1.html',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/apple-touch-icon.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Network-first: always prefer the live deploy while online, so a normal
// refresh never shows a stale cached page. Cache is only a fallback for
// being genuinely offline, and stays updated in the background whenever a
// network fetch succeeds.
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (response.ok) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        }
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
