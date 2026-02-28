# SWARM-SOP.md — Official Delegation System

## Purpose
Make delegation default, enforce NVIDIA-safe concurrency, and require QA before task completion.

## Roles
- **Kimi**: deep reasoning, architecture, root-cause analysis.
- **Qwen**: heavy implementation, coding, large fix passes.
- **MiniMax**: summaries, checklists, reports, verification notes.

## Hard Concurrency Rule
Never run **Kimi + Qwen** in the same batch (shared NVIDIA rate limits).

Allowed 3-way patterns:
- `Kimi + MiniMax + MiniMax`
- `Qwen + MiniMax + MiniMax`
- `MiniMax x3`

## Routing Policy
- Reasoning/system tasks → `kimi`
- Build/fix/coding/content implementation → `qwen`
- Summaries/QA/reporting/docs → `minimax`

## Quality Gate (required before complete)
A task can be marked completed only if:
1. Output artifact exists (file/commit/report/screenshot)
2. Verification step is recorded
3. Verification status is `verified`
4. `self_score` recorded (1–10)

If failed:
- Retry once with concrete fix notes
- If repeated failure, escalate to canonical fix-pass task

## Anti-Loop Policy
- Max retry count: 2 for same issue
- No re-audit until at least one real fix is applied
- Repeated findings append to existing issue key, do not create clones

## Commands
Bootstrap routing subagents + reroute backlog:
```bash
~/.openclaw/workspace/scripts/swarm-route-tasks.js --apply
```

Dry-run preview:
```bash
~/.openclaw/workspace/scripts/swarm-route-tasks.js --dry-run
```

## Notes
This SOP is enforced through Mission Control task routing + verification metadata.
