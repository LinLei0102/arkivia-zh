const { chromium } = require('playwright-core');
const { pathToFileURL } = require('url');
const path = require('path');
const EXE = 'C:/Users/Administrator/AppData/Local/ms-playwright/chromium-1255/chrome-win64/chrome.exe';
(async () => {
  const browser = await chromium.launch({ executablePath: EXE, headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errs = [];
  page.on('pageerror', e => errs.push(e.message));
  await page.addInitScript(() => { localStorage.clear(); });
  await page.goto(pathToFileURL(path.join(__dirname, '..', 'dist', 'index.html')).href);
  await page.waitForTimeout(1200);
  const first = await page.evaluate(() => ({ main: document.getElementById('main').innerText, buttons: [...document.querySelectorAll('#main button')].map(b => b.textContent) }));
  console.log('INTRO', JSON.stringify(first));
  await page.click('#main button');
  await page.waitForTimeout(400);
  console.log('AFTER CLICK', JSON.stringify(await page.evaluate(() => document.getElementById('main').innerText)));
  // 森林健身房会员链接
  const gym = await page.evaluate(() => {
    energy = 100; health = 300; battleStats = { str: 20, def: 20, spd: 20, dex: 20 }; money = 1000;
    sceneManager('forestGym');
    const t1 = [...document.querySelectorAll('#main button')].map(b => b.textContent);
    sceneManager('forestGymTrainerMembershipAsk');
    const t2 = [...document.querySelectorAll('#main button')].map(b => b.textContent);
    sceneManager('huntersGuildMissions');
    const t3 = document.getElementById('main').innerText.slice(0, 200);
    return { gymLinks: t1, memberLinks: t2, missions: t3 };
  });
  console.log('GYM', JSON.stringify(gym, null, 1));
  await page.screenshot({ path: path.join(__dirname, 'shot-gym.png') });
  console.log('ERRORS', JSON.stringify(errs.slice(0, 5)));
  await browser.close();
})();