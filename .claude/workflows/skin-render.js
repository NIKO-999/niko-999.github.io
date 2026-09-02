/* Render one WHOLE-APP VISUAL LANGUAGE over the REAL schedule app and
   screenshot the real screens at the size a phone draws them.

     node skin-render.js <dir> <name> <port>

   Expects <dir>/<name>.js to assign:

     globalThis.SKIN = {
       accent: 124,             // hue angle the app's own wheel solves
       css:    '...',           // injected LAST, so it outranks app.css
       tune:   (help) => {},    // optional DOM work per screen
     }

   `help` carries { screen, el }.

   IT IS SHOT AT 390x844, 1:1. This repo has twice judged a treatment
   on an enlargement and been wrong about it — the sneaker's midsole
   and the eleven particle fields — and a comparison sheet laid out in
   a grid understates how loud the winner is. Read each shot at its
   own size.

   SKINLIVE=1 photographs the app as it ships, on the same fixture,
   which is the only honest baseline to grade a proposal against.

   ONE TRAP, PAID FOR ONCE ALREADY: `screen` unqualified inside a
   function that runs IN THE PAGE is window.screen, never the Node
   variable of that name. The contrast pass built on this harness
   compared a Screen object to a string, took the else branch on every
   call, and measured four of six lenses on the wrong view — reporting
   an empty box rather than throwing, which is a harness bug wearing a
   design finding's clothes. Pass the view in as an argument.

   Writes <name>-week.png, -flip.png, -today.png, -work.png, -pat.png.  */
const http = require('http'), fs = require('fs'), path = require('path');
const ROOT = '/home/user/niko-999.github.io';
const [dir, name, portArg] = process.argv.slice(2);
const port = +portArg || 8955;
const WANT = (process.env.SKINSHOTS || 'week,today').split(',');

const T = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript',
  '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.json': 'application/json',
  '.jpg': 'image/jpeg', '.png': 'image/png' };
const srv = http.createServer((q, s) => {
  let p = decodeURIComponent(q.url.split('?')[0]);
  if (p.endsWith('/')) p += 'index.html';
  const f = path.join(ROOT, p);
  if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) {
    s.writeHead(404); return s.end('no');
  }
  s.writeHead(200, { 'content-type': T[path.extname(f)] || 'application/octet-stream' });
  fs.createReadStream(f).pipe(s);
});

/* A real week with a full weekday on it. A language judged on five
   tidy blocks a day is a language judged on its best case. */
const WEEK = { title: 'Daily Process', items: [].concat(
  [1, 2, 3, 4, 5].reduce((a, d) => a.concat([
    { d, s: 360, e: 390, r: '', n: 'Wake' },
    { d, s: 390, e: 450, r: '', n: 'Train' },
    { d, s: 465, e: 510, r: '', n: 'Walk' },
    { d, s: 540, e: 660, r: '', n: 'Trading' },
    { d, s: 750, e: 780, r: '', n: 'Lunch' },
    { d, s: 780, e: 1050, r: 'Studio', n: 'Work' },
    { d, s: 1110, e: 1155, r: '', n: 'Cook' },
    { d, s: 1275, e: 1305, r: '', n: 'Read' },
    { d, s: 1365, e: 1380, r: '', n: 'Down' },
  ]), []),
  [0, 6].reduce((a, d) => a.concat([
    { d, s: 420, e: 450, r: '', n: 'Wake' },
    { d, s: 480, e: 570, r: '', n: 'Run' },
    { d, s: 720, e: 840, r: '', n: 'Clean' },
    { d, s: 1020, e: 1140, r: '', n: 'Friends' },
    { d, s: 1380, e: 1395, r: '', n: 'Down' },
  ]), [])
) };

/* A Wednesday at 10:12 — inside Trading, so every language has to say
   something about a block that is RUNNING and a morning already spent. */
const FROZEN = new Date('2026-09-02T10:12:00').getTime();

(async () => {
  const gen = process.env.SKINLIVE ? '' :
    fs.readFileSync(path.join(dir, name + '.js'), 'utf8');
  const { chromium, chrome } = require(path.join(ROOT, 'tests', 'lib.js'));
  await new Promise((r) => srv.listen(port, r));
  const browser = await chromium.launch({ executablePath: chrome() });
  const page = await browser.newPage({
    viewport: { width: 390, height: 844 }, deviceScaleFactor: 3,
    isMobile: true, hasTouch: true, locale: 'en-GB',
  });

  /* THE ACCENT HAS TO BE SEEDED BEFORE THE FIRST LOAD. It was set from
     inside shoot(), which runs after the screen is already up — and
     scPaint is inside the app's IIFE, so it cannot be called from
     outside to repaint. The first screen therefore photographed the
     PREVIOUS accent and the second photographed the new one, which
     reads as two lenses disagreeing with themselves. Parsed out of the
     skin's own source here so one number lives in one place. */
  const hue = (gen.match(/accent:\s*(\d+)/) || [])[1];
  /* SKINMODE=light|dark seeds the theme the same way, for the same
     reason: the mode is read once at boot and the first paint is
     whichever one the key held. */
  const mode = process.env.SKINMODE || null;

  const board = process.env.SKINBOARD ? 1 : 0;
  await page.addInitScript(([w, f, h, m, b]) => {
    if (h != null) localStorage.setItem('sched.accent.v1', String(h));
    if (m) localStorage.setItem('sched.mode.v1', m);
    if (b) { localStorage.setItem('sched.wkview.v1', 'board'); localStorage.setItem('sched.tyview.v1', 'board'); }
    const R = Date;
    window.Date = class extends R {
      constructor(...a) { super(...(a.length ? a : [f])); }
      static now() { return f; }
    };
    const d = new R(f), p = (n) => String(n).padStart(2, '0');
    const key = (b) => { const x = new R(f); x.setDate(x.getDate() - b);
      return x.getFullYear() + '-' + p(x.getMonth() + 1) + '-' + p(x.getDate()); };
    /* Only when absent: scClean mints ids on the way in, and a week
       re-seeded on every reload orphans the log written against the
       previous open's ids. */
    if (!localStorage.getItem('sched.v1')) localStorage.setItem('sched.v1', JSON.stringify(w));
    localStorage.setItem('sched.tour.v1', '1');
    localStorage.setItem('sched.net.v1', JSON.stringify({
      url: 'about:blank', code: '', key: '', name: '', pic: '', on: false }));
    /* Six months of a record, so every panel that reads one has
       something to draw rather than an empty state. */
    const tick = {}, rate = {}, log = {};
    for (let i = 0; i < 120; i++) {
      const k = key(i);
      if (i % 7 !== 3) tick[k] = { t: 1, w: 1, r: 1,
        s: 7000 + (i * 431) % 5000, f: 2100 + (i * 97) % 700,
        z: 6.2 + ((i * 13) % 30) / 10 };
      if (i % 5 !== 2) rate[k] = 1 + ((i * 7) % 5);
    }
    localStorage.setItem('sched.tick.v1', JSON.stringify(tick));
    localStorage.setItem('sched.rate.v2', JSON.stringify(rate));
    if (!localStorage.getItem('sched.log.v1')) localStorage.setItem('sched.log.v1', JSON.stringify(log));
    /* Workouts, so the deck and the panels are not empty. */
    const tl = {};
    for (let i = 0; i < 60; i++) {
      if (i % 2) continue;
      const kinds = [['bro.chest'], ['ppl.push', 'bro.abs'], ['run.long'],
        ['bro.back'], ['ppl.legs'], ['rec.stretch']];
      /* The record's own shape: keyed by block id, the kinds joined
         with a plus in one field, the effort as its word. */
      tl[key(i)] = { seed: { k: kinds[i % 6].join('+'),
        e: ['Light', 'Moderate', 'Hard'][i % 3], m: 30 + (i % 4) * 15 } };
    }
    localStorage.setItem('sched.train.v1', JSON.stringify(tl));
    localStorage.setItem('sched.obj.v1', JSON.stringify({
      [key(0)]: [{ t: 'Call a hundred clients', d: 0 },
                 { t: 'Ship the pattern screen', d: 1 },
                 { t: 'Read forty pages', d: 0 }] }));
  }, [WEEK, FROZEN, hue, mode, board]);

  const shoot = async (screen) => {
    if (gen) await page.evaluate(gen);
    await page.evaluate((sc) => {
      const S = globalThis.SKIN || {};
      if (S.css && !document.getElementById('skinCSS')) {
        const st = document.createElement('style');
        st.id = 'skinCSS'; st.textContent = S.css;
        document.head.appendChild(st);
      }
      if (S.tune) S.tune({ screen: sc, el: (t, c, x) => {
        const n = document.createElement(t); if (c) n.className = c;
        if (x != null) n.textContent = x; return n; } });
    }, screen);
    await page.evaluate(async () => { await document.fonts.ready; });
    await page.waitForTimeout(420);
    await page.screenshot({ path: path.join(dir, `${name}-${screen}.png`) });
  };

  /* The first navigation has to happen before anything reads
     localStorage: on about:blank the property throws SecurityError
     rather than returning empty, so a lab that seeds its keys before
     landing on the origin dies on its first line. */
  await page.goto(`http://127.0.0.1:${port}/schedule/`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(400);

  const go = async (view, stop) => {
    await page.evaluate(([v, s]) => {
      localStorage.setItem('sched.view.v1', v);
      if (s) localStorage.setItem('sched.ty.v1', s);
    }, [view, stop]);
    await page.reload({ waitUntil: 'networkidle' });
    await page.evaluate(async () => { await document.fonts.ready; });
    await page.waitForTimeout(500);
  };

  for (const screen of WANT) {
    if (screen === 'week' || screen === 'flip') {
      await go('list');
      /* Two blocks of today done, through the app's own store, so a
         finished row is a state every language has to answer. */
      await page.evaluate(() => {
        const rows = document.querySelectorAll('.day.is-today .row[data-id]');
        const d = new Date(), p = (n) => String(n).padStart(2, '0');
        const k = d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate());
        const log = JSON.parse(localStorage.getItem('sched.log.v1') || '{}');
        log[k] = log[k] || {};
        [0, 1, 2].forEach((i) => { if (rows[i]) log[k][rows[i].dataset.id] = 1; });
        localStorage.setItem('sched.log.v1', JSON.stringify(log));
      });
      await page.reload({ waitUntil: 'networkidle' });
      await page.waitForTimeout(500);
      if (screen === 'flip') {
        await page.evaluate(() => {
          const b = document.getElementById('scHdTurn');
          if (b) b.click();
        });
        await page.waitForTimeout(900);
      }
    } else if (screen === 'today') await go('tally', 'up');
    else if (screen === 'work') await go('tally', 'work');
    else if (screen === 'pat') await go('tally', 'pat');
    else if (screen === 'friends') await go('friends');
    else if (screen === 'edit') {
      await go('list');
      await page.evaluate(() => {
        const r = document.querySelector('.day.is-open .row[data-id]');
        if (r) r.click();
      });
      await page.waitForTimeout(600);
    } else if (screen === 'menu') {
      await go('list');
      await page.evaluate(() => { document.getElementById('scTabYou').click(); });
      await page.waitForTimeout(600);
    }
    await shoot(screen);
  }

  await browser.close();
  srv.close();
  console.log('wrote ' + WANT.map((s) => `${name}-${s}.png`).join(', '));
})();
