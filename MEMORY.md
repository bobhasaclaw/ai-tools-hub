# MEMORY.md - Long-Term Memory

## Core Info

- **User:** Andrew Priest
- **Location:** Cooloola Cove, QLD, Australia
- **Goal:** Self-sufficiency, rich from online means
- **Setup:** OpenClaw on WSL2 Ubuntu (migrated from Windows 2026-02-17)
- **NEW:** Mac mini M4 arriving - dedicated OpenClaw machine (2026-02-25)

## Running Notes

- **Backup:** `C:\Users\Pfam\Documents\openclawbackupBob\` — manual
- **Mission Control:** PM2 process, auto-restart, runs at `localhost:9000`
- **Coding Setup:** Cursor v2.4.37, Node.js v22.22.0, projects in `workspace/projects/`
- **Subagent System:** Real subagents via `sessions_spawn()`, check with `sessions_list`
- **Skills:** weather, healthcheck, skill-creator, tmux
- **Qwen 3.5 (NVIDIA):** Has built-in image AND video generation - use for website images, article illustrations

## Key OpenClaw Insights

### Tools
- `exec`: use `pty: true` for interactive CLIs
- `browser`: `profile="chrome"` = your Chrome, `profile="openclaw"` = isolated
- Use tool groups: `group:fs`, `group:runtime`, `group:sessions`, `group:web`

### Subagents
- Long timeouts (600s+ research, 900s+ coding)
- Unique labels: `research-*`, `code-*`, `web-*`
- Nested subagents (depth 2) for orchestrator pattern

### Debugging
- OpenClaw: `openclaw doctor`, `openclaw logs`
- Browser: `browser(action="console")` for JS errors
- Node: `node --inspect` + Chrome DevTools

## Website Principles (AI Tools Hub)

1. **"Why would users come here?"** — constantly ask this
2. **Never perfect, always improve** — keep iterating
3. **Professional 2026 standards** — quality over quantity
4. **E-E-A-T & fact-checking** — accurate pricing, cite sources
5. **Design + function** — make it attractive AND useful

## Problem Solving

**ALWAYS RESEARCH FIRST** — check docs, search errors, understand root cause before fixing.

## AI Tools Hub Progress (2026-02-21)

- 7 AI tools covered with accurate 2026 pricing
- SEO-optimized articles with E-E-A-T, Schema.org, Open Graph

## Social Media Automation Research (2026-02-21)

### Key Findings

**AI Video Free Tiers:**
- HeyGen: Free plan available, text-to-video
- Synthesia: 10 min/month free, 160+ languages
- RunwayML: Limited free credits (125)
- Pika: Free tier available
- Luma Dream Machine: Free plan with limits

**AI Image Free Tiers:**
- Leonardo.ai: 150 tokens/day (BEST free option)
- Bing Image Creator: Free via Microsoft Rewards
- Adobe Firefly: 25 credits/month
- Stable Diffusion: Self-hosted free

**Social Media APIs:**
- Twitter/X: NOW PAY-PER-USAGE (not $100/mo!) - major update
- Instagram: Free tier with business verification
- BEST FREE OPTION: OpenClaw browser automation

**Video Editing Stack (Free):**
- CapCut: Full-featured free, AI-powered
- Descript: Free tier (1hr/month), Underlord AI
- DaVinci Resolve: Full free version with AI features (v20)

**Content Repurposing:**
- 1 article → 10+ social posts via AI
- Typefully/ChatGPT for threads
- Canva/CapCut for carousels

**Shorts/Reels Automation:**
- CapCut + AI images = viral potential
- Pippit AI: text to ready-to-post videos
- Workflow: Script → AI images/video → CapCut edit → schedule

### Source
- Full guide: research/SOCIAL-MEDIA-RESEARCH.md
- GitHub Pages deployment: bobhasaclaw.github.io/ai-tools-hub
- Latest: Eleven Labs Review 2026 (4.9/5 rating)

### Browser Setup (WORKAROUND FOUND)
- Chrome extension needs `chrome-extension://iegbeidaccchcniplcmhgihefheoobno/options.html` visited first
- After visiting URL, clicking extension icon WORKS!

## Nightly Research (2026-02-21)

### 1. Online Income
- Creator economy continues thriving — TikTok creators redefining high-quality storytelling (Forbes)
- BBC Maestro courses on business/personal development gaining traction
- Key insight: Focus on validating business ideas with honest feedback before building

### 2. Self-Sufficiency & Homesteading
- Energy costs trending down — UK household bills forecast to fall by £117/year (Guardian)
- Growing interest in sustainable living and financial independence
- Record 1,000 UK taxpayers under 30 earned >£1m — FIRE movement gaining momentum

### 3. Wealth Building & Investing
- ETF investing trends continue dominant (Forbes)
- Trump administration proposing "alternative investments" for everyday Americans — WARNING: potential risks for small investors
- Next Billion-Dollar Startups 2025 (Forbes) — research emerging companies

### 4. AI Tools for Income
- Agentic AI emerging as major trend (Forbes)
- AI-powered cybersecurity in high demand
- Enterprise AI continues growth trajectory

### 5. Side Hustles
- Job market challenging — "Hunger Games" style competition for low-paid work
- People turning to dating apps for career networking
- Key: Skills-based side hustles (writing, design, coding) remain viable

### Actionable Insights
- Start with idea validation before building products
- Focus on long-term sustainable productivity vs. short-term gains
- Consider AI tools for automation and scaling existing income streams
- Build personal brand through consistent content creation

## 2026-02-22 SEO Research (Latest - Feb 22)

### ChatGPT Citation Science (Breakthrough)
- Kevin Indig analyzed 1.2M ChatGPT citations - P-value 0.0 (statistically indisputable)
- "Ski ramp" pattern: 44.2% citations from FIRST 30% of content
- Write like a journalist, NOT "ultimate guides"

**5 Winning Characteristics:**
1. Definitive language (2x more citations) - "is defined as"
2. Conversational Q&A - H2 = question, paragraph = answer
3. Entity richness - 20.6% density (vs 5-8% normal)
4. Balanced sentiment - 0.47 score (analyst voice)
5. Simple writing - Flesch-Kincaid 16 (college level)

### Action Items
- Front-load key insights in articles
- Use Q&A heading structure
- Name specific tools/brands (increase entity density)
- Add Review schema markup

### Resources
- research/RESEARCH-LOG.md (full details)
- Search Engine Journal

### Key Findings

**OpenClaw Tool Best Practices:**
- Use tool groups: `group:fs`, `group:runtime`, `group:sessions`, `group:web`
- Browser: `profile="chrome"` for existing Chrome with extension relay, `profile="openclaw"` for isolated
- Exec: Use `pty: true` for interactive CLIs (vim, htop)
- Subagents: Use unique labels, long timeouts (600s+), nested (depth=2) for orchestrator pattern

**Advanced Features:**
- apply_patch: multi-file structured edits (experimental, OpenAI only)
- Loop detection: configurable thresholds for repetitive tool calls
- Provider-specific tool policies: granular control per model
- Nested subagents: maxSpawnDepth 2 for orchestrator → worker pattern

**Sources:**
- Full guide: research/CODING-RESEARCH.md
- OpenClaw docs: ~/.npm-global/lib/node_modules/openclaw/docs/tools/

---

## 2026-02-21 Learning: Automation Protocol

### Key Insight
- Search existing context BEFORE asking user (tokens, prior solutions)
- Automate repetitive tasks without waiting to be asked
- Every failure → memory entry

### Automation Wins Today
- Cron health check auto-fixed missing crons.json
- yt-dlp installed for YouTube (free, works)
- gh CLI authenticated via found token
- Auto-memory flush enabled in config

### Next Level
- Build automation scripts that run without prompts
- Log learnings proactively
- Reduce manual hand-holding

## Social Media & Content Creation Research (2026-02-22)

### Key Findings

**AI Video Free Tiers:**
- RunwayML: 125 credits free (one-time), then $12/mo
- HeyGen: 3 videos/month free, 3-min max, 720p
- Synthesia: 1,200 credits/mo (~10 min) free
- Luma Dream Machine: Free tier available

**AI Image Free Tiers:**
- Leonardo.ai: 150 tokens/day (BEST free option)
- DALL-E 3: 15 images free first 3 weeks via ChatGPT
- Bing Image Creator: Free via Microsoft Rewards
- Adobe Firefly: 25 credits/month free

**Social Media APIs:**
- Twitter/X: NOW PAY-PER-USAGE (not $100/mo!) - major update
- Instagram: Free tier but requires Business Verification
- BEST FREE OPTION: OpenClaw browser automation

**Video Editing Stack (Free):**
- CapCut: Full-featured free, watermark, AI-powered
- Descript: Free tier (60 min/month), Underlord AI
- DaVinci Resolve: Full free version

**Content Repurposing:**
- 1 article → 10+ social posts via AI
- Typefully/ChatGPT for threads
- Canva/CapCut for carousels
- Vidyo.ai for auto-clips

**Viral 2026 Strategies:**
- Twitter: Threads, hooks, engagement bombs
- Instagram: Reels-first, carousels for saves
- TikTok: Trend-jack, loops, post 3-5x/day
- Shorts: 30-60 sec, hook immediately, CTA

### Source
- Full guide: research/SOCIAL-MEDIA-RESEARCH.md

---

## 2026-02-22 Nightly Research

### 1. Online Income
- **Creator economy** continues thriving — TikTok creators redefining high-quality storytelling (Forbes)
- **BBC Maestro** courses on business/personal development gaining traction
- Key insight: **Validate business ideas with honest feedback** before building products
- Digital products on Etsy + Pinterest affiliate marketing remain viable low-cost options

### 2. Self-Sufficiency & Homesteading
- **Energy bills forecast to fall £117/year** in Great Britain (Guardian)
- **FIRE movement** gaining momentum — record 1,000 UK taxpayers under 30 earned >£1m
- Growing interest in sustainable living and financial independence
- Making Tax Digital (MTD) major shake-up coming for sole traders and landlords in UK

### 3. Wealth Building & Investing
- **ETF investing trends** continue dominant (Forbes)
- ⚠️ **WARNING**: Trump administration proposing "alternative investments" for everyday Americans — potential risks for small investors
- Forbes "Next Billion-Dollar Startups 2025" — research emerging companies for opportunities

### 4. AI Tools for Income
- **Agentic AI** emerging as major 2026 trend (Forbes)
- AI-powered cybersecurity in high demand
- Enterprise AI continues strong growth trajectory

### 5. Side Hustles
- Job market remains **brutal** — "Hunger Games" style competition for low-paid work (Guardian)
- **Skills-based side hustles** remain viable: writing, design, coding
- People turning to **dating apps for career networking** (interesting trend)
- Digital products (Etsy) and Pinterest affiliate marketing — low-cost options mentioned

### Actionable Insights
- Start with idea validation before building products
- Focus on long-term sustainable productivity vs. short-term gains
- Consider AI tools for automation and scaling existing income streams
- Build personal brand through consistent content creation
- Be cautious with "alternative investment" proposals

### Sources
- Guardian Money (theguardian.com/money)
- Forbes Innovation/Entrepreneurship
- BBC Business

---

## Autonomy Roadmap (2026-02-21)

### Phase 1: Quality Foundation (NOW)
- Research, learning, memory systems
- Chrome relay for reliable browsing
- Error detection and recovery
- Trust building through competence

### Phase 2: Autonomy (FUTURE)
- 24/7 operation aligned with goals
- Self-directing task execution
- Minimal hand-holding
- Creative problem-solving

### Principle
Quality before autonomy. Can't have unreliable agent running unsupervised.

## 2026-02-21 Daily Consolidation

### Key Actions
- Fixed crons.json (restored from backup)
- Created 3 missing cron scripts (Nightly Research, SEO Research, Morning Brief)
- Enabled auto-memory flush in OpenClaw config
- Installed gh CLI, authenticated to GitHub
- Website: Created reviews.html, search.html, about.html
- Consolidated duplicate pages (articles + categories → reviews)

### Website Improvements
- Added category filter buttons (reviews.html)
- Added search with instant filtering
- Added about page with FAQ schema
- Fixed navigation links

### Feedback Received
- "Pretty good job overall" - positive
- Issues: doubled up pages, missing pricing data
- Learning: check existing structure first

### Technical Notes
- Review sites (G2, Capterra) block automated access
- Trustpilot is accessible - use for ratings where available
- Need browser automation for real aggregate reviews

## 2026-02-21 Evening Session - Proactive Automation

### Key Learning
- Instead of idle heartbeats, agent should identify and execute tasks that advance goals
- Website improvements: ratings, favicon, SVG icons added proactively

### Proactive Tasks Executed:
1. Added real G2/Trustpilot ratings to all 12 articles
2. Created and added custom robot favicon
3. Created SVG icons for all AI tools (12 total)
4. Added SVG icons to all article pages
5. Consolidated duplicate pages (articles + categories → reviews)
6. Added Trustpilot ratings and combined averages

### Still To Do:
- Add Review schema markup to articles for SEO
- Add more AI tools/articles to site
- Continue website improvements without prompting

## 2026-02-22 Morning - Cron Fixes & Content

### Key Fixes
- **helpers.sh syntax error**: Line 62 had malformed case statement (`press "$1" *.Z)`) — fixed to `*.Z)`
- **Missing log function**: Scripts called `log` but only `log_info`/`log_error` existed — added `log()` alias
- Verified all scripts now work: nightly-research.sh, seo-research.sh, morning-brief.sh

### Website Content
- Created Kling AI review article (2,100+ words, SEO-optimized)
- Pushed to GitHub: commit c54d2df
- Published: https://bobhasaclaw.github.io/ai-tools-hub/articles/kling-ai-review-2026.html

### Cron Status (4AM)
- All 4 critical crons present: Hourly Backup, Morning Brief, Nightly Research, SEO Research
- "error" status = pre-fix failures, scripts now working

### Deep Work Crons (Feb 22)
- Created 3 new full-hour content crons:
  - 1AM: AI Tools (LLMs) - Research + 2 articles
  - 4AM: Video AI - Research + 2 articles  
  - 8AM: Coding Assistants - Research + 2 articles
- Each runs 55+ min with phased approach: Research → Create → Verify → Push
- Total: ~3+ hours of actual work per day vs ~11 min before

### Social Media Research (12PM)
- Major finding: Twitter/X API now PAY-PER-USAGE (not $100/mo!)
- Best free tools: HeyGen (video), Leonardo.ai (image), CapCut (edit)
- Full guide: research/SOCIAL-MEDIA-RESEARCH.md

## 2026-02-22 Daily Consolidation

### Key Actions
- Fixed helpers.sh: syntax error + missing log function
- Morning Brief cron ran successfully at 6AM
- Website content: Created Kling AI review + AI Video Creation guide (2 articles)
- Hourly backups running every hour
- Quick backups every 15 minutes

### Website Progress
- 2 new SEO articles added today (Kling AI review, AI Video Creation guide)
- Both with proper meta tags, Schema.org, E-E-A-T
- Pushed to GitHub: c54d2df, 1aca0e4

### Key Learnings
1. Cron "error" status can be misleading - scripts may work, status just reflects last run
2. Regular backups are critical - workspace resets can lose data
3. 4AM-7AM content crons running smoothly now


---

## 2026-02-23 Major Session - MiniMax Fix & Swarm Setup

### MiniMax Coding Plan API Fix - CRITICAL
**Root Cause:** MiniMax Coding Plan uses Anthropic Messages API, NOT OpenAI Chat API.

| Provider | API Format | Endpoint |
|----------|-----------|----------|
| Standard MiniMax | OpenAI Chat | `api.minimax.chat/v1` |
| **MiniMax Coding Plan** | **Anthropic Messages** | `api.minimax.io/anthropic` |

### Swarm Configuration Finalized
| Agent | Model | Specialty |
|-------|-------|-----------|
| Manager | GLM-5 | Orchestrator |
| Kimi | Kimi K2.5 | Logic Specialist |
| Qwen | Qwen 3.5 | Builder |
| MiniMax | MiniMax M2.5 | Fast Drafter |

### Asymmetric Load Balancing
- Kimi + Qwen = NVIDIA rate-limited = **Sequential ONLY**
- MiniMax = Independent = **Parallel OK**
- Valid: `[Kimi + MiniMax + MiniMax]` or `[MiniMax x3]`
- **NEVER:** `[Kimi + Qwen + ...]`

### Cron Assignments
| Cron | Agent | Time |
|------|-------|------|
| Content - AI Tools | Qwen | 1 AM |
| Nightly Research | Kimi | 2 AM |
| Content - Video AI | Qwen | 4 AM |
| Morning Brief | MiniMax | 6 AM |
| Content - Coding | Qwen | 8 AM |
| Heartbeat/Backup | MiniMax | Every 30-60 min |

### Website Architecture Simplified
- Deleted `articles.html` and `search.html`
- Nav: **Home | Reviews | About**
- Reviews page has ALL 51 articles with search + category filters

### Key Learnings
1. MiniMax Coding Plan = Anthropic Messages API
2. Parallel MiniMax works for independent tasks (3.5min wall time for 4 tasks)
3. Cron scripts must use OpenClaw agent system, not bash
4. One reviews page > multiple listing pages

---

## 2026-02-26 Heartbeat - System Recovery

### Issues Found & Fixed
1. **Mission Control PM2 Error** - Port 9000 blocked by orphan node process (PID 10094)
   - Fix: `kill 10094 && pm2 restart mission-control`
   - Status: Now online and stable

2. **Missing Content Crons** - Crontab only had @reboot, no scheduled content tasks
   - Fix: Restored full cron schedule:
     - 1AM: AI Tools Content (Qwen)
     - 2AM: Nightly Research (Kimi)
     - 4AM: Video AI Content (Qwen)
     - 6AM: Morning Brief (MiniMax)
     - 8AM: Coding Content (Qwen)
     - Hourly + 15-min backups
     - Noon SEO Research

### System Status
- Mission Control: ✅ Online (localhost:9000)
- Crontab: ✅ Full schedule restored
- All 78 tasks: ✅ Completed

### Key Learning
- PM2 "errored" status often means port conflict from orphan process
- Always check `lsof -i :9000` when EADDRINUSE error appears
- Content crons can disappear after WSL restarts - verify regularly

---

## 2026-02-27 Discord Channel Resolution

### Root Cause
1. Invalid Discord config keys/values broke channel config validation (`channels.discord.botToken` in config and invalid policy strings)
2. Guild mention-gating still active, causing inbound skips with `reason: "no-mention"`

### Working Fix
- Keep Discord bot token in environment variables (not `channels.discord.botToken` config)
- Valid Discord settings:
  - `channels.discord.configWrites = true`
  - `channels.discord.groupPolicy = "open"`
  - `channels.discord.dmPolicy = "open"`
  - `channels.discord.allowFrom = ["*"]`
  - `channels.discord.guilds = { "*": { "requireMention": false, "channels": { "1476842437312909396": { "allow": true, "requireMention": false } } } }`
- Restart gateway after config correction

### Verification
- `openclaw channels status --probe --json`: Discord running, probe ok, audit ok, `unresolvedChannels: 0`
- Direct send test to channel succeeded
- Normal Discord messages now receive responses

---

## 2026-02-27 Mac Mini Stabilization + Telemetry Upgrades

### Mission Control on macOS
- Rebuilt native dependencies (sqlite3) for Mac architecture; previous WSL build failed with invalid Mach-O error.
- Added LaunchAgent auto-start for Mission Control and watchdog recovery checks every 5 minutes.

### Telemetry/Reporting
- Added task telemetry fields (status lifecycle, retries, duration, verification status/notes, self score).
- Added daily Mission summary generator and Telegram delivery.
- Added failure-only Telegram alert stream (suppressed when no failures).

### Discord Config Learning (critical)
- For OpenClaw 2026.2.26, Discord token key must be `channels.discord.token`.
- Using `channels.discord.botToken` causes config schema failure and channel startup issues.

### Website QA
- Found/fixed local AI Tools Hub asset issues (missing/incorrect icon refs), but deployment can be blocked by SSH host-key setup on new Mac until git remote trust is configured.
