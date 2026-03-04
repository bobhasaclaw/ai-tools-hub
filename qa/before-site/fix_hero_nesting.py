#!/usr/bin/env python3
"""
Fix article-hero nesting in articles.
The issue: <div class="article-hero"> is inside <div class="tool-header">
but should be OUTSIDE it.

Current (wrong):
<div class="tool-header">
  <img ...>
  <div class="tool-info">...</div>
  <div class="article-hero">...</div>  <!-- WRONG: inside -->
  <p class="subtitle">...</p>
  ...
</div>

Correct:
<div class="tool-header">
  <img ...>
  <div class="tool-info">...</div>
</div>  <!-- Close tool-header HERE -->
<div class="article-hero">...</div>  <!-- Now OUTSIDE -->
<p class="subtitle">...</p>
...
"""

import os
import re
import glob

ARTICLES_DIR = "/home/pfam/.openclaw/workspace/ai-affiliate-site-v2/articles"

# Files that have <div class="tool-info"> which need fixing
FILES_TO_FIX = [
    "ai-video-creation-guide-2026.html",
    "chatgpt-review-2026.html",
    "claude-review-2026.html",
    "copy-ai-review-2026.html",
    "deepseek-ai-review-2026.html",
    "grammarly-review-2026.html",
    "jasper-ai-review-2026.html",
    "kling-ai-review-2026.html",
    "notion-ai-review-2026.html",
    "qwen-3-5-coder-review-2026.html",
    "suno-ai-review-2026.html",
]

def fix_article(filepath):
    """Fix the nesting issue in a single article file."""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original = content
    
    # Pattern 1: <div class="tool-header"> followed by content, then <div class="tool-info">...</div>
    # followed directly by <div class="article-hero">
    # We need to close tool-header right after tool-info closes
    
    # Look for: </div>\s*</div>\s*<div class="article-hero">
    # where the first </div> closes tool-info and we need to add </div> before article-hero
    
    # Pattern to match: </div> (closing tool-info) followed by whitespace then <div class="article-hero">
    # We want to insert </div> (closing tool-header) between them
    
    # Match: </div> followed by any whitespace/indentation then <div class="article-hero"
    # The </div> should be the closing of tool-info
    
    pattern = r'(</div>\s*)(<div class="article-hero")'
    replacement = r'\1</div>\n\2'
    
    new_content = re.sub(pattern, replacement, content)
    
    if new_content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Fixed: {os.path.basename(filepath)}")
        return True
    else:
        print(f"No change needed: {os.path.basename(filepath)}")
        return False

def main():
    print(f"Fixing article-hero nesting in {ARTICLES_DIR}")
    print("=" * 60)
    
    fixed_count = 0
    for filename in FILES_TO_FIX:
        filepath = os.path.join(ARTICLES_DIR, filename)
        if os.path.exists(filepath):
            if fix_article(filepath):
                fixed_count += 1
        else:
            print(f"File not found: {filename}")
    
    print("=" * 60)
    print(f"Fixed {fixed_count} files")

if __name__ == "__main__":
    main()
