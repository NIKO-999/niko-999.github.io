/* Render one PASSAGE effect into the REAL orrery and screenshot it at
   several moments OF AN ACTUAL FLIGHT. Usage:
     node passage-render.js <yourdir> <name> <port>

   A flight is 880ms end to end, and a Playwright screenshot costs more
   than one of its frames — so this does NOT try to sample one flight
   five times. It flies the SAME flight once per sample offset, from the
   same start state, and screenshots at a different point each run. Each
   still is therefore a true frame of a real passage, not a blur of one.

   Expects <yourdir>/<name>.js to assign:

     globalThis.PASSAGE = {
       css: '...',                          // injected once into <head>
       replaceDebris: false,                // true = suppress orDebris's own streaks
       spawn: (ox, oy, help) => [elements],  // called at the START of a zoom-IN flight
     }

   spawn's return value is an array of elements; the harness removes them
   when the flight lands (exactly where orDebris.stop runs), so nothing
   you create outlives its own passage. `ox, oy` are the aim point in the
   map's own 0-1000 user units. `help` carries:

     NS      the SVG namespace string
     layer   an empty <g> inside #orView, yours, already on screen
     defs    the <svg>'s <defs> — see the WARNING below
     svg     the <svg> element itself
     rng(s)  a seeded PRNG. Math.random is forbidden: the map must
             draw the same twice.
     N(v)    round to 2dp
     z0, z1  the camera's zoom at the start and end of THIS flight
     FLY_MS  the flight's duration in ms (880)

   WARNING, and it has already cost this repo half a pass: orPaintRings
   overwrites <defs>.innerHTML WHOLESALE on every repaint. A gradient you
   put there survives only until the next filter keystroke. For a
   flight-scoped effect that is usually fine (you are inside one flight),
   but a <style> element must go in <head> — put your CSS in the `css`
   field and let the harness place it.

   SMIL WARNING, also already paid for: `begin`, INCLUDING the implicit
   default of 0s, is measured against the SVG document's own animation
   clock, never against when your element was inserted. On a page open
   longer than your `dur`, "0s" has already passed and the browser
   resolves the animation straight to its frozen end state — no motion,
   no error, nothing to see. Use begin="indefinite" + el.beginElementAt(
   offsetSeconds). This harness deliberately holds the page open FOUR
   SECONDS before the first flight so that bug bites here rather than in
   front of the user.

   Writes <name>-dark-{120,300,500,700,1080}.png — the pull-away, the
   early cruise, mid-cruise, the berth, and 200ms after landing — plus
   <name>-light-500.png. READ THEM ALL. */
const http = require('http'), fs = require('fs'), path = require('path');
const ROOT = '/home/user/niko-999.github.io';
const [dir, name, port] = process.argv.slice(2);
const T = {'.html':'text/html','.css':'text/css','.js':'text/javascript',
           '.svg':'image/svg+xml','.jpg':'image/jpeg','.png':'image/png'};
const srv = http.createServer((q, s) => {
  let p = decodeURIComponent(q.url.split('?')[0]);
  if (p.endsWith('/')) p += 'index.html';
  const f = path.join(ROOT, p);
  if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) {
    s.writeHead(404); return s.end('no');
  }
  s.writeHead(200, {'content-type': T[path.extname(f)] || 'application/octet-stream'});
  fs.createReadStream(f).pipe(s);
});
const SRC = fs.readFileSync(path.join(dir, name + '.js'), 'utf8');

/* Hook the flight without touching the app: orZoom.glide already knows
   which flights are passages (z > z0), and orZoom.land already runs at
   every one of the four ways a flight can end. Wrapping those two is
   the whole install. */
const INSTALL = `globalThis.__pgInstall = () => {
  const P = globalThis.PASSAGE || {};
  if (P.css) { const s = document.createElement('style'); s.textContent = P.css; document.head.appendChild(s); }
  const NS = 'http://www.w3.org/2000/svg';
  const view = document.getElementById('orView');
  let layer = document.getElementById('pgLayer');
  if (!layer) { layer = document.createElementNS(NS, 'g'); layer.id = 'pgLayer'; view.appendChild(layer); }
  if (P.replaceDebris) orDebris.spawn = () => {};
  const rng = (seed) => { let h = 2166136261 >>> 0;
    for (let i = 0; i < String(seed).length; i++) { h ^= String(seed).charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; }
    return () => { h ^= h << 13; h >>>= 0; h ^= h >> 17; h ^= h << 5; h >>>= 0; return h / 4294967296; }; };
  const help = { NS, layer, svg: document.getElementById('orSvg'),
    defs: document.getElementById('orSvg').querySelector('defs'),
    rng, N: (v) => Math.round(v * 100) / 100, FLY_MS: 880 };
  let live = [];
  const glide = orZoom.glide, land = orZoom.land;
  orZoom.glide = (z, px, py, focus) => {
    const z0 = state.zoom;
    const out = glide(z, px, py, focus);
    if (z > z0 && typeof P.spawn === 'function') {
      const aim = focus || null;
      try {
        live = P.spawn(aim ? aim[0] : 500, aim ? aim[1] : 500,
          Object.assign({ z0, z1: z }, help)) || [];
      } catch (e) { globalThis.__pgErr = String(e && e.stack || e); live = []; }
    }
    return out;
  };
  orZoom.land = () => { live.forEach((el) => el && el.remove && el.remove()); live = []; return land(); };
};`;

const OFFSETS = [120, 300, 500, 700, 1080];
const TARGET = 'trading/models/cisd';

srv.listen(Number(port), '127.0.0.1', async () => {
  const { open } = require(ROOT + '/tests/lib.js');
  const shots = [];
  for (const scheme of ['dark', 'light']) {
    const offs = scheme === 'dark' ? OFFSETS : [500];
    const c = await open({ colorScheme: scheme });
    await c.page.goto(`http://127.0.0.1:${port}/orrery/`, { waitUntil: 'networkidle' });
    await c.page.waitForFunction(() => document.querySelectorAll('#orNodes .or-node').length > 0, { timeout: 25000 });
    await c.page.waitForFunction(() => state.alpha < SIM.floor, { timeout: 25000 }).catch(() => {});
    await c.page.addScriptTag({ content: SRC });
    await c.page.addScriptTag({ content: INSTALL });
    const bad = await c.page.evaluate(() => {
      if (typeof globalThis.PASSAGE !== 'object' || !globalThis.PASSAGE) return 'PASSAGE was never assigned';
      try { globalThis.__pgInstall(); } catch (e) { return String(e && e.stack || e); }
      return null;
    });
    if (bad) { console.error('INSTALL FAILED:\n' + bad); await c.browser.close(); srv.close(); process.exit(1); }
    /* Four real seconds before the first flight, on purpose — see the
       SMIL note at the top. An effect that only works on a freshly
       loaded page is an effect that does not work. */
    await c.page.waitForTimeout(4000);
    /* The clip is read PER SHOT, never once up front: orOpen swings the
       reading pane in, which narrows #orStage — a box measured before
       the flight frames a stage that no longer exists there, and the
       effect lands outside it. Measured, the first time this ran. */
    const clip = () => c.page.evaluate(() => {
      const r = document.getElementById('orStage').getBoundingClientRect();
      const s = Math.min(r.width, r.height);
      return { x: Math.round(r.x + (r.width - s) / 2), y: Math.round(r.y + (r.height - s) / 2),
               width: Math.round(s), height: Math.round(s) };
    });
    for (const ms of offs) {
      await c.page.evaluate(() => { orClose(); orZoom(0); });
      await c.page.waitForFunction(
        () => !document.getElementById('orSvg').classList.contains('or-flying'), { timeout: 8000 }).catch(() => {});
      await c.page.waitForTimeout(700);
      await c.page.evaluate((id) => { orOpen(id); }, TARGET);
      await c.page.waitForTimeout(ms);
      const f = path.join(dir, `${name}-${scheme}-${ms}.png`);
      await c.page.screenshot({ path: f, clip: await clip() });
      shots.push(f);
    }
    const seen = await c.page.evaluate(() => ({
      err: globalThis.__pgErr || null,
      n: document.getElementById('pgLayer') ? document.getElementById('pgLayer').querySelectorAll('*').length : -1,
    }));
    if (seen.err) console.error('SPAWN THREW: ' + seen.err);
    if (scheme === 'dark') console.log(`elements left in #pgLayer after landing: ${seen.n} (should be 0)`);
    if (c.errs.length) console.error('page errors: ' + JSON.stringify(c.errs.slice(0, 3)));
    await c.browser.close();
  }
  srv.close();
  console.log('wrote:\n  ' + shots.join('\n  '));
});
