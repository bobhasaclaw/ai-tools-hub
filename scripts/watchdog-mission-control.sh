#!/bin/bash
set -euo pipefail

LABEL="ai.openclaw.mission-control"
UID_NUM="$(id -u)"
API_URL="http://localhost:9000/api/tasks"
LOG_FILE="/Users/pmanopen/.openclaw/workspace/logs/mission-control-watchdog.log"

mkdir -p "$(dirname "$LOG_FILE")"

timestamp() { date '+%Y-%m-%d %H:%M:%S'; }
log() { echo "[$(timestamp)] $*" >> "$LOG_FILE"; }

# Health check: API must respond with JSON array/object quickly
if curl -fsS -m 4 "$API_URL" | head -c 1 | grep -Eq '[\[{]'; then
  log "OK - Mission Control healthy"
  exit 0
fi

log "WARN - Health check failed, attempting restart"

# Try launchctl-managed restart first
launchctl kickstart -k "gui/${UID_NUM}/${LABEL}" >/dev/null 2>&1 || true
sleep 2

if curl -fsS -m 4 "$API_URL" | head -c 1 | grep -Eq '[\[{]'; then
  log "RECOVERED - Restart via launchctl succeeded"
  exit 0
fi

# Fallback: start process directly
NODE_BIN="$(command -v node)"
MC_DIR="/Users/pmanopen/.openclaw/workspace/mission-control"
nohup "$NODE_BIN" "$MC_DIR/server.js" >> /tmp/mission-control.log 2>> /tmp/mission-control.err &
sleep 2

if curl -fsS -m 4 "$API_URL" | head -c 1 | grep -Eq '[\[{]'; then
  log "RECOVERED - Fallback direct start succeeded"
  exit 0
fi

log "ERROR - Recovery failed; manual intervention required"
exit 1
