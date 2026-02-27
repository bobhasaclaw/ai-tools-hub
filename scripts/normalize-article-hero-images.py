#!/usr/bin/env python3
import os, re

ROOT = os.path.expanduser('~/.openclaw/workspace/ai-tools-hub')
ART = os.path.join(ROOT, 'articles')

# explicit slug -> image filename map
MAP = {
    'chatgpt': 'chatgpt.svg',
    'claude': 'claude.svg',
    'gemini': 'gemini.svg',
    'perplexity-ai': 'perplexity.svg',
    'deepseek-ai': 'deepseek.svg',
    'mistral': 'mistral.svg',
    'llama': 'llama.svg',
    'cohere': 'cohere.svg',
    'qwen-3-5-coder': 'qwen.svg',
    'github-copilot': 'github-copilot.svg',
    'cursor-ai-editor': 'cursor.svg',
    'notion-ai': 'notion.svg',
    'grammarly': 'grammarly.svg',
    'copy-ai': 'copyai.svg',
    'writesonic': 'writesonic.svg',
    'chatsonic': 'chatsonic.svg',
    'jasper-ai': 'jasper.svg',
    'quillbot': 'quillbot.svg',
    'wordtune': 'wordtune.svg',
    'anyword': 'anyword.svg',
    'rytr': 'rytr.svg',
    'frase': 'frase.svg',
    'articleforge': 'articleforge.svg',
    'midjourney': 'midjourney.svg',
    'dalle': 'dalle.svg',
    'stable-diffusion': 'stablediffusion.svg',
    'stability-ai': 'stability.svg',
    'adobe-firefly': 'firefly.svg',
    'sora': 'sora.svg',
    'runway-ml': 'runway.svg',
    'kling-ai': 'kling.svg',
    'synthesia': 'synthesia.svg',
    'heygen': 'heygen.svg',
    'pika': 'pika.svg',
    'lumen5': 'lumen5.svg',
    'invideo': 'invideo.svg',
    'veed': 'veed.svg',
    'pictory': 'pictory.svg',
    'canva': 'canva.svg',
    'descript': 'descript.svg',
    'otter-ai': 'otter.svg',
    'eleven-labs': 'elevenlabs.svg',
    'suno-ai': 'suno.svg',
    'figma': 'figma.svg',
    'huggingface': 'huggingface.svg',
    'microsoft-copilot': 'copilot.svg',
    'simplified': 'simplified.svg',
}

def image_for_file(fn: str) -> str:
    base = fn.replace('.html','')
    base = base.replace('-review-2026','')
    if base in MAP:
        return MAP[base]
    if base.endswith('-guide') or 'guide' in base or 'vs' in base:
        return 'robot-mascot.png'
    return 'robot-mascot.png'

changed = 0
for f in os.listdir(ART):
    if not f.endswith('.html'):
        continue
    p = os.path.join(ART, f)
    txt = open(p, encoding='utf-8', errors='ignore').read()
    img = image_for_file(f)
    # replace placehold image URLs in img src attributes
    new = re.sub(r'src="https://placehold\.co/[^"]+"', f'src="../images/{img}"', txt)
    # brand capitalization cleanup
    new = new.replace('Chatgpt', 'ChatGPT').replace('Vs Claude', 'vs Claude')
    if new != txt:
        with open(p, 'w', encoding='utf-8') as w:
            w.write(new)
        changed += 1

print(f'updated_files={changed}')
