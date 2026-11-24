const fs=require('fs');
const base=fs.readFileSync('game.base.js','utf8');
const zh=fs.readFileSync('game.zh.js','utf8');
const dict=JSON.parse(fs.readFileSync('dict.json','utf8'));
const cjk=s=>(s.match(/[\u4e00-\u9fa5]/g)||[]).length;
const {tokenize}=require('./lexer.js');
const tb=tokenize(base), tz=tokenize(zh);
const strsB=tb.filter(t=>t.kind==='str').length, strsZ=tz.filter(t=>t.kind==='str').length;
const segsB=tb.filter(t=>t.kind==='tpl').reduce((a,t)=>a+t.segs.length,0);
const segsZ=tz.filter(t=>t.kind==='tpl').reduce((a,t)=>a+t.segs.length,0);
console.log(JSON.stringify({
  baseBytes: Buffer.byteLength(base), zhBytes: Buffer.byteLength(zh),
  dictKeys: Object.keys(dict).length,
  cjkInZh: cjk(zh), cjkInBase: cjk(base),
  strTokensBase: strsB, strTokensZh: strsZ, tplSegsBase: segsB, tplSegsZh: segsZ,
  structureSame: strsB===strsZ && segsB===segsZ
}, null, 1));