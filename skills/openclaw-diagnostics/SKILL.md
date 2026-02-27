---
name: openclaw-diagnostics
description: Run OpenClaw diagnostics and triage for gateway, channels, config validation, mention-gating, memory mode, cron health, and restart verification. Use when messages fail, channels are silent, startup breaks, or the user asks for health checks/runbooks.
---

# OpenClaw Diagnostics

Run this checklist in order:

1. Check runtime basics
- `openclaw status`
- `openclaw gateway status`
- `openclaw channels status --probe --json`

2. Check logs/errors
- `openclaw logs --follow` (or recent log tail)
- Search for skip reasons: `no-mention`, `allowlist`, auth failures, schema validation

3. Validate config safety
- Ensure no invalid keys/enum values
- Confirm DM/group policy intent matches channel behavior
- For Discord: verify guild/channel `requireMention` and `allow`

4. Check memory mode
- Test `memory_search` once
- If provider auth fails, identify mismatched key/provider
- If `fts-only`, report semantic embeddings are not active

5. Check automation
- Verify expected crons exist and are current
- Confirm heartbeat behavior and alert/noise level

6. Apply minimal fix + verify
- Make smallest reversible change
- Restart gateway if required
- Re-run probe and send/receive smoke test

Always return:
- Root cause
- Exact fix
- Verification proof
- Rollback command
