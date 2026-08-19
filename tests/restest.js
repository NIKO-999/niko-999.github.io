/* Resources: the approach panel, the saved links, the editor. */
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

  // ── the rail ───────────────────────────────────────────────────
  ok('rail has a Resources tab', await p.locator('.rail [data-view="resources"]').count() === 1);
  /* Relative order, not the whole list — the rail keeps gaining views,
     and pinning every one of them here just breaks on each addition
     without ever catching the thing this cares about. */
  ok('Resources sits at the very foot of the rail, below the scales', await p.evaluate(() => {
    const v = [...document.querySelectorAll('.rail [data-view]')].map(b => b.dataset.view);
    return v.indexOf('resources') === v.length - 1 && v.indexOf('resources') > v.indexOf('risk');
  }));

  await p.click('.rail [data-view="resources"]');
  await p.waitForTimeout(250);
  ok('the section shows', await p.locator('#resourcesSection').isVisible());
  ok('every other section is hidden', await p.evaluate(() =>
    [...document.querySelectorAll('main.main')].filter(m => !m.hidden).length === 1));
  ok('the tab is marked current', await p.locator('.rail [data-view="resources"]')
    .getAttribute('aria-current') === 'page');

  // ── the topic rail ─────────────────────────────────────────────
  ok('a pill per note, then All links', await p.evaluate(() =>
    [...document.querySelectorAll('#tpRail button')].map(b => b.dataset.topic).join()
    === NOTES.map(n => n.id).concat('all').join()));
  ok('the first note is selected', await p.evaluate(() =>
    document.querySelector('#tpRail button[aria-selected="true"]').dataset.topic === NOTES[0].id));

  // ── the approach ───────────────────────────────────────────────
  ok('the panel is built from the record, not markup', await p.evaluate(() =>
    document.querySelector('#apWrap .ap-lede').textContent.trim() === NOTES[0].lede));
  ok('four situations', await p.locator('.ap-grid .ap-s').count() === 4);
  ok('seven rules', await p.locator('.ap-rules > li').count() === 7);
  ok('exactly one note owns the sheet lists', await p.evaluate(() =>
    NOTES.filter(n => n.lists).length === 1));
  ok('and this is not it', await p.locator('.ap-lists .ap-list').count() === 0);

  // the note that does
  const owner = await p.evaluate(() => NOTES.find(n => n.lists).id);
  await p.click(`#tpRail [data-topic="${owner}"]`);
  await p.waitForTimeout(250);
  ok('two checklists printed there', await p.locator('.ap-lists .ap-list').count() === 2);
  const CH = await p.evaluate(() => [CHECKLISTS.reversal, CHECKLISTS.continuation]);
  const lists = await p.evaluate(() => ({
    page: [...document.querySelectorAll('.ap-list')].map(d =>
      [...d.querySelectorAll('li')].map(li => li.textContent.trim())),
    src: [CHECKLISTS.reversal, CHECKLISTS.continuation],
  }));
  ok('the printed lists ARE the constant the sheet ticks',
    JSON.stringify(lists.page) === JSON.stringify(lists.src), lists);
  /* The same length as each other, whatever that length is. Pinning the
     number here breaks the suite every time the method gains a step,
     which is the fastest way to teach someone to ignore a red test. */
  ok('both lists are the same length',
    lists.src[0].length === lists.src[1].length, lists.src.map(l => l.length));
  /* The funnel: they open the same way, and they end the same way —
     the last two are the change in delivery and the protected swing,
     which neither kind of entry goes without. */
  const LAST = lists.src[0].length - 1;
  ok('both walk the same funnel — same first, second and last two steps',
    [0, 1, LAST - 1, LAST].every(i => CH[0][i] === CH[1][i]), CH);
  ok('and diverge only at three and four',
    [2, 3].every(i => CH[0][i] !== CH[1][i]), CH);
  await p.click('#tpRail [data-topic="' + (await p.evaluate(() => NOTES[0].id)) + '"]');
  await p.waitForTimeout(250);

  // the sheet ticks the same wording
  await p.click('.rail [data-view="calendar"]');
  await p.waitForTimeout(200);
  const sheetRules = await p.evaluate(() => {
    openTrade('2026-03-06');
    return [...document.querySelectorAll('.checks li')].map(x => x.textContent.trim());
  });
  ok('the trade sheet shows one of the new lists',
    sheetRules.length === lists.src[0].length && lists.src.some(l =>
      l.every((x, i) => sheetRules[i].includes(x))), sheetRules);
  await p.keyboard.press('Escape');
  await p.click('.rail [data-view="resources"]');
  await p.waitForTimeout(200);

  // ── the seeded link ────────────────────────────────────────────
  const SD = await p.evaluate(() => SEED.map(r => ({ note: r.note || '', marks: r.marks.length })));
  const NIDS = await p.evaluate(() => NOTES.map(n => n.id));
  ok('every seeded link is filed under a real note',
    SD.every(r => NIDS.includes(r.note)), SD.map(r => r.note));
  ok('and every note has one', NIDS.every(id => SD.some(r => r.note === id)), NIDS);
  const here = SD.filter(r => r.note === NIDS[0]).length;
  ok('the rail shows only this note\'s', await p.locator('.rs').count() === here);
  ok('four marks — the worked examples only', await p.locator('.rs-mark').count() === 4);
  const allMarks = SD.reduce((n, r) => n + r.marks, 0);
  ok('the meta counts every link, not the filtered ones',
    (await p.locator('#resMeta').textContent()).trim() === `${SD.length} saved · ${allMarks} marks`,
    await p.locator('#resMeta').textContent());
  ok('and the header says how many are shown',
    (await p.locator('#resCount').textContent()).trim() === `${here} of ${SD.length}`,
    await p.locator('#resCount').textContent());
  /* The timestamp is the mark's FIRST b — notes now bold terms like C3
     and EQ inside themselves, so a bare `.rs-mark b` picks those up too. */
  ok('marks are in order and formatted', await p.evaluate(() =>
    [...document.querySelectorAll('.rs-mark')].map(m => m.querySelector('b').textContent.trim()).join(',')
    === '12:32,16:26,20:56,24:44'),
    await p.evaluate(() => [...document.querySelectorAll('.rs-mark')].map(m => m.querySelector('b').textContent.trim())));
  ok('the seeded link is the real one', await p.evaluate(() =>
    SEED[0].url === 'https://youtu.be/nMAL3VXTr8M'));
  ok('so the marks are live from the start', await p.evaluate(() =>
    [...document.querySelectorAll('.rs-mark')].every(x => !x.disabled)));
  ok('and no "paste the link in" hint', await p.locator('.rs-hint').count() === 0);
  ok('the tile draws the continuation profile', await p.locator('.rs-art .rs-diag').count() === 1);
  ok('nothing was written to disk just by looking',
    await p.evaluate(() => localStorage.getItem('ledger.res.v1')) === null);
  ok('the seed is not in the ledger key', await p.evaluate(() =>
    (localStorage.getItem('ledger.v1') || '') === ''));

  // clicking one is the first thing that writes
  ok('a youtu.be link still deep-links', await p.evaluate(() => {
    window.open = (u) => { window.__u = u; return null; };
    document.querySelectorAll('.rs-mark')[0].click();
    return true;
  }) && await p.evaluate(() => window.__u) === 'https://www.youtube.com/watch?v=nMAL3VXTr8M&t=752s');

  // ── paste a link in ────────────────────────────────────────────
  await p.click('.rs-edit');
  await p.waitForTimeout(250);
  ok('the editor opens on the seeded card', await p.locator('#rsTitle').textContent() === 'Edit link');
  ok('and carries the link', await p.inputValue('#rsUrl') === 'https://youtu.be/nMAL3VXTr8M');
  ok('marks round-trip into the textarea', await p.evaluate(() => {
    const v = document.getElementById('rsMarks').value.split('\n');
    return v.length === 4 && v[0].startsWith('12:32  ') && v[3].startsWith('24:44  ');
  }), await p.inputValue('#rsMarks'));
  await p.fill('#rsUrl', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ');
  await p.click('#rsForm button[type="submit"]');
  await p.waitForTimeout(300);
  ok('the whole seed materialises on the first write', await p.evaluate(() =>
    JSON.parse(localStorage.getItem('ledger.res.v1')).length === SEED.length));
  ok('the marks became live', await p.evaluate(() =>
    [...document.querySelectorAll('.rs-mark')].every(x => !x.disabled)));
  ok('the source line names the host',
    (await p.locator('.rs-src').textContent()).includes('youtube.com'));

  // clicking a mark opens the right second
  const opened = [];
  p.on('popup', pop => { opened.push(pop.url()); pop.close().catch(() => {}); });
  await p.evaluate(() => { window.open = (u) => { window.__u = u; return null; }; });
  await p.locator('.rs-mark').nth(2).click();
  await p.waitForTimeout(300);
  ok('a mark deep-links to its own second', await p.evaluate(() => window.__u)
    === 'https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=1256s');
  ok('and stamps the day it was opened',
    (await p.locator('.rs-open').textContent()).trim() === 'opened today');

  // ── add one of your own ────────────────────────────────────────
  await p.click('#resAdd');
  await p.waitForTimeout(200);
  ok('the editor opens empty', await p.evaluate(() =>
    document.getElementById('rsName').value === '' && document.getElementById('rsMarks').value === ''
    && document.getElementById('rsDelete').hidden));
  await p.fill('#rsName', 'Position sizing that survives a streak');
  await p.selectOption('#rsKind', 'read');
  await p.fill('#rsLen', '11 min read');
  await p.fill('#rsSum', 'The table near the end is the only part I reread.');
  await p.fill('#rsTags', 'risk, sizing');
  await p.fill('#rsMarks', '1:02:30  the table\nnot a time at all\n0:15 early bit');
  await p.click('#rsForm button[type="submit"]');
  await p.waitForTimeout(300);
  ok('two cards now', await p.locator('.rs').count() === 2);
  ok('the new one is on top', (await p.locator('.rs-title').first().textContent())
    .includes('Position sizing'));
  ok('a line with no readable time is dropped, not saved at zero', await p.evaluate(() =>
    JSON.parse(localStorage.getItem('ledger.res.v1'))[0].marks.length === 2));
  ok('marks are sorted by time', await p.evaluate(() =>
    JSON.parse(localStorage.getItem('ledger.res.v1'))[0].marks.map(m => m.t).join() === '15,3750'));
  ok('an hour-long stamp reads as one', await p.evaluate(() =>
    [...document.querySelectorAll('.rs')][0].querySelectorAll('.rs-mark b')[1].textContent.trim()
    === '1:02:30'));
  ok('reading gets no play glyph', await p.evaluate(() =>
    !document.querySelectorAll('.rs')[0].querySelector('.rs-art svg[fill="currentColor"]')));
  ok('tags render', await p.evaluate(() =>
    [...document.querySelectorAll('.rs')[0].querySelectorAll('.rs-tag')]
      .map(x => x.textContent).join() === 'risk,sizing'));
  ok('meta recounts', (await p.locator('#resMeta').textContent()).trim()
    === `${SD.length + 1} saved · ${allMarks + 2} marks`,
    await p.locator('#resMeta').textContent());

  // ── a thumbnail of your own ────────────────────────────────────
  await p.locator('.rs-edit').nth(1).click();     // the seeded card
  await p.waitForTimeout(250);
  ok('the thumbnail starts empty', await p.evaluate(() =>
    !document.getElementById('rsThumb').classList.contains('has')));
  await p.evaluate(async () => {
    const c = document.createElement('canvas');
    c.width = 300; c.height = 170;
    const x = c.getContext('2d');
    x.fillStyle = '#fff'; x.fillRect(0, 0, 300, 170);
    x.fillStyle = '#000'; x.fillRect(40, 30, 30, 80);
    const blob = await new Promise(r => c.toBlob(r, 'image/png'));
    await takeRsThumb(new File([blob], 'shot.png', { type: 'image/png' }));
  });
  await p.waitForTimeout(300);
  ok('the picker takes an image', await p.evaluate(() =>
    document.getElementById('rsThumb').classList.contains('has')));
  await p.click('#rsForm button[type="submit"]');
  await p.waitForTimeout(600);
  ok('the card shows it instead of the drawing', await p.evaluate(() => {
    const art = [...document.querySelectorAll('.rs-art')][1];
    return art.classList.contains('has') && /^url\(/.test(art.style.backgroundImage);
  }));
  ok('the image is not in localStorage', await p.evaluate(() =>
    !/blob|data:image/.test(localStorage.getItem('ledger.res.v1'))));
  await p.reload({ waitUntil: 'networkidle' });
  await p.waitForTimeout(500);
  await p.click('.rail [data-view="resources"]');
  await p.waitForTimeout(600);
  ok('and survives a reload', await p.evaluate(() =>
    [...document.querySelectorAll('.rs-art')][1].classList.contains('has')));

  // ── survives a reload ──────────────────────────────────────────
  await p.reload({ waitUntil: 'networkidle' });
  await p.waitForTimeout(400);
  await p.click('.rail [data-view="resources"]');
  await p.waitForTimeout(200);
  ok('both survive a reload', await p.locator('.rs').count() === 2);

  // ── remove ─────────────────────────────────────────────────────
  p.on('dialog', d => d.accept());
  await p.locator('.rs-edit').first().click();
  await p.waitForTimeout(200);
  await p.click('#rsDelete');
  await p.waitForTimeout(300);
  ok('removing one leaves the rest', await p.evaluate(() =>
    JSON.parse(localStorage.getItem('ledger.res.v1')).length === SEED.length));
  await p.click('#tpRail [data-topic="all"]');
  await p.waitForTimeout(250);
  ok('All links shows every one that is left',
    await p.locator('.rs').count() === SD.length);
  /* Empty it, one at a time, so the empty state is reached honestly. */
  for (let i = 0; i < SD.length + 2 && await p.locator('.rs').count(); i++) {
    await p.locator('.rs-edit').first().click();
    await p.waitForTimeout(200);
    await p.click('#rsDelete');
    await p.waitForTimeout(300);
  }
  ok('removing the seeded ones keeps them gone', await p.locator('.rs').count() === 0);
  ok('and says so rather than showing the seed again',
    (await p.locator('.rs-none').textContent()).includes('Nothing saved'));
  await p.reload({ waitUntil: 'networkidle' });
  await p.waitForTimeout(400);
  await p.click('.rail [data-view="resources"]');
  await p.waitForTimeout(200);
  ok('still gone after a reload', await p.locator('.rs').count() === 0);

  // ── topics ─────────────────────────────────────────────────────
  await p.evaluate(() => {
    localStorage.removeItem('ledger.topic.v1');
    localStorage.setItem('ledger.res.v1', JSON.stringify([
      { id: 'a', kind: 'video', title: 'Filed', url: '', note: 'align-4h', marks: [], tags: [] },
      { id: 'b', kind: 'read',  title: 'Unfiled', url: '', note: '', marks: [], tags: [] },
    ]));
  });
  await p.reload({ waitUntil: 'networkidle' });
  await p.waitForTimeout(400);
  await p.click('.rail [data-view="resources"]');
  await p.waitForTimeout(250);
  ok('a topic shows its own links and anything unfiled',
    (await p.locator('.rs-title').allTextContents()).join() === 'Filed,Unfiled');
  ok('the heading names what the list is',
    (await p.locator('#resHead').textContent()) === 'What it came from');

  await p.click('#tpRail [data-topic="all"]');
  await p.waitForTimeout(250);
  ok('All links drops the note panel', await p.locator('#apWrap .ap').count() === 0);
  ok('and still shows everything', await p.locator('.rs').count() === 2);
  ok('with its own heading', (await p.locator('#resHead').textContent()) === 'Every link');

  await p.reload({ waitUntil: 'networkidle' });
  await p.waitForTimeout(400);
  await p.click('.rail [data-view="resources"]');
  await p.waitForTimeout(250);
  ok('the rail remembers where you were', await p.evaluate(() =>
    document.querySelector('#tpRail button[aria-selected="true"]').dataset.topic === 'all'));

  // adding a note is adding a record — nothing else
  await p.evaluate(() => {
    NOTES.push({ id: 'second', title: 'Liquidity', sub: 'a second model',
      lede: 'Written up from the next video.',
      sit: [{ n: '01', h: 'One', p: 'p', li: ['a'] }],
      rules: [['R', 'why']] });
    TOPIC = 'second';
    renderRes();
  });
  await p.waitForTimeout(250);
  ok('a second note needs no markup', await p.evaluate(() =>
    document.querySelectorAll('#tpRail button').length === NOTES.length + 1
    && document.querySelector('#apWrap h2').textContent === 'Liquidity'
    && document.querySelector('#apWrap .ap-lede').textContent.includes('next video')));
  ok('and only the live model prints the checklists',
    await p.locator('#apWrap .ap-list').count() === 0);
  ok('its list starts with just the unfiled ones',
    (await p.locator('.rs-title').allTextContents()).join() === 'Unfiled');
  await p.evaluate(() => { NOTES.pop(); TOPIC = 'align-4h'; renderRes(); });

  // ── the backup carries them ────────────────────────────────────
  await p.evaluate(() => {
    localStorage.setItem('ledger.res.v1', JSON.stringify(
      [{ id: 'x', kind: 'video', title: 'One', url: '', len: '', sum: '', marks: [{ t: 5, s: 'a' }], tags: [] }]));
  });
  await p.reload({ waitUntil: 'networkidle' });
  await p.waitForTimeout(400);
  const payload = await p.evaluate(() => {
    let held = null;
    const orig = URL.createObjectURL;
    URL.createObjectURL = (blob) => { held = blob; return orig.call(URL, blob); };
    document.getElementById('backupBtn').click();
    document.getElementById('bkSave').click();
    URL.createObjectURL = orig;
    return held.text();
  });
  const file = JSON.parse(payload);
  ok('the copy carries the links', Array.isArray(file.res) && file.res.length === 1, file.res);
  ok('and still carries the events', Array.isArray(file.events));

  ok('no page errors through all of that', errs.length === 0, errs);

  console.log(`\n${pass} passed, ${fail} failed`);
  await b.close();
  process.exit(fail ? 1 : 0);
})();
