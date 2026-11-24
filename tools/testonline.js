const { chromium } = require('playwright-core');
const EXE = 'C:/Users/Administrator/AppData/Local/ms-playwright/chromium-1255/chrome-win64/chrome.exe';
(async () => {
  const browser = await chromium.launch({ executablePath: EXE, headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const bad = [];
  page.on('response', r => { if (r.status() >= 400) bad.push(r.status() + ' ' + r.url()); });
  page.on('pageerror', e => bad.push('JS ' + e.message));
  await page.goto('https://linlei0102.github.io/arkivia-zh/', { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForTimeout(2500);
  const info = await page.evaluate(() => ({ lang: window.ARK_LANG, main: document.getElementById('main').innerText.slice(0, 120), title: document.title, inventory: document.getElementById('inventory-button').textContent }));
  console.log('ONLINE', JSON.stringify(info));
  console.log('BAD', JSON.stringify(bad.slice(0, 8)));
  await page.screenshot({ path: 'online-zh.png' });
  await browser.close();
})();