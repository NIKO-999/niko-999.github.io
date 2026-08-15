'use strict';

/**
 * RITUAL — photo evidence.
 * ────────────────────────
 * Proof that a habit actually happened, stored on the device and nowhere
 * else. Nothing here is uploaded and nothing leaves the phone.
 *
 * IndexedDB rather than localStorage, deliberately. localStorage is capped
 * around 5–10MB *per origin*, and this origin already carries other apps —
 * one of which stores uncompressed base64 photos in it. Sharing that budget
 * would mean Ritual failing to save because something else filled it up.
 * IndexedDB gets its own, far larger allowance and takes Blobs directly,
 * with none of base64's 33% inflation.
 *
 * Photos are compressed *before* they are stored, never after. A phone
 * camera hands over 2–5MB; what gets kept is nearer 100KB.
 */

window.RITUAL_PHOTOS = (function () {

  const DB_NAME  = 'ritual-photos';
  const STORE    = 'shots';
  const DB_VER   = 1;

  const MAX_EDGE = 1000;   // longest side, px
  const QUALITY  = 0.82;   // JPEG

  const id = (day, block) => day + ':' + block;

  /* ── the database ── */

  let dbp = null;

  function open() {
    if (dbp) return dbp;
    dbp = new Promise((resolve, reject) => {
      let req;
      try { req = indexedDB.open(DB_NAME, DB_VER); }
      catch (e) { reject(e); return; }

      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains(STORE)) {
          const s = db.createObjectStore(STORE, { keyPath: 'id' });
          /* by-day lookup, so opening a day costs one indexed read rather
             than a scan of every photo ever taken */
          s.createIndex('day', 'day', { unique: false });
        }
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror   = () => reject(req.error);
    });
    /* Don't cache a rejected open — private mode or a blocked upgrade
       should be retried rather than remembered as permanently broken. */
    dbp.catch(() => { dbp = null; });
    return dbp;
  }

  function withStore(mode, fn) {
    return open().then((db) => new Promise((resolve, reject) => {
      const t = db.transaction(STORE, mode);
      let req;
      try { req = fn(t.objectStore(STORE)); }
      catch (e) { reject(e); return; }
      t.oncomplete = () => resolve(req ? req.result : undefined);
      t.onerror    = () => reject(t.error);
      t.onabort    = () => reject(t.error || new Error('transaction aborted'));
    }));
  }

  /* ── decode + shrink ──
     createImageBitmap is faster and avoids the Image/onload dance, but it
     refuses formats the browser can't decode (an iPhone library HEIC, for
     one), so it falls back rather than failing outright. */

  function decode(file) {
    if (window.createImageBitmap) {
      return createImageBitmap(file).catch(() => viaImg(file));
    }
    return viaImg(file);
  }

  function viaImg(file) {
    return new Promise((resolve, reject) => {
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload  = () => { URL.revokeObjectURL(url); resolve(img); };
      img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('unreadable')); };
      img.src = url;
    });
  }

  function shrink(file) {
    return decode(file).then((img) => {
      const w0 = img.width, h0 = img.height;
      if (!w0 || !h0) throw new Error('unreadable');

      const scale = Math.min(1, MAX_EDGE / Math.max(w0, h0));
      const w = Math.max(1, Math.round(w0 * scale));
      const h = Math.max(1, Math.round(h0 * scale));

      const c = document.createElement('canvas');
      c.width = w; c.height = h;
      c.getContext('2d').drawImage(img, 0, 0, w, h);
      if (img.close) img.close();          // release the ImageBitmap

      return new Promise((resolve, reject) => {
        c.toBlob(
          (blob) => blob ? resolve({ blob: blob, w: w, h: h }) : reject(new Error('encode failed')),
          'image/jpeg', QUALITY
        );
      });
    });
  }

  /* ── warm cache ──
     renderToday() is synchronous and runs on a 30-second tick; IndexedDB is
     not synchronous. So a day's photos are read once, up front, into memory,
     and the render only ever reads from here. */

  const cache = new Map();   // id → row

  function warm(day) {
    return withStore('readonly', (s) => s.index('day').getAll(day))
      .then((rows) => {
        (rows || []).forEach((r) => cache.set(r.id, r));
        return (rows || []).length;
      })
      .catch(() => 0);       // no photos is a perfectly good answer
  }

  const peek = (day, block) => cache.get(id(day, block)) || null;
  const has  = (day, block) => cache.has(id(day, block));

  /* ── object URLs ──
     Created once per photo and reused. renderToday() rebuilds the whole
     timeline with innerHTML every 30 seconds, so minting a fresh URL each
     render would leak a blob handle on every tick, forever. */

  const urls = new Map();    // id → object URL

  function url(day, block) {
    const k = id(day, block);
    if (urls.has(k)) return urls.get(k);
    const row = cache.get(k);
    if (!row || !row.blob) return null;
    const u = URL.createObjectURL(row.blob);
    urls.set(k, u);
    return u;
  }

  function drop(k) {
    if (!urls.has(k)) return;
    URL.revokeObjectURL(urls.get(k));
    urls.delete(k);
  }

  /* Release everything outside the days still on screen — both the URL
     handles and the decoded rows, since those hold Blobs. Without this,
     paging back through a month accumulates every photo it passed. Takes a
     list because the Habits tab always shows today while the timeline may
     be showing some other day. */
  function releaseExcept(keepDays) {
    const keep = {};
    (Array.isArray(keepDays) ? keepDays : [keepDays]).forEach((d) => { keep[d] = true; });
    const dayOf = (k) => k.slice(0, k.indexOf(':'));

    const staleUrls = [];
    urls.forEach((_, k) => { if (!keep[dayOf(k)]) staleUrls.push(k); });
    staleUrls.forEach(drop);

    const staleRows = [];
    cache.forEach((_, k) => { if (!keep[dayOf(k)]) staleRows.push(k); });
    staleRows.forEach((k) => cache.delete(k));
  }

  const liveURLs = () => urls.size;   // for the leak check in the test suite

  /* ── the operations ── */

  function put(day, block, file) {
    return shrink(file).then((out) => {
      const row = {
        id: id(day, block), day: day, block: block,
        blob: out.blob, w: out.w, h: out.h, at: Date.now(),
      };
      return withStore('readwrite', (s) => s.put(row)).then(() => {
        cache.set(row.id, row);
        drop(row.id);                 // a retake must not show the old shot
        return row;
      });
    });
  }

  function del(day, block) {
    const k = id(day, block);
    return withStore('readwrite', (s) => s.delete(k)).then(() => {
      cache.delete(k);
      drop(k);
    });
  }

  /* Which days hold at least one photo — so the date arrows can hint at
     where there is something to go back to. */
  function days() {
    return withStore('readonly', (s) => s.getAllKeys())
      .then((keys) => {
        const out = {};
        (keys || []).forEach((k) => { out[String(k).split(':')[0]] = true; });
        return Object.keys(out).sort();
      })
      .catch(() => []);
  }

  /* Ask the OS to treat this as worth keeping rather than evictable cache.
     Best-effort: it is fine for this to be refused. */
  function persist() {
    if (navigator.storage && navigator.storage.persist) {
      navigator.storage.persist().catch(() => {});
    }
  }

  const supported = (function () {
    try { return !!window.indexedDB; } catch (e) { return false; }
  })();

  return {
    supported: supported,
    warm: warm, peek: peek, has: has, url: url,
    put: put, del: del, days: days,
    releaseExcept: releaseExcept, liveURLs: liveURLs,
    persist: persist,
    MAX_EDGE: MAX_EDGE,
  };
})();
