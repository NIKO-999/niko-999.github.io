/* ═══════════════════════════════════════════════════════════════
   THE WORKER — the friends half's server.

   Runs the real `worker/index.js` in this process against a Map
   standing in for KV. No browser, no network, no Cloudflare account:
   a Worker is a function from a Request to a Response, and Node has
   had Request, Response and crypto.subtle for years.

   That is the whole reason this file exists rather than a note saying
   "deployed, seems fine". The worker is the first thing in this repo
   that anybody's data leaves the phone for, and every check below is
   on something whose failure is SILENT — a day filed under the wrong
   date, a write accepted without a key, a picture id that dedupes
   nothing. None of those throw. Two of them were in the first draft.

   What is deliberately NOT here: latency, KV's eventual consistency,
   and the claim race that follows from it. A Map is strongly
   consistent, so a test built on one can only ever agree with the
   optimistic path. The worker says so where it matters and the real
   defence is the size of the code space, not the check.
   ═══════════════════════════════════════════════════════════════ */
const path = require('path');

let pass = 0, fail = 0;
const ok = (name, cond, extra) => {
  if (cond) { pass++; console.log('  ok  ' + name); }
  else { fail++; console.log('FAIL  ' + name + (extra ? '\n      ' + extra : '')); }
};

const ORIGIN = 'https://niko-999.github.io';
const KEY = 'a'.repeat(32);
const KEY2 = 'b'.repeat(32);

/* KV, near enough. get(k) returns text; get(k,'arrayBuffer') returns
   bytes; a missing key is null rather than a throw, which is the one
   behaviour the worker actually leans on. */
const kv = () => {
  const m = new Map();
  return {
    m,
    async get(k, type) {
      if (!m.has(k)) return null;
      const v = m.get(k);
      if (type === 'arrayBuffer') return v;
      return typeof v === 'string' ? v : new TextDecoder().decode(new Uint8Array(v));
    },
    async put(k, v) { m.set(k, v); },
    async delete(k) { m.delete(k); },
  };
};

const day = (off) => {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() + off);
  return d.getUTCFullYear() + '-' + String(d.getUTCMonth() + 1).padStart(2, '0')
    + '-' + String(d.getUTCDate()).padStart(2, '0');
};

(async () => {
  const worker = (await import(
    'file://' + path.resolve(__dirname, '..', 'worker', 'index.js'))).default;

  let env = { SCHED: kv() };
  const hit = (method, p, opts = {}) => worker.fetch(new Request('https://w.dev' + p, {
    method,
    headers: {
      Origin: opts.origin || ORIGIN,
      ...(opts.key ? { Authorization: 'Bearer ' + opts.key } : {}),
      ...(opts.body !== undefined && !(opts.body instanceof Uint8Array)
        ? { 'Content-Type': 'application/json' } : {}),
    },
    body: opts.body === undefined ? undefined
      : (opts.body instanceof Uint8Array ? opts.body : JSON.stringify(opts.body)),
  }), env);

  /* ── claiming a code ───────────────────────────────────────── */
  let r = await hit('POST', '/v1/claim', { body: { code: 'lower123', key: KEY } });
  ok('claim refuses a lowercase code', r.status === 400, 'got ' + r.status);
  r = await hit('POST', '/v1/claim', { body: { code: 'AB', key: KEY } });
  ok('claim refuses a two-character code', r.status === 400, 'got ' + r.status);
  r = await hit('POST', '/v1/claim', { body: { code: 'NIKO4821', key: 'short' } });
  ok('claim refuses a short key', r.status === 400, 'got ' + r.status);
  r = await hit('POST', '/v1/claim', { body: {} });
  ok('claim refuses an empty body', r.status === 400, 'got ' + r.status);

  r = await hit('POST', '/v1/claim', { body: { code: 'NIKO4821', key: KEY } });
  ok('claim takes a well-formed code', r.status === 200, 'got ' + r.status);

  /* The one thing a dump of the store must not hand over. */
  const stored = env.SCHED.m.get('key:NIKO4821');
  ok('the key is stored as a hash, not as itself',
    typeof stored === 'string' && stored !== KEY && stored.length === 64,
    JSON.stringify(stored));

  r = await hit('POST', '/v1/claim', { body: { code: 'NIKO4821', key: KEY2 } });
  ok('a claimed code cannot be claimed again', r.status === 409, 'got ' + r.status);
  ok('...and the second claim did not take the record',
    env.SCHED.m.get('key:NIKO4821') === stored);

  /* ── reading, by code, with no key ─────────────────────────── */
  r = await hit('GET', '/v1/rec/NOSUCH99');
  ok('an unclaimed code reads 404', r.status === 404, 'got ' + r.status);

  r = await hit('GET', '/v1/rec/NIKO4821');
  ok('a code reads WITHOUT a key — this is the sharing model',
    r.status === 200, 'got ' + r.status);
  ok('...and comes back as the record', (await r.json()).code === 'NIKO4821');

  /* ── writing needs the key ─────────────────────────────────── */
  r = await hit('PUT', '/v1/rec/NIKO4821', { body: { name: 'nobody' } });
  ok('a write with no key is refused', r.status === 401, 'got ' + r.status);
  r = await hit('PUT', '/v1/rec/NIKO4821', { body: { name: 'nobody' }, key: KEY2 });
  ok('a write with the wrong key is refused', r.status === 401, 'got ' + r.status);
  r = await hit('PUT', '/v1/rec/NIKO4821', { body: { name: 'nobody' }, key: 'zz' });
  ok('a malformed key is refused', r.status === 401, 'got ' + r.status);
  ok('...and none of those three landed',
    JSON.parse(env.SCHED.m.get('rec:NIKO4821')).name === undefined);

  r = await hit('PUT', '/v1/rec/NIKO4821', {
    key: KEY,
    body: { code: 'SOMEONELS', name: 'Niko', days: { [day(0)]: { t: 4 } }, logs: [] },
  });
  ok('a write with the key lands', r.status === 200, 'got ' + r.status);
  let saved = JSON.parse(env.SCHED.m.get('rec:NIKO4821'));
  ok('the code comes from the PATH, not from the body',
    saved.code === 'NIKO4821', saved.code);
  ok('...and the record is what was sent', saved.name === 'Niko');

  r = await hit('PUT', '/v1/rec/NIKO4821', { key: KEY, body: 'not an object' });
  ok('a bare JSON string is refused rather than stored', r.status === 400, 'got ' + r.status);
  r = await hit('PUT', '/v1/rec/NIKO4821', { key: KEY, body: [1, 2, 3] });
  ok('so is an array', r.status === 400, 'got ' + r.status);

  /* Written as a raw string so it is genuinely oversized rather than
     an object that claims to be. */
  r = await worker.fetch(new Request('https://w.dev/v1/rec/NIKO4821', {
    method: 'PUT', headers: { Origin: ORIGIN, Authorization: 'Bearer ' + KEY },
    body: '{"pad":"' + 'x'.repeat(120 * 1024) + '"}',
  }), env);
  ok('an oversized record is refused', r.status === 413, 'got ' + r.status);

  /* ── the window ────────────────────────────────────────────────
     The reason this is not a formality: the client files a day under
     its OWN local date and the worker runs on UTC, so east of
     Greenwich the phone is a day ahead for part of every day. A
     window that stopped at the server's today would drop the day
     being lived in, on write, and answer 200. Narrow the window back
     to `i = 0` and the third line here falls over. */
  await hit('PUT', '/v1/rec/NIKO4821', {
    key: KEY,
    body: { days: { [day(0)]: 1, [day(1)]: 2, [day(-29)]: 3, [day(-30)]: 4, [day(-40)]: 5 } },
  });
  saved = JSON.parse(env.SCHED.m.get('rec:NIKO4821'));
  ok('today is kept', saved.days[day(0)] === 1);
  ok('the far edge of the window is kept', saved.days[day(-29)] === 3);
  ok('a day AHEAD of the server is kept — the phone east of UTC',
    saved.days[day(1)] === 2, JSON.stringify(saved.days));
  ok('the day past the window is dropped', saved.days[day(-30)] === undefined);
  ok('and so is one long past it', saved.days[day(-40)] === undefined);

  await hit('PUT', '/v1/rec/NIKO4821', {
    key: KEY,
    body: { logs: Array.from({ length: 90 }, (_, i) => ({ i })) },
  });
  saved = JSON.parse(env.SCHED.m.get('rec:NIKO4821'));
  ok('logs are capped at sixty', saved.logs.length === 60, String(saved.logs.length));
  ok('...and it is the SIXTY most recent, not the first sixty',
    saved.logs[59].i === 89, JSON.stringify(saved.logs[0]));

  /* ── pictures ──────────────────────────────────────────────── */
  const pic = new Uint8Array(2048).map((_, i) => i & 255);
  r = await hit('POST', '/v1/img?code=NIKO4821', { body: pic });
  ok('a picture with no key is refused', r.status === 401, 'got ' + r.status);
  r = await hit('POST', '/v1/img?code=NIKO4821', { body: pic, key: KEY2 });
  ok('a picture with the wrong key is refused', r.status === 401, 'got ' + r.status);

  r = await hit('POST', '/v1/img?code=NIKO4821', { body: pic, key: KEY });
  ok('a picture with the key is taken', r.status === 200, 'got ' + r.status);
  const { id } = await r.json();
  ok('the id is 24 hex characters', /^[a-f0-9]{24}$/.test(id), id);

  /* The comment above this endpoint claims the same picture twice
     costs one entry. It was written over Date.now(), which reads
     identically and dedupes nothing — the claim was true in prose and
     false in code, and nothing on screen would ever have said so. */
  const before = env.SCHED.m.size;
  r = await hit('POST', '/v1/img?code=NIKO4821', { body: pic, key: KEY });
  const again = (await r.json()).id;
  ok('the same bytes give the same id', again === id, id + ' vs ' + again);
  ok('...and cost no second entry', env.SCHED.m.size === before);

  const other = new Uint8Array(2048).map((_, i) => (i + 1) & 255);
  r = await hit('POST', '/v1/img?code=NIKO4821', { body: other, key: KEY });
  ok('different bytes give a different id', (await r.json()).id !== id);

  r = await hit('GET', '/v1/img/' + id);
  ok('a picture reads back without a key', r.status === 200, 'got ' + r.status);
  ok('...as an image', r.headers.get('Content-Type') === 'image/jpeg');
  ok('...byte for byte',
    Buffer.from(await r.arrayBuffer()).equals(Buffer.from(pic)));
  r = await hit('GET', '/v1/img/' + 'f'.repeat(24));
  ok('a picture that is gone is 404', r.status === 404, 'got ' + r.status);

  r = await worker.fetch(new Request('https://w.dev/v1/img?code=NIKO4821', {
    method: 'POST', headers: { Origin: ORIGIN, Authorization: 'Bearer ' + KEY },
    body: new Uint8Array(500 * 1024),
  }), env);
  ok('an oversized picture is refused', r.status === 413, 'got ' + r.status);

  /* ── the doors that are not there ──────────────────────────────
     Not an inventory of 404s for its own sake. The friend list living
     on the client is the design, and the way that stops being true is
     somebody adding the endpoint that would make it convenient. */
  for (const [m, p] of [['GET', '/v1/friends'], ['POST', '/v1/friends'],
                        ['GET', '/v1/all'], ['GET', '/v1/rec'], ['GET', '/']]) {
    r = await hit(m, p, { key: KEY });
    ok('there is no ' + m + ' ' + p, r.status === 404, 'got ' + r.status);
  }

  /* ── CORS ──────────────────────────────────────────────────── */
  r = await hit('OPTIONS', '/v1/rec/NIKO4821');
  ok('a preflight is answered', r.status === 200, 'got ' + r.status);
  ok('...for the app itself',
    r.headers.get('Access-Control-Allow-Origin') === ORIGIN,
    r.headers.get('Access-Control-Allow-Origin'));
  r = await hit('GET', '/v1/rec/NIKO4821', { origin: 'https://evil.example' });
  const allow = r.headers.get('Access-Control-Allow-Origin');
  ok('a stranger is never answered with * — this holds photographs',
    allow !== '*' && allow !== 'https://evil.example', allow);
  ok('the origin is varied on, so a cache cannot serve one to another',
    (r.headers.get('Vary') || '').includes('Origin'));

  /* ── leaving ───────────────────────────────────────────────── */
  r = await hit('DELETE', '/v1/rec/NIKO4821', { key: KEY2 });
  ok('the wrong key cannot delete', r.status === 401, 'got ' + r.status);
  ok('...and it is still there', env.SCHED.m.has('rec:NIKO4821'));
  r = await hit('DELETE', '/v1/rec/NIKO4821', { key: KEY });
  ok('the key deletes', r.status === 200, 'got ' + r.status);
  ok('the record is gone', !env.SCHED.m.has('rec:NIKO4821'));
  ok('the key is gone with it', !env.SCHED.m.has('key:NIKO4821'));
  r = await hit('GET', '/v1/rec/NIKO4821');
  ok('and a friend holding the code now reads 404', r.status === 404, 'got ' + r.status);
  r = await hit('PUT', '/v1/rec/NIKO4821', { key: KEY, body: { name: 'back' } });
  ok('the old key opens nothing afterwards', r.status === 401, 'got ' + r.status);

  console.log('\n  ' + pass + ' passed, ' + fail + ' failed\n');
  process.exit(fail ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });
