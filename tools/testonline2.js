const { chromium } = require('playwright-core');
const EXE = 'C:/Users/Administrator/AppData/Local/ms-playwright/chromium-1255/chrome-win64/chrome.exe';
const BASE = 'https://linlei0102.github.io/arkivia-zh/';
(async () => {
  const browser = await chromium.launch({ executablePath: EXE, headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const bad = [];
  page.on('response', r => { if (r.status() >= 400) bad.push(r.status() + ' ' + r.url()); });
  page.on('pageerror', e => bad.push('JS ' + e.message));

  await page.goto(BASE + 'save.html', { waitUntil: 'networkidle', timeout: 60000 });
  console.log('IMPORT PAGE:', (await page.evaluate(() => document.getElementById('status').textContent)));
  await page.click('#do-import-open');
  await page.waitForTimeout(3500);
  const st = await page.evaluate(() => ({
    url: location.pathname,
    lang: window.ARK_LANG,
    level: document.getElementById('level') ? document.getElementById('level').textContent : null,
    main: document.getElementById('main') ? document.getElementById('main').innerText.slice(0, 80) : null,
    weight: document.getElementById('inventory-weight') ? document.getElementById('inventory-weight').textContent : null
  }));
  console.log('AFTER IMPORT:', JSON.stringify(st));
  await page.screenshot({ path: 'online-endgame.png' });

  // 语言切换
  await page.evaluate(() => localStorage.setItem('arkivia-lang', 'en'));
  await page.goto(BASE, { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForTimeout(2000);
  console.log('EN:', JSON.stringify(await page.evaluate(() => ({ lang: window.ARK_LANG, inv: document.getElementById('inventory-button').textContent, main: document.getElementById('main').innerText.slice(0, 60) }))));
  await page.evaluate(() => localStorage.setItem('arkivia-lang', 'zh'));
  await page.goto(BASE, { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForTimeout(1500);
  console.log('ZH:', JSON.stringify(await page.evaluate(() => ({ lang: window.ARK_LANG, inv: document.getElementById('inventory-button').textContent }))));
  console.log('BAD:', JSON.stringify(bad.slice(0, 8)));
  await browser.close();
})();