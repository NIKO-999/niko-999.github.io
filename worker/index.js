/* ═══════════════════════════════════════════════════════════════
   THE WORKER

   The whole server for the friends half of the schedule app. It is
   deliberately as close to nothing as it can be while still doing the
   job, because everything it knows is something the app used to keep
   on your phone.

   ── what it is NOT ──
   It has no accounts, no email, no password and no sessions. It cannot
   tell you who anyone is; it has never been told. It does not know who
   is friends with whom either — THE FRIEND LIST LIVES ON THE CLIENT.
   You store your friends' codes on your own phone and ask for each
   record by code. The server sees a stream of unrelated reads and has
   no graph to hand anybody.

   That last point is worth keeping if this is ever rewritten. A
   /friends endpoint that took your key and returned your people would
   be one line shorter and would put the entire social graph on
   somebody else's machine for no gain.

   ── identity ──
   Two strings, generated once by the client and never sent to a person:

     code   short, shareable, PUBLIC. Anyone with it can read your
            record. This is the thing you text to a friend.
     key    32 hex characters, secret, never leaves your phone except
            in the Authorization header. Only it can WRITE.

   Splitting them is the whole security model. With one string doing
   both jobs, handing somebody your code would hand them the ability to
   post as you.

   ── what a record holds ──
   Name, accent and ground hexes, an avatar id, thirty days of ticks,
   and log entries. That is everything the feed needs, which is what
   was asked for — and it is a long way past the "five bits a day" the
   ticks alone would have been. The app says so on the screen where you
   turn it on; this file is not the place that decision gets softened.

   ── storage ──
   One KV namespace. Records under `rec:<code>`, images under
   `img:<id>`, and a write-key hash under `key:<code>` so the key
   itself is never stored in a readable form.
   ═══════════════════════════════════════════════════════════════ */

const MAX_REC = 96 * 1024;      /* a record, JSON, without images      */
const MAX_IMG = 400 * 1024;     /* one picture, already cropped client-side */
const DAYS = 30;                /* the board's window, and the retention */

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
    'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type,Authorization',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin',
  };
}

const json = (req, body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...cors(req) },
  });

/* The key is compared by hash, so a dump of the store does not hand
   anybody the ability to write as everyone in it. */
async function hash(s) {
  const b = await crypto.subtle.digest('SHA-256',
    typeof s === 'string' ? new TextEncoder().encode(s) : s);
  return [...new Uint8Array(b)].map((x) => x.toString(16).padStart(2, '0')).join('');
}

/* Constant time, because a plain === on a secret leaks its prefix to
   anyone willing to time a few thousand requests. */
function same(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string' || a.length !== b.length) return false;
  let out = 0;
  for (let i = 0; i < a.length; i++) out |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return out === 0;
}

const CODE = /^[A-Z0-9]{4,12}$/;
const KEYRE = /^[a-f0-9]{32,64}$/;

async function auth(env, code, req) {
  const given = (req.headers.get('Authorization') || '').replace(/^Bearer\s+/i, '');
  if (!KEYRE.test(given)) return false;
  const want = await env.SCHED.get('key:' + code);
  if (!want) return false;
  return same(want, await hash(given));
}

/* Thirty days and no more. Retention is not a policy note here, it is
   the shape of the data: the board is a rolling thirty days, so a
   fortieth day is not something anyone is entitled to keep.

   The window runs from a day AHEAD of the server, and that day is
   load-bearing rather than slack. A worker runs on UTC; the client
   files a day under its OWN local date, which is what stops a tick
   taken at 9pm in London landing on yesterday. East of Greenwich those
   two disagree for part of every day — at 9am in Auckland the phone
   says the 2nd and the server still says the 1st — so a window that
   stopped at the server's today would silently drop the day the user
   is actually living in, on write, with a 200 back. Two days of slack
   covers every offset there is and costs two keys. */
/* The same window, as a set of the dates in it — the record's trim
   walks it to copy days across, and the health inbox walks its own
   keys to drop the ones that have fallen out. Written once because two
   copies of "which days count" is the pair that drifts. */
function window() {
  const keys = {};
  const now = new Date();
  for (let i = -2; i < DAYS; i++) {
    const d = new Date(now);
    d.setUTCDate(d.getUTCDate() - i);
    keys[d.getUTCFullYear() + '-'
      + String(d.getUTCMonth() + 1).padStart(2, '0') + '-'
      + String(d.getUTCDate()).padStart(2, '0')] = 1;
  }
  return keys;
}

/* The server's own date, for a POST that names none. */
function today() {
  const d = new Date();
  return d.getUTCFullYear() + '-'
    + String(d.getUTCMonth() + 1).padStart(2, '0') + '-'
    + String(d.getUTCDate()).padStart(2, '0');
}

function trim(rec) {
  const keep = {};
  const win = window();
  for (const k in win) {
    if (rec.days && rec.days[k]) keep[k] = rec.days[k];
  }
  rec.days = keep;
  if (Array.isArray(rec.logs)) rec.logs = rec.logs.slice(-60);
  return rec;
}

export default {
  async fetch(req, env) {
    if (req.method === 'OPTIONS') return new Response(null, { headers: cors(req) });

    const url = new URL(req.url);
    const p = url.pathname.replace(/\/+$/, '');

    /* One record route, three methods. It was written as two identical
       regexes under two names, which is a pair that drifts: widening
       the code alphabet in one of them leaves reads and writes
       disagreeing about what a code is. */
    const rec = p.match(/^\/v1\/rec\/([A-Z0-9]{4,12})$/);

    /* ── who am I ──
       The client generates its own code and key and simply claims the
       code. First come, first served: a code already taken is a
       collision, and the client retries with another rather than being
       handed somebody else's record.

       The check is a check and NOT a lock — KV has no compare-and-set,
       and it is eventually consistent, so two claims of the same code
       inside the same second could both read empty and the second would
       take the first one's record. What actually makes that not happen
       is the client drawing 8 characters from 36, which is 2.8e12
       codes; the guard here catches the birthday case and nothing more.
       Written down because "if (already taken) 409" reads like a lock
       and would be trusted as one by whoever changes this next. */
    if (p === '/v1/claim' && req.method === 'POST') {
      const body = await req.json().catch(() => null);
      if (!body || !CODE.test(body.code || '') || !KEYRE.test(body.key || ''))
        return json(req, { error: 'bad code or key' }, 400);
      if (await env.SCHED.get('key:' + body.code))
        return json(req, { error: 'taken' }, 409);
      await env.SCHED.put('key:' + body.code, await hash(body.key));
      await env.SCHED.put('rec:' + body.code,
        JSON.stringify({ code: body.code, days: {}, logs: [] }));
      return json(req, { ok: true });
    }

    /* ── read somebody, by code ──
       No key needed and none accepted. This is the endpoint a friend
       uses, and it is why the code is the thing you share. */
    if (rec && req.method === 'GET') {
      const got = await env.SCHED.get('rec:' + rec[1]);
      if (!got) return json(req, { error: 'no such code' }, 404);
      return json(req, JSON.parse(got));
    }

    /* ── write my own ──
       Whole record at a time. A per-tick endpoint would be tidier and
       would also spend one of the free tier's thousand daily writes on
       every glass of water. */
    if (rec && req.method === 'PUT') {
      const code = rec[1];
      if (!(await auth(env, code, req))) return json(req, { error: 'no' }, 401);
      const text = await req.text();
      if (text.length > MAX_REC) return json(req, { error: 'too big' }, 413);
      let body;
      try { body = JSON.parse(text); } catch (e) { return json(req, { error: 'bad json' }, 400); }
      if (!body || typeof body !== 'object' || Array.isArray(body))
        return json(req, { error: 'bad json' }, 400);
      body.code = code;
      await env.SCHED.put('rec:' + code, JSON.stringify(trim(body)));
      return json(req, { ok: true });
    }

    /* ══════════════════════════════════════════════════════════
       THE INBOX A SHORTCUT POSTS INTO

       A Garmin cannot talk to a web page, and Garmin's own Health API
       is a partner programme whose secret would have to live here — so
       the sanctioned automatic route is this server holding a
       credential that can read the whole account. It does not.

       Instead the phone does the reading. Garmin Connect writes steps
       and sleep into the phone's own health store; a Shortcut reads
       that store and POSTs the numbers here in the background, and the
       app collects them the next time it is opened. What crosses the
       wire is four numbers and a date.

       IT IS AN INBOX, NOT A RECORD. The app files what it finds through
       the same path a number you typed goes through, so the backfill
       window applies and nothing here can write further into the past
       than you can. That is why the read does not clear: a destructive
       read loses the morning if the app is opened and closed before it
       files, and writing the same value twice is a no-op anyway.

       THE KEY IS NEEDED TO READ, which /v1/rec does not require. That
       endpoint is the leaderboard and the code is the thing you share;
       how long you slept is not.
       ══════════════════════════════════════════════════════════ */
    const hl = p.match(/^\/v1\/health\/([A-Z0-9]{4,12})$/);

    /* A ceiling each, and they are the client's ceilings again rather
       than a second opinion: a Shortcut that hands over milliseconds of
       sleep instead of hours writes 27000000 into the record, and every
       figure drawn for the rest of the year is that one day. Checked
       here as well because a bad reading stored is a bad reading served
       to every future open, and the client that filters it is not the
       client that put it in. */
    const READING = { steps: 200000, sleep: 24, water: 30, fuel: 20000 };

    if (hl && req.method === 'POST') {
      const code = hl[1];
      if (!(await auth(env, code, req))) return json(req, { error: 'no' }, 401);
      const body = await req.json().catch(() => null);
      if (!body || typeof body !== 'object' || Array.isArray(body))
        return json(req, { error: 'bad json' }, 400);

      /* The DAY the Shortcut says, defaulting to the server's — and
         trimmed to the same window everything else here is, so the one
         thing a phone in another timezone cannot do is file outside it.
         The client's own backfill rule is stricter and is what actually
         decides; this only keeps the store from growing. */
      const on = /^\d{4}-\d{2}-\d{2}$/.test(body.on || '') ? body.on : today();
      const took = {};
      for (const k in READING) {
        if (!(k in body)) continue;
        const v = Number(body[k]);
        /* Dropped rather than clamped. A clamped 24 is a lie that looks
           like a reading; a missing day is what actually happened. */
        if (!isFinite(v) || v < 0 || v > READING[k]) continue;
        took[k] = v;
      }
      if (!Object.keys(took).length)
        return json(req, { error: 'no readings' }, 400);

      let box = {};
      try { box = JSON.parse((await env.SCHED.get('hl:' + code)) || '{}') || {}; }
      catch (e) { box = {}; }
      box[on] = { ...(box[on] || {}), ...took };
      const win = window();
      for (const d in box) if (!win[d]) delete box[d];
      await env.SCHED.put('hl:' + code, JSON.stringify(box),
        { expirationTtl: 60 * 60 * 24 * (DAYS + 2) });
      return json(req, { ok: true, on, took: Object.keys(took).length });
    }

    if (hl && req.method === 'GET') {
      const code = hl[1];
      if (!(await auth(env, code, req))) return json(req, { error: 'no' }, 401);
      const got = await env.SCHED.get('hl:' + code);
      return json(req, got ? JSON.parse(got) : {});
    }

    /* ── pictures ──
       The id is the hash of the BYTES, which is what makes the sentence
       "posting the same picture twice costs one entry" true. It was
       written over `Date.now()` first, which reads the same and dedupes
       nothing — the comment was the only place the intent existed and
       it did not match the line under it.

       Nothing about the id is guessable without the picture, and
       anybody holding the picture is not who the id protects it from.
       Putting a byte-identical image again is a no-op that also pushes
       the expiry out, which is right: it is still in use. */
    if (p === '/v1/img' && req.method === 'POST') {
      const code = url.searchParams.get('code') || '';
      if (!CODE.test(code) || !(await auth(env, code, req)))
        return json(req, { error: 'no' }, 401);
      const buf = await req.arrayBuffer();
      if (buf.byteLength > MAX_IMG) return json(req, { error: 'too big' }, 413);
      const id = (await hash(buf)).slice(0, 24);
      await env.SCHED.put('img:' + id, buf, { expirationTtl: 60 * 60 * 24 * (DAYS + 2) });
      return json(req, { id });
    }

    const img = p.match(/^\/v1\/img\/([a-f0-9]{24})$/);
    if (img && req.method === 'GET') {
      const b = await env.SCHED.get('img:' + img[1], 'arrayBuffer');
      if (!b) return new Response('gone', { status: 404, headers: cors(req) });
      return new Response(b, {
        headers: { 'Content-Type': 'image/jpeg',
                   'Cache-Control': 'public, max-age=86400', ...cors(req) },
      });
    }

    /* ── leaving ──
       Final and immediate, and it takes the key with it: the string on
       the leaver's phone stops opening anything, and the code goes back
       in the pool for whoever draws it next. Everything else in this
       app has a bin; this is somebody asking to be off a server.

       It does not chase the images, and that is not laziness: every
       one carries a TTL from the day it was written, so they age out on
       their own inside the retention window. Walking them would mean
       the record listing every id it ever posted, which is a list that
       exists for no other reason and survives exactly the request that
       was meant to end things. */
    if (rec && req.method === 'DELETE') {
      const code = rec[1];
      if (!(await auth(env, code, req))) return json(req, { error: 'no' }, 401);
      await env.SCHED.delete('rec:' + code);
      await env.SCHED.delete('key:' + code);
      return json(req, { ok: true });
    }

    return json(req, { error: 'no such thing' }, 404);
  },
};
