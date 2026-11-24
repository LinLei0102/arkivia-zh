import json, os, urllib.request
token = open(os.path.expanduser('~/.gh_token_tmp')).read().strip()
def get(path):
    req = urllib.request.Request("https://api.github.com" + path, headers={"Authorization": f"token {token}", "Accept": "application/vnd.github+json"})
    try:
        with urllib.request.urlopen(req, timeout=60) as r:
            return r.status, json.loads(r.read().decode() or "{}")
    except urllib.error.HTTPError as e:
        return e.code, e.read().decode()[:300]
for p in ["/repos/LinLei0102/arkivia-zh/pages", "/repos/LinLei0102/arkivia-zh/pages/builds?per_page=3"]:
    st, b = get(p)
    print(p, st)
    print(json.dumps(b, ensure_ascii=False)[:600] if isinstance(b, dict) else b)
