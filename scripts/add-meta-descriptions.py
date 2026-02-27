#!/usr/bin/env python3
import os,re,html

ROOT=os.path.expanduser('~/.openclaw/workspace/ai-tools-hub/articles')
updated=0
for fn in os.listdir(ROOT):
    if not fn.endswith('.html'): continue
    p=os.path.join(ROOT,fn)
    t=open(p,encoding='utf-8',errors='ignore').read()
    if re.search(r'<meta\s+name=["\']description["\']',t,re.I):
        continue

    # Build fallback description from H1 + first paragraph
    h1m=re.search(r'<h1[^>]*>(.*?)</h1>',t,re.I|re.S)
    h1=re.sub(r'<[^>]+>','',h1m.group(1)).strip() if h1m else fn.replace('.html','').replace('-',' ')
    pm=re.search(r'<p[^>]*>(.*?)</p>',t,re.I|re.S)
    ptxt=re.sub(r'<[^>]+>','',pm.group(1)).strip() if pm else ''
    desc=f"{h1}. {ptxt}".strip()
    desc=' '.join(desc.split())
    if len(desc)>155: desc=desc[:152].rsplit(' ',1)[0]+'...'
    desc=html.escape(desc, quote=True)

    meta=f'    <meta name="description" content="{desc}">\n'

    # Insert after viewport if present, else after <head>
    if 'name="viewport"' in t:
        t=t.replace('name="viewport" content="width=device-width, initial-scale=1.0">',
                    'name="viewport" content="width=device-width, initial-scale=1.0">\n'+meta,1)
    elif '<head>' in t:
        t=t.replace('<head>','<head>\n'+meta,1)
    else:
        continue

    with open(p,'w',encoding='utf-8') as w: w.write(t)
    updated+=1

print('updated',updated)
