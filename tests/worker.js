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

  /* ── WHAT A PROFILE IS ALLOWED TO BE ──
     The 96KB ceiling stops a record being enormous, which is not the
     same as these fields having a shape. A cap here is what makes "a
     bio is a line" and "a shelf is twelve books" facts about the
     server rather than promises the client happens to keep — and the
     client is the one part of this anybody can replace.

     CLAMPED, never rejected: a record a little too long is somebody
     on an old build, and dropping their whole day over a field this
     server does not need to be exact about is the harshest possible
     reading of it. */
  await hit('PUT', '/v1/rec/NIKO4821', {
    key: KEY,
    body: {
      bio: 'x'.repeat(400),
      year: '5'.repeat(900),
      goals: Array.from({ length: 20 }, (_, i) => 'goal ' + i + ' ' + 'y'.repeat(80)),
      work: Array.from({ length: 20 }, (_, i) => ({ n: 'W' + i, c: '#fff', v: 1e9 })),
      mind: Array.from({ length: 40 }, (_, i) => ({ t: 'B' + i, a: 'A', c: 'z'.repeat(600), k: 'read' })),
    },
  });
  saved = JSON.parse(env.SCHED.m.get('rec:NIKO4821'));
  ok('a bio is clamped to a line', saved.bio.length === 140, saved.bio.length);
  ok('a year is a year and no more', saved.year.length === 371, saved.year.length);
  ok('six goals, each a sentence', saved.goals.length === 6
    && saved.goals.every((g) => g.length <= 40), saved.goals.length);
  ok('six sessions, and a count that is a count',
    saved.work.length === 6 && saved.work.every((w) => w.v <= 9999), saved.work);
  ok('twelve books, and a cover url that cannot be a payload',
    saved.mind.length === 12 && saved.mind.every((m) => m.c.length <= 300),
    saved.mind.length);
  /* A YEAR IS DIGITS. Anything else in that field is a string the
     client did not write, and the almanac reads it a character at a
     time — so it is stripped rather than trusted. */
  await hit('PUT', '/v1/rec/NIKO4821', {
    key: KEY, body: { year: '12<script>34' },
  });
  saved = JSON.parse(env.SCHED.m.get('rec:NIKO4821'));
  ok('and a year that is not digits has the rest taken out',
    saved.year === '1234', saved.year);
  /* A record with none of it is not a broken record: somebody who
     shares nothing gets the empty shape rather than a missing key,
     because a reader cannot tell "turned off" from "old build". */
  await hit('PUT', '/v1/rec/NIKO4821', { key: KEY, body: { name: 'Niko' } });
  saved = JSON.parse(env.SCHED.m.get('rec:NIKO4821'));
  ok('sharing nothing stores the empty shape, not a missing key',
    saved.bio === '' && saved.year === '' && Array.isArray(saved.goals)
    && saved.goals.length === 0 && Array.isArray(saved.mind)
    && saved.mind.length === 0, saved);

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

  /* A loopback on ANY port, because the port is not the boundary and
     pinning three of them shut this app's own suite out: the runner
     finds a free port at run time, so it can never be on a list
     written in advance. That surfaced as "could not reach that
     address" — a CORS rejection wearing a network error. */
  for (const o of ['http://127.0.0.1:8902', 'http://localhost:41235', 'http://[::1]:9']) {
    r = await hit('GET', '/v1/rec/NIKO4821', { origin: o });
    ok('a loopback origin is answered: ' + o,
      r.headers.get('Access-Control-Allow-Origin') === o,
      r.headers.get('Access-Control-Allow-Origin'));
  }
  for (const o of ['http://127.0.0.1.evil.example', 'https://127.0.0.1:8902',
                   'http://localhost.evil.example']) {
    r = await hit('GET', '/v1/rec/NIKO4821', { origin: o });
    ok('and something dressed as one is not: ' + o,
      r.headers.get('Access-Control-Allow-Origin') !== o,
      r.headers.get('Access-Control-Allow-Origin'));
  }
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

  /* ── the deployment config, parsed rather than eyeballed ──
     wrangler.toml is the other half of this worker and nothing here
     used to look at it. It cost a real bug: `workers_dev = true` was
     written UNDER the [[kv_namespaces]] block, and in TOML every key
     after a table header belongs to that table until the next one — so
     it parsed as a property of the KV binding, where it means nothing
     and nothing complains. The file read correctly to a human and was
     wrong to the parser, which is the only kind of wrong worth a test.

     `binding` gets the same treatment for the same reason: index.js
     reads env.SCHED, and a rename here fails at request time on
     somebody's phone with no way to see why. */
  {
    const toml = require('fs').readFileSync(
      path.resolve(__dirname, '..', 'worker', 'wrangler.toml'), 'utf8');
    /* A five-line TOML reader: enough for a flat file of scalars and
       one array-of-tables, and it models the ONE rule the bug turned
       on — a key belongs to whatever header last opened. */
    const top = {}, tables = {};
    let where = top;
    for (const line of toml.split('\n')) {
      const s = line.replace(/#.*$/, '').trim();
      if (!s) continue;
      const tbl = s.match(/^\[\[?([a-z_]+)\]\]?$/);
      if (tbl) { where = tables[tbl[1]] = tables[tbl[1]] || {}; continue; }
      const kv = s.match(/^([a-z_]+)\s*=\s*(.+)$/);
      if (kv) where[kv[1]] = kv[2].replace(/^"|"$/g, '');
    }
    ok('the worker is named, and named the same as its URL',
      top.name === 'sched' && top.main === 'index.js', JSON.stringify(top));
    ok('workers_dev is TOP LEVEL, not swallowed by the table under it',
      top.workers_dev === 'true', JSON.stringify(top));
    ok('and the KV binding is the name index.js actually reads',
      tables.kv_namespaces && tables.kv_namespaces.binding === 'SCHED',
      JSON.stringify(tables.kv_namespaces));
    ok('and it names a namespace rather than the placeholder',
      /^[a-f0-9]{32}$/.test((tables.kv_namespaces || {}).id || ''),
      JSON.stringify(tables.kv_namespaces));
  }

  /* ══════════════════════════════════════════════════════
     EPISODES

     The one route that is not about a person, and the only one that
     makes an OUTBOUND request — which is what makes it the one worth
     testing hardest. Every failure here is silent in production: an
     open proxy answers 200, a feed read without a ceiling just takes
     longer, and a cache that never hits looks exactly like one that
     does.

     `fetch` is replaced rather than reached: a test that hit Apple
     would be measuring somebody else's uptime, and one that hit a real
     feed would be flaky by design. */
  {
    const asked = [];
    const real = globalThis.fetch;
    let FEED = ['<rss><channel>',
      '<item><title><![CDATA[Ep 3 &amp; last]]></title>',
      '<pubDate>Tue, 02 Sep 2026 06:00:00 GMT</pubDate>',
      '<itunes:duration>1:02:03</itunes:duration></item>',
      '<item><title>Ep 2</title><itunes:duration>2700</itunes:duration></item>',
      '<item><title>Ep 1</title><itunes:duration>45:00</itunes:duration></item>',
      '</channel></rss>'].join('');
    let LOOK = { results: [{ collectionName: 'The Daily Stoic',
      artworkUrl600: 'https://is1.example/art.jpg',
      feedUrl: 'https://feeds.example/daily.xml' }] };
    let lookOk = true, feedOk2 = true;

    globalThis.fetch = async (u) => {
      const url = String(u);
      asked.push(url);
      if (url.indexOf('itunes.apple.com') >= 0) {
        return new Response(JSON.stringify(LOOK),
          { status: lookOk ? 200 : 500, headers: { 'Content-Type': 'application/json' } });
      }
      return new Response(FEED, { status: feedOk2 ? 200 : 404 });
    };

    env = { SCHED: kv() };
    let e = await hit('GET', '/v1/pod/1200361736');
    let body = await e.json();
    ok('a show id comes back as its episodes, newest first',
      e.status === 200 && body.show === 'The Daily Stoic'
      && body.items.length === 3 && body.items[0].t === 'Ep 3 & last',
      JSON.stringify(body));
    /* CDATA, entities and the three duration spellings that are all in
       the wild — "3723", "1:02:03" and "45:00". */
    ok('...with durations read in every spelling a feed uses',
      body.items[0].s === 3723 && body.items[1].s === 2700
      && body.items[2].s === 2700, JSON.stringify(body.items));

    /* ── THE CALLER CANNOT NAME A URL, WHICH IS THE WHOLE DESIGN ──
       The obvious shape is /feed?url=… and it is an open proxy. The
       route takes digits and nothing else, so there is no request that
       can express "fetch this address". */
    const ssrf = [
      '/v1/pod/http%3A%2F%2F169.254.169.254%2Flatest%2Fmeta-data',
      '/v1/pod/..%2F..%2Fv1%2Frec%2FABCD',
      '/v1/feed?url=http://169.254.169.254/',
    ];
    let refused = 0;
    for (const u of ssrf) {
      const r2 = await hit('GET', u);
      if (r2.status === 404 && !(await r2.json()).items) refused++;
    }
    ok('no request can name an address for the worker to fetch',
      refused === ssrf.length, refused + ' of ' + ssrf.length);
    /* A VALID id carrying a spurious parameter is not an attack that
       fails — it is a parameter that does not exist. The route reads
       the PATH and nothing else, so the right assertion is that the
       answer is unchanged and the address in the query is never
       fetched. Written the other way round first, as "it must 404",
       which is a check that would have forced the route to start
       caring about query strings in order to reject them. */
    env = { SCHED: kv() };
    asked.length = 0;
    const junk = await hit('GET', '/v1/pod/1200361736?url=http://169.254.169.254/');
    ok('...and a parameter it does not read changes nothing',
      junk.status === 200 && (await junk.json()).show === 'The Daily Stoic'
      && !asked.some((u) => u.indexOf('169.254') >= 0), asked.join(' '));

    /* ── AND APPLE'S OWN ANSWER IS NOT TRUSTED EITHER ──
       Anyone can submit a podcast whose feed points anywhere, so the
       URL that comes back is still checked: https only, and no
       loopback, private or link-local host. The show survives — it is
       a real answer — and the episodes do not. */
    const bad = ['http://feeds.example/x.xml', 'https://127.0.0.1/x.xml',
                 'https://169.254.169.254/x.xml', 'https://10.0.0.5/x.xml',
                 'https://192.168.1.9/x.xml', 'https://box.internal/x.xml',
                 'file:///etc/passwd', 'https://localhost/x.xml'];
    let held = 0;
    for (let i = 0; i < bad.length; i++) {
      LOOK = { results: [{ collectionName: 'S', feedUrl: bad[i] }] };
      env = { SCHED: kv() };
      const r3 = await hit('GET', '/v1/pod/' + (900000 + i));
      const b3 = await r3.json();
      if (r3.status === 200 && b3.show === 'S' && b3.items.length === 0) held++;
    }
    ok('a feed that is not plain https on a public host is refused, and the show survives',
      held === bad.length, held + ' of ' + bad.length);

    /* ── NOTHING IS REFLECTED ──
       An open proxy that only ever returns thirty short strings is not
       one. The feed's own bytes must not appear in the answer. */
    LOOK = { results: [{ collectionName: 'S', feedUrl: 'https://feeds.example/x.xml' }] };
    FEED = '<rss><channel><item><title>T</title></item>'
      + '<secret>SHOULD-NOT-COME-BACK</secret></channel></rss>';
    env = { SCHED: kv() };
    const refl = await (await hit('GET', '/v1/pod/700')).text();
    ok('the feed itself is never passed through, only parsed fields',
      refl.indexOf('SHOULD-NOT-COME-BACK') < 0 && refl.indexOf('"T"') > 0, refl);

    /* ── A MALFORMED FEED IS A FEED ──
       It is somebody else's file and it is allowed to be broken. An
       unclosed <item> is the case a `<item>([\s\S]*?)</item>` global
       regex goes quadratic on; the scan cannot backtrack. */
    FEED = '<rss><channel><item><title>Open</title>'
      + '<item><title>Also open</title></channel></rss>';
    env = { SCHED: kv() };
    const torn = await (await hit('GET', '/v1/pod/701')).json();
    ok('an unclosed item does not hang or throw', Array.isArray(torn.items), JSON.stringify(torn));

    /* ── AND IT IS CAPPED ──
       A feed that streams for ever would otherwise hold the request
       open until the platform kills it. Asserted as the answer being
       BOUNDED rather than as a byte count, which is what the ceiling
       is actually for. */
    FEED = '<rss><channel>' + Array.from({ length: 400 }, (x, i) =>
      '<item><title>E' + i + '</title></item>').join('') + '</channel></rss>';
    env = { SCHED: kv() };
    const many = await (await hit('GET', '/v1/pod/702')).json();
    ok('a feed with hundreds of episodes is trimmed to thirty',
      many.items.length === 30, many.items.length);

    /* ── CACHED, because a feed is a file somebody publishes twice a
       week and this is asked for every time you open a show. */
    env = { SCHED: kv() };
    FEED = '<rss><channel><item><title>One</title></item></channel></rss>';
    asked.length = 0;
    await hit('GET', '/v1/pod/703');
    const firstCalls = asked.length;
    await hit('GET', '/v1/pod/703');
    ok('the second ask for the same show reaches nothing',
      firstCalls === 2 && asked.length === 2, asked.join(' '));

    /* ── AND A SHOW THAT DOES NOT EXIST IS A 404, not an empty 200 ── */
    LOOK = { results: [] };
    env = { SCHED: kv() };
    const none = await hit('GET', '/v1/pod/704');
    ok('an id nothing answers for is a 404', none.status === 404, none.status);

    /* ── AND APPLE BEING DOWN IS NOT A CRASH ── */
    lookOk = false;
    env = { SCHED: kv() };
    const down = await hit('GET', '/v1/pod/705');
    ok('the lookup failing is a 404 rather than a throw', down.status === 404, down.status);
    lookOk = true;

    /* ── AND IT ANSWERS THE APP'S ORIGIN, like everything else here ── */
    LOOK = { results: [{ collectionName: 'S', feedUrl: 'https://feeds.example/x.xml' }] };
    env = { SCHED: kv() };
    const cor = await hit('GET', '/v1/pod/706', { origin: 'https://evil.example' });
    ok('and it is not readable from an origin this worker does not know',
      cor.headers.get('Access-Control-Allow-Origin') === ORIGIN,
      cor.headers.get('Access-Control-Allow-Origin'));

    globalThis.fetch = real;
  }

  console.log('\n  ' + pass + ' passed, ' + fail + ' failed\n');
  process.exit(fail ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });
