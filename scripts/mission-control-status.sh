#!/usr/bin/env bash
set -euo pipefail

TASKS_JSON=$(curl -s http://localhost:9000/api/tasks)

now() { date '+%Y-%m-%d %H:%M:%S'; }

echo "=== Mission Control Status @ $(now) ==="
echo

python3 - <<'PY' "$TASKS_JSON"
import json, sys, datetime
arr=json.loads(sys.argv[1])

def short(s,n=110):
    s=(s or '').replace('\n',' ')
    return s if len(s)<=n else s[:n-1]+'…'

inprog=[t for t in arr if t.get('status_text')=='in_progress']
pending=[t for t in arr if t.get('status_text')=='pending']
completed=[t for t in arr if t.get('status_text')=='completed']
failed=[t for t in arr if t.get('status_text')=='failed']

print(f"Running:   {len(inprog)}")
print(f"Pending:   {len(pending)}")
print(f"Completed: {len(completed)}")
print(f"Failed:    {len(failed)}")

print("\n-- In Progress --")
if inprog:
    for t in inprog[:12]:
        print(f"#{t['id']:>3} [{t.get('priority','normal')}] [{t.get('subagent_id','?')}] {short(t.get('text',''))}")
else:
    print("(none)")

print("\n-- Pending (Top 12) --")
if pending:
    for t in pending[:12]:
        print(f"#{t['id']:>3} [{t.get('priority','normal')}] [{t.get('subagent_id','?')}] {short(t.get('text',''))}")
else:
    print("(none)")

print("\n-- Recently Completed (Top 10) --")
if completed:
    for t in completed[:10]:
        print(f"#{t['id']:>3} [{t.get('priority','normal')}] [{t.get('subagent_id','?')}] {short(t.get('text',''))}")
else:
    print("(none)")
PY

echo
if command -v openclaw >/dev/null 2>&1; then
  echo "-- Live Subagents (last 60m) --"
  openclaw sessions list >/dev/null 2>&1 || true
else
  echo "(openclaw CLI not in PATH for subagent live view)"
fi

echo
printf "Tip: run this anytime with: %s\n" "~/\.openclaw/workspace/scripts/mission-control-status.sh"
