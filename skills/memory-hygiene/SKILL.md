---
name: memory-hygiene
description: Maintain high-quality OpenClaw memory logs for durable recall with or without semantic embeddings. Use when writing MEMORY.md, daily logs, consolidating learnings, deduplicating entries, or improving searchability under FTS-only mode.
---

# Memory Hygiene

Write memory for retrieval first, prose second.

## Entry template
- Date/time (local)
- Context (project/system)
- Problem/decision
- Root cause
- Fix/action
- Verification
- Tags (3-8): e.g. `discord`, `memory`, `cron`, `auth`, `openclaw`

## Rules
- Prefer short factual bullets over long narrative
- Include exact config keys/commands when relevant
- Record only durable facts in `MEMORY.md`
- Keep transient detail in `memory/YYYY-MM-DD.md`
- Deduplicate near-identical sections weekly

## FTS-only optimization
When semantic embeddings are unavailable:
- Repeat canonical terms users will query (`Discord`, `no-mention`, `groupPolicy`)
- Add explicit aliases (`X/Twitter`, `OpenAI Codex`, `openai-codex`)
- Use consistent headings and tags

## Consolidation cadence
- Daily: append key outcomes
- Weekly: merge duplicates + keep newest verified fix
