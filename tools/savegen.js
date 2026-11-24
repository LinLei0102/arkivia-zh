const { chromium } = require('playwright-core');
const { pathToFileURL } = require('url');
const path = require('path');
const fs = require('fs');
const DIST = path.join(__dirname, '..', 'dist');
const OUT = path.join(__dirname, '..', 'save');
const EXE = 'C:/Users/Administrator/AppData/Local/ms-playwright/chromium-1255/chrome-win64/chrome.exe';
(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch({ executablePath: EXE, headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();
  const url = pathToFileURL(path.join(DIST, 'index.html')).href;
  await page.addInitScript(() => { localStorage.setItem('arkivia-lang', 'zh'); localStorage.removeItem('arkivia-save1'); });
  await page.goto(url);
  await page.waitForTimeout(1200);

  const data = await page.evaluate(() => {
    const log = [];
    try {
      for (const skill of Object.keys(skillData)) { skills[skill] = 3000; }
      battleStats = { str: 25, def: 25, spd: 25, dex: 25 };
      xp = 24000;
      money = 2500;
      energy = 100;
      health = calcMaxHp();
      knownRecipes = Object.keys(itemData).filter(id => itemData[id]['crafting']);
      const curated = {
        straw: 5, wood: 3, stone: 2, grass: 3, apple: 2,
        basicHealthPotion: 2, exercisePill: 2, strawBasket: 3
      };
      for (const [id, amount] of Object.entries(curated)) {
        if (itemData[id]) { inventory[id] = amount; }
      }
      const nonStack = ['copperSword', 'woodenAxe', 'strawHelmet', 'strawChestplate', 'strawBracers', 'strawLeggings', 'strawPendant'];
      for (const id of nonStack) {
        if (itemData[id]) {
          changeInventory(id, 1, null, null, { ignoreWeightLimit: true });
          const keys = Object.keys(inventoryNonStackable);
          const newId = keys[keys.length - 1];
          if (newId) { try { changeEquipment(newId); } catch (e) { log.push('equip fail ' + id + ' ' + e.message); } }
        }
      }
      achievements = Object.keys(achievementData);
      completedQuests = Object.keys(questData).filter(q => questData[q]['repeatable'] === false);
      team = 'nextLevel';
      storageAccess = true;
      stats['discoveredItems'] = Object.keys(itemData);
      stats['totalKills'] = stats['totalKills'] || 120;
      stats['kills'] = stats['kills'] || {};
      for (const e of Object.keys(enemyData)) { stats['kills'][e] = 12; }
      checks['forestLayer1EnemiesRemaining'] = 0;
      checks['trainingGroundsTeamIntro'] = true;
      checks['arenaParticipated'] = true;
      sceneManager('townCenter');
      const dict = makeSave();
      dict['version'] = VERSION;
      const bin = bytesToBinary(MessagePack.encode(dict));
      const packed = LZString.compressToUint8Array(bin);
      let b64 = '';
      const chunk = 0x8000;
      for (let i = 0; i < packed.length; i += chunk) {
        b64 += String.fromCharCode.apply(null, packed.subarray(i, i + chunk));
      }
      return { log: log, base64: btoa(b64), bytes: packed.length, level: xpToLevel(xp), hp: health, scene: currentScene };
    } catch (e) { return { err: e.message, stack: e.stack }; }
  });
  if (data.err) { console.log('ERR', data.err, data.stack); process.exit(1); }
  console.log('built save bytes', data.bytes, 'level', data.level, 'hp', data.hp, 'scene', data.scene, 'log', JSON.stringify(data.log));
  const buf = Buffer.from(data.base64, 'base64');
  fs.writeFileSync(path.join(OUT, 'endgame-0.27.2.sav'), buf);
  fs.writeFileSync(path.join(OUT, 'endgame-0.27.2.base64.txt'), data.base64);
  console.log('save written', buf.length);

  // 验证：写入 localStorage 后重载
  const page2 = await ctx.newPage();
  await page2.addInitScript((b64) => { localStorage.setItem('arkivia-save1', b64); localStorage.setItem('arkivia-lang', 'zh'); }, data.base64);
  await page2.goto(url);
  await page2.waitForTimeout(2000);
  const check = await page2.evaluate(() => ({
    title: document.getElementById('title').textContent,
    str: document.getElementById('stat-str').textContent,
    main: document.getElementById('main').innerText.slice(0, 200),
    level: document.getElementById('level').textContent,
    log: document.getElementById('log').innerText.slice(0, 200)
  }));
  console.log('VERIFY', JSON.stringify(check, null, 1));
  await page2.screenshot({ path: path.join(__dirname, 'shot-endgame.png') });
  await browser.close();
})();