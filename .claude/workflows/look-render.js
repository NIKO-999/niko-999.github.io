/* Render one LOOK treatment into the REAL orrery and screenshot it, at
   the whole map and close up. Usage:
     node look-render.js <yourdir> <name> <port>

   This is for effects you can SEE STANDING STILL — how the stars are
   drawn, how the links read, what the image is made of. For motion
   during a camera flight use passage-render.js instead.

   Expects <yourdir>/<name>.js to assign:

     globalThis.LOOK = {
       css: '...',                 // injected once into <head>
       paint: (help) => {},        // optional: add SVG, or restyle what is there
     }

   `help` carries:
     NS      the SVG namespace string
     svg     the <svg> element
     view    #orView, the group the camera transforms
     defs    the <svg>'s <defs> — see the WARNING below
     layer   an empty <g> at the top of #orView, yours
     under   an empty <g> at the BOTTOM of #orView, yours — behind the
             rings, links and stars, for anything that must sit under
             the drawing rather than over it
     rng(s)  a seeded PRNG. Math.random is forbidden.
     N(v)    round to 2dp
     nodes   [{id, x, y, cat, tier, deg}] every star on the map, in user
             units, already laid out — enough to draw over, group, or
             join without re-deriving the layout
     links   [{a, b, ax, ay, bx, by}] every resolved link, same units

   WARNING, already paid for once in this repo: orPaintRings overwrites
   <defs>.innerHTML WHOLESALE on every repaint, and orPaint rebuilds
   #orRings, #orLinks, #orNodes and #orLabels. Anything you put in those
   is gone the moment someone types in the filter box. `layer` and
   `under` are siblings of those and survive, which is where #orDebris
   and #orAmbient already live. Put CSS in the `css` field — a <style>
   in <defs> is the exact bug that cost half a pass.

   An SVG <filter> is the one thing that genuinely wants to be in <defs>.
   Define it inside your `paint` and re-add it there; or better, put it in
   your own `layer` — a <filter> works from anywhere in the document.

   Writes <name>-dark.png, <name>-light.png (the whole map) and
   <name>-dark-close.png, <name>-light-close.png (clipped tight to one
   real constellation, so detail is judged at the size it is drawn).
   READ ALL FOUR. */
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

const INSTALL = `globalThis.__lkInstall = () => {
  const L = globalThis.LOOK || {};
  if (L.css) { const s = document.createElement('style'); s.textContent = L.css; document.head.appendChild(s); }
  const NS = 'http://www.w3.org/2000/svg';
  const view = document.getElementById('orView');
  const mk = (id, first) => { let g = document.getElementById(id);
    if (!g) { g = document.createElementNS(NS, 'g'); g.id = id;
      if (first) view.insertBefore(g, view.firstChild); else view.appendChild(g); }
    return g; };
  const under = mk('lkUnder', true), layer = mk('lkLayer', false);
  const rng = (seed) => { let h = 2166136261 >>> 0;
    for (let i = 0; i < String(seed).length; i++) { h ^= String(seed).charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; }
    return () => { h ^= h << 13; h >>>= 0; h ^= h >> 17; h ^= h << 5; h >>>= 0; return h / 4294967296; }; };
  const catOf = orLayout.catOf || {}, tier = orLayout.tier || {}, deg = orLayout.deg || {};
  const nodes = Object.keys(state.xy).map((id) => ({ id, x: state.xy[id][0], y: state.xy[id][1],
    cat: catOf[id] || null, tier: tier[id] || 'leaf', deg: deg[id] || 0 }));
  const links = (state.edges || []).filter((e) => state.xy[e[0]] && state.xy[e[1]])
    .map((e) => ({ a: e[0], b: e[1], ax: state.xy[e[0]][0], ay: state.xy[e[0]][1],
                   bx: state.xy[e[1]][0], by: state.xy[e[1]][1] }));
  const help = { NS, svg: document.getElementById('orSvg'), view, layer, under,
    defs: document.getElementById('orSvg').querySelector('defs'),
    rng, N: (v) => Math.round(v * 100) / 100, nodes, links };
  if (typeof L.paint === 'function') L.paint(help);
};`;

srv.listen(Number(port), '127.0.0.1', async () => {
  const { open } = require(ROOT + '/tests/lib.js');
  const shots = [];
  for (const scheme of ['dark', 'light']) {
    /* 2x pixels. The trading constellation is only ~215 CSS px across at
       the default camera, and a treatment whose whole subject is how the
       stars are DRAWN cannot be judged from a 215px thumbnail. Same
       drawn size, twice the pixels to look at it with. */
    const c = await open({ colorScheme: scheme, deviceScaleFactor: 2 });
    await c.page.goto(`http://127.0.0.1:${port}/orrery/`, { waitUntil: 'networkidle' });
    await c.page.waitForFunction(() => document.querySelectorAll('#orNodes .or-node').length > 0, { timeout: 25000 });
    await c.page.waitForFunction(() => state.alpha < SIM.floor, { timeout: 25000 }).catch(() => {});
    await c.page.waitForTimeout(500);
    await c.page.addScriptTag({ content: SRC });
    await c.page.addScriptTag({ content: INSTALL });
    const bad = await c.page.evaluate(() => {
      if (typeof globalThis.LOOK !== 'object' || !globalThis.LOOK) return 'LOOK was never assigned';
      /* The legend card is chrome, not the drawing — it is in the way of
         judging the map and it is not what you are designing. */
      const lg = document.getElementById('orLegend'); if (lg) lg.style.opacity = '0';
      try { globalThis.__lkInstall(); } catch (e) { return String(e && e.stack || e); }
      return null;
    });
    if (bad) { console.error('LOOK FAILED:\n' + bad); await c.browser.close(); srv.close(); process.exit(1); }
    await c.page.waitForTimeout(700);
    const box = await c.page.evaluate(() => {
      const r = document.getElementById('orStage').getBoundingClientRect();
      const s = Math.min(r.width, r.height);
      return { x: Math.round(r.x + (r.width - s) / 2), y: Math.round(r.y + (r.height - s) / 2),
               width: Math.round(s), height: Math.round(s) };
    });
    const wide = path.join(dir, `${name}-${scheme}.png`);
    await c.page.screenshot({ path: wide, clip: box });
    shots.push(wide);
    /* Close up on one real constellation, clipped in SCREEN pixels off
       the nodes' own boxes — detail has to be judged at the size it is
       actually drawn, not at whatever a scaled-down whole map implies. */
    const near = await c.page.evaluate(() => {
      const gs = [...document.querySelectorAll('#orNodes .or-node')]
        .filter((g) => (g.getAttribute('data-id') || '').startsWith('trading/'));
      if (!gs.length) return null;
      let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
      gs.forEach((g) => { const r = g.getBoundingClientRect();
        x0 = Math.min(x0, r.left); y0 = Math.min(y0, r.top);
        x1 = Math.max(x1, r.right); y1 = Math.max(y1, r.bottom); });
      const pad = 26, s = Math.max(x1 - x0, y1 - y0) + pad * 2;
      return { x: Math.round((x0 + x1) / 2 - s / 2), y: Math.round((y0 + y1) / 2 - s / 2),
               width: Math.round(s), height: Math.round(s) };
    });
    if (near && near.width > 40) {
      const close = path.join(dir, `${name}-${scheme}-close.png`);
      await c.page.screenshot({ path: close, clip: near });
      shots.push(close);
    }
    if (c.errs.length) console.error('page errors: ' + JSON.stringify(c.errs.slice(0, 3)));
    if (scheme === 'dark') {
      const n = await c.page.evaluate(() => ({
        layer: document.getElementById('lkLayer').querySelectorAll('*').length,
        under: document.getElementById('lkUnder').querySelectorAll('*').length,
      }));
      console.log(`elements added: lkLayer=${n.layer} lkUnder=${n.under}`);
    }
    await c.browser.close();
  }
  srv.close();
  console.log('wrote:\n  ' + shots.join('\n  '));
});
