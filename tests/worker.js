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

  /* ── the vault: a sealed record, and the worker never holds the key ──
     Everything here fails SILENTLY in production: a write accepted with
     no token overwrites somebody's year, and a stale write accepted
     throws a whole device's day away while both phones say "synced". */
  {
    const ID = '0123456789abcdef0123456789abcdef', TOK = 'f'.repeat(32), BAD = 'e'.repeat(32);
    const V = '/v1/vault/' + ID;
    r = await hit('GET', V);
    ok('a vault nobody has written is a 404', r.status === 404, r.status);
    r = await hit('PUT', V, { body: { iv: 'aaa', ct: 'bbb', base: 0 } });
    ok('a write with no token is refused', r.status === 401, r.status);
    r = await hit('PUT', V, { key: TOK, body: { iv: 'aaa', ct: 'bbb', base: 0 } });
    const w1 = await r.json();
    ok('the first write makes revision 1', r.status === 200 && w1.rev === 1, JSON.stringify(w1));
    r = await hit('GET', V);
    const g1 = await r.json();
    ok('a read hands back the ciphertext and its revision, never the token',
      g1.rev === 1 && g1.ct === 'bbb' && g1.iv === 'aaa' && !('wh' in g1) && !JSON.stringify(g1).includes(TOK), JSON.stringify(g1));
    const stored = env.SCHED.m.get('vault:' + ID);
    ok('the token is kept only as its hash', !stored.includes(TOK) && /"wh":"[0-9a-f]{64}"/.test(stored), stored.slice(0, 120));
    r = await hit('PUT', V, { key: BAD, body: { iv: 'x', ct: 'y', base: 1 } });
    ok('a write with the wrong token is refused', r.status === 403, r.status);
    r = await hit('DELETE', V, { key: BAD });
    ok('...and so is a delete', r.status === 403 && env.SCHED.m.has('vault:' + ID), r.status);
    r = await hit('PUT', V, { key: TOK, body: { iv: 'x', ct: 'stale', base: 0 } });
    const w409 = await r.json();
    ok('a write built on an old revision is a 409 naming the current one',
      r.status === 409 && w409.rev === 1 && (await (await hit('GET', V)).json()).ct === 'bbb', r.status + ' ' + JSON.stringify(w409));
    r = await hit('PUT', V, { key: TOK, body: { iv: 'x', ct: 'ccc', base: 1 } });
    ok('a write on the current revision moves it on', (await r.json()).rev === 2);
    r = await hit('PUT', V, { key: TOK, body: { iv: 'x', ct: 'z'.repeat(2 * 1024 * 1024 + 10), base: 2 } });
    ok('a vault is capped', r.status === 413 || r.status === 400, r.status);
    r = await hit('PUT', '/v1/vault/NOT-AN-ID', { key: TOK, body: { iv: 'x', ct: 'y', base: 0 } });
    ok('an id that is not 32 hex characters names nothing', r.status === 404, r.status);
    r = await hit('DELETE', V, { key: TOK });
    ok('the right token deletes it', r.status === 200 && !env.SCHED.m.has('vault:' + ID), r.status);
    r = await hit('OPTIONS', V);
    ok('a preflight allows the write and its token',
      /PUT/.test(r.headers.get('Access-Control-Allow-Methods')) && /Authorization/i.test(r.headers.get('Access-Control-Allow-Headers')),
      r.headers.get('Access-Control-Allow-Methods') + ' / ' + r.headers.get('Access-Control-Allow-Headers'));
  }

  /* ── push: reminders sent at the minute, without being read ──
     The phone hands over a push endpoint and a queue of messages it has
     already sealed with its own push keys. Everything here fails
     silently in production: an endpoint that is any URL is an SSRF, a
     timer that sends early or twice is a phone buzzing wrongly, and a
     subscription the service says is gone must stop costing a read. */
  {
    const ID = '1123456789abcdef0123456789abcdef', TOK = 'd'.repeat(32), BAD = 'c'.repeat(32);
    const P = '/v1/push/' + ID, EP = 'https://web.push.apple.com/QXYZ';
    const T0 = Date.now() + 3600e3;
    const good = { ep: EP, q: [{ t: T0, b: 'AAAA' }, { t: T0 + 60e3, b: 'BBBB' }, { t: T0 + 864e5, b: 'CCCC' }] };

    r = await hit('GET', '/v1/push/key');
    const k1 = (await r.json()).key;
    r = await hit('GET', '/v1/push/key');
    const k2 = (await r.json()).key;
    ok('the worker hands out one public signing key, and the same one twice',
      /^[A-Za-z0-9_-]{87}$/.test(k1) && k1 === k2, k1 + ' / ' + k2);
    ok('and never the private half', !JSON.stringify(k1).includes('"d"') && !(await (await hit('GET', '/v1/push/key')).text()).includes('jwk'));

    r = await hit('PUT', P, { body: good });
    ok('a queue with no token is refused', r.status === 401, r.status);
    for (const ep of ['http://web.push.apple.com/x', 'https://169.254.169.254/latest', 'https://evil.example/push',
                      'https://web.push.apple.com.evil.example/x', 'https://web.push.apple.com:8443/x']) {
      r = await hit('PUT', P, { key: TOK, body: { ep, q: good.q } });
      ok('an endpoint that is not a push service is refused: ' + ep, r.status === 400 && !env.SCHED.m.has('push:' + ID), r.status);
    }
    r = await hit('PUT', P, { key: TOK, body: { ep: EP, q: Array.from({ length: 201 }, (_, i) => ({ t: T0 + i * 60e3, b: 'AAAA' })) } });
    ok('a queue is capped', r.status === 413, r.status);
    r = await hit('PUT', P, { key: TOK, body: { ep: EP, q: [{ t: T0, b: 'A'.repeat(1025) }] } });
    ok('and so is one message', r.status === 400, r.status);
    r = await hit('PUT', P, { key: TOK, body: { ep: EP, q: [{ t: T0, b: 'not base64!' }] } });
    ok('and a message is base64url or nothing', r.status === 400, r.status);

    r = await hit('PUT', P, { key: TOK, body: { ep: EP, q: good.q.concat([{ t: Date.now() - 3600e3, b: 'OLD0' }, { t: Date.now() + 30 * 864e5, b: 'FAR0' }]) } });
    const put = await r.json();
    const rec = JSON.parse(env.SCHED.m.get('push:' + ID));
    ok('a queue is stored, sorted, with times already gone and times too far ahead dropped',
      r.status === 200 && put.n === 3 && rec.q.map((x) => x.b).join() === 'AAAA,BBBB,CCCC', JSON.stringify(put) + ' ' + JSON.stringify(rec.q));
    ok('the token is kept only as its hash', !env.SCHED.m.get('push:' + ID).includes(TOK) && /^[0-9a-f]{64}$/.test(rec.wh));
    ok('and the index names when it is next due', JSON.parse(env.SCHED.m.get('push:ix'))[ID] === T0, env.SCHED.m.get('push:ix'));
    r = await hit('PUT', P, { key: BAD, body: good });
    ok('a queue with the wrong token is refused', r.status === 403, r.status);

    const real = globalThis.fetch, sent = [];
    let answer = 201;
    globalThis.fetch = async (u, o) => { sent.push({ u: String(u), o }); return new Response('', { status: answer }); };
    const tick = (t) => worker.scheduled({ scheduledTime: t }, env, { waitUntil() {} });

    await tick(T0 - 60e3);
    ok('a minute before, nothing is sent', sent.length === 0, sent.length);
    await tick(T0 + 1000);
    ok('at the minute, the one reminder due is sent, and only it', sent.length === 1 && sent[0].u === EP, JSON.stringify(sent.map((x) => x.u)));
    const h = sent[0].o.headers, body = new Uint8Array(sent[0].o.body);
    ok('as the sealed bytes the phone gave, marked aes128gcm with a lifetime',
      Buffer.from(body).toString('base64').replace(/=+$/, '') === 'AAAA' && h['Content-Encoding'] === 'aes128gcm' && +h.TTL > 0, JSON.stringify(h));
    const m = /^vapid t=([^.]+)\.([^.]+)\.([^,]+), k=(.+)$/.exec(h.Authorization || '');
    const u8 = (t) => new Uint8Array(Buffer.from(t.replace(/-/g, '+').replace(/_/g, '/'), 'base64'));
    let verified = false, claims = {};
    if (m) {
      const pub = await crypto.subtle.importKey('raw', u8(m[4]), { name: 'ECDSA', namedCurve: 'P-256' }, false, ['verify']);
      verified = await crypto.subtle.verify({ name: 'ECDSA', hash: 'SHA-256' }, pub, u8(m[3]), new TextEncoder().encode(m[1] + '.' + m[2]));
      claims = JSON.parse(Buffer.from(u8(m[2])).toString());
    }
    ok('signed with the key the worker hands out, for the push service\'s own origin',
      !!m && m[4] === k1 && verified && claims.aud === 'https://web.push.apple.com' && claims.exp * 1000 > T0 && /^https:|^mailto:/.test(claims.sub), JSON.stringify({ m: !!m, verified, claims }));
    ok('and what was sent leaves the queue', JSON.parse(env.SCHED.m.get('push:' + ID)).q.map((x) => x.b).join() === 'BBBB,CCCC'
      && JSON.parse(env.SCHED.m.get('push:ix'))[ID] === T0 + 60e3);
    await tick(T0 + 1000);
    ok('a second tick in the same minute sends nothing twice', sent.length === 1, sent.length);

    /* A phone that was off for an hour must not get an hour of reminders
       at once, all of them late. */
    await tick(T0 + 60e3 + 11 * 60e3);
    ok('a reminder more than ten minutes late is dropped rather than sent', sent.length === 1
      && JSON.parse(env.SCHED.m.get('push:' + ID)).q.map((x) => x.b).join() === 'CCCC', sent.length);

    answer = 410;
    await tick(T0 + 864e5 + 1000);
    ok('a subscription the service says is gone is deleted, index and all',
      sent.length === 2 && !env.SCHED.m.has('push:' + ID) && !(ID in JSON.parse(env.SCHED.m.get('push:ix'))), sent.length);
    globalThis.fetch = real;

    await hit('PUT', P, { key: TOK, body: good });
    r = await hit('DELETE', P, { key: BAD });
    ok('a delete with the wrong token is refused', r.status === 403 && env.SCHED.m.has('push:' + ID), r.status);
    r = await hit('DELETE', P, { key: TOK });
    ok('the right token deletes the queue and its place in the index',
      r.status === 200 && !env.SCHED.m.has('push:' + ID) && !(ID in JSON.parse(env.SCHED.m.get('push:ix'))), r.status);
  }

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
    ok('and the minute timer that sends reminders is on',
      (tables.triggers || {}).crons === '["* * * * *"]', JSON.stringify(tables.triggers));
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
