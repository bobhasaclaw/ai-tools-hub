---
name: discord-ops-runbook
description: Troubleshoot and stabilize OpenClaw Discord channel behavior including bot token placement, dm/group policy, mention-gating, guild/channel allow rules, and post-restart verification. Use for no-response, skipped-message, or config-validation Discord issues.
---

# Discord Ops Runbook

Use this runbook for Discord failures.

## Fast checks
- `openclaw channels status --probe --json`
- Confirm Discord enabled and unresolved channels = 0
- Review logs for skip reason (`no-mention`, allowlist, auth)

## Known-safe config patterns
- Keep Discord token in env/secret store
- Use valid policy enums only
- Explicitly set guild/channel behavior where needed

Example intent for open channel:
- `groupPolicy: "open"`
- `dmPolicy: "open"`
- `allowFrom: ["*"]`
- `guilds["*"].requireMention: false`
- `guilds["*"].channels["<channelId>"].allow: true`
- `guilds["*"].channels["<channelId>"].requireMention: false`

## Recovery flow
1. Fix config mismatch
2. Restart gateway
3. Probe status
4. Send test message to target channel
5. Verify inbound normal message response

## Report format
- Root cause(s)
- Fix applied
- Probe output summary
- Remaining risks
