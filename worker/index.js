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

   ── storage ──
   One KV namespace, holding parsed feeds under `pod:<id>` with a six
   hour TTL, and sealed vaults under `vault:<id>`. Records written by the friends half are
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

    return json(req, { error: 'no such thing' }, 404);
  },
};
