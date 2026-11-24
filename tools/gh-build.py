import json, os, time, urllib.request
token = open(os.path.expanduser('~/.gh_token_tmp')).read().strip()
def get(path):
    req = urllib.request.Request("https://api.github.com" + path, headers={"Authorization": f"token {token}", "Accept": "application/vnd.github+json"})
    try:
        with urllib.request.urlopen(req, timeout=60) as r:
            return json.loads(r.read().decode() or "{}")
    except urllib.error.HTTPError as e:
        return {"error": e.code, "body": e.read().decode()[:300]}

for i in range(20):
    b = get("/repos/LinLei0102/arkivia-zh/pages/builds/latest")
    print(i, b.get("status"), b.get("error"), b.get("commit"))
    if b.get("status") == "built" or b.get("error"):
        break
    time.sleep(10)
