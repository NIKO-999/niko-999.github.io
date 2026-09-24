/* ═══════════════════════════════════════════════════════════════
   THE WORKER — one route, and it is not about a person.

   Runs the real `worker/index.js` in this process against a Map
   standing in for KV. No browser, no network, no Cloudflare account:
   a Worker is a function from a Request to a Response, and Node has
   had Request, Response and crypto.subtle for years.

   That is the whole reason this file exists rather than a note saying
   "deployed, seems fine". Every check below is on something whose
   failure is SILENT in production — an SSRF gate that lets a private
   host through, a feed scan that goes quadratic on a broken file, a
   cache key that never hits.

   IT WAS THE FRIENDS SERVER and most of this file went with them:
   claiming a code, a write key compared by hash, a thirty-day window,
   the profile clamps, the picture store and the leave route. What is
   left is the reason the worker survived — a podcast feed is XML
   without a CORS header, so a browser cannot read one — plus the CORS
   rule and the deployment config, which are about the worker itself
   rather than about what it serves.
   ═══════════════════════════════════════════════════════════════ */
const path = require('path');

let pass = 0, fail = 0;
const ok = (name, cond, extra) => {
  if (cond) { pass++; console.log('  ok  ' + name); }
  else { fail++; console.log('FAIL  ' + name + (extra ? '\n      ' + extra : '')); }
};

const ORIGIN = 'https://niko-999.github.io';
const KEY = 'a'.repeat(32);


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

  /* ── the doors that are not there ──────────────────────────────
     Not an inventory of 404s for its own sake. Every one of these was
     a real route until friends went, and the way a removal like that
     half-happens is one of them being left behind — a write path with
     no caller is a write path anybody can still call. */
  let r;
  for (const [m, p] of [['POST', '/v1/claim'], ['GET', '/v1/pod/1200361736'],
                        ['PUT', '/v1/pod/1200361736'], ['DELETE', '/v1/pod/1200361736'],
                        ['POST', '/v1/img'], ['GET', '/v1/img/abc123'],
                        ['GET', '/v1/friends'], ['GET', '/']]) {
    r = await hit(m, p, { key: KEY });
    ok('there is no ' + m + ' ' + p, r.status === 404, 'got ' + r.status);
  }

  /* ── CORS ──────────────────────────────────────────────────── */
  r = await hit('OPTIONS', '/v1/pod/1200361736');
  ok('a preflight is answered', r.status === 200, 'got ' + r.status);
  ok('...for the app itself',
    r.headers.get('Access-Control-Allow-Origin') === ORIGIN,
    r.headers.get('Access-Control-Allow-Origin'));
  r = await hit('GET', '/v1/pod/1200361736', { origin: 'https://evil.example' });
  const allow = r.headers.get('Access-Control-Allow-Origin');
  ok('a stranger is never answered with * — this holds photographs',
    allow !== '*' && allow !== 'https://evil.example', allow);

  /* A loopback on ANY port, because the port is not the boundary and
     pinning three of them shut this app's own suite out: the runner
     finds a free port at run time, so it can never be on a list
     written in advance. That surfaced as "could not reach that
     address" — a CORS rejection wearing a network error. */
  for (const o of ['http://127.0.0.1:8902', 'http://localhost:41235', 'http://[::1]:9']) {
    r = await hit('GET', '/v1/pod/1200361736', { origin: o });
    ok('a loopback origin is answered: ' + o,
      r.headers.get('Access-Control-Allow-Origin') === o,
      r.headers.get('Access-Control-Allow-Origin'));
  }
  for (const o of ['http://127.0.0.1.evil.example', 'https://127.0.0.1:8902',
                   'http://localhost.evil.example']) {
    r = await hit('GET', '/v1/pod/1200361736', { origin: o });
    ok('and something dressed as one is not: ' + o,
      r.headers.get('Access-Control-Allow-Origin') !== o,
      r.headers.get('Access-Control-Allow-Origin'));
  }
  ok('the origin is varied on, so a cache cannot serve one to another',
    (r.headers.get('Vary') || '').includes('Origin'));

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
