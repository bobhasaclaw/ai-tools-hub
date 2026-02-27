#!/usr/bin/env python3
import os

ROOT = os.path.expanduser('~/.openclaw/workspace/ai-tools-hub')
MARKER = '/* PRO_QUALITY_POLISH_V1 */'

OVERRIDE = f'''
<style>
{MARKER}
:root {{
  --pro-radius: 12px;
  --pro-border: rgba(99,102,241,.22);
  --pro-shadow: 0 8px 24px rgba(0,0,0,.22);
  --pro-shadow-hover: 0 14px 32px rgba(0,0,0,.28);
}}
nav .container, .container {{ max-width: 1200px; }}
section {{ scroll-margin-top: 90px; }}
h2 {{ letter-spacing: .1px; }}
.card, .tool-card, .review-card, .popular-card, .feature-card {{
  border-radius: var(--pro-radius) !important;
  border: 1px solid var(--pro-border) !important;
  box-shadow: var(--pro-shadow);
}}
.card:hover, .tool-card:hover, .review-card:hover, .popular-card:hover, .feature-card:hover {{
  box-shadow: var(--pro-shadow-hover);
  transform: translateY(-2px);
}}
.btn, .cta-button, button, a.button, .card-link {{
  border-radius: 10px !important;
  font-weight: 600;
}}
.btn-primary, .cta-button, .hero-cta, .btn.btn-primary {{
  box-shadow: 0 6px 16px rgba(99,102,241,.35);
}}
.btn-primary:hover, .cta-button:hover, .hero-cta:hover, .btn.btn-primary:hover {{
  transform: translateY(-1px);
}}
.footer, footer {{ margin-top: 3rem; }}
@media (max-width: 768px) {{
  .container {{ padding-left: 16px !important; padding-right: 16px !important; }}
  .hero, .hero-section {{ padding-top: 84px !important; }}
}}
</style>
'''

updated = 0
for dp, _, fs in os.walk(ROOT):
    for f in fs:
        if not f.endswith('.html'):
            continue
        p = os.path.join(dp, f)
        txt = open(p, encoding='utf-8', errors='ignore').read()
        if MARKER in txt:
            continue
        if '</head>' in txt:
            txt = txt.replace('</head>', OVERRIDE + '\n</head>')
            with open(p, 'w', encoding='utf-8') as w:
                w.write(txt)
            updated += 1

print('updated_files=', updated)
