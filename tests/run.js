#!/usr/bin/env node
/* ═══════════════════════════════════════════════════════════════
   THE SUITE.

     npm test                 everything
     npm test bt models       just those
     CHROME=/path npm test    a browser somewhere else

   The runner owns the server. It used to be something you started by
   hand in another terminal, and the failure mode was silent and awful:
   the server dies, thirteen files report connection refused, and the
   output looks exactly like thirteen genuine regressions.
   ═══════════════════════════════════════════════════════════════ */
const { spawn, spawnSync } = require('child_process');
const net = require('net');
const path = require('path');
const fs = require('fs');

const ROOT = path.resolve(__dirname, '..');

/* Order is deliberate. The static checks need no browser and take
   milliseconds, so a duplicate name or a clobbered class fails before
   anything spends a minute driving Chromium. The gauntlet goes last
   because it reports faults rather than passes and reads best as a
   closing summary. */
const SUITE = [
  'names',
  'bt', 'models', 'restest', 'swingtest', 'psptest', 'aligntest',
  'logtest', 'journal', 'bintest', 'snaptest', 'daytest', 'intest',
  'lenstest', 'besttest', 'scratch', 'tiles',
  'checkin', 'habits', 'reminders', 'days', 'jade', 'orrery',
  'gauntlet',
];

/* The list above is ordered on purpose, so it cannot be a directory
   scan — but a hardcoded list SILENTLY SKIPS anything not in it, and it
   did: a new file was added, the suite reported "all green", and none
   of its assertions had run. Nothing is more expensive than a test that
   is not running and looks like it is. So the list is checked against
   the directory, and anything on disk that is not named here stops the
   run rather than being ignored. */
const HELPERS = new Set(['run', 'lib', 'seed']);
{
  const disk = fs.readdirSync(__dirname)
    .filter(f => f.endsWith('.js')).map(f => f.slice(0, -3))
    .filter(n => !HELPERS.has(n));
  const missing = disk.filter(n => !SUITE.includes(n));
  if (missing.length) {
    console.error(`\n  tests/ holds ${missing.join(', ')}, which the suite does not run.`);
    console.error('  Add it to SUITE in tests/run.js — where in the order is a decision.\n');
    process.exit(2);
  }
}

const want = process.argv.slice(2).filter(a => !a.startsWith('-'));
const files = (want.length ? want : SUITE).filter((n) => {
  if (fs.existsSync(path.join(__dirname, n + '.js'))) return true;
  console.error(`  no such test: ${n}`);
  return false;
});

const free = (port) => new Promise((res) => {
  const s = net.createServer();
  s.once('error', () => res(false));
  s.once('listening', () => s.close(() => res(true)));
  s.listen(port, '127.0.0.1');
});

async function findPort() {
  for (let p = 8901; p < 8951; p++) if (await free(p)) return p;
  console.error('No free port in 8901–8950.');
  process.exit(2);
}

const alive = (url) => new Promise((res) => {
  const req = require('http').get(url, (r) => { r.resume(); res(r.statusCode < 500); });
  req.on('error', () => res(false));
  req.setTimeout(500, () => { req.destroy(); res(false); });
});

(async () => {
  if (!spawnSync('python3', ['-c', 'pass']).status === 0) {
    console.error('python3 is needed to serve the files.');
    process.exit(2);
  }
  const port = await findPort();
  const base = `http://127.0.0.1:${port}`;
  const server = spawn('python3', ['-m', 'http.server', String(port), '--directory', ROOT],
    { stdio: 'ignore', detached: false });

  const stop = () => { try { server.kill('SIGTERM'); } catch (e) {} };
  process.on('exit', stop);
  process.on('SIGINT', () => { stop(); process.exit(130); });

  /* Wait for it rather than sleeping a guessed amount. */
  let up = false;
  for (let i = 0; i < 60 && !up; i++) {
    up = await alive(`${base}/trading/`);
    if (!up) await new Promise(r => setTimeout(r, 100));
  }
  if (!up) { stop(); console.error(`Server never came up on ${base}.`); process.exit(2); }

  console.log(`\n\x1b[1mserving ${ROOT}\x1b[0m on ${base}\n`);

  const rows = [];
  let bad = 0;
  for (const name of files) {
    const t0 = Date.now();
    const r = spawnSync(process.execPath, [path.join(__dirname, name + '.js')], {
      cwd: __dirname,
      env: { ...process.env, BASE_URL: base },
      encoding: 'utf8',
      /* Was 300s, and orrery grew past it — 280-odd assertions across a
         dozen browser contexts, several of which have to sit and watch
         a real 880ms flight settle. A file that trips this reports as
         "no summary", which reads exactly like a crash and is not one,
         so the number wants headroom rather than to sit on the edge of
         the longest file's real runtime. */
      timeout: 600000,
    });
    const out = (r.stdout || '') + (r.stderr || '');
    const secs = ((Date.now() - t0) / 1000).toFixed(1);

    /* Each file reports in its own shape; read whichever it used. The
       three shapes are historical — they were written months apart and
       rewriting twenty-two reporters to unify them would be churn
       against the one part of this repo that must not churn. */
    const m = out.match(/(\d+) passed, (\d+) failed/)
           || out.match(/PASS\s+(\d+)\s+FAIL\s+(\d+)/);
    const ticks = out.match(/^\s*✓ /gm);
    const bare = out.match(/^FAIL (\d+)\s*$/m);
    const faults = out.match(/FAULTS (\d+)/);

    let line, ill = r.status !== 0;
    if (m) {
      const [, p, f] = m;
      ill = ill || +f > 0;
      line = `${p} passed, ${f} failed`;
    } else if (bare && ticks) {
      ill = ill || +bare[1] > 0;
      line = `${ticks.length} passed, ${bare[1]} failed`;
    } else if (faults) {
      line = `${faults[1]} faults`;              // the gauntlet reports, it does not fail
    } else {
      ill = true;
      line = 'no summary — see output below';
    }
    if (ill) bad++;
    rows.push({ name, line, ill, secs, out });
    console.log(`  ${ill ? '\x1b[31m✗\x1b[0m' : '\x1b[32m✓\x1b[0m'} ${name.padEnd(11)} ${line.padEnd(24)} ${secs}s`);
    if (ill) console.log(out.split('\n').filter(l => /FAIL|✗|Error|error/.test(l)).slice(0, 12)
      .map(l => '      ' + l).join('\n'));
  }

  stop();
  const total = rows.reduce((n, r) => {
    const m = r.line.match(/(\d+) passed/);
    return n + (m ? +m[1] : 0);
  }, 0);
  console.log(`\n\x1b[1m${total} assertions across ${rows.length} files\x1b[0m`
    + (bad ? `  —  \x1b[31m${bad} failing\x1b[0m\n` : '  —  all green\n'));
  process.exit(bad ? 1 : 0);
})();
