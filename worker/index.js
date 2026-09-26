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

    return json(req, { error: 'no such thing' }, 404);
  },

  /* The minute timer. `scheduledTime` rather than Date.now(), so the
     suite can hand it a moment. */
  async scheduled(ev, env, ctx) {
    const run = pushTick(env, (ev && ev.scheduledTime) || Date.now());
    if (ctx && ctx.waitUntil) ctx.waitUntil(run);
    await run;
  },
};
