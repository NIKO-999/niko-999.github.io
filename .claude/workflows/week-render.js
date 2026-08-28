/* Render one WEEK VIEW proposal into the REAL schedule app and
   screenshot it at the size a phone draws it. Usage:
     node week-render.js <dir> <name> <port>

   Expects <dir>/<name>.js to assign:

     globalThis.WEEKVIEW = {
       css:   '...',            // injected once into <head>
       paint: (help) => {},     // rebuild #scRail
     }

   `help` carries:
     rail    #scRail, emptied for you
     week    [{ d, abbr, full, today, rows: [...] }] in the app's own
             day order, EVERY day 0..6 whether or not it has blocks
     rows    [{ id, n, s, e, r, done, now, past, icon }] where `icon` is
             the outerHTML of the glyph the app itself matched — the
             real glyph from the real keyword table, not a redraw
     now     minutes since midnight, on the frozen clock
     today   the day-of-week the frozen clock is in
     hhmm(m) the app's own time format
     el(t,c,x) tiny element helper

   IT IS RENDERED AT 390x844 AND SHOT AT 1:1. This repo has twice
   judged a treatment on an enlargement and been wrong about it — the
   sneaker's midsole and the eleven particle fields. A week view is
   mostly small type at a density, which is exactly the thing a 2x
   sheet flatters. Read the shot at its own size.

   Both themes, because seven of the thirteen palettes are dark and a
   drawing that only works on paper is half a drawing.

   Writes <name>-light.png and <name>-dark.png. READ BOTH. */
const http = require('http'), fs = require('fs'), path = require('path');
const ROOT = '/home/user/niko-999.github.io';
const [dir, name, portArg] = process.argv.slice(2);
const port = +portArg || 8931;

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

/* The same week tests/schedule.js measures against: 47 blocks, a long
   Work shift so a printed range has something to prove, a Tuesday with
   no shift, and two items that share a start. A generator judged on
   five tidy blocks a day is a generator judged on nothing. */
const WEEK = {
  title: 'Daily Process',
  sub: 'Up at 5:45 · down at 22:45',
  items: [].concat(
    [0, 1, 2, 3, 4, 5, 6].reduce((all, d) => all.concat([
      { d, s: 345, e: 375, r: '', n: 'Wake' },
      { d, s: 390, e: 450, r: '', n: 'Train' },
      { d, s: 465, e: 510, r: '', n: 'Walk' },
      { d, s: 1365, e: 1380, r: '', n: 'Down' },
    ]), []),
    [{ d: 0, s: 540, e: 630, r: '', n: 'Trading' },
     { d: 1, s: 540, e: 630, r: '', n: 'Trading' },
     { d: 2, s: 540, e: 660, r: '', n: 'Trading' },
     { d: 3, s: 540, e: 660, r: '', n: 'Trading' },
     { d: 4, s: 540, e: 630, r: '', n: 'Trading' },
     { d: 5, s: 525, e: 585, r: '', n: 'Trading' },
     { d: 6, s: 525, e: 585, r: '', n: 'Trading' }],
    [{ d: 0, s: 660, e: 1020, r: '', n: 'Work' },
     { d: 1, s: 780, e: 1260, r: '', n: 'Work' },
     { d: 4, s: 720, e: 1320, r: '', n: 'Work' },
     { d: 5, s: 600, e: 1080, r: '', n: 'Work' },
     { d: 6, s: 600, e: 1080, r: '', n: 'Work' }],
    [{ d: 0, s: 1275, e: 1305, r: '', n: 'Read' },
     { d: 1, s: 1275, e: 1305, r: '', n: 'Read' },
     { d: 2, s: 1275, e: 1305, r: '', n: 'Read' },
     { d: 3, s: 1275, e: 1305, r: '', n: 'Read' },
     { d: 4, s: 1320, e: 1350, r: '', n: 'Read' },
     { d: 5, s: 1275, e: 1305, r: '', n: 'Read' },
     { d: 6, s: 1275, e: 1305, r: '', n: 'Read' }]
  ),
};

/* A Wednesday at 10:12, which is inside the Trading block — so every
   proposal has to say something about a block that is RUNNING, and
   about a morning that is already spent. A frozen clock at 3am would
   let a generator get away with never drawing either. */
const FROZEN = new Date('2026-09-02T10:12:00').getTime();

(async () => {
  const gen = fs.readFileSync(path.join(dir, name + '.js'), 'utf8');
  /* tests/lib.js finds the browser by asking the disk what is actually
     installed. Hardcoding the path is what stops a suite working the
     day it moves machines, and this lab is no different. */
  const { chromium, chrome } = require(path.join(ROOT, 'tests', 'lib.js'));
  const exe = chrome();
  await new Promise((r) => srv.listen(port, r));
  const browser = await chromium.launch({ executablePath: exe });

  for (const theme of ['light', 'dark']) {
    const page = await browser.newPage({
      viewport: { width: 390, height: 844 }, deviceScaleFactor: 3,
      isMobile: true, hasTouch: true,
    });
    await page.addInitScript(([w, f, th]) => {
      const R = Date;
      window.Date = class extends R {
        constructor(...a) { super(...(a.length ? a : [f])); }
        static now() { return f; }
      };
      localStorage.setItem('sched.v1', JSON.stringify(w));
      localStorage.setItem('sched.view.v1', 'list');
      localStorage.setItem('sched.theme.v1', th);
      /* Nowhere to reach. A lab that quietly claims a code on the live
         worker every time it renders is a lab that files rubbish. */
      localStorage.setItem('sched.net.v1', JSON.stringify({
        url: 'about:blank', code: '', key: '', name: '', pic: '', on: false }));
      /* One block already ticked, so "done" is a state every proposal
         has to have an answer for rather than one it can skip. */
      const d = new Date(f);
      const k = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0')
        + '-' + String(d.getDate()).padStart(2, '0');
      localStorage.setItem('sched.block.v1', JSON.stringify({ [k]: {} }));
    }, [WEEK, FROZEN, theme]);

    await page.goto(`http://127.0.0.1:${port}/schedule/`, { waitUntil: 'networkidle' });
    await page.evaluate(async () => { await document.fonts.ready; });
    await page.waitForTimeout(300);

    /* The first two blocks of today, marked done in the app's own
       store and re-rendered, so the tick comes from the real path. */
    await page.evaluate(() => {
      const rows = document.querySelectorAll('.day.is-today .row[data-id]');
      const k = (() => { const d = new Date();
        return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0')
          + '-' + String(d.getDate()).padStart(2, '0'); })();
      const log = JSON.parse(localStorage.getItem('sched.block.v1') || '{}');
      log[k] = log[k] || {};
      [0, 1].forEach((i) => { if (rows[i]) log[k][rows[i].dataset.id] = 1; });
      localStorage.setItem('sched.block.v1', JSON.stringify(log));
    });
    await page.reload({ waitUntil: 'networkidle' });
    await page.evaluate(async () => { await document.fonts.ready; });
    await page.waitForTimeout(300);

    /* ── harvest the REAL render, then replace it ──
       The glyph is taken as the app drew it: the keyword table decided
       it, and a lab that re-derives the icon is a lab measuring its own
       guess about which glyph "Trading" reaches. */
    await page.evaluate(gen);
    await page.evaluate(() => {
      const V = globalThis.WEEKVIEW;
      /* The app writes these UPPERCASE into the markup — it is not a
         text-transform. Matched case-insensitively rather than copied,
         because a second hardcoded list is a second thing to keep in
         step, and getting it wrong here is silent: every day lands
         under index -1 and each proposal renders seven empty tracks
         that look like a bug in the proposal. */
      const ABBR = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const FULL = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday',
        'Friday', 'Saturday'];
      const rail = document.getElementById('scRail');
      const now = new Date().getHours() * 60 + new Date().getMinutes();
      const today = new Date().getDay();

      const byDay = {};
      document.querySelectorAll('.day').forEach((li) => {
        const ab = li.querySelector('.day-name').textContent.trim().toLowerCase();
        const d = ABBR.findIndex((x) => x.toLowerCase() === ab);
        if (d < 0) throw new Error('unknown day label: ' + ab);
        byDay[d] = [].map.call(li.querySelectorAll('.row[data-id]'), (r) => ({
          id: r.dataset.id,
          s: +r.dataset.s, e: +r.dataset.e,
          n: r.querySelector('.n').childNodes[0].textContent.trim(),
          r: (r.querySelector('.n em') || {}).textContent || '',
          done: r.classList.contains('is-done'),
          now: r.classList.contains('is-now'),
          past: r.classList.contains('is-past'),
          icon: r.querySelector('.ic').outerHTML,
        }));
      });

      const week = [];
      /* Monday-first, which is what a week is to the person living it.
         The app's own rail starts at today; a proposal about the WEEK
         has to show the week's shape, and a shape that starts on a
         different day every time you open it has none. */
      [1, 2, 3, 4, 5, 6, 0].forEach((d) => week.push({
        d, abbr: ABBR[d], full: FULL[d], today: d === today,
        rows: byDay[d] || [],
      }));

      const hhmm = (m) => String(Math.floor(m / 60)).padStart(2, '0') + ':'
        + String(m % 60).padStart(2, '0');
      const el = (t, c, x) => {
        const n = document.createElement(t);
        if (c) n.className = c;
        if (x != null) n.textContent = x;
        return n;
      };

      if (V.css) {
        const st = document.createElement('style');
        st.textContent = V.css;
        document.head.appendChild(st);
      }
      rail.textContent = '';
      rail.className = 'rail wv';
      V.paint({ rail, week, rows: byDay, now, today, hhmm, el });
    });
    await page.waitForTimeout(260);

    if (process.env.WVDEBUG) {
      console.log(theme, JSON.stringify(await page.evaluate(() => {
        const r = document.getElementById('scRail').getBoundingClientRect();
        const b = document.querySelector('.bar').getBoundingClientRect();
        const d = document.querySelector('.wv-deck');
        const c = document.querySelector('.wv-card.mid');
        return { railTop: r.top, railH: r.height, barTop: b.top, barH: b.height,
          vh: window.innerHeight,
          deckSet: d && d.style.height, deckH: d && d.getBoundingClientRect().height,
          deckTop: d && d.getBoundingClientRect().top,
          cardH: c && c.getBoundingClientRect().height,
          cardBottom: c && c.getBoundingClientRect().bottom,
          scroll: document.documentElement.scrollHeight };
      }), null, 1));
    }

    await page.screenshot({ path: path.join(dir, `${name}-${theme}.png`) });
    await page.close();
  }

  await browser.close();
  srv.close();
  console.log('wrote ' + name + '-light.png and ' + name + '-dark.png');
})();
