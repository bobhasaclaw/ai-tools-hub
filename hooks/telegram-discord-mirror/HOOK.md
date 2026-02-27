---
name: telegram-discord-mirror
description: Mirror inbound Telegram messages into a Discord channel for Bob's Hub visibility.
metadata:
  {"openclaw":{"emoji":"🪞","events":["message:received"],"always":true}}
---

# Telegram → Discord Mirror (Scaffold)

This hook is a **safe scaffold**:
- Captures inbound `message:received` events
- Logs Telegram payload shape to a local debug file
- Includes placeholder forwarding code for Discord mirror

## Why scaffold first

OpenClaw hook event payloads can differ by version/channel plugin details. This scaffold confirms exact runtime keys before enabling hard forwarding logic.

## Files

- `handler.ts` — payload probe + mirror placeholder

## Next step

1. Enable hook
2. Send one Telegram test message
3. Check debug output file for exact payload structure
4. Replace placeholder mapping with verified fields and Discord send call
