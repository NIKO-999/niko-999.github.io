/* The two entry models — that both landed, that they disagree on the one
   thing they are supposed to disagree on, and that neither of them
   smuggled in an instrument name or the phrase this account does not use. */
const { chrome, BASE } = require('./lib');
const { chromium } = require('playwright-core');

let pass = 0, fail = 0;
const ok = (name, cond, extra) => {
  if (cond) { pass++; console.log('  ok  ' + name); }
  else { fail++; console.log('FAIL  ' + name + (extra !== undefined ? '  → ' + JSON.stringify(extra) : '')); }
};

(async () => {
  const b = await chromium.launch({ executablePath: chrome(), args: ['--no-sandbox'] });
  const p = await b.newPage({ viewport: { width: 1512, height: 950 } });
  const errs = [];
  p.on('pageerror', e => errs.push(String(e)));
  p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  await p.goto(`${BASE}/trading/`, { waitUntil: 'networkidle' });
  await p.waitForTimeout(400);
  ok('no page errors on load', errs.length === 0, errs);

  await p.click('.rail [data-view="resources"]');
  await p.waitForTimeout(250);

  // ── both notes exist and are reachable ─────────────────────────
  for (const id of ['continuation', 'reversal']) {
    ok(`${id}: a pill in the rail`, await p.locator(`#tpRail [data-topic="${id}"]`).count() === 1);
  }
  ok('continuation is offered before reversal', await p.evaluate(() => {
    const v = [...document.querySelectorAll('#tpRail button')].map(x => x.dataset.topic);
    return v.indexOf('continuation') < v.indexOf('reversal');
  }));
  ok('neither displaced the default topic', await p.evaluate(() =>
    document.querySelector('#tpRail button[aria-selected="true"]').dataset.topic === NOTES[0].id));

  const seen = {};
  for (const id of ['continuation', 'reversal']) {
    await p.click(`#tpRail [data-topic="${id}"]`);
    await p.waitForTimeout(220);
    const got = await p.evaluate(() => ({
      lede: document.querySelector('#apWrap .ap-lede').textContent.trim(),
      sits: [...document.querySelectorAll('.ap-grid .ap-s')].map(s => s.querySelector('h3 span').textContent),
      rules: [...document.querySelectorAll('.ap-rules > li > b')].map(x => x.textContent),
      check: [...document.querySelectorAll('.ap-lists .ap-list li')].map(x => x.textContent.trim()),
      checkH: (document.querySelector('.ap-lists .ap-list h3') || {}).textContent || '',
      lists: document.querySelectorAll('.ap-lists .ap-list').length,
      diag: !!document.querySelector('#apWrap') && document.querySelectorAll('.rs-card .rs-diag').length,
      text: document.getElementById('resourcesSection').innerText,
    }));
    seen[id] = got;
    ok(`${id}: six situations`, got.sits.length === 6, got.sits);
    ok(`${id}: ten rules`, got.rules.length === 10, got.rules.length);
    ok(`${id}: a five-line checklist, and only one list`,
       got.lists === 1 && got.check.length === 5, [got.lists, got.check]);
    ok(`${id}: the lede says what it is`, got.lede.length > 200 && /\.$/.test(got.lede));
  }

  // ── the one thing that separates them ──────────────────────────
  ok('continuation asks for ONE stage', /\bONE SMT\b/.test(seen.continuation.lede)
     && /one is enough/i.test(seen.continuation.text));
  ok('reversal asks for TWO', /\bTWO-stage SMT\b/.test(seen.reversal.lede)
     && /Two stages, always/i.test(seen.reversal.text));
  ok('continuation names the contrast', /reversal model needs two/i.test(seen.continuation.text));
  ok('reversal names the fallback', /take the continuation/i.test(seen.reversal.text));
  ok('reversal insists on the close', /Wait for the close\. Always\./.test(seen.reversal.text));
  ok('continuation carries the loss', /had no V/i.test(seen.continuation.text));

  // ── the links ──────────────────────────────────────────────────
  const links = await p.evaluate(() => ['continuation', 'reversal'].map(id => {
    const r = resAll().find(x => x.note === id);
    return r && { id: r.id, url: r.url, len: r.len, art: r.art, marks: r.marks.length,
                  diag: !!DIAG[r.art], stamps: r.marks.map(m => m.t) };
  }));
  for (const l of links) {
    ok(`${l.id}: linked, with its own diagram`, l.diag && l.art);
    ok(`${l.id}: five worked examples`, l.marks === 5, l.marks);
    ok(`${l.id}: marks are inside the runtime`, (() => {
      const [m, s] = l.len.split(':').map(Number);
      return l.stamps.every(t => t > 0 && t < m * 60 + s);
    })(), [l.len, l.stamps]);
  }
  ok('the two urls are the ones given', links.map(l => l.url).join() ===
     'https://youtu.be/7Fq5CZorvFA,https://youtu.be/n8xNJJzy5Ic', links.map(l => l.url));
  await p.click('#tpRail [data-topic="all"]');
  await p.waitForTimeout(250);
  ok('both cards render under All links', await p.locator('.rs').count() === 7,
     await p.locator('.rs').count());
  ok('and each of the two drew its own diagram', await p.evaluate(() =>
    ['The continuation model', 'The reversal model'].every(t => {
      const card = [...document.querySelectorAll('.rs')]
        .find(c => (c.querySelector('.rs-title') || {}).textContent === t);
      return card && card.querySelector('.rs-art .rs-diag');
    })));

  // ── the house rules, over everything Resources says ────────────
  /* Scoped to the written-up content, not the whole app: the ledger's
     own sym field is the user typing what THEY traded, and the demo
     trades exercise it. What must stay clean is the prose lifted out of
     somebody else's videos. */
  const all = await p.evaluate(() =>
    [document.getElementById('resourcesSection').innerText,
     JSON.stringify(NOTES), JSON.stringify(SEED)].join('\n'));
  const BANNED = [
    /\bgold\b/i, /\bsilver\b/i, /\bNQ\b/, /\bYM\b/, /\bRTY\b/, /\bES\b/,
    /\bGBP\b/, /\bnasdaq\b/i, /\bdow\b/i, /\bs&p\b/i, /\bindices\b/i,
    /instagram/i, /\bcomment(s)? (down )?below\b/i, /\bmy video\b/i, /\byou guys\b/i,
  ];
  BANNED.forEach(re => ok('nothing says ' + re, !re.test(all),
    (all.match(re) || []).concat(all.split('\n').filter(l => re.test(l)).slice(0, 2))));
  ok('order block is never used — it is CISD', !/order block/i.test(all),
     all.split('\n').filter(l => /order block/i.test(l)).slice(0, 3));
  ok('CISD appears in both new notes',
     /CISD/.test(seen.continuation.text) && /CISD/.test(seen.reversal.text));

  ok('still no page errors', errs.length === 0, errs);

  console.log(`\n${pass} passed, ${fail} failed`);
  await b.close();
  process.exit(fail ? 1 : 0);
})();
