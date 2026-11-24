const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const SRC = fs.readFileSync(path.join(ROOT, 'game.js'), 'utf8');

// 共享补丁（中英两版都打）
const patches = [];

patches.push({
  find: 'function capitaliseFirst(string) {\n    return string.charAt(0).toUpperCase() + string.slice(1)\n}',
  replace: 'function capitaliseFirst(string) {\n    if (window.ARK_WORDS && window.ARK_WORDS[string] !== undefined) {return window.ARK_WORDS[string]}\n    return string.charAt(0).toUpperCase() + string.slice(1)\n}'
});

patches.push({
  find: 'const settingsCategories = {\n',
  replace: 'const settingsCategories = {\n    \"language\": {\n        \"name\": (window.ARK_LANG_NAME || \"Language\"),\n        \"execute\": function(el) {\n            if (window.ARK_LANG_UI) {window.ARK_LANG_UI(el)}\n        }\n    },\n'
});

patches.push({
  find: 'function changeTitle(newTitle) {\n    playerTitle = newTitle',
  replace: 'function changeTitle(newTitle) {\n    if (window.ARK_LEGACY_TITLES && window.ARK_LEGACY_TITLES[newTitle] !== undefined) {newTitle = window.ARK_LEGACY_TITLES[newTitle]}\n    playerTitle = newTitle'
});

patches.push({
  find: '        // End\n        processText(sceneText)',
  replace: '        // End\n        if (sceneText && window.ARK_LANG && scenes[currentScene] && (/[\\u4e00-\\u9fa5]/.test(String(sceneText)) !== (window.ARK_LANG !== \"en\"))) {\n            try {sceneText = scenes[currentScene]()} catch (e) {}\n        }\n        processText(sceneText)'
});

patches.push({
  find: 'function englishifyNumber(n) {\n    const special',
  replace: 'function englishifyNumber(n) {\n    if (window.ARK_LANG && window.ARK_LANG !== \"en\") {return String(n)}\n    const special'
});

let base = SRC;
for (const p of patches) {
  const count = base.split(p.find).length - 1;
  if (count !== 1) {throw new Error('patch anchor count ' + count + ' for: ' + JSON.stringify(p.find).slice(0, 80));}
  base = base.replace(p.find, p.replace);
}
fs.writeFileSync(path.join(__dirname, 'game.base.js'), base);
console.log('base written', base.length);