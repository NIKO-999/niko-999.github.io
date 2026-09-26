# Natal — birth chart app

A standalone, static astrology app (separate from the Human Design app in this repo).
Open `index.html` through any static server, e.g. `python3 -m http.server` from this folder, or host the folder on GitHub Pages.

## What it calculates
- **Planets**: Sun → Pluto from astronomy-engine (vendored in `vendor/`), with degree, minute, second, sign, house, decan, speed, retrograde, declination and out-of-bounds status, dignity, and critical or anaretic degrees.
- **Points**: Mean (default, as on Astro-Seek) or True lunar nodes, Chiron, Black Moon Lilith (mean), Part of Fortune (day/night), Vertex, ASC and MC.
- **Chiron** comes from `js/chiron-data.js`: yearly state vectors (1850–2150) taken from the Swiss Ephemeris, with Kepler propagation between them. **Lilith** and the **mean node** get small correction tables (`js/lilith-data.js`) that align them with the Swiss Ephemeris; the **true node** is the osculating node of the Moon's orbit.
- **Houses**: Placidus, Koch, Regiomontanus, Topocentric, Campanus, Porphyry, Equal and Whole Sign, including intercepted signs. Polar latitudes fall back to Porphyry.
- **Aspects**: major and minor, with orbs, applying/separating and a grid, plus parallels and contra-parallels of declination. Patterns detected: Grand Trine, T-Square, Grand Cross, Yod and stelliums.
- **Karmic**: the nodal axis by sign and house, planets on the nodes, Saturn, Chiron, Pluto, Lilith, retrograde planets, the 4th, 8th and 12th houses, and a timeline of nodal, Saturn and Chiron returns.
- **Zodiac**: Tropical, or Sidereal (Lahiri).

Birth time zones are resolved with the browser's time-zone database (historical DST included). City search is limited to Australia and New Zealand: a built-in list of about 115 places plus the free Open-Meteo geocoding API (filtered to AU and NZ).
Charts are saved in localStorage and can be shared as a link.

## Accuracy check
`node test/check.js` compares a reference chart (8 May 2002, 13:00, Whangārei NZ) against Astro-Seek.
Planets, Chiron and the MC match to the arc-minute. The mean node, Lilith and Ascendant are within 1–2′.

## Install as an app (PWA)
The folder is a Progressive Web App: `manifest.webmanifest`, a service worker (`sw.js`) that caches the whole app for offline use, and icons in `icons/`.
Host the folder over HTTPS (e.g. GitHub Pages), open it on a phone and choose "Add to Home Screen" (Safari: Share → Add to Home Screen).
When you change any file, bump `VERSION` in `sw.js` so installed copies pick up the update.

## Swiss Ephemeris comparison
`test/swiss/` compares the engine with the Swiss Ephemeris (what Astro-Seek uses) over 400 random charts. Every point matches within half an arc-minute and every house cusp within 0.07′. See `test/swiss/README.md`.
