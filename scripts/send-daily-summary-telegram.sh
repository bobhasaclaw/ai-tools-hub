#!/bin/bash
set -euo pipefail

HOME_DIR="${HOME:-/Users/pmanopen}"
OPENCLAW_CONFIG="$HOME_DIR/.openclaw/openclaw.json"
SUMMARY_LOG="$HOME_DIR/.openclaw/workspace/logs/daily-mission-summary.log"
SEND_LOG="$HOME_DIR/.openclaw/workspace/logs/daily-mission-summary-telegram.log"

# Override this in env if needed
TELEGRAM_CHAT_ID="${TELEGRAM_CHAT_ID:-2018558180}"

timestamp() { date '+%Y-%m-%d %H:%M:%S'; }
log() { echo "[$(timestamp)] $*" >> "$SEND_LOG"; }

if [ ! -f "$OPENCLAW_CONFIG" ]; then
  log "ERROR openclaw config missing: $OPENCLAW_CONFIG"
  exit 1
fi

if [ ! -f "$SUMMARY_LOG" ]; then
  log "ERROR summary log missing: $SUMMARY_LOG"
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
  log "ERROR telegram bot token not found in openclaw config"
  exit 1
fi

# Extract latest summary block
MSG=$(python3 - <<'PY'
from pathlib import Path
p=Path.home()/'.openclaw/workspace/logs/daily-mission-summary.log'
text=p.read_text(errors='ignore')
blocks=[b.strip() for b in text.split('\n\n') if b.strip()]
last=blocks[-1] if blocks else 'No summary available.'
print('📊 Daily Mission Summary\n\n'+last)
PY
)

# Telegram message max ~4096 chars
MSG_TRIMMED="${MSG:0:3900}"

resp=$(curl -s -X POST "https://api.telegram.org/bot${BOT_TOKEN}/sendMessage" \
  -d "chat_id=${TELEGRAM_CHAT_ID}" \
  --data-urlencode "text=${MSG_TRIMMED}")

if echo "$resp" | grep -q '"ok":true'; then
  log "OK sent daily summary to telegram chat ${TELEGRAM_CHAT_ID}"
else
  log "ERROR telegram send failed: $resp"
  exit 1
fi
