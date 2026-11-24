#!/usr/bin/env bash
set -u
TOKEN=$(printf 'protocol=https\nhost=github.com\nusername=LinLei0102\n\n' | git credential fill 2>/dev/null | sed -n 's/^password=//p')
if [ -z "${TOKEN:-}" ]; then echo 'NO_TOKEN'; exit 2; fi
echo "token_prefix=${TOKEN:0:4} len=${#TOKEN}"
echo "$TOKEN" > "$HOME/.gh_token_tmp"
chmod 600 "$HOME/.gh_token_tmp"
curl -s -H "Authorization: token $TOKEN" https://api.github.com/user | node -e "let s='';process.stdin.on('data',d=>s+=d).on('end',()=>{try{const j=JSON.parse(s);console.log('login='+j.login+' name='+(j.name||''))}catch(e){console.log('ERR',s.slice(0,200))}})"
echo '--- scopes'
curl -s -I -H "Authorization: token $TOKEN" https://api.github.com/user | grep -i '^x-oauth-scopes' | head -2