#!/usr/bin/env node

const API = 'http://localhost:9000/api';
const DRY = process.argv.includes('--dry-run');
const APPLY = process.argv.includes('--apply');

if (!DRY && !APPLY) {
  console.log('Usage: swarm-route-tasks.js --dry-run | --apply');
  process.exit(1);
}

function pickAgent(text = '') {
  const t = text.toLowerCase();
  if (/(root.?cause|architecture|strategy|stability|loop|policy|reliability|research)/.test(t)) return 'kimi';
  if (/(fix|implement|build|code|refactor|sweep|repair|website|ui|css|html)/.test(t)) return 'qwen';
  if (/(summary|report|brief|checklist|verify|verification|status|notes|document)/.test(t)) return 'minimax';
  return 'minimax';
}

async function jfetch(path, opts = {}) {
  const r = await fetch(`${API}${path}`, {
    headers: { 'content-type': 'application/json' },
    ...opts,
  });
  const txt = await r.text();
  try { return JSON.parse(txt); } catch { return { raw: txt, status: r.status }; }
}

async function ensureSubagents() {
  const existing = await jfetch('/subagents');
  const ids = new Set((existing || []).map(s => s.id));
  const targets = [
    { id: 'kimi', name: 'Kimi', type: 'reasoning' },
    { id: 'qwen', name: 'Qwen', type: 'builder' },
    { id: 'minimax', name: 'MiniMax', type: 'drafter' },
  ];
  for (const t of targets) {
    if (!ids.has(t.id)) {
      if (APPLY) await jfetch('/subagents', { method: 'POST', body: JSON.stringify(t) });
      console.log(`${APPLY ? 'created' : 'would create'} subagent ${t.id}`);
    }
  }
}

async function main() {
  await ensureSubagents();
  const tasks = await jfetch('/tasks');
  const open = (tasks || []).filter(t => ['pending', 'in_progress'].includes(t.status_text));

  let reassigned = 0;
  for (const t of open) {
    const desired = pickAgent(t.text || '');
    if (t.subagent_id === desired) continue;
    const line = `#${t.id} ${t.subagent_id || '?'} -> ${desired} | ${(t.text || '').slice(0, 90)}`;
    if (APPLY) {
      await jfetch(`/tasks/${t.id}`, { method: 'PUT', body: JSON.stringify({ subagent_id: desired }) });
      console.log(`updated ${line}`);
    } else {
      console.log(`would update ${line}`);
    }
    reassigned++;
  }

  console.log(`\n${APPLY ? 'Applied' : 'Planned'} reassignments: ${reassigned}`);
  console.log('Concurrency reminder: never run Kimi + Qwen in same parallel batch.');
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
