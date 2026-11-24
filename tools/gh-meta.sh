#!/usr/bin/env bash
set -u
TOKEN=$(cat "$HOME/.gh_token_tmp")
curl -s -X PUT -H "Authorization: token $TOKEN" -H 'Accept: application/vnd.github+json' \
  https://api.github.com/repos/LinLei0102/arkivia-zh/topics \
  -d '{"names":["arkivia","incremental-game","browser-game","chinese-localization","translation","github-pages","html5-game"]}' \
  -o /dev/null -w 'topics=%{http_code}\n'
curl -s -X PATCH -H "Authorization: token $TOKEN" -H 'Accept: application/vnd.github+json' \
  https://api.github.com/repos/LinLei0102/arkivia-zh \
  -d '{"description":"Arkivia v0.27.2 简体中文汉化版（中英双语 + 设置内语言切换 + 残局存档）｜在线游玩：https://linlei0102.github.io/arkivia-zh/","homepage":"https://linlei0102.github.io/arkivia-zh/"}' \
  -o /dev/null -w 'patch=%{http_code}\n'