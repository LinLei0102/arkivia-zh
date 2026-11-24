#!/usr/bin/env bash
set -u
TOKEN=$(cat "$HOME/.gh_token_tmp")
curl -s -X POST -H "Authorization: token $TOKEN" -H 'Accept: application/vnd.github+json' \
  "https://api.github.com/repos/LinLei0102/arkivia-zh/actions/runs/45353781240/rerun-failed-jobs" \
  -o /dev/null -w 'rerun=%{http_code}\n'