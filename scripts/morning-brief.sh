#!/bin/bash
# Morning Brief - Real data from APIs and web search
# Runs at 6AM daily via cron
# Spawns MiniMax subagent to fetch and deliver brief

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/helpers.sh"

OPENCLAW_BIN="/Users/pmanopen/.nvm/versions/node/v24.14.0/bin/openclaw"
if [ ! -x "$OPENCLAW_BIN" ]; then
  OPENCLAW_BIN="openclaw"
fi

log "Spawning morning brief subagent..."

# Use OpenClaw agent command to run a brief-generation turn and deliver it.
"$OPENCLAW_BIN" agent \
  --session-id "cron-morning-brief-$(date +%Y%m%d%H%M%S)" \
  --channel telegram \
  --to 2018558180 \
  --deliver \
  --timeout 300 \
  --message "$(cat <<'TASK'
You are generating the Morning Brief for Andrew Priest.

**Your task:** Fetch real data and send a concise, useful morning brief to Telegram.

**Location:** Cooloola Cove, QLD, Australia (timezone: Australia/Brisbane)

**Required sections with SOURCE LINKS:**

## 1. 🌤️ Weather (Cooloola Cove, QLD)
- Use wttr.in API: `curl wttr.in/Cooloola+Cove?format=v2`
- Include: current temp, conditions, today's high/low, chance of rain
- Source: https://wttr.in

## 2. ₿ Crypto Prices
Use CoinGecko API (free, no key needed):
```
curl -s "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,ripple,solana&vs_currencies=aud&include_24hr_change=true"
```
- Show: BTC, ETH, XRP, SOL in AUD with 24h change
- Format as table
- Source: https://www.coingecko.com

## 3. 🥇 Precious Metals (Gold/Silver)
- Search for current gold and silver spot prices in AUD
- Include 1-2 recent gold/silver news headlines with links
- Use web_search for news

## 4. 📰 Finance & Market News
- Use web_search for "Australian finance news today" and "crypto news today"
- Pick 3-5 most relevant headlines
- Include BRIEF 1-sentence summary + link for each

## 5. 💪 Fitness & Longevity
- Use web_search for "longevity research news 2026" and "fitness science news"
- Pick 2-3 interesting items
- Brief summary + link

## 6. 💰 Online Income & Side Hustles
- Use web_search for "side hustle trends 2026" and "online income opportunities"
- Pick 2-3 actionable items or trends
- Brief summary + link

## 7. 🤖 AI Tools Hub Status
- Check: https://bobhasaclaw.github.io/ai-tools-hub
- Report: number of articles (check reviews page), any new tools added
- Quick site health check

## 8. ✅ System Status
- Mission Control: Check localhost:9000/api/tasks
- Pending tasks count
- Cron status

**Format:** Clean markdown, concise, actionable. Use tables for prices.
**Delivery:** Use the `message` tool with action=send to send to Telegram (Andrew's chat).

**Tone:** Brief, useful, no fluff. Andrew drinks coffee and scans this fast.
TASK
)" 2>&1

log "Morning brief run triggered"
