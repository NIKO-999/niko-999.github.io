'use strict';

/**
 * RITUAL — service worker.
 *
 * The app is opened first thing in the morning, on a phone, sometimes with
 * no usable signal. Everything it needs is a handful of static files, so it
 * has no business needing the network at all once it has been opened once.
 *
 * Strategy is stale-while-revalidate rather than plain cache-first: the
 * cached copy is served immediately (which is the whole point), and a fresh
 * copy is fetched in the background and stored for next time. Plain
 * cache-first would be just as fast and would strand you on an old version
 * indefinitely; this costs one extra open to pick a new version up.
 *
 * BUMP `VERSION` whenever a shell file changes, or the old cache is what
 * keeps being served.
 */

const VERSION = 'ritual-v2';

/* Everything needed to draw the app with the network switched off. The
   icons live outside this worker's scope (../icons/) so they cannot be
   intercepted here — they are only read by the OS at install time, which
   is online by definition. */
const SHELL = [
  './',
  './index.html',
  './styles.css',
  './fonts.css',
  './data.js',
  './creatures.js',
  './photos.js',
  './app.js',
  './manifest.json',
  './fonts/Inter-300.woff2',
  './fonts/Inter-400.woff2',
  './fonts/Inter-500.woff2',
  './fonts/Inter-600.woff2',
  './fonts/Archivo-300.woff2',
  './fonts/Archivo-700i.woff2',
  './fonts/JetBrainsMono-400.woff2',
  './fonts/JetBrainsMono-500.woff2',
];

self.addEventListener('install', (ev) => {
  ev.waitUntil(
    caches.open(VERSION)
      .then((c) => c.addAll(SHELL))
      /* Take over straight away rather than waiting for every tab to close.
         Nothing here is lazy-loaded, so there is no risk of one page ending
         up with a mix of old and new files. */
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (ev) => {
  ev.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys.filter((k) => k !== VERSION).map((k) => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (ev) => {
  const req = ev.request;
  if (req.method !== 'GET') return;

  /* Only same-origin. Anything else is left to the network untouched. */
  let url;
  try { url = new URL(req.url); } catch (e) { return; }
  if (url.origin !== self.location.origin) return;

  ev.respondWith(
    caches.match(req).then((cached) => {
      const fresh = fetch(req).then((res) => {
        /* Opaque and error responses are not worth storing — caching a 404
           would make the failure permanent. */
        if (res && res.ok && res.type === 'basic') {
          const copy = res.clone();
          caches.open(VERSION).then((c) => c.put(req, copy)).catch(() => {});
        }
        return res;
      }).catch(() => cached);        // offline: whatever we already have

      return cached || fresh;
    })
  );
});
