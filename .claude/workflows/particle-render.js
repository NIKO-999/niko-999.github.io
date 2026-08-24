/* Render one ambient-particle generator into the REAL orrery and screenshot
   it across time, so motion is judged from what actually plays rather than
   a single still. Usage:  node particle-render.js <yourdir> <name> <port>

   Expects <yourdir>/<name>.js to assign a function to globalThis.PARTICLES:

     globalThis.PARTICLES = (help) => ({ css: '...', svg: '...' })

   `css` is arbitrary CSS text (including @keyframes) injected into a
   <style> appended to <head> — it is NOT scoped, so prefix every rule with
   a class unique to your lens.
   `svg` is markup injected as the children of a fresh <g> appended as the
   LAST child of #orView (same tier as #orDebris — it survives every
   #orRings repaint because it never sits inside #orRings).

   `help` carries: N(v) round to 2dp · rng(seed) a seeded PRNG (Math.random
   is forbidden — the field must draw the same twice) · CX/CY the viewBox
   centre (500,500) · polar(r,a) -> [x,y] with a in degrees.

   Writes <name>-dark-0.png, <name>-dark-2.png, <name>-dark-5.png (three
   moments of the same loop, ~2.5s apart) and <name>-light-2.png (one
   mid-loop still to check contrast against the light backdrop). Also
   prints an element count and flags any keyframe touching a property
   other than transform/opacity, since this layer runs unconditionally and
   forever — the cost model is "compositor only or it does not ship". */
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
const HELP = `globalThis.PHELP = (() => {
  const N = v => Math.round(v * 100) / 100;
  const CX = 500, CY = 500;
  const polar = (r, a) => { const t = a * Math.PI / 180;
    return [CX + r * Math.cos(t), CY + r * Math.sin(t)]; };
  const rng = (seed) => { let h = 2166136261 >>> 0;
    for (let i = 0; i < String(seed).length; i++) { h ^= String(seed).charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; }
    return () => { h ^= h << 13; h >>>= 0; h ^= h >> 17; h ^= h << 5; h >>>= 0; return h / 4294967296; }; };
  return { N, CX, CY, polar, rng };
})();`;

const BAD_PROP = /(^|[\s{;])(cx|cy|x|y|width|height|r|d|left|top|margin|font-size)\s*:/i;

srv.listen(Number(port), '127.0.0.1', async () => {
  const { open } = require(ROOT + '/tests/lib.js');
  let elCount = 0, cssFlag = null;
  for (const scheme of ['dark', 'light']) {
    const c = await open({ colorScheme: scheme });
    await c.page.goto(`http://127.0.0.1:${port}/orrery/`, { waitUntil: 'networkidle' });
    await c.page.waitForFunction(() => document.querySelectorAll('#orNodes .or-node').length > 0, { timeout: 25000 });
    await c.page.waitForFunction(() => !orSim.raf, { timeout: 25000 }).catch(() => {});
    await c.page.waitForTimeout(400);
    await c.page.addScriptTag({ content: HELP });
    await c.page.addScriptTag({ content: SRC });
    const box = await c.page.evaluate(() => {
      const r = document.getElementById('orStage').getBoundingClientRect();
      const s = Math.min(r.width, r.height);
      return { x: Math.round(r.x + (r.width - s) / 2), y: Math.round(r.y + (r.height - s) / 2),
               width: Math.round(s), height: Math.round(s) };
    });
    const err = await c.page.evaluate(() => {
      try {
        const p = globalThis.PARTICLES(globalThis.PHELP);
        const style = document.createElement('style');
        style.textContent = p.css || '';
        document.head.appendChild(style);
        const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        g.id = 'orAmbTest';
        g.innerHTML = p.svg || '';
        document.getElementById('orView').appendChild(g);
        window.__pcss = p.css || '';
        window.__pn = g.querySelectorAll('*').length;
      } catch (e) { return String(e && e.stack || e); }
      return null;
    });
    if (err) { console.error('PARTICLES THREW:\n' + err); await c.browser.close(); srv.close(); process.exit(1); }
    if (scheme === 'dark') {
      elCount = await c.page.evaluate(() => window.__pn);
      const css = await c.page.evaluate(() => window.__pcss);
      const m = css.match(/@keyframes[^{]*\{([\s\S]*?)\}\s*\}/g) || [];
      for (const block of m) if (BAD_PROP.test(block)) { cssFlag = block.slice(0, 120); break; }
      await c.page.screenshot({ path: path.join(dir, `${name}-dark-0.png`), clip: box });
      await c.page.waitForTimeout(2500);
      await c.page.screenshot({ path: path.join(dir, `${name}-dark-2.png`), clip: box });
      await c.page.waitForTimeout(2500);
      await c.page.screenshot({ path: path.join(dir, `${name}-dark-5.png`), clip: box });
    } else {
      await c.page.waitForTimeout(2500);
      await c.page.screenshot({ path: path.join(dir, `${name}-light-2.png`), clip: box });
    }
    if (c.errs.length) console.error('page errors: ' + JSON.stringify(c.errs.slice(0, 3)));
    await c.browser.close();
  }
  srv.close();
  console.log(`wrote ${path.join(dir, name)}-{dark-0,dark-2,dark-5,light-2}.png  elements=${elCount}`
    + (cssFlag ? `  FLAG: keyframe touches a non-compositor property near "${cssFlag}"` : '  css: transform/opacity only'));
});
