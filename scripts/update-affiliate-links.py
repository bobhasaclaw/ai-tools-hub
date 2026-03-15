#!/usr/bin/env python3
"""
Update affiliate links in tool HTML files.
Adds UTM tracking parameters to all external tool links.
"""

import os
import re
import json

# Correct URLs for each tool (fixing broken links)
TOOL_URLS = {
    "adobe-firefly": "https://firefly.adobe.com",
    "anyword": "https://anyword.com",
    "articleforge": "https://articleforge.com",
    "canva-ai": "https://www.canva.com/ai/",
    "chatgpt": "https://chat.openai.com",
    "chatsonic": "https://writesonic.com/chatsonic/",
    "claude": "https://claude.ai",
    "cohere": "https://cohere.com",
    "cursor": "https://cursor.sh",
    "dall-e": "https://openai.com/dall-e-3",
    "descript": "https://descript.com",
    "eleven-labs": "https://elevenlabs.io",
    "frase": "https://frase.io",
    "gemini": "https://gemini.google.com",
    "github-copilot": "https://github.com/features/copilot",
    "grammarly": "https://grammarly.com",
    "heygen": "https://heygen.com",
    "huggingface": "https://huggingface.co",
    "invideo": "https://invideo.io",
    "jasper": "https://jasper.ai",
    "kling-ai": "https://klingai.com/global/",
    "leonardoai": "https://leonardo.ai",
    "llama": "https://www.llama.com",
    "lumen5": "https://lumen5.com",
    "microsoft-copilot": "https://copilot.microsoft.com",
    "midjourney": "https://www.midjourney.com",
    "mistral": "https://mistral.ai",
    "notion-ai": "https://notion.so",
    "otter-ai": "https://otter.ai",
    "perplexity": "https://www.perplexity.ai",
    "pictory": "https://pictory.ai",
    "pika": "https://pika.art",
    "quillbot": "https://quillbot.com",
    "runway": "https://runwayml.com",
    "rytr": "https://rytr.me",
    "simplified": "https://simplified.com",
    "sora": "https://sora.com",
    "stability-ai": "https://stability.ai",
    "stable-diffusion": "https://stability.ai/stablediffusion",
    "suno-ai": "https://suno.ai",
    "synthesia": "https://synthesia.io",
    "veed": "https://veed.io",
    "wordtune": "https://wordtune.com",
    "writesonic": "https://writesonic.com",
}

# Known affiliate programs (update with your affiliate IDs)
AFFILIATE_IDS = {
    "jasper": "",  # Add your Jasper affiliate ID
    "copyai": "",  # Add your Copy.ai affiliate ID
    "writesonic": "",  # Add your Writesonic affiliate ID
    "rytr": "",
    "wordtune": "",
    "simplified": "",
    "frase": "",
    "anyword": "",
    "runway": "",
    "synthesia": "",
    "heygen": "",
    "invideo": "",
    "pictory": "",
    "lumen5": "",
    "veed": "",
    "elevenlabs": "",
    "descript": "",
    "otter": "",
    "cursor": "",
    "notion": "",
    "grammarly": "",
    "leonardo": "",
    "adobe-firefly": "",
    "midjourney": "",
    "pika": "",
    "kling": "",
    "suno": "",
}

def build_affiliate_url(tool_name, base_url):
    """Build URL with UTM parameters and affiliate ID if available."""
    tool_key = tool_name.replace("-", "").replace("_", "").lower()
    
    # Add UTM parameters
    utm_url = f"{base_url}?utm_source=ai-tools-hub&utm_medium=referral&utm_campaign={tool_name}-cta"
    
    # Check for affiliate ID
    for aff_key, aff_id in AFFILIATE_IDS.items():
        if aff_key in tool_key and aff_id:
            if "?" in utm_url:
                return f"{utm_url}&ref={aff_id}"
            else:
                return f"{utm_url}?ref={aff_id}"
    
    return utm_url

def update_tool_file(filepath):
    """Update a single tool HTML file."""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    tool_name = os.path.basename(filepath).replace('.html', '')
    
    # Find the CTA link pattern
    # Pattern: href="https://..." in the CTA section
    cta_pattern = r'(href=")(https?://[^"]+)(")'
    
    def replace_cta_link(match):
        prefix = match.group(1)
        old_url = match.group(2)
        suffix = match.group(3)
        
        # Get correct URL
        correct_url = TOOL_URLS.get(tool_name, old_url)
        
        # Build affiliate URL with tracking
        new_url = build_affiliate_url(tool_name, correct_url)
        
        return f'{prefix}{new_url}{suffix}'
    
    # Only replace the main CTA link (in the cta-section)
    cta_section_match = re.search(r'(<section class="cta-section">.*?href=")(https?://[^"]+)(")', content, re.DOTALL)
    
    if cta_section_match:
        old_url = cta_section_match.group(2)
        correct_url = TOOL_URLS.get(tool_name, old_url)
        new_url = build_affiliate_url(tool_name, correct_url)
        
        content = content[:cta_section_match.start(2)] + new_url + content[cta_section_match.end(2):]
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        
        print(f"✓ Updated {tool_name}: {old_url} -> {new_url}")
    else:
        print(f"✗ No CTA link found in {tool_name}")

def main():
    tools_dir = "tools"
    
    for filename in os.listdir(tools_dir):
        if filename.endswith('.html') and not filename.endswith('.bak'):
            filepath = os.path.join(tools_dir, filename)
            update_tool_file(filepath)

if __name__ == "__main__":
    main()
