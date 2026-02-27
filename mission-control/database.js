// Mission Control - SQLite Data Layer
// Provides persistent storage for all subagent data

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const DB_PATH = path.join(__dirname, 'mission-control.db');

let db = null;

// Initialize database
function initDB() {
    return new Promise((resolve, reject) => {
        db = new sqlite3.Database(DB_PATH, (err) => {
            if (err) {
                console.error('DB init error:', err);
                reject(err);
                return;
            }
            
            // Create tables
            db.serialize(() => {
                // Subagents table
                db.run(`
                    CREATE TABLE IF NOT EXISTS subagents (
                        id TEXT PRIMARY KEY,
                        name TEXT NOT NULL,
                        type TEXT DEFAULT 'general',
                        status TEXT DEFAULT 'idle',
                        current_task TEXT,
                        start_time TEXT,
                        progress INTEGER DEFAULT 0,
                        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
                        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
                    )
                `);
                
                // Todos table
                db.run(`
                    CREATE TABLE IF NOT EXISTS todos (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        subagent_id TEXT NOT NULL,
                        text TEXT NOT NULL,
                        completed INTEGER DEFAULT 0,
                        status_text TEXT DEFAULT 'pending',
                        priority TEXT DEFAULT 'normal',
                        queued_at TEXT DEFAULT CURRENT_TIMESTAMP,
                        started_at TEXT,
                        finished_at TEXT,
                        duration_ms INTEGER,
                        retry_count INTEGER DEFAULT 0,
                        failure_reason TEXT,
                        verification_status TEXT DEFAULT 'unverified',
                        verification_notes TEXT,
                        self_score REAL,
                        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
                        FOREIGN KEY (subagent_id) REFERENCES subagents(id) ON DELETE CASCADE
                    )
                `);
                
                // History table
                db.run(`
                    CREATE TABLE IF NOT EXISTS history (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        subagent_id TEXT NOT NULL,
                        task TEXT NOT NULL,
                        status TEXT DEFAULT 'completed',
                        summary TEXT,
                        details TEXT,
                        start_time TEXT,
                        end_time TEXT,
                        duration TEXT,
                        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
                        FOREIGN KEY (subagent_id) REFERENCES subagents(id) ON DELETE CASCADE
                    )
                `);
                
                // Activity log - for full audit trail
                db.run(`
                    CREATE TABLE IF NOT EXISTS activity_log (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        subagent_id TEXT NOT NULL,
                        action TEXT NOT NULL,
                        data TEXT,
                        timestamp TEXT DEFAULT CURRENT_TIMESTAMP,
                        FOREIGN KEY (subagent_id) REFERENCES subagents(id) ON DELETE CASCADE
                    )
                `);

                // Lightweight migrations for existing databases
                const todoMigrations = [
                    "ALTER TABLE todos ADD COLUMN status_text TEXT DEFAULT 'pending'",
                    "ALTER TABLE todos ADD COLUMN priority TEXT DEFAULT 'normal'",
                    "ALTER TABLE todos ADD COLUMN queued_at TEXT",
                    "ALTER TABLE todos ADD COLUMN started_at TEXT",
                    "ALTER TABLE todos ADD COLUMN finished_at TEXT",
                    "ALTER TABLE todos ADD COLUMN duration_ms INTEGER",
                    "ALTER TABLE todos ADD COLUMN retry_count INTEGER DEFAULT 0",
                    "ALTER TABLE todos ADD COLUMN failure_reason TEXT",
                    "ALTER TABLE todos ADD COLUMN verification_status TEXT DEFAULT 'unverified'",
                    "ALTER TABLE todos ADD COLUMN verification_notes TEXT",
                    "ALTER TABLE todos ADD COLUMN self_score REAL"
                ];
                todoMigrations.forEach((sql) => db.run(sql, () => {}));
                db.run("UPDATE todos SET queued_at = COALESCE(queued_at, created_at, datetime('now'))", () => {});
                db.run("UPDATE todos SET status_text = CASE WHEN completed = 1 THEN 'completed' ELSE COALESCE(status_text, 'pending') END", () => {});
                
                console.log('Database initialized');
                resolve();
            });
        });
    });
}

// Helper to run queries
function runQuery(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.run(sql, params, function(err) {
            if (err) reject(err);
            else resolve(this);
        });
    });
}

function getOne(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.get(sql, params, (err, row) => {
            if (err) reject(err);
            else resolve(row);
        });
    });
}

function getAll(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
}

// ============ Subagent Operations ============

// Register new subagent
async function registerSubagent(id, name, type = 'general') {
    await runQuery(
        `INSERT OR REPLACE INTO subagents (id, name, type, status, created_at, updated_at) 
         VALUES (?, ?, ?, 'idle', datetime('now'), datetime('now'))`,
        [id, name, type]
    );
    await logActivity(id, 'registered', { name, type });
    return getSubagent(id);
}

// Get subagent by ID
async function getSubagent(id) {
    return getOne(`SELECT * FROM subagents WHERE id = ?`, [id]);
}

// Get all subagents
async function getAllSubagents() {
    return getAll(`SELECT * FROM subagents ORDER BY updated_at DESC`);
}

// Update subagent status
async function updateStatus(id, status, progress = null) {
    let sql = `UPDATE subagents SET status = ?, updated_at = datetime('now')`;
    let params = [status];
    
    if (progress !== null) {
        sql += `, progress = ?`;
        params.push(progress);
    }
    
    sql += ` WHERE id = ?`;
    params.push(id);
    
    await runQuery(sql, params);
    await logActivity(id, 'status_change', { status, progress });
    return getSubagent(id);
}

// Update current task
async function updateTask(id, task) {
    await runQuery(
        `UPDATE subagents SET current_task = ?, start_time = datetime('now'), updated_at = datetime('now') WHERE id = ?`,
        [task, id]
    );
    await logActivity(id, 'task_update', { task });
    return getSubagent(id);
}

// Set subagent to idle (no active task)
async function setIdle(id) {
    await runQuery(
        `UPDATE subagents SET status = 'idle', progress = NULL, updated_at = datetime('now') WHERE id = ?`,
        [id]
    );
    await logActivity(id, 'idle', {});
    return getSubagent(id);
}

// Delete subagent
async function deleteSubagent(id) {
    await runQuery(`DELETE FROM subagents WHERE id = ?`, [id]);
    await logActivity(id, 'deleted', {});
}

// ============ Todo Operations ============

// Add todo
async function addTodo(subagentId, text, priority = 'normal') {
    const result = await runQuery(
        `INSERT INTO todos (subagent_id, text, status_text, priority, queued_at) VALUES (?, ?, 'pending', ?, datetime('now'))`,
        [subagentId, text, priority]
    );
    await logActivity(subagentId, 'todo_added', { text, id: result.lastID });
    return getTodos(subagentId);
}

// Get todos for subagent
async function getTodos(subagentId) {
    return getAll(`SELECT * FROM todos WHERE subagent_id = ? ORDER BY created_at DESC`, [subagentId]);
}

// Toggle todo
async function toggleTodo(todoId) {
    const todo = await getOne(`SELECT * FROM todos WHERE id = ?`, [todoId]);
    if (todo) {
        await runQuery(`UPDATE todos SET completed = ? WHERE id = ?`, [todo.completed ? 0 : 1, todoId]);
        await logActivity(todo.subagent_id, 'todo_toggled', { todoId, completed: !todo.completed });
    }
    return getTodos(todo.subagent_id);
}

// Delete todo
async function deleteTodo(todoId) {
    const todo = await getOne(`SELECT * FROM todos WHERE id = ?`, [todoId]);
    if (todo) {
        await runQuery(`DELETE FROM todos WHERE id = ?`, [todoId]);
        await logActivity(todo.subagent_id, 'todo_deleted', { todoId });
    }
}

// Update todo
async function updateTodo(todoId, updates) {
    const todo = await getOne(`SELECT * FROM todos WHERE id = ?`, [todoId]);
    if (!todo) return null;
    
    let updateParts = [];
    let params = [];
    
    if (updates.text !== undefined) {
        updateParts.push('text = ?');
        params.push(updates.text);
    }
    if (updates.completed !== undefined) {
        updateParts.push('completed = ?');
        params.push(updates.completed ? 1 : 0);
    }
    
    if (updateParts.length > 0) {
        params.push(todoId);
        await runQuery(`UPDATE todos SET ${updateParts.join(', ')} WHERE id = ?`, params);
        await logActivity(todo.subagent_id, 'todo_updated', { todoId, updates });
    }
    
    return getOne(`SELECT * FROM todos WHERE id = ?`, [todoId]);
}

// ============ History Operations ============

// Add to history (when task completes)
async function addToHistory(subagentId, task, status, summary = '', details = '') {
    const subagent = await getSubagent(subagentId);
    const startTime = subagent?.start_time || datetime('now');
    const endTime = datetime('now');
    const duration = calculateDuration(startTime, endTime);
    
    await runQuery(
        `INSERT INTO history (subagent_id, task, status, summary, details, start_time, end_time, duration)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [subagentId, task, status, summary, details, startTime, endTime, duration]
    );
    
    // Clear current task
    await runQuery(
        `UPDATE subagents SET current_task = NULL, start_time = NULL, progress = NULL, status = 'idle', updated_at = datetime('now') WHERE id = ?`,
        [subagentId]
    );
    
    await logActivity(subagentId, 'task_completed', { task, status, summary });
    return getHistory(subagentId);
}

// Get history for subagent
async function getHistory(subagentId, limit = 50) {
    return getAll(
        `SELECT * FROM history WHERE subagent_id = ? ORDER BY created_at DESC LIMIT ?`,
        [subagentId, limit]
    );
}

// Get all history (across all subagents)
async function getAllHistory(limit = 100) {
    return getAll(
        `SELECT * FROM history ORDER BY created_at DESC LIMIT ?`,
        [limit]
    );
}

// ============ Activity Log ============

// Log activity
async function logActivity(subagentId, action, data = {}) {
    await runQuery(
        `INSERT INTO activity_log (subagent_id, action, data) VALUES (?, ?, ?)`,
        [subagentId, action, JSON.stringify(data)]
    );
}

// Get activity log
async function getActivity(subagentId, limit = 50) {
    return getAll(
        `SELECT * FROM activity_log WHERE subagent_id = ? ORDER BY timestamp DESC LIMIT ?`,
        [subagentId, limit]
    );
}

// ============ Stats ============

// Get dashboard stats
async function getStats() {
    const total = await getOne(`SELECT COUNT(*) as count FROM subagents`);
    const running = await getOne(`SELECT COUNT(*) as count FROM subagents WHERE status = 'running'`);
    const idle = await getOne(`SELECT COUNT(*) as count FROM subagents WHERE status = 'idle'`);
    const errors = await getOne(`SELECT COUNT(*) as count FROM subagents WHERE status = 'error'`);
    const totalTasks = await getOne(`SELECT COUNT(*) as count FROM history`);
    const completedTasks = await getOne(`SELECT COUNT(*) as count FROM history WHERE status = 'completed'`);
    const failedTasks = await getOne(`SELECT COUNT(*) as count FROM history WHERE status = 'error'`);
    
    // Get research tasks (tasks with 'research' in task name or file_path)
    const researchTasks = await getOne(`SELECT COUNT(*) as count FROM history WHERE task LIKE '%research%' OR task LIKE '%Research%'`);
    
    // Get content tasks
    const contentTasks = await getOne(`SELECT COUNT(*) as count FROM history WHERE task LIKE '%content%' OR task LIKE '%article%' OR task LIKE '%website%'`);

    // Telemetry stats (todos/task-board)
    const taskTotals = await getOne(`SELECT COUNT(*) as count FROM todos`);
    const taskPending = await getOne(`SELECT COUNT(*) as count FROM todos WHERE status_text IN ('pending') AND completed = 0`);
    const taskInProgress = await getOne(`SELECT COUNT(*) as count FROM todos WHERE status_text IN ('in_progress','running') AND completed = 0`);
    const taskCompleted = await getOne(`SELECT COUNT(*) as count FROM todos WHERE status_text = 'completed' OR completed = 1`);
    const taskFailed = await getOne(`SELECT COUNT(*) as count FROM todos WHERE status_text IN ('failed','error')`);
    const avgDurationMs = await getOne(`SELECT CAST(AVG(duration_ms) AS INTEGER) as value FROM todos WHERE duration_ms IS NOT NULL`);
    const avgSelfScore = await getOne(`SELECT ROUND(AVG(self_score), 2) as value FROM todos WHERE self_score IS NOT NULL`);
    
    return {
        totalSubagents: total?.count || 0,
        running: running?.count || 0,
        idle: idle?.count || 0,
        errors: errors?.count || 0,
        totalTasks: totalTasks?.count || 0,
        completedTasks: completedTasks?.count || 0,
        failedTasks: failedTasks?.count || 0,
        researchTasks: researchTasks?.count || 0,
        contentTasks: contentTasks?.count || 0,
        telemetry: {
            total: taskTotals?.count || 0,
            pending: taskPending?.count || 0,
            inProgress: taskInProgress?.count || 0,
            completed: taskCompleted?.count || 0,
            failed: taskFailed?.count || 0,
            avgDurationMs: avgDurationMs?.value || 0,
            avgSelfScore: avgSelfScore?.value || null
        }
    };
}

// ============ Utils ============

function datetime(isoString) {
    if (!isoString || isoString === 'now') {
        return new Date().toISOString();
    }
    return new Date(isoString).toISOString();
}

function calculateDuration(start, end) {
    if (!start || !end) return 'N/A';
    const s = new Date(start);
    const e = new Date(end);
    const ms = e - s;
    
    if (ms < 60000) return `${Math.floor(ms / 1000)}s`;
    if (ms < 3600000) return `${Math.floor(ms / 60000)}m ${Math.floor((ms % 60000) / 1000)}s`;
    return `${Math.floor(ms / 3600000)}h ${Math.floor((ms % 3600000) / 60000)}m`;
}

module.exports = {
    initDB,
    // Subagents
    registerSubagent,
    getSubagent,
    getAllSubagents,
    updateStatus,
    updateTask,
    setIdle,
    deleteSubagent,
    // Todos
    addTodo,
    getTodos,
    toggleTodo,
    deleteTodo,
    updateTodo,
    // History
    addToHistory,
    getHistory,
    getAllHistory,
    // Activity
    logActivity,
    getActivity,
    // Stats
    getStats,
    // Utility
    runQuery
};
