const { chromium } = require('playwright-core');
const { pathToFileURL } = require('url');
const path = require('path');
const EXE = 'C:/Users/Administrator/AppData/Local/ms-playwright/chromium-1255/chrome-win64/chrome.exe';
(async () => {
  const browser = await chromium.launch({ executablePath: EXE, headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  const importUrl = pathToFileURL(path.join(__dirname, '..', 'save', 'import.html')).href;
  await page.goto(importUrl);
  await page.waitForTimeout(300);
  console.log('IMPORT PAGE TEXT:', (await page.evaluate(() => document.getElementById('status').textContent)));
  await page.click('#do-import-open');
  await page.waitForTimeout(3000);
  const res = await page.evaluate(() => ({
    url: location.href.split('/').slice(-2).join('/'),
    lang: window.ARK_LANG,
    level: document.getElementById('level') ? document.getElementById('level').textContent : null,
    main: document.getElementById('main') ? document.getElementById('main').innerText.slice(0, 120) : null,
    backup: !!localStorage.getItem('arkivia-save1-backup-l10n'),
    items: document.getElementById('inventory-table') ? document.getElementById('inventory-table').innerText.slice(0, 80) : null
  }));
  console.log('AFTER IMPORT', JSON.stringify(res, null, 1));
  await page.screenshot({ path: path.join(__dirname, 'shot-import.png') });
  console.log('ERRORS', JSON.stringify(errors.slice(0,5)));
  await browser.close();
})();