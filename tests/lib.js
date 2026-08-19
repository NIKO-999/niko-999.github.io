/* ═══════════════════════════════════════════════════════════════
   Shared plumbing for the suite.

   Every test used to open with the same fifteen lines: require
   playwright out of a node_modules path, hardcode
   /opt/pw-browsers/chromium-1194/chrome-linux/chrome, hardcode
   http://127.0.0.1:8901, and define its own ok(). Two of those are
   machine-specific, which is how a suite stops running the day it moves.
   ═══════════════════════════════════════════════════════════════ */
const fs = require('fs');
const path = require('path');

let core;
try {
  core = require('playwright-core');
} catch (e) {
  console.error('\nplaywright-core is not installed.\n\n  npm install\n');
  process.exit(2);
}

/* ── finding a browser ──
   In order, and each step says why it failed rather than throwing a
   stack trace at somebody who has just cloned this.

   Note the third step is not the first: playwright-core resolves a
   browser by the build number it was compiled against, so 1.62 looks for
   chromium_headless_shell-1234 and finds nothing on a machine that has
   -1194 sitting right there. Asking the disk what is actually present
   beats asking the library what it expects. */
function chrome() {
  const tried = [];

  /* Named explicitly? Then that one or nothing. Falling back would hand
     you a different browser than the one you asked for and say nothing,
     which makes the run prove something other than what you meant. */
  if (process.env.CHROME) {
    if (fs.existsSync(process.env.CHROME)) return process.env.CHROME;
    console.error(`\nCHROME=${process.env.CHROME} does not exist.\n\n`
      + 'Unset it to search the usual places.\n');
    process.exit(2);
  }

  /* Whatever is on the disk, newest build first. */
  const root = process.env.PLAYWRIGHT_BROWSERS_PATH || '/opt/pw-browsers';
  if (fs.existsSync(root)) {
    const builds = fs.readdirSync(root)
      .filter(d => /^chromium-\d+$/.test(d))
      .sort((a, b) => +b.split('-')[1] - +a.split('-')[1]);
    for (const b of builds) {
      const exe = path.join(root, b, 'chrome-linux', 'chrome');
      if (fs.existsSync(exe)) return exe;
    }
    tried.push(`${root} (no chromium-*/chrome-linux/chrome)`);
  } else {
    tried.push(`${root} (no such directory)`);
  }

  try {
    const own = core.chromium.executablePath();
    if (own && fs.existsSync(own)) return own;
    tried.push(`playwright's own path ${own} (does not exist)`);
  } catch (e) {
    tried.push(`playwright's own path (${e.message.split('\n')[0]})`);
  }

  for (const sys of ['/usr/bin/google-chrome', '/usr/bin/chromium',
                     '/usr/bin/chromium-browser',
                     '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome']) {
    if (fs.existsSync(sys)) return sys;
  }
  tried.push('the usual system paths');

  console.error('\nNo Chromium found. Tried:\n'
    + tried.map(t => '  · ' + t).join('\n')
    + '\n\nInstall one:      npx playwright install chromium'
    + '\nOr name one:      CHROME=/path/to/chrome npm test\n');
  process.exit(2);
}

/* The runner owns the server and tells us where it put it. The default
   is only for running one file by hand against a server you started. */
const BASE = process.env.BASE_URL || 'http://127.0.0.1:8901';

/* One page, error capture already wired. Every suite wants the same
   thing and half of them used to forget the console listener. */
async function open(opts = {}) {
  const browser = await core.chromium.launch({
    executablePath: chrome(),
    args: ['--no-sandbox'],
  });
  const errs = [];
  const page = await browser.newPage({
    viewport: opts.viewport || { width: 1512, height: 950 },
    ...opts,
  });
  page.on('pageerror', e => errs.push(String(e)));
  page.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  return { browser, page, errs };
}

module.exports = { chromium: core.chromium, chrome, BASE, open };
