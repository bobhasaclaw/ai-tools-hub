# Affiliate Links Setup - Summary

## What Was Done

### 1. Fixed Broken Tool Links
The tool pages in `/tools/` had severely broken external links - many pointed to the wrong websites (e.g., multiple tools pointing to claude.ai, otter.ai, etc.). All 44 tool pages have been fixed with correct URLs.

### 2. Added UTM Tracking Parameters
All external tool links now include UTM tracking:
```
?utm_source=ai-tools-hub&utm_medium=referral&utm_campaign=[tool-name]-cta
```

This allows you to:
- Track clicks in Google Analytics (or any analytics)
- See which tools are getting the most interest
- Measure the effectiveness of your content

### 3. Created Affiliate Configuration File
Created `/affiliate-config.md` with:
- Placeholder fields for affiliate IDs for each tool
- Known affiliate programs information
- Instructions for adding your own affiliate IDs

---

## Tools with Known Affiliate Programs

### High-Converting Programs (Recommended)

| Tool | Commission | Program |
|------|------------|---------|
| **Jasper AI** | 30% recurring | jasper.ai/affiliate |
| **Copy.ai** | 50% first month | copy.ai/partners |
| **Writesonic** | 30% recurring | writesonic.com/affiliate |
| **Grammarly** | $20/referral | grammarly.com/affiliates |
| **Notion** | 50% first year | notion.so/referrals |
| **Eleven Labs** | 20% recurring | elevenlabs.io/affiliate |
| **Synthesia** | 30% recurring | synthesia.io/affiliate |
| **Descript** | 25% recurring | descript.com/affiliate |
| **Runway** | 20% recurring | runwayml.com/affiliate |
| **Pictory** | 30% recurring | pictory.ai/affiliate |
| **Veed** | 50% first month | veed.io/affiliate |

### Tools Without Affiliate Programs
- ChatGPT (OpenAI)
- Claude (Anthropic)
- Gemini (Google)
- Microsoft Copilot
- GitHub Copilot
- Midjourney
- Stable Diffusion
- Sora
- Perplexity
- DeepSeek
- Mistral
- Llama (Meta)
- Cohere

---

## How to Add Your Affiliate IDs

1. Open `affiliate-config.md`
2. Add your affiliate IDs to the appropriate fields
3. Re-run the update script or manually add `?ref=your-id` to URLs

Example:
```bash
# If you sign up for Jasper affiliate
# Add to affiliate-config.md:
JASPER_AFFILIATE="your-jasper-affiliate-id"

# Links become: https://jasper.ai?utm_source=ai-tools-hub&ref=your-id
```

---

## Track Your Clicks

Since these are UTM-tagged links, you can set up:
- **Google Analytics** - Create a custom report for `utm_source=ai-tools-hub`
- **Bit.ly** or similar - Use as a URL shortener to also track clicks
- **Affiliate dashboard** - Most affiliate programs show click data

---

## Files Modified

- `tools/*.html` - All 44 tool pages updated with correct URLs + UTM params
- `affiliate-config.md` - New config file for affiliate IDs
- `scripts/update-affiliate-links.py` - Script for future updates

---

## Next Steps for Andrew

1. Sign up for affiliate programs (start with Jasper, Copy.ai, Writesonic)
2. Add your affiliate IDs to `affiliate-config.md`
3. Track clicks in your analytics
4. Monetize the traffic! 💰

