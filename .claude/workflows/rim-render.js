/* Render one rim generator into the REAL app and screenshot it.
   Usage:  node render.js <yourdir> <name> <port>
   Expects <yourdir>/<name>.js to assign a function to globalThis.RIM:

     globalThis.RIM = (sec, help) => { ...return an SVG string... }

   `sec` is orLayout.sec mapped to {id,a0,a1,mid,n} — one per category,
   in draw order, with angles in degrees and n = notes in it.
   `help` carries: N(v) round to 2dp · P(r,a) polar->[x,y] with the map
   centred at 500,500 · arc(r,a,b) an arc path · hair(r,o,w) a circle
   path string · H the ink token 'var(--or-hair)' · rng(seed) a seeded
   PRNG (Math.random is forbidden — the map must draw the same twice).

   Everything you return is injected as the contents of #orRings between
   the dust shells and the two heavy arcs. Draw only in the band
   r 330 → 490. Colour comes from tokens: var(--or-hair) for ink,
   var(--or-cat-<id>) for a category, var(--or-star-core) for light.
   Never a literal hex — the map has eleven backdrops and two themes. */
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
const HELP = `globalThis.RIMHELP = (() => {
  const N = v => Math.round(v * 100) / 100;
  const P = (r, a) => { const t = a * Math.PI / 180;
    return [500 + r * Math.cos(t), 500 + r * Math.sin(t)]; };
  const arc = (r, a, b) => { const [x1,y1]=P(r,a), [x2,y2]=P(r,b);
    return \`M\${N(x1)} \${N(y1)}A\${r} \${r} 0 \${(b-a)>180?1:0} 1 \${N(x2)} \${N(y2)}\`; };
  const hair = (r, o, w) => \`<circle cx="500" cy="500" r="\${r}" fill="none" stroke="var(--or-hair)" stroke-width="\${w||.8}" opacity="\${o}"/>\`;
  const rng = (seed) => { let h = 2166136261 >>> 0;
    for (let i = 0; i < String(seed).length; i++) { h ^= String(seed).charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; }
    return () => { h ^= h << 13; h >>>= 0; h ^= h >> 17; h ^= h << 5; h >>>= 0; return h / 4294967296; }; };
  return { N, P, arc, hair, rng, H: 'var(--or-hair)' };
})();`;

srv.listen(Number(port), '127.0.0.1', async () => {
  const { open } = require(ROOT + '/tests/lib.js');
  for (const scheme of ['dark', 'light']) {
    const c = await open({ colorScheme: scheme });
    await c.page.goto(`http://127.0.0.1:${port}/orrery/`, { waitUntil: 'networkidle' });
    await c.page.waitForFunction(() => document.querySelectorAll('#orNodes .or-node').length > 0, { timeout: 25000 });
    await c.page.waitForFunction(() => !orSim.raf, { timeout: 25000 }).catch(() => {});
    await c.page.waitForTimeout(600);
    await c.page.addScriptTag({ content: HELP });
    await c.page.addScriptTag({ content: SRC });
    await c.page.evaluate(() => { document.getElementById('orLegend').style.opacity = '0'; });
    const box = await c.page.evaluate(() => {
      const r = document.getElementById('orStage').getBoundingClientRect();
      const s = Math.min(r.width, r.height);
      return { x: Math.round(r.x + (r.width - s) / 2), y: Math.round(r.y + (r.height - s) / 2),
               width: Math.round(s), height: Math.round(s) };
    });
    const err = await c.page.evaluate(() => {
      const g = document.getElementById('orRings');
      const dust = Array.from(g.querySelectorAll('.or-dust')).map(n => n.outerHTML).join('');
      const arcs = Array.from(g.querySelectorAll('.or-turn')).map(n => n.outerHTML).join('');
      const inner = `<circle cx="500" cy="500" r="330" fill="none" stroke="var(--or-hair)" stroke-width=".8" opacity=".18"/>`
        + `<circle cx="500" cy="500" r="120" fill="none" stroke="var(--or-hair)" stroke-width=".8" opacity=".1"/>`;
      const sec = (orLayout.sec || []).map(s => ({ id: s.id, a0: s.a0, a1: s.a1, mid: s.mid, n: s.n }));
      try { g.innerHTML = dust + globalThis.RIM(sec, globalThis.RIMHELP) + arcs + inner; }
      catch (e) { return String(e && e.stack || e); }
      return null;
    });
    if (err) { console.error('RIM THREW:\n' + err); await c.browser.close(); srv.close(); process.exit(1); }
    await c.page.waitForTimeout(300);
    await c.page.screenshot({ path: path.join(dir, `${name}-${scheme}.png`), clip: box });
    if (c.errs.length) console.error('page errors: ' + JSON.stringify(c.errs.slice(0, 3)));
    await c.browser.close();
  }
  srv.close();
  console.log('wrote ' + path.join(dir, name + '-{dark,light}.png'));
});
