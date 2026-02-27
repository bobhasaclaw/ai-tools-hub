// Mission Control Server with SQLite Backend
// Serves dashboard + API for subagent management

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = 9000;
const DIR = __dirname;
const HOME = process.env.HOME || '/Users/pmanopen';
const OPENCLAW_DIR = path.join(HOME, '.openclaw');
const WORKSPACE_DIR = path.join(OPENCLAW_DIR, 'workspace');

// Database (lazy loaded)
let db = null;
const dbPromise = import('./database.js').then(m => {
    return m.initDB().then(() => m);
});

const mimeTypes = {
    '.html': 'text/html',
    '.js': 'application/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.md': 'text/markdown'
};

// Parse JSON body
function parseBody(req) {
    return new Promise((resolve, reject) => {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            try {
                resolve(body ? JSON.parse(body) : {});
            } catch (e) {
                reject(e);
            }
        });
    });
}

// Send JSON response
function sendJSON(res, data, status = 200) {
    res.writeHead(status, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
    res.end(JSON.stringify(data));
}

// Send error
function sendError(res, message, status = 500) {
    sendJSON(res, { error: message }, status);
}

// Handle API requests
async function handleAPI(req, res, pathname) {
    try {
        const db = await dbPromise;
        
        // === SUBAGENTS ===
        
        // GET /api/subagents - List all subagents
        if (pathname === '/api/subagents' && req.method === 'GET') {
            const subagents = await db.getAllSubagents();
            
            // Enrich with todo count and history count
            for (let sub of subagents) {
                const todos = await db.getTodos(sub.id);
                const history = await db.getHistory(sub.id);
                sub.todoCount = todos.filter(t => !t.completed).length;
                sub.historyCount = history.length;
            }
            
            return sendJSON(res, subagents);
        }
        
        // POST /api/subagents - Register new subagent
        if (pathname === '/api/subagents' && req.method === 'POST') {
            const { id, name, type } = await parseBody(req);
            if (!id || !name) {
                return sendError(res, 'Missing id or name', 400);
            }
            const subagent = await db.registerSubagent(id, name, type || 'general');
            return sendJSON(res, subagent);
        }
        
        // GET /api/subagents/:id - Get single subagent
        if (pathname.startsWith('/api/subagents/') && req.method === 'GET') {
            const id = pathname.split('/')[3];
            const subagent = await db.getSubagent(id);
            if (!subagent) {
                return sendError(res, 'Subagent not found', 404);
            }
            
            // Enrich with todos and history
            subagent.todos = await db.getTodos(id);
            subagent.history = await db.getHistory(id);
            subagent.activity = await db.getActivity(id);
            
            return sendJSON(res, subagent);
        }
        
        // PUT /api/subagents/:id - Update subagent
        if (pathname.startsWith('/api/subagents/') && req.method === 'PUT') {
            const id = pathname.split('/')[3];
            const { status, task, progress } = await parseBody(req);
            
            if (status) await db.updateStatus(id, status, progress);
            if (task) await db.updateTask(id, task);
            
            return sendJSON(res, await db.getSubagent(id));
        }
        
        // DELETE /api/subagents/:id
        if (pathname.startsWith('/api/subagents/') && req.method === 'DELETE') {
            const id = pathname.split('/')[3];
            await db.deleteSubagent(id);
            return sendJSON(res, { success: true });
        }
        
        // === TODOS ===
        
        // POST /api/subagents/:id/todos - Add todo
        if (pathname.match(/\/api\/subagents\/[^/]+\/todos$/) && req.method === 'POST') {
            const id = pathname.split('/')[3];
            const { text } = await parseBody(req);
            if (!text) return sendError(res, 'Missing text', 400);
            const todos = await db.addTodo(id, text);
            return sendJSON(res, todos);
        }
        
        // PUT /api/todos/:id/toggle - Toggle todo
        if (pathname === '/api/todos/toggle' && req.method === 'PUT') {
            const { id } = await parseBody(req);
            const todos = await db.toggleTodo(id);
            return sendJSON(res, todos);
        }
        
        // DELETE /api/todos/:id
        if (pathname.match(/\/api\/todos\/\d+$/) && req.method === 'DELETE') {
            const id = parseInt(pathname.split('/').pop());
            await db.deleteTodo(id);
            return sendJSON(res, { success: true });
        }
        
        // === HISTORY ===
        
        // POST /api/subagents/:id/history - Add to history
        if (pathname.match(/\/api\/subagents\/[^/]+\/history$/) && req.method === 'POST') {
            const id = pathname.split('/')[3];
            const { task, status, summary, details } = await parseBody(req);
            const history = await db.addToHistory(id, task, status || 'completed', summary || '', details || '');
            return sendJSON(res, history);
        }
        
        // GET /api/history - All history
        if (pathname === '/api/history' && req.method === 'GET') {
            const history = await db.getAllHistory();
            return sendJSON(res, history);
        }
        
        // === STATS ===
        
        // GET /api/stats
        if (pathname === '/api/stats' && req.method === 'GET') {
            const stats = await db.getStats();
            return sendJSON(res, stats);
        }
        
        // === ACTIVITY ===
        
        // GET /api/subagents/:id/activity
        if (pathname.match(/\/api\/subagents\/[^/]+\/activity$/) && req.method === 'GET') {
            const id = pathname.split('/')[3];
            const activity = await db.getActivity(id);
            return sendJSON(res, activity);
        }
        
        // === TASKS BOARD ===
        
        // GET /api/tasks - Get all tasks (for board view)
        if (pathname === '/api/tasks' && req.method === 'GET') {
            const subagents = await db.getAllSubagents();
            const allTodos = [];
            for (const sub of subagents) {
                const todos = await db.getTodos(sub.id);
                for (const todo of todos) {
                    allTodos.push({
                        ...todo,
                        agentName: sub.name,
                        agentType: sub.type
                    });
                }
            }
            return sendJSON(res, allTodos);
        }
        
        // POST /api/tasks - Add new task
        if (pathname === '/api/tasks' && req.method === 'POST') {
            const { subagent_id, text, status, priority } = await parseBody(req);
            if (!subagent_id || !text) {
                return sendError(res, 'Missing subagent_id or text', 400);
            }
            // Insert into todos table with telemetry defaults
            const result = await db.addTodo(subagent_id, text, priority || 'normal');
            // Update status if provided
            if (status) {
                const isDone = status === 'completed';
                await db.runQuery(`UPDATE todos SET completed = ?, status_text = ?, ${isDone ? "finished_at = datetime('now'), duration_ms = CAST((julianday(datetime('now')) - julianday(COALESCE(started_at, queued_at, created_at))) * 86400000 AS INTEGER)" : "started_at = COALESCE(started_at, datetime('now'))"} WHERE id = ?`, [isDone ? 1 : 0, status, result.lastID]);
            }
            return sendJSON(res, result);
        }
        
        // PUT /api/tasks/:id - Update task
        if (pathname.match(/\/api\/tasks\/\d+$/) && req.method === 'PUT') {
            const id = parseInt(pathname.split('/').pop());
            const { text, completed, status, failure_reason, verification_status, verification_notes, self_score, retry_increment } = await parseBody(req);
            let updates = [];
            let params = [];

            if (text) { updates.push('text = ?'); params.push(text); }
            if (completed !== undefined) {
                updates.push('completed = ?');
                params.push(completed ? 1 : 0);
                if (completed) {
                    updates.push("status_text = 'completed'");
                    updates.push("finished_at = datetime('now')");
                    updates.push("duration_ms = CAST((julianday(datetime('now')) - julianday(COALESCE(started_at, queued_at, created_at))) * 86400000 AS INTEGER)");
                }
            }
            if (status) {
                updates.push('status_text = ?');
                params.push(status);
                if (status === 'in_progress' || status === 'running') {
                    updates.push("started_at = COALESCE(started_at, datetime('now'))");
                    updates.push('completed = 0');
                }
                if (status === 'completed') {
                    updates.push('completed = 1');
                    updates.push("finished_at = datetime('now')");
                    updates.push("duration_ms = CAST((julianday(datetime('now')) - julianday(COALESCE(started_at, queued_at, created_at))) * 86400000 AS INTEGER)");
                }
                if (status === 'failed' || status === 'error') {
                    updates.push('completed = 0');
                    updates.push("finished_at = datetime('now')");
                }
            }
            if (failure_reason !== undefined) { updates.push('failure_reason = ?'); params.push(failure_reason); }
            if (verification_status !== undefined) { updates.push('verification_status = ?'); params.push(verification_status); }
            if (verification_notes !== undefined) { updates.push('verification_notes = ?'); params.push(verification_notes); }
            if (self_score !== undefined) { updates.push('self_score = ?'); params.push(self_score); }
            if (retry_increment) { updates.push('retry_count = COALESCE(retry_count, 0) + 1'); }

            params.push(id);
            if (updates.length > 0) {
                await db.runQuery(`UPDATE todos SET ${updates.join(', ')} WHERE id = ?`, params);
            }
            return sendJSON(res, { success: true });
        }
        
        // DELETE /api/tasks/:id
        if (pathname.match(/\/api\/tasks\/\d+$/) && req.method === 'DELETE') {
            const id = parseInt(pathname.split('/').pop());
            await db.runQuery(`DELETE FROM todos WHERE id = ?`, [id]);
            return sendJSON(res, { success: true });
        }
        
        // === CALENDAR (CRON JOBS) ===
        
        // GET /api/calendar - Get cron jobs + run history
        if (pathname === '/api/calendar' && req.method === 'GET') {
            const fs = require('fs');
            const cronJobsPath = path.join(OPENCLAW_DIR, 'cron', 'jobs.json');
            const cronRunsPath = path.join(OPENCLAW_DIR, 'cron', 'runs');
            
            let jobs = [];
            let runs = [];
            
            // Read current jobs
            try {
                if (fs.existsSync(cronJobsPath)) {
                    const jobsData = JSON.parse(fs.readFileSync(cronJobsPath, 'utf-8'));
                    jobs = jobsData.jobs || [];
                }
            } catch (e) {
                console.error('Error reading cron jobs:', e);
            }
            
            // Read run history
            try {
                if (fs.existsSync(cronRunsPath)) {
                    const files = fs.readdirSync(cronRunsPath);
                    for (const file of files) {
                        if (file.endsWith('.jsonl')) {
                            const content = fs.readFileSync(path.join(cronRunsPath, file), 'utf-8');
                            const lines = content.trim().split('\n');
                            for (const line of lines) {
                                try {
                                    const run = JSON.parse(line);
                                    runs.push(run);
                                } catch (e) {}
                            }
                        }
                    }
                }
            } catch (e) {
                console.error('Error reading cron runs:', e);
            }
            
            // Sort runs by time (newest first)
            runs.sort((a, b) => b.ts - a.ts);
            
            // Get query params for filtering
            const urlObj = new URL(req.url, 'http://127.0.0.1:9000');
            const days = parseInt(urlObj.searchParams.get('days')) || 7;
            const startDate = Date.now() - (days * 24 * 60 * 60 * 1000);
            
            // Filter runs to last N days
            const recentRuns = runs.filter(r => r.ts > startDate);
            
            return sendJSON(res, {
                jobs: jobs.map(j => ({
                    id: j.id,
                    name: j.name,
                    schedule: j.schedule?.expr,
                    enabled: j.enabled,
                    nextRun: j.state?.nextRunAtMs,
                    lastRun: j.state?.lastRunAtMs,
                    status: j.state?.lastStatus
                })),
                runs: recentRuns.map(r => ({
                    id: r.jobId,
                    runAt: r.runAtMs,
                    duration: r.durationMs,
                    status: r.status,
                    summary: r.summary?.substring(0, 200)
                }))
            });
        }
        
        // GET /api/calendar/runs/:jobId - Get specific job runs
        if (pathname.match(/\/api\/calendar\/runs\/[^\/]+$/) && req.method === 'GET') {
            const jobId = pathname.split('/').pop();
            const fs = require('fs');
            const runFile = path.join(OPENCLAW_DIR, 'cron', 'runs', `${jobId}.jsonl`);
            
            let runs = [];
            try {
                if (fs.existsSync(runFile)) {
                    const content = fs.readFileSync(runFile, 'utf-8');
                    const lines = content.trim().split('\n');
                    for (const line of lines) {
                        try {
                            const run = JSON.parse(line);
                            runs.push({
                                runAt: run.runAtMs,
                                duration: run.durationMs,
                                status: run.status,
                                summary: run.summary,
                                nextRun: run.nextRunAtMs
                            });
                        } catch (e) {}
                    }
                }
            } catch (e) {
                console.error('Error reading run file:', e);
            }
            
            runs.sort((a, b) => b.runAt - a.runAt);
            return sendJSON(res, runs);
        }
        
        // === RESEARCH FILES ===
        
        // GET /api/research - List available research files
        if (pathname === '/api/research' && req.method === 'GET') {
            const researchDir = path.join(WORKSPACE_DIR, 'research');
            const files = [];
            try {
                const fs = require('fs');
                if (fs.existsSync(researchDir)) {
                    const dirFiles = fs.readdirSync(researchDir);
                    for (const file of dirFiles) {
                        if (file.endsWith('.md')) {
                            const stats = fs.statSync(path.join(researchDir, file));
                            files.push({
                                name: file,
                                path: `research/${file}`,
                                size: stats.size,
                                modified: stats.mtime
                            });
                        }
                    }
                }
            } catch (e) {
                console.error('Error reading research dir:', e);
            }
            return sendJSON(res, files);
        }
        
        // GET /api/research/:filename - Get specific research file content
        if (pathname.match(/\/api\/research\/[^\/]+$/) && req.method === 'GET') {
            const filename = pathname.split('/').pop();
            const researchDir = path.join(WORKSPACE_DIR, 'research');
            const filePath = path.join(researchDir, filename);
            
            // Security: prevent directory traversal
            if (!filePath.startsWith(researchDir)) {
                return sendError(res, 'Forbidden', 403);
            }
            
            try {
                const content = fs.readFileSync(filePath, 'utf-8');
                sendJSON(res, { filename, content });
            } catch (e) {
                return sendError(res, 'File not found', 404);
            }
        }
        
        // 404
        if (!res.headersSent) {
            sendError(res, 'Not found', 404);
        }
        
    } catch (err) {
        console.error('API Error:', err);
        try {
            if (!res.headersSent) {
                sendError(res, err.message);
            }
        } catch (e) {
            console.error('Error sending error response:', e);
        }
    }
}

// Serve static files
function serveStatic(req, res, pathname) {
    let filePath = path.join(DIR, pathname === '/' ? 'index.html' : pathname);
    
    // Security: prevent directory traversal
    if (!filePath.startsWith(DIR)) {
        res.writeHead(403);
        res.end('Forbidden');
        return;
    }
    
    const ext = path.extname(filePath).toLowerCase();
    const contentType = mimeTypes[ext] || 'application/octet-stream';
    
    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                res.writeHead(404);
                res.end('File not found');
            } else {
                res.writeHead(500);
                res.end('Server error');
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content);
        }
    });
}

// Main server
async function startServer() {
    // Initialize DB first
    await dbPromise;
    console.log('Database ready');
    
    const server = http.createServer(async (req, res) => {
        const parsedUrl = url.parse(req.url, true);
        const pathname = parsedUrl.pathname;
        
        // CORS headers
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        
        if (req.method === 'OPTIONS') {
            res.writeHead(204);
            res.end();
            return;
        }
        
        // API routes
        if (pathname.startsWith('/api/')) {
            return handleAPI(req, res, pathname);
        }
        
        // Static files
        serveStatic(req, res, pathname);
    });
    
    server.listen(PORT, () => {
        console.log(`🎯 Mission Control running at http://localhost:${PORT}`);
        console.log(`📊 Dashboard: http://localhost:${PORT}/`);
        console.log(`🔌 API: http://localhost:${PORT}/api/`);
    });
}

startServer().catch(console.error);

// Keep process alive
process.stdin.resume();
