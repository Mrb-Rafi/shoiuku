"""Build the site's CSS from the ShoiUku design system.

Usage: python tools/build-tokens.py design-system
  - writes assets/css/tokens.css from tokens.json (light on :root, dark via
    prefers-color-scheme and [data-theme="dark"], light via [data-theme="light"])
  - copies components/bundle.css to assets/css/shoiuku.css (fonts are linked in the HTML)
"""
import json, os, re, sys

src = sys.argv[1]
here = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
out = os.path.join(here, 'assets', 'css')
os.makedirs(out, exist_ok=True)

t = json.load(open(os.path.join(src, 'tokens.json'), encoding='utf-8'))
themes = [x['id'] for x in t['color']['themes']]


def val(v, th):
    if isinstance(v, str):
        v = {themes[0]: v}
    x = v.get(th, v.get(themes[0]))
    m = re.fullmatch(r'\{(.+)\}', x)
    return f'var(--{m.group(1)})' if m else x


def themed(th):
    rows = [f'  --{c["name"]}: {val(c["value"], th)};' for c in t['color']['tokens']]
    rows += [f'  --{s["name"]}: {val(s["value"], th)};' for s in t['shadow']['tokens']]
    return '\n'.join(rows)


static = []
for fam in ('spacing', 'radius', 'layout'):
    static += [f'  --{x["name"]}: {x["value"]};' for x in t[fam]['tokens']]
static += [f'  --font-{k}: {v};' for k, v in t['type']['families'].items()]

css = f"""/* ShoiUku — generated from the design system's tokens.json by tools/build-tokens.py. Do not edit by hand. */
:root {{
{themed('light')}
{chr(10).join(static)}
  color-scheme: light;
}}
@media (prefers-color-scheme: dark) {{
  :root:not([data-theme="light"]) {{
{themed('dark')}
    color-scheme: dark;
  }}
}}
:root[data-theme="dark"] {{
{themed('dark')}
  color-scheme: dark;
}}
"""
open(os.path.join(out, 'tokens.css'), 'w', encoding='utf-8', newline='\n').write(css)

bundle = open(os.path.join(src, 'components', 'bundle.css'), encoding='utf-8').read()
bundle = re.sub(r'^@import[^\n]*\n', '', bundle)
open(os.path.join(out, 'shoiuku.css'), 'w', encoding='utf-8', newline='\n').write(
    '/* ShoiUku components — copied from the design system (components/bundle.css). */\n' + bundle)
print('tokens.css and shoiuku.css written')
