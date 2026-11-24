'use strict';
const TICK = String.fromCharCode(96);

function tokenize(src) {
  const tokens = [];
  const len = src.length;

  function scanString(k, quote) {
    let j = k + 1;
    while (j < len) {
      const ch = src[j];
      if (ch === '\\') { j += 2; continue; }
      if (ch === quote) { j++; break; }
      if (ch === '\n') break;
      j++;
    }
    const raw = src.slice(k + 1, j - (src[j-1] === quote ? 1 : 0));
    tokens.push({ kind: 'str', quote: quote, start: k, end: j, raw: raw });
    return j;
  }

  function scanTemplate(tStart) {
    let j = tStart + 1;
    let segStart = j;
    const segs = [];
    while (j < len) {
      const ch = src[j];
      if (ch === '\\') { j += 2; continue; }
      if (ch === TICK) {
        segs.push({ text: src.slice(segStart, j), start: segStart, end: j });
        j++;
        break;
      }
      if (ch === '$' && src[j+1] === '{') {
        const seg = { text: src.slice(segStart, j), start: segStart, end: j };
        segs.push(seg);
        j = scanExpression(j + 2);
        seg.expr = src.slice(seg.end + 2, j - 1);
        segStart = j;
        continue;
      }
      j++;
    }
    tokens.push({ kind: 'tpl', start: tStart, end: j, segs: segs });
    return j;
  }

  function scanExpression(k) {
    let depth = 1;
    while (k < len && depth > 0) {
      const c = src[k];
      if (c === '/' && src[k+1] === '/') { const e = src.indexOf('\n', k); k = e === -1 ? len : e; continue; }
      if (c === '/' && src[k+1] === '*') { const e = src.indexOf('*/', k+2); k = e === -1 ? len : e + 2; continue; }
      if (c === '"' || c === "'") { k = scanString(k, c); continue; }
      if (c === TICK) { k = scanTemplate(k); continue; }
      if (c === '{') depth++;
      else if (c === '}') { depth--; if (depth === 0) { k++; break; } }
      k++;
    }
    return k;
  }

  let i = 0;
  while (i < len) {
    const c = src[i];
    if (c === '/' && src[i+1] === '/') { const e = src.indexOf('\n', i); i = e === -1 ? len : e; continue; }
    if (c === '/' && src[i+1] === '*') { const e = src.indexOf('*/', i+2); i = e === -1 ? len : e + 2; continue; }
    if (c === '"' || c === "'") { i = scanString(i, c); continue; }
    if (c === TICK) { i = scanTemplate(i); continue; }
    i++;
  }
  return tokens;
}

module.exports = { tokenize: tokenize };