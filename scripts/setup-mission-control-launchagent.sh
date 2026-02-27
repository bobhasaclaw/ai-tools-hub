#!/bin/bash
set -euo pipefail

PLIST="$HOME/Library/LaunchAgents/ai.openclaw.mission-control.plist"
NODE_BIN="$(command -v node)"
WORKDIR="$HOME/.openclaw/workspace/mission-control"

if [ ! -f "$WORKDIR/server.js" ]; then
  echo "mission-control not found at $WORKDIR" >&2
  exit 1
fi

cat > "$PLIST" <<EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key>
  <string>ai.openclaw.mission-control</string>
  <key>ProgramArguments</key>
  <array>
    <string>$NODE_BIN</string>
    <string>$WORKDIR/server.js</string>
  </array>
  <key>WorkingDirectory</key>
  <string>$WORKDIR</string>
  <key>RunAtLoad</key>
  <true/>
  <key>KeepAlive</key>
  <true/>
  <key>StandardOutPath</key>
  <string>/tmp/mission-control.log</string>
  <key>StandardErrorPath</key>
  <string>/tmp/mission-control.err</string>
  <key>EnvironmentVariables</key>
  <dict>
    <key>PATH</key>
    <string>$NODE_BIN:/usr/local/bin:/opt/homebrew/bin:/usr/bin:/bin:/usr/sbin:/sbin</string>
  </dict>
</dict>
</plist>
EOF

plutil -lint "$PLIST"
launchctl bootout gui/$(id -u) "$PLIST" 2>/dev/null || true
launchctl bootstrap gui/$(id -u) "$PLIST"
launchctl enable gui/$(id -u)/ai.openclaw.mission-control
launchctl kickstart -k gui/$(id -u)/ai.openclaw.mission-control

echo "Mission Control LaunchAgent installed and started."
