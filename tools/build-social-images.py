"""Render the share image (Open Graph) and app icons with headless Chrome or Edge.

Usage: python tools/build-social-images.py
Writes assets/img/og-image.png (1200x630), assets/img/apple-touch-icon.png (180x180)
and assets/img/icon-512.png (512x512).
"""
import os, shutil, subprocess, sys, tempfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
IMG = os.path.join(ROOT, 'assets', 'img')
LOGO = 'file:///' + os.path.join(IMG, 'logo.svg').replace('\\', '/')
FONTS = '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Darker+Grotesque:wght@600&family=Space+Mono:wght@700&display=swap">'

OG = f'''<!doctype html><html><head><meta charset="utf-8">{FONTS}<style>
html,body{{margin:0;width:1200px;height:630px;overflow:hidden;background:#4f200d;color:#f6f1e9}}
.w{{position:relative;width:1200px;height:630px;padding:72px 80px;box-sizing:border-box}}
.mark{{position:absolute;right:-90px;top:-40px;width:560px;opacity:.1}}
.top{{display:flex;align-items:center;gap:16px;font:700 26px "Space Mono",monospace}}
.top img{{width:40px}}
h1{{margin:70px 0 18px;font:700 96px/0.95 "Space Mono",monospace;letter-spacing:-.03em;text-transform:uppercase}}
h1 b{{color:#ffd93d}}
p{{margin:0;font:600 34px/1.3 "Darker Grotesque",sans-serif;max-width:760px}}
.url{{position:absolute;left:80px;bottom:64px;font:700 22px "Space Mono",monospace;color:#ffd93d}}
.pots{{position:absolute;right:80px;bottom:64px;display:flex;align-items:flex-end;gap:14px}}
.pots i{{display:block}}
.a{{width:170px;height:100px;background:#ff8400;border-radius:16px 16px 50px 50px}}
.b{{width:110px;height:66px;background:#ffd93d;border-radius:14px 14px 36px 36px}}
.c{{width:54px;height:54px;background:#f6f1e9;border-radius:50%}}
</style></head><body><div class="w"><img class="mark" src="{LOGO}"><div class="top"><img src="{LOGO}">Project ShoiUku</div>
<h1>Keeping <b>Chak</b><br>alive</h1><p>Recording, digitising and bringing an endangered language of Bangladesh online.</p>
<div class="url">shoiuku.korikath.org</div><div class="pots"><i class="a"></i><i class="b"></i><i class="c"></i></div></div></body></html>'''

ICON = '''<!doctype html><html><head><meta charset="utf-8"><style>
html,body{{margin:0;width:{s}px;height:{s}px;overflow:hidden;background:#4f200d}}
div{{width:{s}px;height:{s}px;display:grid;place-items:center}} img{{height:{h}px}}
</style></head><body><div><img src="{logo}"></div></body></html>'''

browsers = [r'C:\Program Files\Google\Chrome\Application\chrome.exe', r'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe',
            shutil.which('google-chrome') or '', shutil.which('chromium') or '']
exe = next((b for b in browsers if b and os.path.exists(b)), None)
if not exe:
    sys.exit('No Chrome or Edge found.')

tmp = tempfile.mkdtemp()
jobs = [('og-image.png', OG, 1200, 630),
        ('apple-touch-icon.png', ICON.format(s=180, h=120, logo=LOGO), 180, 180),
        ('icon-512.png', ICON.format(s=512, h=340, logo=LOGO), 512, 512)]
for name, doc, w, h in jobs:
    src = os.path.join(tmp, name + '.html')
    open(src, 'w', encoding='utf-8').write(doc)
    out = os.path.join(IMG, name)
    subprocess.run([exe, '--headless=new', '--disable-gpu', '--hide-scrollbars', '--allow-file-access-from-files',
                    f'--window-size={w},{h}', '--virtual-time-budget=15000', f'--screenshot={out}',
                    'file:///' + src.replace('\\', '/')], check=True, timeout=120, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    print('wrote', out, os.path.getsize(out), 'bytes')
shutil.rmtree(tmp, ignore_errors=True)
