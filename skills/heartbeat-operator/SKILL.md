---
name: heartbeat-operator
description: Operate OpenClaw heartbeat workflows safely with low noise and actionable alerts. Use when designing heartbeat checklists, reducing spam, deciding cron vs heartbeat, or processing one task per cycle.
---

# Heartbeat Operator

Optimize heartbeat for signal, not chatter.

## Core behavior
- If no action needed: return `HEARTBEAT_OK`
- If action needed: send concise alert with severity and next step

## Checklist design
Include only checks that benefit from periodic awareness:
- Channel health/probe summary
- Critical service up/down
- Pending task queue age
- Backup freshness

## Anti-noise rules
- Do not repeat unchanged warnings every cycle
- Alert only on state change or threshold breach
- Batch related checks in one summary

## Work budget
- Process one bounded task per heartbeat unless urgent
- Defer deep work to cron/subagent jobs

## Escalation output
- What failed
- Why it matters
- Immediate fix command
- Verification command
