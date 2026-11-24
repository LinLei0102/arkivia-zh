const { chromium } = require('playwright-core');
const { pathToFileURL } = require('url');
const path = require('path');
const EXE = 'C:/Users/Administrator/AppData/Local/ms-playwright/chromium-1255/chrome-win64/chrome.exe';
(async () => {
  const browser = await chromium.launch({ executablePath: EXE, headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 }, deviceScaleFactor: 4 });
  await page.goto(pathToFileURL(path.join(__dirname, '..', 'dist', 'index.html')).href);
  await page.waitForTimeout(1200);
  const box = await page.evaluate(() => { const r = document.getElementById('inventory-discard').getBoundingClientRect(); return { x: r.left - 6, y: r.top - 6, width: r.width + 14, height: r.height + 12 }; });
  await page.screenshot({ path: path.join(__dirname, '..', 'docs', 'shots', 'discard-zoom.png'), clip: box });
  console.log(JSON.stringify(box));
  await browser.close();
})();