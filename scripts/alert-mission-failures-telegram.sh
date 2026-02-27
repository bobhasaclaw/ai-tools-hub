#!/bin/bash
set -euo pipefail

HOME_DIR="${HOME:-/Users/pmanopen}"
DB_PATH="$HOME_DIR/.openclaw/workspace/mission-control/mission-control.db"
OPENCLAW_CONFIG="$HOME_DIR/.openclaw/openclaw.json"
STATE_FILE="$HOME_DIR/.openclaw/workspace/logs/mission-failure-alert.state"
LOG_FILE="$HOME_DIR/.openclaw/workspace/logs/mission-failure-alert.log"

TELEGRAM_CHAT_ID="${TELEGRAM_CHAT_ID:-2018558180}"
WINDOW_HOURS="${WINDOW_HOURS:-24}"

timestamp() { date '+%Y-%m-%d %H:%M:%S'; }
log() { echo "[$(timestamp)] $*" >> "$LOG_FILE"; }

mkdir -p "$(dirname "$LOG_FILE")"
TMP_FILE=""
cleanup() { [ -n "$TMP_FILE" ] && [ -f "$TMP_FILE" ] && rm -f "$TMP_FILE"; }
trap cleanup EXIT

if [ ! -f "$DB_PATH" ]; then
  log "ERROR missing DB: $DB_PATH"
  exit 1
fi

BOT_TOKEN=$(python3 - <<'PY'
import json, os
p=os.path.expanduser('~/.openclaw/openclaw.json')
try:
    d=json.load(open(p))
    print(d.get('channels',{}).get('telegram',{}).get('botToken',''))
except Exception:
    print('')
PY
)

if [ -z "$BOT_TOKEN" ]; then
  log "ERROR telegram bot token missing"
  exit 1
fi

TMP_FILE=$(mktemp)
python3 - <<PY > "$TMP_FILE"
import sqlite3, datetime
db = sqlite3.connect(r'''$DB_PATH''')
cur = db.cursor()
window_hours = int(r'''$WINDOW_HOURS''')
since = (datetime.datetime.utcnow() - datetime.timedelta(hours=window_hours)).strftime('%Y-%m-%d %H:%M:%S')
cur.execute('''
SELECT COUNT(*)
FROM todos
WHERE status_text IN ('failed','error')
  AND COALESCE(finished_at, created_at) >= ?
''', (since,))
count = cur.fetchone()[0]
cur.execute('''
SELECT id, subagent_id, text, COALESCE(failure_reason,'unknown')
FROM todos
WHERE status_text IN ('failed','error')
  AND COALESCE(finished_at, created_at) >= ?
ORDER BY id DESC
LIMIT 5
''', (since,))
rows = cur.fetchall()
print(count)
for r in rows:
    print(f"#{r[0]} [{r[1]}] {r[2][:90]} :: {r[3][:60]}")
PY

FAIL_COUNT=$(head -n 1 "$TMP_FILE" | tr -d '\r')

if [ "$FAIL_COUNT" = "0" ]; then
  log "OK no failures in last ${WINDOW_HOURS}h"
  echo "0" > "$STATE_FILE"
  exit 0
fi

LAST_SENT_COUNT="0"
if [ -f "$STATE_FILE" ]; then
  LAST_SENT_COUNT=$(cat "$STATE_FILE" 2>/dev/null || echo "0")
fi

# Avoid duplicate spam if count unchanged
if [ "$FAIL_COUNT" = "$LAST_SENT_COUNT" ]; then
  log "SKIP failures unchanged ($FAIL_COUNT)"
  exit 0
fi

BODY="🚨 Mission Control Failure Alert\n\nDetected ${FAIL_COUNT} failed task(s) in last ${WINDOW_HOURS}h.\n\nRecent failures:\n"
while IFS= read -r line; do
  [ -z "$line" ] && continue
  BODY+="- ${line}\n"
done < <(tail -n +2 "$TMP_FILE")

resp=$(curl -s -X POST "https://api.telegram.org/bot${BOT_TOKEN}/sendMessage" \
  -d "chat_id=${TELEGRAM_CHAT_ID}" \
  --data-urlencode "text=${BODY:0:3900}")

if echo "$resp" | grep -q '"ok":true'; then
  echo "$FAIL_COUNT" > "$STATE_FILE"
  log "ALERT sent ($FAIL_COUNT failures)"
else
  log "ERROR telegram send failed: $resp"
  exit 1
fi
