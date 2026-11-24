#!/usr/bin/env bash
set -u
TOKEN=$(cat "$HOME/.gh_token_tmp")
API=https://api.github.com/repos/LinLei0102/arkivia-zh
curl -s -H "Authorization: token $TOKEN" "$API/actions/runs?per_page=5" | node -e "let s='';process.stdin.on('data',d=>s+=d).on('end',()=>{const j=JSON.parse(s);console.log('total='+j.total_count);(j.workflow_runs||[]).forEach(r=>console.log(r.id+' | '+r.name+' | '+r.status+'/'+r.conclusion+' | '+r.created_at))})"