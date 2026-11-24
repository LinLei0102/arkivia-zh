import json, os, time, urllib.request
token = open(os.path.expanduser('~/.gh_token_tmp')).read().strip()
def call(method, path):
    req = urllib.request.Request("https://api.github.com" + path, data=b"", method=method,
        headers={"Authorization": f"token {token}", "Accept": "application/vnd.github+json"})
    try:
        with urllib.request.urlopen(req, timeout=60) as r:
            return r.status, r.read().decode()[:300]
    except urllib.error.HTTPError as e:
        return e.code, e.read().decode()[:300]

print("POST build:", call("POST", "/repos/LinLei0102/arkivia-zh/pages/builds"))
for i in range(18):
    time.sleep(10)
    req = urllib.request.Request("https://api.github.com/repos/LinLei0102/arkivia-zh/pages/builds?per_page=1",
        headers={"Authorization": f"token {token}", "Accept": "application/vnd.github+json"})
    with urllib.request.urlopen(req, timeout=60) as r:
        b = json.loads(r.read().decode() or "[]")
    if b:
        print(i, b[0].get("status"), b[0].get("error", {}).get("message") if b[0].get("error") else "")
        if b[0].get("status") in ("built", "errored"):
            break
    else:
        print(i, "no builds")
