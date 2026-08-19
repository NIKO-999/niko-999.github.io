module.exports = async (p) => {
  await p.evaluate(() => {
    const S = ['18:00','22:00','02:00','06:00','10:00'];
    const setups = ['CISD','SMT','PSP','Sweep','Gap'];
    const runs = []; let k = 0;
    const t = new Date(); t.setHours(0,0,0,0);
    const rnd = (() => { let s = 7; return () => (s = (s * 1103515245 + 12345) % 2147483648) / 2147483648; })();
    for (let back = 0; back < 56; back++) {
      const d = new Date(t); d.setDate(d.getDate() - back);
      const wd = (d.getDay() + 6) % 7;
      if (back > 40 && rnd() < 0.45) continue;
      if (rnd() > (wd < 5 ? 0.8 : 0.3)) continue;
      const n = 1 + (rnd() < 0.35 ? 1 : 0) + (rnd() < 0.12 ? 1 : 0);
      for (let i = 0; i < n; i++) {
        const j = rnd() < 0.32;
        runs.push({ id: 'x' + (k++), date: iso(d),
          sess: S[Math.floor(rnd() * (back < 20 ? 4 : 5))],
          setup: setups[Math.floor(rnd() * setups.length)],
          mode: rnd() < 0.6 ? 'continuation' : 'reversal',
          note: j ? 'Waited for the close beyond the body, then the CISD. Clean.' : '',
          checks: (() => {
            const list = CHECKLISTS[rnd() < 0.6 ? 'continuation' : 'reversal'];
            return list.filter((_, ix) => rnd() < [0.95, 0.9, 0.72, 0.66, 0.8, 0.34][ix]);
          })(),
          of: 6,
          r: j ? Math.round((rnd() * 5 - 1.2) * 10) / 10 : undefined,
          at: Date.now() - back * 8.64e7 - i });
      }
    }
    localStorage.setItem('backtest.v1', JSON.stringify({ runs }));
  });
};
