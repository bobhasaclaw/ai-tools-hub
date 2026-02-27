#!/usr/bin/env python3
import os

ROOT = os.path.expanduser('~/.openclaw/workspace/ai-tools-hub')

root_repls = {
    'href="/ai-tools-hub/"': 'href="index.html"',
    "href='/ai-tools-hub/'": "href='index.html'",
    'href="/ai-tools-hub/reviews.html"': 'href="reviews.html"',
    'href="/ai-tools-hub/about.html"': 'href="about.html"',
    'href="/ai-tools-hub/articles/': 'href="articles/',
    'src="/ai-tools-hub/': 'src="',
    'href="/ai-tools-hub/favicon.svg"': 'href="favicon.svg"',
}

article_repls = {
    'href="/ai-tools-hub/"': 'href="../index.html"',
    "href='/ai-tools-hub/'": "href='../index.html'",
    'href="/ai-tools-hub/reviews.html"': 'href="../reviews.html"',
    'href="/ai-tools-hub/about.html"': 'href="../about.html"',
    'href="/ai-tools-hub/articles/': 'href="../articles/',
    'src="/ai-tools-hub/': 'src="../',
    'href="/ai-tools-hub/favicon.svg"': 'href="../favicon.svg"',
}

def apply(path, repls):
    txt = open(path, encoding='utf-8', errors='ignore').read()
    new = txt
    for a,b in repls.items():
        new = new.replace(a,b)
    if new != txt:
        with open(path, 'w', encoding='utf-8') as f:
            f.write(new)
        return 1
    return 0

count=0
for dp,_,fs in os.walk(ROOT):
    for f in fs:
        if not f.endswith('.html'): continue
        p=os.path.join(dp,f)
        rel=os.path.relpath(p, ROOT)
        if rel.startswith('articles'+os.sep):
            count += apply(p, article_repls)
        else:
            count += apply(p, root_repls)
print('updated_files=',count)
