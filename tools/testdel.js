const { chromium } = require('playwright-core');
const { pathToFileURL } = require('url');
const path = require('path');
const EXE = 'C:/Users/Administrator/AppData/Local/ms-playwright/chromium-1255/chrome-win64/chrome.exe';
(async () => {
  const browser = await chromium.launch({ executablePath: EXE, headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.addInitScript(() => { localStorage.clear(); localStorage.setItem('arkivia-lang', 'zh'); });
  await page.goto(pathToFileURL(path.join(__dirname, '..', 'dist', 'index.html')).href);
  await page.waitForTimeout(1200);
  const discard = await page.evaluate(() => {
    const el = document.getElementById('inventory-discard');
    const r = el.getBoundingClientRect();
    return { text: el.textContent, w: Math.round(r.width), h: Math.round(r.height), left: Math.round(r.left), top: Math.round(r.top) };
  });
  console.log('DISCARD', JSON.stringify(discard));
  await page.hover('#inventory-discard');
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(__dirname, '..', 'docs', 'shots', 'discard-zh.png'), clip: { x: 0, y: 175, width: 340, height: 145 } });
  // 移动端按钮
  const mob = await page.evaluate(() => {
    toggleDebug(document.getElementById('debug-button').style.display === ''); 
    mobileLayout();
    return { del: document.getElementById('delete-save').textContent, conf: document.getElementById('settings-button').textContent };
  }).catch(e => ({ err: e.message }));
  console.log('MOBILE', JSON.stringify(mob));
  await page.waitForTimeout(300);
  await page.screenshot({ path: path.join(__dirname, '..', 'docs', 'shots', 'mobile-zh.png') });
  // 英文模式对照
  await page.evaluate(() => localStorage.setItem('arkivia-lang', 'en'));
  await page.goto(pathToFileURL(path.join(__dirname, '..', 'dist', 'index.html')).href);
  await page.waitForTimeout(1200);
  console.log('EN DISCARD', JSON.stringify(await page.evaluate(() => document.getElementById('inventory-discard').textContent)));
  await browser.close();
})();