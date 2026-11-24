#!/usr/bin/env bash
set -u
TOKEN=$(cat "$HOME/.gh_token_tmp")
REPO=arkivia-zh
OWNER=LinLei0102
API=https://api.github.com
echo '--- check existing'
CODE=$(curl -s -o /tmp/repo.json -w '%{http_code}' -H "Authorization: token $TOKEN" "$API/repos/$OWNER/$REPO")
echo "status=$CODE"
if [ "$CODE" = "404" ]; then
  echo '--- create repo'
  curl -s -X POST -H "Authorization: token $TOKEN" -H 'Accept: application/vnd.github+json' "$API/user/repos" \
    -d '{"name":"arkivia-zh","description":"Arkivia v0.27.2 简体中文汉化版（中英双语 + 语言切换 + 残局存档）","homepage":"https://linlei0102.github.io/arkivia-zh/","private":false,"has_issues":true,"has_wiki":false}' \
    -o /tmp/create.json -w 'create_status=%{http_code}\n'
  node -e "const j=require('/tmp/create.json');console.log('full_name='+j.full_name+' default_branch='+j.default_branch)" 2>/dev/null || head -c 300 /tmp/create.json
else
  node -e "const j=require('/tmp/repo.json');console.log('exists: '+j.full_name+' branch='+j.default_branch+' pages='+(j.has_pages?'yes':'no'))"
fi