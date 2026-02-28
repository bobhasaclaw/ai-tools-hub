#!/bin/bash
# Mission Control Task Processor (API-compatible)
# Default: inspect queue and print oldest pending task (no status mutation)
# Optional: claim oldest pending task with --claim
# Optional: reset stale in_progress tasks to pending with --unstick

set -euo pipefail

TASKS_API="http://localhost:9000/api/tasks"
STALE_MINUTES="${STALE_MINUTES:-45}"
CLAIM=0
UNSTICK=0

for arg in "$@"; do
  case "$arg" in
    --claim) CLAIM=1 ;;
    --unstick) UNSTICK=1 ;;
  esac
done

fetch_tasks() {
  curl -s "$TASKS_API"
}

update_task_status() {
  local task_id="$1"
  local status="$2"
  curl -s -X PUT "$TASKS_API/$task_id" \
    -H "Content-Type: application/json" \
    -d "{\"status\":\"$status\"}" >/dev/null
}

get_oldest_pending_id() {
  local tasks_json="$1"
  python3 - <<'PY' "$tasks_json"
import json,sys
arr=json.loads(sys.argv[1])
p=[t for t in arr if t.get('status_text')=='pending']
p.sort(key=lambda x: x.get('id', 10**9))
print(p[0]['id'] if p else '')
PY
}

get_task_by_id_from_list() {
  local tasks_json="$1"
  local task_id="$2"
  python3 - <<'PY' "$tasks_json" "$task_id"
import json,sys
arr=json.loads(sys.argv[1]); tid=int(sys.argv[2])
for t in arr:
    if t.get('id')==tid:
        print(json.dumps(t))
        break
PY
}

reset_stale_in_progress() {
  local tasks_json="$1"
  python3 - <<'PY' "$tasks_json" "$STALE_MINUTES"
import json,sys,datetime
arr=json.loads(sys.argv[1]); stale_min=int(sys.argv[2])
now=datetime.datetime.now(datetime.timezone.utc)
ids=[]
for t in arr:
    if t.get('status_text')!='in_progress':
        continue
    s=t.get('started_at') or t.get('queued_at') or t.get('created_at')
    if not s:
        continue
    s=s.replace(' ', 'T')
    try:
        dt=datetime.datetime.fromisoformat(s)
        if dt.tzinfo is None:
            dt=dt.replace(tzinfo=datetime.timezone.utc)
    except Exception:
        continue
    age=(now-dt).total_seconds()/60
    if age>=stale_min:
        ids.append(t.get('id'))
print('\n'.join(str(i) for i in ids))
PY
}

echo "Checking Mission Control tasks..."
TASKS_JSON="$(fetch_tasks)"

if [ "$UNSTICK" -eq 1 ]; then
  STALE_IDS="$(reset_stale_in_progress "$TASKS_JSON")"
  if [ -n "$STALE_IDS" ]; then
    echo "Unsticking stale in_progress tasks (>${STALE_MINUTES}m):"
    while IFS= read -r id; do
      [ -z "$id" ] && continue
      update_task_status "$id" "pending"
      echo "  - reset #$id -> pending"
    done <<< "$STALE_IDS"
    TASKS_JSON="$(fetch_tasks)"
  else
    echo "No stale in_progress tasks found."
  fi
fi

TASK_ID="$(get_oldest_pending_id "$TASKS_JSON")"
if [ -z "$TASK_ID" ]; then
  echo "No pending tasks."
  exit 0
fi

TASK_JSON="$(get_task_by_id_from_list "$TASKS_JSON" "$TASK_ID")"
echo "Oldest pending task: #$TASK_ID"
echo "TASK_JSON=$TASK_JSON"

if [ "$CLAIM" -eq 1 ]; then
  update_task_status "$TASK_ID" "in_progress"
  echo "Claimed task #$TASK_ID -> in_progress"
else
  echo "Dry mode: task not claimed. Use --claim to claim it."
fi
