const fs=require('fs');
const {tokenize}=require('./lexer.js');
const wl=JSON.parse(fs.readFileSync('worklist.json','utf8'));
const nl=JSON.parse(fs.readFileSync('newlist.json','utf8'));
const p1=JSON.parse(fs.readFileSync('zh-part1.json','utf8'));
const p2=JSON.parse(fs.readFileSync('zh-part2.json','utf8'));
const p3=JSON.parse(fs.readFileSync('zh-part3.json','utf8'));
const p4=JSON.parse(fs.readFileSync('zh-part4.json','utf8'));
const map=Object.assign({},p1,p2,p3,p4);
let extra={};
try { extra=JSON.parse(fs.readFileSync('zh-extra.json','utf8')); } catch (e) {}
const dict={};
for(const w of wl){ const v=map[w.i]; if(v!==undefined) dict[w.raw]=v; }
for(const w of nl){ const v=map[w.idx]; if(v!==undefined) dict[w.raw]=v; }
for(const k of Object.keys(extra)){ dict[k]=extra[k]; }
function linkTargets(s){
  const out=[]; const re=/\{([^}]*)\}/g; let m;
  while((m=re.exec(s))!==null){ const inner=m[1]; const idx=inner.indexOf('|'); const target=idx===-1?'':inner.slice(idx+1);
    const cleaned=target.replace(/\([^)]*\)/g,''); out.push((cleaned.match(/[A-Za-z_][A-Za-z0-9_.]*/g)||[]).join(',')); }
  return out;
}
const problems=[];
for(const [en,zh] of Object.entries(dict)){
  const a=linkTargets(en), b=linkTargets(zh);
  if(a.length!==b.length){problems.push(['linkcount',en.slice(0,60),a.length,b.length]);continue;}
  for(let k=0;k<a.length;k++) if(a[k]!==b[k]){problems.push(['linktarget',en.slice(0,60),a[k],b[k]]);break;}
  const nlA=(en.match(/\\n/g)||[]).length, nlB=(zh.match(/\\n/g)||[]).length;
  if(nlA!==nlB) problems.push(['newlines',en.slice(0,50),nlA,nlB]);
  const phA=(en.match(/\$\{[^}]*\}/g)||[]).length, phB=(zh.match(/\$\{[^}]*\}/g)||[]).length;
  if(phA!==phB) problems.push(['placeholders',en.slice(0,50),phA,phB]);
}
console.log('dict',Object.keys(dict).length,'problems',problems.length);
for(const p of problems) console.log(JSON.stringify(p));
fs.writeFileSync('dict.json',JSON.stringify(dict,null,1));

const base=fs.readFileSync('game.base.js','utf8');
const tokens=tokenize(base);
const repl=[];
for(const t of tokens){
  if(t.kind==='str'){ if(dict[t.raw]!==undefined && dict[t.raw]!==t.raw) repl.push({start:t.start,end:t.end,text:t.quote+dict[t.raw]+t.quote,raw:t.raw}); }
  else for(const s of t.segs){ if(dict[s.text]!==undefined && dict[s.text]!==s.text) repl.push({start:s.start,end:s.end,text:dict[s.text],raw:s.text}); }
}
repl.sort((a,b)=>b.start-a.start);
let out=base, cursor=Infinity;
for(const r of repl){ if(r.start>=cursor) throw new Error('overlap '+r.start); out=out.slice(0,r.start)+r.text+out.slice(r.end); cursor=r.start; }
fs.writeFileSync('game.zh.js',out);
console.log('applied',repl.length,'len',out.length);
const missing=Object.keys(dict).filter(k=>!repl.some(r=>r.raw===k));
console.log('unused keys',missing.length, missing.slice(0,10));