import json, os, urllib.request, zipfile, io
token = open(os.path.expanduser('~/.gh_token_tmp')).read().strip()
run = 45353781240
url = f"https://api.github.com/repos/LinLei0102/arkivia-zh/actions/runs/{run}/logs"
req = urllib.request.Request(url, headers={"Authorization": f"token {token}", "Accept": "application/vnd.github+json"})
data = urllib.request.urlopen(req, timeout=60).read()
print("zip bytes", len(data))
z = zipfile.ZipFile(io.BytesIO(data))
for name in z.namelist():
    txt = z.read(name).decode("utf-8", "replace")
    if any(k in txt.lower() for k in ["error", "failed", "fatal", "exception"]):
        lines = [l for l in txt.splitlines() if any(k in l.lower() for k in ["error", "failed", "fatal", "exception", "status"])]
        print("=== " + name)
        print("\n".join(lines[-25:]))
