const { chromium } = require('/home/user/niko-999.github.io/node_modules/playwright-core');
const fs = require('fs');
const OUT = '' + (process.env.OUT_DIR || 'sweep') + '/';
fs.mkdirSync(OUT, { recursive: true });
const mode = process.argv[2] || 'earned'; // earned | locked
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const c = await b.newContext({ viewport: { width: 430, height: 932 }, deviceScaleFactor: 2, serviceWorkers: 'block' });
  await c.addInitScript(`localStorage.setItem('lift.v1', JSON.stringify({unit:'kg',goal:3,wkSum:'9999-12-31',wkDone:'9999-12-31',tour:true,mseen:{wo:1e9,vol:1e12,pr:1e9,lv:99,u:[]}}));`);
  const p = await c.newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message));
  await p.route('**/lift/index.html', async (r) => {
    let t = fs.readFileSync('/home/user/niko-999.github.io/lift/index.html', 'utf8');
    const i = t.lastIndexOf('})();');
    t = t.slice(0, i) + 'window.__t={};["lfBadges","bdStill","bdStills","bdKey","bdQ","bdSpec","ymd","today"].forEach(function(k){try{window.__t[k]=eval(k)}catch(e){window.__t[k]=null}});window.__t.bdQlen=function(){return bdQ.length};window.__t.bdBusy=function(){return bdBusy};' + t.slice(i);
    r.fulfill({ body: t, contentType: 'text/html' });
  });
  await p.goto('http://localhost:8977/lift/index.html'); await p.waitForTimeout(1500);
  const ids = await p.evaluate((mode) => {
    const all = __t.lfBadges();
    window.__imgs = {};
    all.forEach((x) => { if (mode === 'earned') x.d = __t.ymd(__t.today()); else x.d = ''; const im = new Image(); im.alt = x.b.id; window.__imgs[x.b.id] = { im, x }; __t.bdStill(x, im); });
    return all.map((x) => x.b.id);
  }, mode);
  console.log('badges', ids.length);
  const t0 = Date.now();
  for (let i = 0; i < 900; i++) {
    const st = await p.evaluate(() => ({ q: __t.bdQlen(), busy: __t.bdBusy(), done: Object.keys(__imgs).filter((k) => __imgs[k].im.src).length }));
    if (i % 10 === 0) console.log(st.done, '/', ids.length, 'q', st.q);
    if (st.done >= ids.length || (!st.q && !st.busy && i > 10 && st.done >= ids.length - 0)) break;
    await p.waitForTimeout(1000);
    if (Date.now() - t0 > 780000) break;
  }
  const data = await p.evaluate(() => Object.keys(__imgs).map((k) => [k, __imgs[k].im.src, __imgs[k].x.b.n, __imgs[k].x.b.t || 0, __imgs[k].x.b.fx || '']));
  fs.writeFileSync(OUT + mode + '.json', JSON.stringify(data));
  console.log('collected', data.filter((d) => d[1]).length, 'errors', errs.slice(0, 3));
  await b.close();
})();
