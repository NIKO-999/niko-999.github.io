/* The fifth note: reachable, complete, and carrying nothing it should
   not — no instrument names anywhere in the app. */
const { chrome, BASE } = require('./lib');
const { chromium } = require('playwright-core');
const D = '/tmp/claude-0/-home-user-niko-999-github-io/0c50b2a3-74bc-5684-9821-f4c805b5d78d/scratchpad';
let pass = 0, fail = 0;
const ok = (c, m) => { console.log((c ? '  ✓ ' : '  ✗ ') + m); c ? pass++ : fail++; };

(async () => {
  const br = await chromium.launch({ executablePath: chrome(), args: ['--no-sandbox'] });
  const pg = await br.newPage({ viewport: { width: 1512, height: 950 }, deviceScaleFactor: 2 });
  const errs = [];
  pg.on('pageerror', e => errs.push('JS: ' + e.message));
  pg.on('response', r => { if (r.status() >= 400) errs.push(r.status() + ' ' + r.url()); });
  await pg.emulateMedia({ colorScheme: 'dark' });
  await pg.goto(`${BASE}/trading/`, { waitUntil: 'networkidle' });
  await pg.evaluate(() => goto('resources'));
  await pg.waitForTimeout(400);

  console.log('\n── it is on the rail');
  const tabs = await pg.$$eval('#tpRail [data-topic]', bs => bs.map(b => b.dataset.topic));
  ok(tabs.includes('swings'), `a topic of its own (${tabs.join(', ')})`);
  /* Relative, not absolute. Notes keep getting appended after this one,
     and pinning it to the last slot only ever breaks on the next
     addition without catching anything this test is for. What matters
     is that it comes after the reading notes and before "All links". */
  ok(tabs.indexOf('swings') > tabs.indexOf('phases')
     && tabs.indexOf('swings') < tabs.indexOf('all'),
     `after the reading notes, before "All links" (${tabs.join(', ')})`);

  await pg.click('#tpRail [data-topic="swings"]');
  await pg.waitForTimeout(350);

  console.log('\n── the write-up');
  ok((await pg.textContent('#apH')).trim() === 'Protected swing points', 'it opens on its own page');
  const lede = await pg.textContent('.ap-lede');
  ok(/aligned timeframe/.test(lede), 'the lede says what makes a swing protected');
  const sits = await pg.$$eval('.ap-s h3 span', hs => hs.map(h => h.textContent.trim()));
  ok(sits.length === 6, `six situations (${sits.length})`);
  ok(sits[0] === 'Align the timeframe first', `alignment comes first (${sits[0]})`);
  /* Direct child only. mark() bolds the vocabulary inside the reason as
     well, so `li b` counts those too and reported 21 for nine rules. */
  const rules = await pg.$$eval('.ap-rules li > b', bs => bs.map(b => b.textContent.trim()));
  ok(rules.length === 9, `nine rules (${rules.length})`);

  /* The alignment table is the one piece of hard data in the video. */
  const body = await pg.textContent('.ap');
  for (const pair of [['daily', '1H'], ['4H', '15M'], ['1H', '5M'], ['30M', '3M'], ['15M', '1M']]) {
    const re = new RegExp(`${pair[0]}[^.]{0,40}${pair[1]}`, 'i');
    ok(re.test(body), `${pair[0]} → ${pair[1]} is written down`);
  }

  console.log('\n── the link');
  const link = await pg.evaluate(() => {
    const r = SEED.find(x => x.id === 'seed-psp');
    return r ? { url: r.url, note: r.note, art: r.art, marks: r.marks.length,
                 first: r.marks[0].t, tags: r.tags } : null;
  });
  ok(link && link.url === 'https://youtu.be/wwgtY4ChXgU', 'the real URL is seeded');
  ok(link && link.note === 'swings', 'filed under this note');
  ok(link && link.marks === 4, `four worked examples marked (${link && link.marks})`);
  ok(link && link.first === 384, `the first at 6:24 (${link && link.first}s)`);

  const card = await pg.locator('.rs-main').filter({ hasText: 'Protected swing' });
  ok(await card.count() === 1, 'its card is on the page');
  ok(await pg.locator('.rs-art .rs-diag').count() >= 1, 'with a diagram rather than a blank tile');
  /* The FIRST b in each row is the stamp. The caption after it is run
     through mark(), which bolds the vocabulary — so "before the CISD"
     contributes a second b and the naive selector read it as a stamp. */
  const marks = await pg.$$eval('.rs-mark',
    ms => ms.map(m => m.querySelector('b').textContent.trim()));
  ok(marks.join(',') === '6:24,10:51,15:55,19:33', `stamps read back correctly (${marks.join(', ')})`);

  console.log('\n── nothing that should not be there');
  /* The standing rule: no instrument names anywhere in either app. The
     video names five; none of them may have come across. */
  const whole = await pg.evaluate(() => document.body.innerText);
  /* Word boundaries, or "dow" matches drawdown and "ES" matches
     RESOURCES — which is how a check like this quietly stops meaning
     anything. Case-sensitive on the tickers, since they are initialisms. */
  const banned = [/\bgold\b/i, /\bXAU/i, /\bNQ\b/, /\bES\b/, /\bYM\b/,
                  /\bnasdaq\b/i, /S&P/i, /\bdow jones\b/i, /\bGBP|USD\b/];
  const found = banned.filter(re => re.test(whole)).map(String);
  ok(found.length === 0, `no instrument names on the page (${found.join(', ') || 'none'})`);

  const src = await pg.evaluate(async () =>
    (await (await fetch(location.href)).text()));
  const inNote = src.slice(src.indexOf("id: 'swings'"), src.indexOf("id: 'swings'") + 6000);
  const leaked = [/\bgold\b/i, /\bnasdaq\b/i, /\bYM\b/, /\bNQ\b/, /\bES\b/]
    .filter(re => re.test(inNote)).map(String);
  ok(leaked.length === 0, `nor in the note's source (${leaked.join(', ') || 'none'})`);

  await pg.screenshot({ path: D + '/swings.png' });

  console.log('\n' + (errs.length ? '  problems: ' + [...new Set(errs)].join(' | ')
                                  : '  ✓ no page errors, no 404s'));
  if (errs.length) fail++;
  console.log(`\nPASS ${pass}  FAIL ${fail}`);
  await br.close();
  process.exit(fail ? 1 : 0);
})();
