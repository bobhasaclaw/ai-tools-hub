---
name: backup-guardian
description: Protect OpenClaw workspace and config with lightweight backup, verification, and restore drills. Use when setting backup cadence, validating backup integrity, or recovering after reset/corruption.
---

# Backup Guardian

Keep backups simple and tested.

## Minimum set
- Workspace snapshot
- `~/.openclaw/openclaw.json`
- critical env/secrets location (without exposing values in logs)
- cron definitions and automation scripts

## Cadence
- Quick incremental: every 15-60 min
- Full snapshot: daily
- Retention: 7 daily + 4 weekly + 3 monthly

## Verification
After each backup cycle:
- confirm file exists
- confirm non-zero size
- optionally checksum
- run periodic restore drill to temp path

## Restore drill
- Restore to temp dir
- Validate key files open and parse
- Confirm expected latest timestamp

## Alert thresholds
- No successful backup in >2x expected interval
- Restore drill failure
- Backup size sudden collapse
