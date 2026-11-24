import json, os, urllib.request
token = open(os.path.expanduser('~/.gh_token_tmp')).read().strip()
def call(method, path, body=None):
    data = json.dumps(body).encode() if body is not None else None
    req = urllib.request.Request("https://api.github.com" + path, data=data, method=method,
        headers={"Authorization": f"token {token}", "Accept": "application/vnd.github+json", "Content-Type": "application/json"})
    try:
        with urllib.request.urlopen(req, timeout=60) as r:
            return r.status, json.loads(r.read().decode() or "{}")
    except urllib.error.HTTPError as e:
        return e.code, e.read().decode()[:400]

st, body = call("PUT", "/repos/LinLei0102/arkivia-zh/pages", {"build_type": "legacy", "source": {"branch": "gh-pages", "path": "/"}})
print("PUT status", st)
print(json.dumps(body, ensure_ascii=False)[:400] if isinstance(body, dict) else body)
