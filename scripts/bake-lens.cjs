// Re-bakes src/blur after changing the demo window: node scripts/bake-lens.cjs <abs path to dist/index.html> /tmp/bake && python3 scripts/lens-blur.py /tmp/bake src/blur  (needs playwright)
const { chromium } = require('playwright'); const fs = require('fs');
(async () => {
  const [file, outDir] = process.argv.slice(2);
  const b = await chromium.launch({ args: ['--font-render-hinting=none'] });
  const p = await b.newPage({ viewport: { width: 1536, height: 960 }, deviceScaleFactor: 1 });
  p.on('pageerror', e => console.log('PAGEERROR', e.message));
  await p.goto('file://' + file + '?bakelist');
  await p.waitForFunction(() => document.body.dataset.ready === '1', null, { timeout: 20000 });
  const list = await p.evaluate(() => window.__BAKE__);
  fs.mkdirSync(outDir, { recursive: true });
  for (const it of list) {
    await p.goto('file://' + file + '?bake=' + it.key);
    await p.waitForFunction(() => document.body.dataset.ready === '1', null, { timeout: 20000 });
    await (await p.$('#bake-root')).screenshot({ path: `${outDir}/${it.key}.png`, omitBackground: true });
  }
  fs.writeFileSync(outDir + '/keys.json', JSON.stringify(list.map(x => x.key)));
  console.log('baked', list.length); await b.close();
})().catch(e => { console.error('ERR', e.message); process.exit(1); });
