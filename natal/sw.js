/* Natal service worker: offline app shell + cached fonts. Bump VERSION when files change. */
const VERSION = "natal-v7";
const SHELL = [
  "./",
  "index.html",
  "manifest.webmanifest",
  "css/style.css",
  "icons/icon-192.png",
  "icons/icon-512.png",
  "icons/icon-180.png",
  "icons/icon-32.png",
  "icons/icon.svg",
  "vendor/astronomy.browser.min.js",
  "js/chiron-data.js",
  "js/engine.js",
  "js/content.js",
  "js/deep-big-three.js",
  "js/deep-planet-signs-1.js",
  "js/deep-planet-signs-2.js",
  "js/deep-houses-1.js",
  "js/deep-houses-2.js",
  "js/deep-aspects-1.js",
  "js/deep-aspects-2.js",
  "js/deep-signs.js",
  "js/deep-houses-axes.js",
  "js/deep-extra.js",
  "js/deep-transits.js",
  "js/deep-transit-houses.js",
  "js/cities.js",
  "js/wheel.js",
  "js/sky.js",
  "js/planets.js",
  "js/app.js",
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== VERSION && k !== "natal-fonts").map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);

  // Google Fonts: serve from cache, refresh in the background
  if (url.hostname === "fonts.googleapis.com" || url.hostname === "fonts.gstatic.com") {
    e.respondWith(
      caches.open("natal-fonts").then(async (c) => {
        const hit = await c.match(req);
        const net = fetch(req).then((res) => { if (res.ok || res.type === "opaque") c.put(req, res.clone()); return res; }).catch(() => hit);
        return hit || net;
      })
    );
    return;
  }

  // App files: cache first, fall back to network (and keep the cache fresh)
  if (url.origin === self.location.origin) {
    e.respondWith(
      caches.match(req, { ignoreSearch: true }).then((hit) => {
        const net = fetch(req).then((res) => {
          if (res.ok) caches.open(VERSION).then((c) => c.put(req, res.clone()));
          return res;
        }).catch(() => hit || caches.match("index.html"));
        return hit || net;
      })
    );
  }
  // everything else (e.g. place search) goes straight to the network
});
