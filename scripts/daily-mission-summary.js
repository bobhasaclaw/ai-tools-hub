#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const sqlite3 = require('../mission-control/node_modules/sqlite3').verbose();

const HOME = process.env.HOME || '/Users/pmanopen';
const DB_PATH = path.join(HOME, '.openclaw', 'workspace', 'mission-control', 'mission-control.db');
const OUT_DIR = path.join(HOME, '.openclaw', 'workspace', 'logs');
const OUT_FILE = path.join(OUT_DIR, 'daily-mission-summary.log');

function q(db, sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => (err ? reject(err) : resolve(rows)));
  });
}

(async () => {
  const db = new sqlite3.Database(DB_PATH);
  try {
    const now = new Date();
    const since = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();

    const totals = (await q(db, `
      SELECT
        COUNT(*) as total,
        SUM(CASE WHEN status_text = 'completed' OR completed = 1 THEN 1 ELSE 0 END) as completed,
        SUM(CASE WHEN status_text IN ('failed','error') THEN 1 ELSE 0 END) as failed,
        SUM(CASE WHEN COALESCE(retry_count,0) > 0 THEN 1 ELSE 0 END) as retried,
        CAST(AVG(CASE WHEN duration_ms IS NOT NULL THEN duration_ms END) AS INTEGER) as avg_duration_ms,
        ROUND(AVG(CASE WHEN self_score IS NOT NULL THEN self_score END), 2) as avg_score
      FROM todos
      WHERE COALESCE(finished_at, created_at) >= ?
    `, [since]))[0] || {};

    const failureReasons = await q(db, `
      SELECT COALESCE(NULLIF(TRIM(failure_reason), ''), 'unknown') as reason, COUNT(*) as count
      FROM todos
      WHERE status_text IN ('failed','error')
        AND COALESCE(finished_at, created_at) >= ?
      GROUP BY reason
      ORDER BY count DESC
      LIMIT 5
    `, [since]);

    const agentPerf = await q(db, `
      SELECT
        s.name as agent,
        COUNT(t.id) as total,
        SUM(CASE WHEN t.status_text = 'completed' OR t.completed = 1 THEN 1 ELSE 0 END) as completed,
        SUM(CASE WHEN t.status_text IN ('failed','error') THEN 1 ELSE 0 END) as failed,
        CAST(AVG(CASE WHEN t.duration_ms IS NOT NULL THEN t.duration_ms END) AS INTEGER) as avg_duration_ms
      FROM todos t
      LEFT JOIN subagents s ON s.id = t.subagent_id
      WHERE COALESCE(t.finished_at, t.created_at) >= ?
      GROUP BY s.name
      ORDER BY completed DESC, total DESC
      LIMIT 10
    `, [since]);

    const completionRate = totals.total ? ((totals.completed || 0) / totals.total * 100).toFixed(1) : '0.0';
    const avgMins = totals.avg_duration_ms ? Math.round(totals.avg_duration_ms / 60000) : 0;

    const lines = [];
    lines.push(`\n=== Daily Mission Summary (${now.toISOString()}) ===`);
    lines.push(`Window: last 24h`);
    lines.push(`Total tasks: ${totals.total || 0}`);
    lines.push(`Completed: ${totals.completed || 0}`);
    lines.push(`Failed: ${totals.failed || 0}`);
    lines.push(`Completion rate: ${completionRate}%`);
    lines.push(`Tasks with retries: ${totals.retried || 0}`);
    lines.push(`Avg duration: ${avgMins} min`);
    lines.push(`Avg self-score: ${totals.avg_score ?? 'N/A'}`);

    lines.push(`Top failure reasons:`);
    if (!failureReasons.length) {
      lines.push(`- none`);
    } else {
      for (const r of failureReasons) lines.push(`- ${r.reason}: ${r.count}`);
    }

    lines.push(`Agent performance:`);
    if (!agentPerf.length) {
      lines.push(`- no task activity`);
    } else {
      for (const a of agentPerf) {
        const dur = a.avg_duration_ms ? `${Math.round(a.avg_duration_ms / 60000)}m` : 'n/a';
        lines.push(`- ${a.agent || 'unknown'}: total ${a.total}, completed ${a.completed || 0}, failed ${a.failed || 0}, avg ${dur}`);
      }
    }

    fs.mkdirSync(OUT_DIR, { recursive: true });
    fs.appendFileSync(OUT_FILE, lines.join('\n') + '\n');
    console.log(lines.join('\n'));
  } catch (e) {
    console.error('daily-mission-summary failed:', e.message);
    process.exitCode = 1;
  } finally {
    db.close();
  }
})();
