/* ═══════════════════════════════════════════════════════════════
   THE WORKER

   ONE ROUTE THAT IS NOT ABOUT A PERSON, AND ONE THAT CANNOT READ WHAT
   IT HOLDS (the vault, below). This was the whole server
   for the friends half of the schedule app — records, avatars, a
   write key hashed so a dump of the store could not post as anybody.
   Friends went, and all of it went with them: there is no `rec`, no
   `claim`, no `img`, no key and no KV entry keyed by a person.

   What is left is the reason the worker survived at all. The app can
   name a podcast SHOW from Apple's own search, in the browser; which
   EPISODE is in that show's RSS feed, and a feed is XML served by
   whoever hosts the podcast, almost never with a CORS header. A
   browser cannot read one. So a numeric show id goes out and a
   handful of parsed fields come back, and nothing in the request says
   who asked.

   AND ONE ROUTE THAT HOLDS WHAT IT CANNOT READ: the sync vault. See
   VAULT below — the app encrypts its whole record on the device with a
   key derived from a sync code, and this worker stores the ciphertext
   under an id derived from the same code. There is still no account,
   no email and no name, and nothing here could decrypt what it holds.

   AND REMINDERS, WHICH IT SENDS WITHOUT READING. See PUSH below — a
   phone hands over the times its blocks start and, for each, a message
   already encrypted to that phone's own push keys. At the minute, this
   worker posts the sealed message to Apple or Google and forgets it.

   ── storage ──
   One KV namespace, holding parsed feeds under `pod:<id>` with a six
   hour TTL, sealed vaults under `vault:<id>`, push queues under
   `push:<id>` with their next-due times in `push:ix`, and this
   worker's own push signing key under `push:vapid`. Records written by the friends half are
   not read by anything here any more; every one of them carried a
   thirty-day expiry from the day it was written, so they age out on
   their own rather than being walked and deleted.
   ═══════════════════════════════════════════════════════════════ */

/* Only the app's own origin, plus a loopback for working on it. A
   worker that answers `*` is a public API somebody else can build on,
   and this one is holding photographs.

   THE LOOPBACK RULE IS A PATTERN, NOT A LIST. It named two ports and
   the app's own test suite could not talk to it: the suite finds a
   FREE port at run time, so it is never on any list written in
   advance, and the failure was a CORS rejection that surfaced as
   "could not reach that address". A local port number is not a
   security boundary — anything on the machine can open any port — so
   pinning three of them bought nothing and cost the only automated
   thing that exercises this file end to end. */
const ORIGIN = 'https://niko-999.github.io';
const LOOPBACK = /^http:\/\/(127\.0\.0\.1|localhost|\[::1\])(:\d+)?$/;

function allowed(o) { return o === ORIGIN || LOOPBACK.test(o); }

function cors(req) {
  const o = req.headers.get('Origin') || '';
  const allow = allowed(o) ? o : ORIGIN;
  return {
    'Access-Control-Allow-Origin': allow,
    'Access-Control-Allow-Methods': 'GET,PUT,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin',
  };
}

const json = (req, body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...cors(req) },
  });

/* ══════════════════════════════════════════════════════
   READING A PODCAST FEED

   Everything below is deliberately dependency-free and runs unchanged
   in Node, because the suite executes this file there. */

const VAULT_BYTES = 2 * 1024 * 1024;   /* ciphertext, base64 */
const PIC_BYTES = 1536 * 1024;        /* one sealed picture, base64: a 1280px JPEG with room */
const PIC_MAX = 400;                 /* pictures one vault may hold */

/* ══════════════════════════════════════════════════════
   PUSH

   iOS will not let a web page schedule its own notification, so a
   reminder has to come from a server at the minute. What this worker
   is given is the least that can do that: WHEN, and a message already
   sealed on the phone with the phone's own push keys (RFC 8291), so the
   words — a block's name, its time — are ciphertext here exactly as a
   vault is. What it cannot help learning is the times themselves.

   ── THE ENDPOINT IS A LIST OF PUSH SERVICES, NEVER ANY URL ──
   A subscription is a URL the phone hands over and this worker POSTs
   to later, which is an SSRF the moment it is anything but a push
   service. Apple, Google, Mozilla and Windows, by host, over https. */
const PUSH_HOST = /^(web\.push\.apple\.com|fcm\.googleapis\.com|updates\.push\.services\.mozilla\.com|[a-z0-9-]+\.notify\.windows\.com)$/;
const PUSH_MAX = 400;          /* two weeks of a busy schedule, a start and a "did you do it?" for each */
const PUSH_BODY = 1024;        /* one sealed message, base64; a real one is ~250 */
const PUSH_AHEAD = 16 * 864e5; /* the phone queues fourteen days */
const PUSH_STALE = 10 * 60e3;  /* a reminder more than ten minutes late is dropped, not sent */

function pushOk(u) {
  let x; try { x = new URL(u); } catch (e) { return false; }
  return x.protocol === 'https:' && !x.port && PUSH_HOST.test(x.hostname);
}
const b64u = (u8) => btoa(String.fromCharCode.apply(null, u8)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
function unb64(t) {
  const s = atob(t.replace(/-/g, '+').replace(/_/g, '/')), u = new Uint8Array(s.length);
  for (let i = 0; i < s.length; i++) u[i] = s.charCodeAt(i);
  return u;
}

/* SEALING HERE, for the one push this worker writes itself: a friend's
   reaction, which only exists on the server, so there is nothing for a
   phone to seal in advance. RFC 8291, aes128gcm — the same envelope the
   phones use for their own queues. */
async function hkdf(salt, ikm, info, len) {
  const k = await crypto.subtle.importKey('raw', ikm, 'HKDF', false, ['deriveBits']);
  return new Uint8Array(await crypto.subtle.deriveBits({ name: 'HKDF', hash: 'SHA-256', salt, info }, k, len * 8));
}
function cat(...a) { const n = a.reduce((x, y) => x + y.length, 0), o = new Uint8Array(n); let at = 0; for (const x of a) { o.set(x, at); at += x.length; } return o; }
async function pushSeal(pk, au, obj) {
  const te = new TextEncoder(), ua = unb64(pk), auth = unb64(au), salt = crypto.getRandomValues(new Uint8Array(16));
  const kp = await crypto.subtle.generateKey({ name: 'ECDH', namedCurve: 'P-256' }, true, ['deriveBits']);
  const asPub = new Uint8Array(await crypto.subtle.exportKey('raw', kp.publicKey));
  const uaKey = await crypto.subtle.importKey('raw', ua, { name: 'ECDH', namedCurve: 'P-256' }, false, []);
  const ecdh = new Uint8Array(await crypto.subtle.deriveBits({ name: 'ECDH', public: uaKey }, kp.privateKey, 256));
  const ikm = await hkdf(auth, ecdh, cat(te.encode('WebPush: info\x00'), ua, asPub), 32);
  const cek = await hkdf(salt, ikm, te.encode('Content-Encoding: aes128gcm\x00'), 16), nonce = await hkdf(salt, ikm, te.encode('Content-Encoding: nonce\x00'), 12);
  const k = await crypto.subtle.importKey('raw', cek, 'AES-GCM', false, ['encrypt']);
  const ct = new Uint8Array(await crypto.subtle.encrypt({ name: 'AES-GCM', iv: nonce }, k, cat(te.encode(JSON.stringify(obj)), new Uint8Array([2]))));
  return cat(salt, new Uint8Array([0, 0, 16, 0, 65]), asPub, ct);
}

/* THE SIGNING KEY IS MADE HERE AND NEVER LEAVES KV. A VAPID key the
   push services check a sender against has to be a secret somewhere,
   and the repository is public — so rather than a key somebody has to
   paste into a dashboard, the worker mints its own the first time it is
   asked and keeps it. Only the public half is ever sent. */
async function vapid(env) {
  const hit = await env.SCHED.get('push:vapid');
  if (hit) {
    const v = JSON.parse(hit);
    const priv = await crypto.subtle.importKey('jwk', v.jwk, { name: 'ECDSA', namedCurve: 'P-256' }, false, ['sign']);
    return { pub: v.pub, priv };
  }
  const kp = await crypto.subtle.generateKey({ name: 'ECDSA', namedCurve: 'P-256' }, true, ['sign', 'verify']);
  const pub = b64u(new Uint8Array(await crypto.subtle.exportKey('raw', kp.publicKey)));
  const jwk = await crypto.subtle.exportKey('jwk', kp.privateKey);
  await env.SCHED.put('push:vapid', JSON.stringify({ pub, jwk }));
  return { pub, priv: kp.privateKey };
}

/* RFC 8292. WebCrypto signs ECDSA in the raw r||s form a JWT wants, so
   there is nothing to convert. */
async function vapidAuth(env, endpoint, now) {
  const v = await vapid(env);
  const enc = (o) => b64u(new TextEncoder().encode(JSON.stringify(o)));
  const head = enc({ typ: 'JWT', alg: 'ES256' });
  const body = enc({ aud: new URL(endpoint).origin, exp: Math.floor(now / 1000) + 12 * 3600, sub: 'https://niko-999.github.io/cadence/' });
  const sig = new Uint8Array(await crypto.subtle.sign({ name: 'ECDSA', hash: 'SHA-256' }, v.priv, new TextEncoder().encode(head + '.' + body)));
  return 'vapid t=' + head + '.' + body + '.' + b64u(sig) + ', k=' + v.pub;
}

async function pushIndex(env) {
  const t = await env.SCHED.get('push:ix');
  let o; try { o = JSON.parse(t); } catch (e) { o = null; }
  return o && typeof o === 'object' ? o : {};
}

/* Every minute: read the index, and only the queues it says are due.
   One KV read a minute when nothing is, which is what keeps this inside
   the free tier with room to spare. */
async function pushTick(env, now) {
  const ix = await pushIndex(env);
  let ixDirty = false;
  for (const id of Object.keys(ix)) {
    if (!(ix[id] <= now)) continue;
    const raw = await env.SCHED.get('push:' + id);
    if (!raw) { delete ix[id]; ixDirty = true; continue; }
    const rec = JSON.parse(raw);
    const due = rec.q.filter((x) => x.t <= now), rest = rec.q.filter((x) => x.t > now);
    let gone = false;
    for (const x of due) {
      if (now - x.t > PUSH_STALE || gone) continue;
      try {
        const res = await fetch(rec.ep, {
          method: 'POST',
          headers: { TTL: '600', Urgency: 'high', 'Content-Encoding': 'aes128gcm', 'Content-Type': 'application/octet-stream', Authorization: await vapidAuth(env, rec.ep, now) },
          body: unb64(x.b),
        });
        /* The service saying the subscription is gone is the only
           signal this worker gets that a phone turned reminders off
           without telling it, so it is final. */
        if (res.status === 404 || res.status === 410) gone = true;
      } catch (e) {}
    }
    if (gone) { await env.SCHED.delete('push:' + id); delete ix[id]; ixDirty = true; continue; }
    rec.q = rest;
    await env.SCHED.put('push:' + id, JSON.stringify(rec));
    if (rest.length) ix[id] = rest[0].t; else delete ix[id];
    ixDirty = true;
  }
  if (ixDirty) await env.SCHED.put('push:ix', JSON.stringify(ix));
}

async function sha256hex(t) {
  const b = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(t));
  return Array.from(new Uint8Array(b), (x) => x.toString(16).padStart(2, '0')).join('');
}

const FEED_BYTES = 1024 * 1024;   /* a feed is text; a megabyte is hundreds of episodes */
const FEED_MS = 8000;
const EPISODES = 30;

/* Loopback, private and link-local, by name and by literal. Cloudflare
   will not route most of these anyway — this is the belt to that
   braces, and it is cheap. */
const PRIVATE = /^(localhost$|127\.|10\.|192\.168\.|169\.254\.|::1$|\[::1\]$|172\.(1[6-9]|2\d|3[01])\.|.*\.local$|.*\.internal$)/i;

function feedOk(u) {
  let x;
  try { x = new URL(u); } catch (e) { return null; }
  if (x.protocol !== 'https:') return null;
  if (PRIVATE.test(x.hostname)) return null;
  return x.toString();
}

/* Read a body with a hard ceiling rather than calling .text() and
   hoping. A feed that streams for ever would otherwise hold a request
   open until the platform kills it. */
async function readCapped(res, cap) {
  if (!res.body || !res.body.getReader) {
    const t = await res.text();
    return t.slice(0, cap);
  }
  const reader = res.body.getReader();
  const parts = [];
  let n = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    n += value.length;
    parts.push(value);
    if (n >= cap) { try { await reader.cancel(); } catch (e) {} break; }
  }
  let all = new Uint8Array(n);
  let at = 0;
  for (const part of parts) { all.set(part, at); at += part.length; }
  return new TextDecoder('utf-8', { fatal: false }).decode(all.slice(0, cap));
}

function withTimeout(u, ms) {
  const c = new AbortController();
  const t = setTimeout(() => c.abort(), ms);
  return fetch(u, { signal: c.signal, headers: { 'User-Agent': 'schedule/1.0' } })
    .finally(() => clearTimeout(t));
}

/* The few entities a feed title actually contains, and CDATA. Not a
   general XML unescaper: this text is put in a JSON string and then
   into textContent by the client, so it is never parsed as markup
   anywhere and the only job here is that it READS correctly. */
function unxml(t) {
  return String(t || '')
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&apos;/g, "'")
    .replace(/&#(\d+);/g, (m, d) => String.fromCharCode(+d))
    .replace(/&amp;/g, '&')
    .replace(/<[^>]*>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function tagOf(block, name) {
  const open = block.indexOf('<' + name);
  if (open < 0) return '';
  const gt = block.indexOf('>', open);
  if (gt < 0) return '';
  const close = block.indexOf('</' + name, gt);
  if (close < 0) return '';
  return unxml(block.slice(gt + 1, close));
}

/* "3723", "1:02:03" and "45:00" are all in the wild. */
function secs(t) {
  const v = String(t || '').trim();
  if (!v) return 0;
  if (/^\d+$/.test(v)) return Math.min(+v, 86400);
  const bits = v.split(':').map((x) => +x);
  if (bits.some((x) => !isFinite(x))) return 0;
  let n = 0;
  for (const b of bits) n = n * 60 + b;
  return Math.min(n, 86400);
}

/* A SCAN, not a regex over the whole document. `<item>([\s\S]*?)</item>`
   global is the obvious line and it is the one that goes quadratic on
   a malformed feed with an unclosed tag — this is somebody else's file
   and it is allowed to be broken. indexOf cannot backtrack. */
async function episodes(id) {
  let look;
  try {
    look = await withTimeout(
      'https://itunes.apple.com/lookup?entity=podcast&id=' + encodeURIComponent(id),
      FEED_MS);
  } catch (e) { return null; }
  if (!look.ok) return null;
  const meta = await look.json().catch(() => null);
  const show = meta && meta.results && meta.results[0];
  if (!show) return null;

  const feed = feedOk(show.feedUrl || '');
  const head = {
    show: String(show.collectionName || '').slice(0, 200),
    art: String(show.artworkUrl600 || show.artworkUrl100 || '').slice(0, 400),
    items: [],
  };
  if (!feed) return head;      /* the show is still an answer */

  let res;
  try { res = await withTimeout(feed, FEED_MS); } catch (e) { return head; }
  if (!res.ok) return head;
  let xml;
  try { xml = await readCapped(res, FEED_BYTES); } catch (e) { return head; }

  let at = 0;
  while (head.items.length < EPISODES) {
    const open = xml.indexOf('<item', at);
    if (open < 0) break;
    let close = xml.indexOf('</item>', open);
    if (close < 0) close = xml.length;       /* truncated by the cap */
    const block = xml.slice(open, close);
    at = close + 7;
    const t = tagOf(block, 'title');
    if (!t) continue;
    head.items.push({
      t: t.slice(0, 200),
      d: tagOf(block, 'pubDate').slice(0, 40),
      s: secs(tagOf(block, 'itunes:duration') || tagOf(block, 'duration')),
    });
  }
  return head;
}

/* ── LIFT FRIENDS ──
   COUNTS AND NOTHING ELSE. A name, how often you trained and how much,
   and a thirty-day strip of which days — never a weight, an exercise,
   a body weight or a note. Clamped rather than trusted, because the
   client is the one part of this anybody can replace; a field this
   build does not know is dropped. Sixty days without a write and the
   record ages out on its own, so an abandoned phone leaves nothing. */
const LIFT_TTL = 60 * 86400;
const LIFT_RX = ['🔥', '💪', '👏'];
const LIFT_MUS = ['Quads', 'Hamstrings', 'Glutes', 'Calves', 'Lower back', 'Abs', 'Chest', 'Back', 'Shoulders', 'Biceps', 'Triceps', 'Core', 'Arms', 'Legs', 'Cardio', 'Other'];
const LIFT_NUM = ['wo30', 'sets30', 'pr30', 'wk', 'goal', 'streak', 'cd7', 'rest30', 'tot'];
function liftClean(b) {
  if (!b || typeof b !== 'object' || !b.s || typeof b.s !== 'object') return null;
  const n = typeof b.n === 'string' ? b.n.replace(/[\u0000-\u001f]/g, '').trim().slice(0, 24) : '';
  const s = {};
  for (const k of LIFT_NUM) { const v = Math.round(+b.s[k]); s[k] = isFinite(v) ? Math.max(0, Math.min(100000, v)) : 0; }
  s.d = typeof b.s.d === 'string' && /^[01r]{30}$/.test(b.s.d) ? b.s.d : '0'.repeat(30);
  /* This week, by day, and by muscle against the sender's own targets:
     seven counts, and at most sixteen [muscle, sets, target] rows whose
     muscle is one the app knows. */
  const num = (v) => { v = Math.round(+v); return isFinite(v) ? Math.max(0, Math.min(1000, v)) : 0; };
  s.w7 = Array.isArray(b.s.w7) && b.s.w7.length === 7 ? b.s.w7.map(num) : [0, 0, 0, 0, 0, 0, 0];
  /* Volume is a TOTAL in kg — thirty days, and eight weekly figures —
     never a single lift, so a larger ceiling. */
  const big = (v) => { v = Math.round(+v); return isFinite(v) ? Math.max(0, Math.min(10000000, v)) : 0; };
  s.vol30 = big(b.s.vol30);
  s.v8 = Array.isArray(b.s.v8) && b.s.v8.length === 8 ? b.s.v8.map(big) : [0, 0, 0, 0, 0, 0, 0, 0];
  s.r7 = Array.isArray(b.s.r7) && b.s.r7.length === 7 ? b.s.r7.map((v) => { v = Math.round(+v); return isFinite(v) ? Math.max(0, Math.min(100000, v)) : 0; }) : [0, 0, 0, 0, 0, 0, 0];
  /* the three latest badges: an id the app knows the shape of, and a date */
  s.bg = Array.isArray(b.s.bg) ? b.s.bg.filter((x) => Array.isArray(x) && /^[a-z0-9]{2,8}$/.test(x[0]) && /^\d{4}-\d\d-\d\d$/.test(x[1])).slice(0, 3).map((x) => [x[0], x[1]]) : [];
  /* sets by muscle carry halves: a squat is half a glute set */
  const half = (v) => { v = Math.round(+v * 2) / 2; return isFinite(v) ? Math.max(0, Math.min(1000, v)) : 0; };
  s.mu = Array.isArray(b.s.mu) ? b.s.mu.filter((m) => Array.isArray(m) && LIFT_MUS.includes(m[0])).slice(0, 16).map((m) => [m[0], half(m[1]), num(m[2])]) : [];
  /* THE TREND SHEETS: eight weeks and four windows, each [workouts, sets,
     reps, kg], the Monday they count from, and the heaviest set of the
     month. Totals and one weight — nothing that names a lift. */
  const q4 = (a) => Array.isArray(a) && a.length === 4 ? [num(a[0]), Math.min(100000, Math.max(0, Math.round(+a[1]) || 0)), Math.min(1000000, Math.max(0, Math.round(+a[2]) || 0)), big(a[3])] : [0, 0, 0, 0];
  const tr = b.s.tr;
  if (tr && typeof tr === 'object' && Array.isArray(tr.w8) && tr.w8.length === 8) {
    const hv = Math.round(+tr.hv * 10) / 10;
    s.tr = { m: typeof tr.m === 'string' && /^\d{4}-\d\d-\d\d$/.test(tr.m) ? tr.m : '', w8: tr.w8.map(q4), c30: q4(tr.c30), p30: q4(tr.p30), cw: q4(tr.cw), pw: q4(tr.pw), hv: isFinite(hv) ? Math.max(0, Math.min(2000, hv)) : 0 };
  }
  /* the accent they chose, a hue on the wheel, or none for lime */
  if (Number.isInteger(b.s.ac) && ((b.s.ac >= 0 && b.s.ac < 360) || (b.s.ac >= 1000 && b.s.ac < 1040) || (b.s.ac >= 1200 && b.s.ac < 1240) || b.s.ac === 1299)) s.ac = b.s.ac; /* a hue, a neutral (1000 up), or an earned colour (1200 up, the owner's 1299) */
  /* training now: when the workout in progress started, a time in ms */
  if (Number.isInteger(b.s.lv) && b.s.lv > 1e12 && b.s.lv < 1e14) s.lv = b.s.lv;
  s.last = typeof b.s.last === 'string' && /^\d{4}-\d\d-\d\d$/.test(b.s.last) ? b.s.last : '';
  /* THE WORKOUTS THEMSELVES, asked for so friends can see the sets: at
     most twenty, each a date, a name and up to fifteen exercises of up
     to twenty [kg, reps] sets. Names are cut, numbers clamped, and
     nothing else on a workout survives. Never body weight. */
  const txt = (v, n) => typeof v === 'string' ? v.replace(/[\u0000-\u001f]/g, '').trim().slice(0, n) : '';
  s.wl = Array.isArray(b.s.wl) ? b.s.wl.filter((w) => w && typeof w.d === 'string' && /^\d{4}-\d\d-\d\d$/.test(w.d) && Array.isArray(w.x)).slice(0, 20).map((w) => ({
    d: w.d, n: txt(w.n, 40) || 'Workout', id: typeof w.id === 'string' && /^[A-Za-z0-9_-]{1,24}$/.test(w.id) ? w.id : '',
    /* the time it started, as minutes into the day, when the phone knew */
    ...(Number.isInteger(w.t) && w.t >= 0 && w.t < 1440 ? { t: w.t } : {}),
    x: w.x.filter((e) => e && Array.isArray(e.s)).slice(0, 15).map((e) => ({
      n: txt(e.n, 60) || 'Exercise',
      s: e.s.filter(Array.isArray).slice(0, 20).map((st) => { const kg = Math.round(+st[0] * 10) / 10, rp = Math.round(+st[1]); return [isFinite(kg) ? Math.max(0, Math.min(2000, kg)) : 0, isFinite(rp) ? Math.max(0, Math.min(1000, rp)) : 0]; })
    }))
  })) : [];
  return { n: n || 'Lifter', s };
}

export default {
  async fetch(req, env) {
    if (req.method === 'OPTIONS') return new Response(null, { headers: cors(req) });

    const url = new URL(req.url);
    const p = url.pathname.replace(/\/+$/, '');

    /* ══════════════════════════════════════════════════════
       EPISODES

       The one route here that is not about a person. The app can
       already name a podcast SHOW — the iTunes search gives that
       straight to the client — but which EPISODE is in the show's RSS
       feed, and a feed is XML served by whoever hosts the podcast,
       almost never with a CORS header. A browser cannot read it. That
       is the whole reason this endpoint exists.

       ── THE CALLER NEVER SUPPLIES A URL, AND THAT IS THE DESIGN ──
       The obvious shape is `/feed?url=…`, and it is an open proxy:
       anything on the internet, fetched by this worker, reflected to
       whoever asked. Point it at a metadata address or an internal
       host and it is an SSRF; point it at anything large and it is
       somebody else's bandwidth bill on your account.

       So the caller sends a NUMERIC ID and nothing else. The feed
       address comes from Apple's own lookup, not from the request.
       That does not make the URL trusted — anyone can submit a
       podcast with a feed pointing anywhere — so it is still checked:
       https only, and no loopback, private or link-local host. Two
       gates, and the first one removes the whole class.

       ── AND NOTHING IS REFLECTED ──
       The body is never passed through. What comes back is a handful
       of parsed fields, each truncated, so this cannot be used to
       fetch arbitrary content and read it back out. An open proxy
       that only ever returns thirty short strings is not one.

       ── PARSED BY HAND, AND NOT WITH HTMLRewriter ──
       HTMLRewriter is the idiomatic Cloudflare answer and it is
       exactly the wrong one here: it does not exist in Node, and
       `tests/worker.js` runs THIS FILE in Node against a Map. Reaching
       for it would trade every automated check on the worker for a
       nicer parser. A bounded scan works identically in both. */
    const pod = p.match(/^\/v1\/pod\/(\d{1,12})$/);
    if (pod && req.method === 'GET') {
      const id = pod[1];

      /* A feed is a file somebody publishes a few times a week and
         this app asks for it every time you open a show. Cached for
         six hours, which is far inside "the newest episode is there"
         and takes the repeat cost off both this worker and whoever
         hosts the podcast. */
      const ck = 'pod:' + id;
      const hit = await env.SCHED.get(ck);
      if (hit) return json(req, JSON.parse(hit));

      const out = await episodes(id);
      if (!out) return json(req, { error: 'no such show' }, 404);
      await env.SCHED.put(ck, JSON.stringify(out), { expirationTtl: 21600 });
      return json(req, out);
    }

    /* ══════════════════════════════════════════════════════
       VAULT

       One person's whole Cadence record, SEALED ON THEIR DEVICE. The
       app derives three things from a sync code it shows you once —
       an AES key, this id, and a write token — and only the id and the
       token ever arrive here. The key never does, so what is stored is
       ciphertext this worker has no way to open, and a dump of the KV
       is a dump of noise.

       ── THE ID IS NOT A SECRET, THE TOKEN IS ──
       Anybody who guesses an id can read a blob they cannot decrypt.
       Writing is the dangerous half, because an overwrite destroys a
       record — so a write must carry the token, and the token is kept
       only as its SHA-256. The friends server's own rule, for the
       friends server's own reason: a dump of the store cannot be used
       to write as anybody.

       ── A WRITE NAMES THE REVISION IT WAS BUILT ON ──
       Two devices editing is the one race this has, and last-writer-
       wins would silently throw one device's day away. A PUT carries
       `base`; if the vault has moved past it the answer is 409 with
       the current revision, and the app merges and tries again. KV is
       eventually consistent, so this is a guard rather than a lock —
       for one person on two devices it is the right size.

       ── CAPPED, BECAUSE THE WORKER IS PUBLIC ──
       The route is reachable by anyone, so what one write can put here
       is bounded: 2 MB of ciphertext is years of a daily record and
       nowhere near a bill. */
    /* ── A PICTURE IN A NOTE IS SEALED ON ITS OWN ──
       The record names a picture by key; the picture itself would take
       the 2 MB record past its cap in a dozen photographs, and every
       pull would carry all of them. So each is its own sealed blob under
       the vault, read by the same id and written with the same token,
       and a device fetches only the ones it does not have. A picture
       cannot be written to a vault that does not exist — the token is
       only checkable against a vault's own hash — and the vault keeps an
       index of its pictures so deleting it takes every one with it. */
    const vpic = p.match(/^\/v1\/vault\/([0-9a-f]{32})\/p\/(p[0-9a-z]{2,40})$/);
    if (vpic) {
      const pk = 'vpic:' + vpic[1] + ':' + vpic[2], ixk = 'vpix:' + vpic[1];
      if (req.method === 'GET') {
        const cur = await env.SCHED.get(pk);
        if (!cur) return json(req, { error: 'no such picture' }, 404);
        return json(req, JSON.parse(cur));
      }
      const auth = (req.headers.get('Authorization') || '').replace(/^Bearer\s+/, '');
      if (!/^[0-9a-f]{32}$/.test(auth)) return json(req, { error: 'no token' }, 401);
      const vcur = await env.SCHED.get('vault:' + vpic[1]);
      if (!vcur) return json(req, { error: 'no such vault' }, 404);
      if (JSON.parse(vcur).wh !== await sha256hex(auth)) return json(req, { error: 'wrong token' }, 403);
      const ix = JSON.parse((await env.SCHED.get(ixk)) || '[]');
      if (req.method === 'DELETE') {
        await env.SCHED.delete(pk);
        const at = ix.indexOf(vpic[2]);
        if (at >= 0) { ix.splice(at, 1); await env.SCHED.put(ixk, JSON.stringify(ix)); }
        return json(req, { ok: true });
      }
      if (req.method === 'PUT') {
        let body;
        try { body = JSON.parse(await readCapped({ body: req.body, text: () => req.text() }, PIC_BYTES + 256)); }
        catch (e) { return json(req, { error: 'not json' }, 400); }
        if (!body || typeof body.ct !== 'string' || typeof body.iv !== 'string') return json(req, { error: 'bad shape' }, 400);
        if (body.ct.length > PIC_BYTES || body.iv.length > 64) return json(req, { error: 'too large' }, 413);
        if (ix.indexOf(vpic[2]) < 0) {
          if (ix.length >= PIC_MAX) return json(req, { error: 'too many' }, 413);
          ix.push(vpic[2]); await env.SCHED.put(ixk, JSON.stringify(ix));
        }
        await env.SCHED.put(pk, JSON.stringify({ iv: body.iv, ct: body.ct }));
        return json(req, { ok: true });
      }
    }
    const vault = p.match(/^\/v1\/vault\/([0-9a-f]{32})$/);
    if (vault) {
      const vk = 'vault:' + vault[1];
      const auth = (req.headers.get('Authorization') || '').replace(/^Bearer\s+/, '');
      const cur = await env.SCHED.get(vk);
      const rec = cur ? JSON.parse(cur) : null;

      if (req.method === 'GET') {
        if (!rec) return json(req, { error: 'no such vault' }, 404);
        return json(req, { rev: rec.rev, iv: rec.iv, ct: rec.ct, at: rec.at });
      }

      if (!/^[0-9a-f]{32}$/.test(auth)) return json(req, { error: 'no token' }, 401);
      const wh = await sha256hex(auth);
      if (rec && rec.wh !== wh) return json(req, { error: 'wrong token' }, 403);

      if (req.method === 'DELETE') {
        if (rec) await env.SCHED.delete(vk);
        const ix = JSON.parse((await env.SCHED.get('vpix:' + vault[1])) || '[]');
        for (const k of ix) await env.SCHED.delete('vpic:' + vault[1] + ':' + k);
        await env.SCHED.delete('vpix:' + vault[1]);
        return json(req, { ok: true });
      }

      if (req.method === 'PUT') {
        let body;
        try { body = JSON.parse(await readCapped({ body: req.body, text: () => req.text() }, VAULT_BYTES + 1)); }
        catch (e) { return json(req, { error: 'not json' }, 400); }
        if (!body || typeof body.ct !== 'string' || typeof body.iv !== 'string') return json(req, { error: 'bad shape' }, 400);
        if (body.ct.length > VAULT_BYTES || body.iv.length > 64) return json(req, { error: 'too large' }, 413);
        const base = rec ? rec.rev : 0;
        if ((body.base | 0) !== base) return json(req, { error: 'moved', rev: base }, 409);
        const next = { rev: base + 1, iv: body.iv, ct: body.ct, at: Date.now(), wh };
        await env.SCHED.put(vk, JSON.stringify(next));
        return json(req, { rev: next.rev, at: next.at });
      }
    }

    /* ══════════════════════════════════════════════════════
       PUSH — see the block above VAULT_BYTES for what this holds and
       why it cannot read it. The key is public; a queue is written by
       whoever holds its token, and the token is kept as its hash. */
    if (p === '/v1/push/key' && req.method === 'GET') {
      const v = await vapid(env);
      return json(req, { key: v.pub });
    }
    const push = p.match(/^\/v1\/push\/([0-9a-f]{32})$/);
    if (push) {
      const pk = 'push:' + push[1];
      const auth = (req.headers.get('Authorization') || '').replace(/^Bearer\s+/, '');
      if (!/^[0-9a-f]{32}$/.test(auth)) return json(req, { error: 'no token' }, 401);
      const wh = await sha256hex(auth);
      const cur = await env.SCHED.get(pk);
      const rec = cur ? JSON.parse(cur) : null;
      if (rec && rec.wh !== wh) return json(req, { error: 'wrong token' }, 403);
      const ix = await pushIndex(env);

      if (req.method === 'DELETE') {
        if (rec) await env.SCHED.delete(pk);
        if (push[1] in ix) { delete ix[push[1]]; await env.SCHED.put('push:ix', JSON.stringify(ix)); }
        return json(req, { ok: true });
      }

      if (req.method === 'PUT') {
        let body;
        try { body = JSON.parse(await readCapped({ body: req.body, text: () => req.text() }, PUSH_MAX * (PUSH_BODY + 64) + 4096)); }
        catch (e) { return json(req, { error: 'not json' }, 400); }
        if (!body || typeof body.ep !== 'string' || !Array.isArray(body.q)) return json(req, { error: 'bad shape' }, 400);
        if (!pushOk(body.ep)) return json(req, { error: 'not a push service' }, 400);
        if (body.q.length > PUSH_MAX) return json(req, { error: 'too many' }, 413);
        const now = Date.now();
        const q = [];
        for (const x of body.q) {
          if (!x || typeof x.b !== 'string' || x.b.length > PUSH_BODY || !/^[A-Za-z0-9_-]+$/.test(x.b)) return json(req, { error: 'bad reminder' }, 400);
          const t = Math.round(+x.t);
          if (!(t > now - 60e3 && t < now + PUSH_AHEAD)) continue;
          q.push({ t, b: x.b });
        }
        q.sort((a, b) => a.t - b.t);
        await env.SCHED.put(pk, JSON.stringify({ wh, ep: body.ep, q }));
        if (q.length) ix[push[1]] = q[0].t; else delete ix[push[1]];
        await env.SCHED.put('push:ix', JSON.stringify(ix));
        return json(req, { ok: true, n: q.length });
      }
    }

    /* ══════════════════════════════════════════════════════
       LIFT FRIENDS — see liftClean for the whole of what one can hold.
       A code reads; a key writes, kept only as its hash, so a dump of
       the store cannot post as anybody. The friend LIST lives on each
       phone: there is no route that says who follows whom. */
    /* REACTIONS: a friend's 🔥, 💪 or 👏 on one of your workouts. The
       one who reacts proves who they are with THEIR OWN key, so nobody
       can react as somebody else; pressing the same one again takes it
       back. Kept beside the record, newest 200, for thirty days. */
    const lr = p.match(/^\/v1\/lift\/([A-HJ-NP-Z2-9]{8})\/react$/);
    if (lr && req.method === 'PUT') {
      const auth = (req.headers.get('Authorization') || '').replace(/^Bearer\s+/, '');
      if (!/^[0-9a-f]{32}$/.test(auth)) return json(req, { error: 'no key' }, 401);
      let body;
      try { body = JSON.parse(await readCapped({ body: req.body, text: () => req.text() }, 1024)); }
      catch (e) { return json(req, { error: 'not json' }, 400); }
      if (!body || !/^[A-HJ-NP-Z2-9]{8}$/.test(body.f || '') || !/^[A-Za-z0-9_-]{1,24}$/.test(body.w || '') || LIFT_RX.indexOf(body.e) < 0) return json(req, { error: 'bad shape' }, 400);
      const me = JSON.parse((await env.SCHED.get('lift:' + body.f)) || 'null');
      if (!me || me.kh !== await sha256hex(auth)) return json(req, { error: 'wrong key' }, 403);
      const them = JSON.parse((await env.SCHED.get('lift:' + lr[1])) || 'null');
      if (!them) return json(req, { error: 'nobody has that code' }, 404);
      const rk = 'liftr:' + lr[1];
      let rx = JSON.parse((await env.SCHED.get(rk)) || '[]');
      const had = rx.some((x) => x.f === body.f && x.w === body.w && x.e === body.e);
      rx = rx.filter((x) => !(x.f === body.f && x.w === body.w && x.e === body.e));
      if (!had) rx.unshift({ f: body.f, n: me.n, w: body.w, e: body.e, at: Date.now() });
      rx = rx.slice(0, 200);
      await env.SCHED.put(rk, JSON.stringify(rx), { expirationTtl: 30 * 86400 });
      /* A NEW reaction tells its owner, once, if their phone asked to be
         told. Taking one back is silent. A push service saying the
         address is gone takes it off the record. */
      if (!had && them.pu) {
        const wo = ((them.s && them.s.wl) || []).filter((x) => x.id === body.w)[0];
        try {
          const bytes = await pushSeal(them.pu.pk, them.pu.au, { t: me.n + ' ' + body.e + ' your workout', b: wo ? wo.n : 'Open Lift to see it', g: 'lift-rx-' + body.w });
          const res = await fetch(them.pu.ep, { method: 'POST', headers: { TTL: '86400', Urgency: 'normal', 'Content-Encoding': 'aes128gcm', 'Content-Type': 'application/octet-stream', Authorization: await vapidAuth(env, them.pu.ep, Date.now()) }, body: bytes });
          if (res.status === 404 || res.status === 410) { delete them.pu; await env.SCHED.put('lift:' + lr[1], JSON.stringify(them), { expirationTtl: LIFT_TTL }); }
        } catch (e) {}
      }
      return json(req, { ok: true, on: !had });
    }

    /* ADDING SOMEBODY ADDS YOU TO THEM: the code you added is told who you
       are, signed with YOUR key so nobody can add themselves as somebody
       else. It waits beside their record until their phone collects it —
       the list itself still lives only on each phone. Newest 200. */
    const lfo = p.match(/^\/v1\/lift\/([A-HJ-NP-Z2-9]{8})\/follow$/);
    if (lfo && req.method === 'PUT') {
      const auth = (req.headers.get('Authorization') || '').replace(/^Bearer\s+/, '');
      if (!/^[0-9a-f]{32}$/.test(auth)) return json(req, { error: 'no key' }, 401);
      let body;
      try { body = JSON.parse(await readCapped({ body: req.body, text: () => req.text() }, 512)); }
      catch (e) { return json(req, { error: 'not json' }, 400); }
      if (!body || !/^[A-HJ-NP-Z2-9]{8}$/.test(body.f || '') || body.f === lfo[1]) return json(req, { error: 'bad shape' }, 400);
      const me = JSON.parse((await env.SCHED.get('lift:' + body.f)) || 'null');
      if (!me || me.kh !== await sha256hex(auth)) return json(req, { error: 'wrong key' }, 403);
      const them = JSON.parse((await env.SCHED.get('lift:' + lfo[1])) || 'null');
      if (!them) return json(req, { error: 'nobody has that code' }, 404);
      const fk = 'liftf:' + lfo[1];
      let fo = JSON.parse((await env.SCHED.get(fk)) || '[]');
      const had = fo.some((x) => x.f === body.f);
      fo = [{ f: body.f, n: me.n, at: Date.now() }].concat(fo.filter((x) => x.f !== body.f)).slice(0, 200);
      await env.SCHED.put(fk, JSON.stringify(fo), { expirationTtl: LIFT_TTL });
      /* and their phone is told, once, if it asked to be */
      if (!had && them.pu) {
        try {
          const bytes = await pushSeal(them.pu.pk, them.pu.au, { t: me.n + ' added you on Lift', b: 'You are on each other\'s friends now', g: 'lift-fo-' + body.f });
          const res = await fetch(them.pu.ep, { method: 'POST', headers: { TTL: '86400', Urgency: 'normal', 'Content-Encoding': 'aes128gcm', 'Content-Type': 'application/octet-stream', Authorization: await vapidAuth(env, them.pu.ep, Date.now()) }, body: bytes });
          if (res.status === 404 || res.status === 410) { delete them.pu; await env.SCHED.put('lift:' + lfo[1], JSON.stringify(them), { expirationTtl: LIFT_TTL }); }
        } catch (e) {}
      }
      return json(req, { ok: true });
    }

    const lf = p.match(/^\/v1\/lift\/([A-HJ-NP-Z2-9]{8})$/);
    if (lf) {
      const lk = 'lift:' + lf[1];
      const cur = await env.SCHED.get(lk);
      const rec = cur ? JSON.parse(cur) : null;
      if (req.method === 'GET') {
        if (!rec) return json(req, { error: 'nobody has that code' }, 404);
        const rx = JSON.parse((await env.SCHED.get('liftr:' + lf[1])) || '[]');
        const fo = JSON.parse((await env.SCHED.get('liftf:' + lf[1])) || '[]');
        return json(req, { n: rec.n, s: rec.s, at: rec.at, rx, fo });
      }
      const auth = (req.headers.get('Authorization') || '').replace(/^Bearer\s+/, '');
      if (!/^[0-9a-f]{32}$/.test(auth)) return json(req, { error: 'no key' }, 401);
      const kh = await sha256hex(auth);
      if (rec && rec.kh !== kh) return json(req, { error: 'wrong key' }, 403);
      if (req.method === 'DELETE') {
        if (rec) { await env.SCHED.delete(lk); await env.SCHED.delete('liftr:' + lf[1]); await env.SCHED.delete('liftf:' + lf[1]); }
        return json(req, { ok: true });
      }
      if (req.method === 'PUT') {
        let body;
        try { body = JSON.parse(await readCapped({ body: req.body, text: () => req.text() }, 65536)); }
        catch (e) { return json(req, { error: 'not json' }, 400); }
        const clean = liftClean(body);
        if (!clean) return json(req, { error: 'bad shape' }, 400);
        const at = Date.now();
        /* WHERE TO TELL YOU a friend reacted: your phone's push address,
           kept on your record and never in what a read returns. */
        const pu = body.pu && typeof body.pu === 'object' && pushOk(body.pu.ep) && /^[A-Za-z0-9_-]{80,100}$/.test(body.pu.pk || '') && /^[A-Za-z0-9_-]{16,32}$/.test(body.pu.au || '')
          ? { ep: body.pu.ep, pk: body.pu.pk, au: body.pu.au } : null;
        await env.SCHED.put(lk, JSON.stringify(pu ? { kh, n: clean.n, s: clean.s, at, pu } : { kh, n: clean.n, s: clean.s, at }), { expirationTtl: LIFT_TTL });
        return json(req, { ok: true, at });
      }
    }

    return json(req, { error: 'no such thing' }, 404);
  },

  /* The minute timer. `scheduledTime` rather than Date.now(), so the
     suite can hand it a moment. */
  async scheduled(ev, env, ctx) {
    const t0 = (ev && ev.scheduledTime) || Date.now();
    /* FOUR TIMES A MINUTE, from a real cron only. A gym rest is two
       minutes, so a once-a-minute timer is up to half a rest late; the
       handler waits out the minute and ticks at :15, :30 and :45 too.
       Waiting is wall time, not CPU, and costs one KV read a tick. */
    const run = (async () => {
      await pushTick(env, t0);
      if (!(ev && ev.cron)) return;
      for (const sec of [15, 30, 45]) {
        const wait = t0 + sec * 1000 - Date.now();
        if (wait > 0) await new Promise((res) => setTimeout(res, wait));
        await pushTick(env, Date.now());
      }
    })();
    if (ctx && ctx.waitUntil) ctx.waitUntil(run);
    await run;
  },
};
