#!/usr/bin/env bash
set -u
TOKEN=$(cat "$HOME/.gh_token_tmp")
API=https://api.github.com/repos/LinLei0102/arkivia-zh
echo '--- enable pages (workflow build)'
curl -s -X POST -H "Authorization: token $TOKEN" -H 'Accept: application/vnd.github+json' "$API/pages" -d '{"build_type":"workflow"}' -o /tmp/pages.json -w 'status=%{http_code}\n'
head -c 400 /tmp/pages.json; echo
echo '--- runs'
curl -s -H "Authorization: token $TOKEN" "$API/actions/runs?per_page=5" -o /tmp/runs.json -w 'status=%{http_code}\n'
node -e "const j=require('/tmp/runs.json');(j.workflow_runs||[]).forEach(r=>console.log(r.id+' | '+r.name+' | '+r.status+'/'+r.conclusion+' | '+r.created_at))"