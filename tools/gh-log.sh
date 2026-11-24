#!/usr/bin/env bash
set -u
TOKEN=$(cat "$HOME/.gh_token_tmp")
RUN=45353781240
curl -s -H "Authorization: token $TOKEN" "https://api.github.com/repos/LinLei0102/arkivia-zh/actions/runs/$RUN/jobs" | node -e "let s='';process.stdin.on('data',d=>s+=d).on('end',()=>{const j=JSON.parse(s);(j.jobs||[]).forEach(job=>{console.log('JOB '+job.name+' '+job.status+'/'+job.conclusion);(job.steps||[]).forEach(st=>console.log('  '+st.number+' '+st.name+' -> '+st.status+'/'+st.conclusion))})})"
echo '--- log tail'
curl -s -L -H "Authorization: token $TOKEN" "https://api.github.com/repos/LinLei0102/arkivia-zh/actions/runs/$RUN/logs" -o /tmp/log.zip -w 'zip=%{http_code}\n'
cd /tmp && rm -rf ghlog && mkdir ghlog && cd ghlog && unzip -q ../log.zip 2>/dev/null && grep -riE 'error|failed|fatal' . | tail -20