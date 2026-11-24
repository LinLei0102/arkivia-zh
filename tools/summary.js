const fs=require('fs');
const scan=JSON.parse(fs.readFileSync('scan-result.json','utf8'));
const scenes=Object.keys(scan.texts);
console.log(JSON.stringify({
  scenes: scenes.length,
  missing: scenes.filter(s=>scan.texts[s]==='MISSING SCENE').length,
  errors: scenes.filter(s=>String(scan.texts[s]).startsWith('ERR')).length,
  residual: scan.report.residual.length,
  panels: Object.keys(scan.report.panels).length,
  settingsCats: Object.keys(scan.report.settingsCats).length,
  pageErrors: scan.report.errors.length
}, null, 1));