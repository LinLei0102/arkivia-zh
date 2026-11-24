#!/usr/bin/env bash
set -u
TOKEN=$(cat "$HOME/.gh_token_tmp")
API=https://api.github.com/repos/LinLei0102/arkivia-zh
for i in $(seq 1 12); do
  LINE=$(curl -s -H "Authorization: token $TOKEN" "$API/actions/runs?per_page=1" | node -e "let s='';process.stdin.on('data',d=>s+=d).on('end',()=>{const j=JSON.parse(s);const r=(j.workflow_runs||[])[0];console.log(r?(r.id+'|'+r.status+'|'+r.conclusion):'none')})")
  echo "[$i] $LINE"
  if echo "$LINE" | grep -q '|completed|'; then break; fi
  sleep 8
done