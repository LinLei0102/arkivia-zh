const { chromium } = require('playwright-core');
const { pathToFileURL } = require('url');
const path = require('path');
const fs = require('fs');
const EXE = 'C:/Users/Administrator/AppData/Local/ms-playwright/chromium-1255/chrome-win64/chrome.exe';
(async () => {
  const browser = await chromium.launch({ executablePath: EXE, headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push('PAGEERROR ' + e.message));
  page.on('console', m => { if (m.type() === 'error') errors.push('CONSOLE ' + m.text()); });
  const url = pathToFileURL(path.join(__dirname, '..', 'dist', 'index.html')).href;
  const b64 = fs.readFileSync(path.join(__dirname, '..', 'save', 'endgame-0.27.2.base64.txt'), 'utf8').trim();
  await page.addInitScript((b) => { localStorage.setItem('arkivia-save1', b); localStorage.setItem('arkivia-lang', 'zh'); }, b64);
  await page.goto(url);
  await page.waitForTimeout(1800);

  const report = { residual: [], panels: {}, settingsCats: {}, errors };

  // 侧栏面板
  const panels = {
    inventory: '#inventory-button',
    skills: '#skills-button',
    quests: '#quests-button',
    achievements: '#achievements-button'
  };
  for (const [name, sel] of Object.entries(panels)) {
    await page.evaluate((s) => { const el = document.querySelector(s); el.style.display = ''; el.click(); }, sel);
    await page.waitForTimeout(250);
    report.panels[name] = await page.evaluate(() => {
      const m = document.querySelector('.sidebar-menu:not([style*="none"])');
      return m ? m.innerText.slice(0, 400) : null;
    });
  }

  // 设置各分类
  await page.click('#settings-button');
  await page.waitForTimeout(300);
  const catCount = await page.evaluate(() => document.querySelectorAll('.settings-category').length);
  for (let i = 1; i <= catCount; i++) {
    const name = await page.evaluate((n) => { const el = document.querySelectorAll('.settings-category')[n-1]; el.click(); return el.textContent; }, i);
    await page.waitForTimeout(120);
    const txt = await page.evaluate(() => document.getElementById('settings-options').innerText.slice(0, 500));
    report.settingsCats[name] = txt;
  }
  await page.click('#settings-button');

  // 场景遍历（带状态）
  const scenes = ['intro1','intro5','intro9','home','storage','table','sleep','housingArea','townCenter','noticeBoard','trainingGrounds','trainingGroundsInstructor','trainingGroundsInstructor_askStats','trainingGrounds_nextLevel','dojo','dojoYard','dojoGolems','dojoInstructor','dojoInstructorQuest','alley','hospital','merchant','merchantSell','townNorth','park','parkExplore','weaponShop','theArenaEntrance','theArenaSignupIntro','theArenaSignupIntro1','theArenaWalkIn','theArenaFight','theArenaMedbay','theArenaWinMatch','townGatesNorth','townGatesNorthExterior','grassPlains','forestLayer1','forestLayer1Explore','forestLayer1Clear','forestHunt','huntersGuild','huntersGuildIntro','huntersGuildFireplace','huntersGuildMissions','huntersGuildEls','huntersGuildElsQuest','huntersGuildHeal','forestLayer2','forestMineEntrance','forestMine','forestGym','forestGymTrainer','forestGymTrainerMembershipAsk','forestGymTrainerCharmAsk','craftConfirm','empty','theArenaResignWait'];
  const texts = {};
  for (const s of scenes) {
    const txt = await page.evaluate((name) => {
      try {
        arenaData = { round: 3 };
        combatStatus['enemy'] = 'strawGolem'; combatStatus['enemyMaxHealth'] = 150; combatStatus['enemyHealth'] = 150;
        combatStatus['enemyStats'] = { str: 1, def: 2, spd: 1, dex: 0.5 };
        craftStatus['selected'] = 'strawBasket';
        if (!scenes[name]) { return 'MISSING SCENE'; }
        sceneManager(name);
        return document.getElementById('main').innerText;
      } catch (e) { return 'ERR ' + e.message; }
    }, s);
    texts[s] = txt;
    const words = (txt.match(/[A-Za-z][A-Za-z']{2,}/g) || []).filter(w => w !== 'Arkivia');
    if (words.length && !txt.startsWith('ERR') && txt !== 'MISSING SCENE') report.residual.push({ scene: s, words: [...new Set(words)] });
  }
  fs.writeFileSync(path.join(__dirname, 'scan-result.json'), JSON.stringify({ report, texts }, null, 1));
  console.log('PANELS', JSON.stringify(report.panels, null, 1).slice(0, 1800));
  console.log('SETTING CATS', JSON.stringify(Object.keys(report.settingsCats)));
  console.log('RESIDUAL', JSON.stringify(report.residual, null, 1));
  console.log('MISSING', JSON.stringify(Object.entries(texts).filter(([k,v]) => v === 'MISSING SCENE' || v.startsWith('ERR')).map(([k,v]) => k + ': ' + v.slice(0,60))));
  console.log('ERRORS', JSON.stringify(errors.slice(0, 10)));
  await browser.close();
})();