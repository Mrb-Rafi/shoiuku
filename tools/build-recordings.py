"""Fetch the list of Project ShoiUku recordings from Wikimedia Commons.

Usage: python tools/build-recordings.py
Writes assets/data/recordings.json. Run it again whenever new recordings are
added to the Commons categories. The audio itself is never copied: the page
plays each file straight from Commons.
"""
import json, os, re, time, urllib.parse, urllib.request

API = 'https://commons.wikimedia.org/w/api.php'
UA = {'User-Agent': 'ProjectShoiUkuSite/1.0 (recordings list builder)'}
GROUPS = [
    ('sessions', 'Recording sessions', 'Category:Project_Korikath-ShoiUku-Audio'),
    ('swadesh', 'Swadesh list', 'Category:Project_Korikath-ShoiUku-Audio:Swadesh_list'),
    ('elicitation', 'Master elicitation list', 'Category:Project_Korikath-ShoiUku-Audio:Master_Elicitation_List'),
]
# Plain-English titles for the long session recordings (file names kept as on Commons).
SESSION_TITLES = {
    'Aong thowai Ching Chak (kinterms)': 'Kinship terms',
    'Chak Verb': 'Verbs in Chak',
    'Cultural items and constructions (full)': 'Cultural items and constructions',
    'Discussion of cultural item and constructs': 'Discussion: cultural items',
    'Discussion on prpnouns': 'Discussion: pronouns',
    'Discussion on verb': 'Discussion: verbs',
    'Numericals in Chak (1 to 100)': 'Numbers 1 to 100',
    'Pronoun lamra Ching Chak': 'Pronouns',
    'Thui Ma Ching Chak (51-100)': 'Counting 51 to 100',
    'Tui Ma Ching Chak (1 50)': 'Counting 1 to 50',
    'Voice 2': 'Short recording',
}


def query(params):
    out, cont = [], {}
    while True:
        q = dict(params, format='json', **cont)
        req = urllib.request.Request(API + '?' + urllib.parse.urlencode(q), headers=UA)
        d = json.load(urllib.request.urlopen(req, timeout=60))
        out += list(d.get('query', {}).get('pages', {}).values())
        if 'continue' not in d:
            return out
        cont = d['continue']
        time.sleep(0.3)


def word_of(name):
    """'Ankle 2 in Chak Language' -> ('Ankle', 2); 'Arm-2 in Chak Language' -> ('Arm', 2)."""
    m = re.match(r'^(.*?)(?:[\s-]+(\d+))?\s+in Chak Language(?:\s+(\d+))?$', name)
    if not m:
        return name, 1
    return m.group(1).strip(), int(m.group(2) or m.group(3) or 1)


groups = []
for gid, label, cat in GROUPS:
    pages = query({'action': 'query', 'generator': 'categorymembers', 'gcmtitle': cat, 'gcmtype': 'file',
                   'gcmlimit': '50', 'prop': 'imageinfo', 'iiprop': 'url|size|mime'})
    items = []
    for p in pages:
        ii = (p.get('imageinfo') or [{}])[0]
        if not str(ii.get('mime', '')).startswith('audio/'):
            continue
        name = p['title'][5:].rsplit('.', 1)[0]
        item = {'file': p['title'][5:], 'page': ii.get('descriptionurl'), 'src': (ii.get('url') or '').split('?')[0],
                'duration': round(float(ii.get('duration') or 0), 1)}
        if gid == 'sessions':
            item['title'] = SESSION_TITLES.get(name, name)
        else:
            item['word'], item['take'] = word_of(name)
        items.append(item)
    if gid == 'sessions':
        items.sort(key=lambda i: i['title'].lower())
    else:
        items.sort(key=lambda i: (i['word'].lower(), i['take']))
    groups.append({'id': gid, 'label': label, 'category': 'https://commons.wikimedia.org/wiki/' + cat, 'items': items})
    print(f'{label}: {len(items)} recordings')

here = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
out = os.path.join(here, 'assets', 'data')
os.makedirs(out, exist_ok=True)
json.dump({'generated': time.strftime('%Y-%m-%d'), 'licence': 'CC BY-SA 4.0, Wasiul Bahar, via Wikimedia Commons', 'groups': groups},
          open(os.path.join(out, 'recordings.json'), 'w', encoding='utf-8'), ensure_ascii=False, separators=(',', ':'))
print('wrote assets/data/recordings.json')


# ---------- static list in recordings.html (readable without JavaScript, for search engines and AI tools) ----------
import html as _html
PLAY = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4.5v15a1 1 0 0 0 1.5.86l12.2-7.5a1 1 0 0 0 0-1.72L8.5 3.64A1 1 0 0 0 7 4.5z"/></svg>'


def esc(x):
    return _html.escape(str(x), quote=True)


def clock(sec):
    sec = round(sec)
    if sec < 60:
        return f'{sec} s'
    h, m, s_ = sec // 3600, sec % 3600 // 60, sec % 60
    return (f'{h}:{m:02d}' if h else f'{m}') + f':{s_:02d}'


parts = []
for g in groups:
    if g['id'] == 'sessions':
        parts.append(f'<section class="rec-group" aria-labelledby="h-{g["id"]}"><div class="rec-group-head"><h2 id="h-{g["id"]}">{esc(g["label"])}</h2><span class="caption">{len(g["items"])} long recordings</span></div><div class="recordings">')
        for it in g['items']:
            parts.append(f'<article class="su-word rec-session"><button class="su-word-play" type="button" data-src="{esc(it["src"])}" aria-label="Play {esc(it["title"])}" aria-pressed="false">{PLAY}</button>'
                         f'<div class="su-word-head"><span class="su-word-roman">{esc(it["title"])}</span></div><div class="su-word-gloss">{clock(it["duration"])}</div>'
                         f'<div class="su-word-progress" aria-hidden="true"><span></span></div><div class="su-word-meta"><span>{esc(it["file"].rsplit(".", 1)[0])}</span><a href="{esc(it["page"])}">Source on Commons</a></div></article>')
        parts.append('</div></section>')
    else:
        words, order = {}, []
        for it in g['items']:
            k = it['word'].lower()
            if k not in words:
                words[k] = {'word': it['word'], 'takes': []}
                order.append(k)
            words[k]['takes'].append(it)
        parts.append(f'<section class="rec-group" aria-labelledby="h-{g["id"]}"><div class="rec-group-head"><h2 id="h-{g["id"]}">{esc(g["label"])}</h2><span class="caption">{len(order)} words · {len(g["items"])} recordings · <a href="{esc(g["category"])}">on Commons</a></span></div><ul class="rec-words">')
        for k in order:
            w = words[k]
            multi = len(w['takes']) > 1
            btns = ''
            for i, t in enumerate(w['takes']):
                label = f'Play {w["word"]}, take {i + 1}' if multi else f'Play {w["word"]}'
                btns += f'<button class="rec-take" type="button" data-src="{esc(t["src"])}" aria-label="{esc(label)}" aria-pressed="false" title="{esc(t["file"])}">{PLAY}{f"<span>{i + 1}</span>" if multi else ""}</button>'
            parts.append(f'<li class="rec-word{" rec-word-multi" if multi else ""}"><span class="rec-word-name">{esc(w["word"])}</span><span class="rec-takes">{btns}</span></li>')
        parts.append('</ul></section>')

page = os.path.join(here, 'recordings.html')
doc = open(page, encoding='utf-8').read()
start, end = '<!-- RECORDINGS:START -->', '<!-- RECORDINGS:END -->'
a, b = doc.index(start) + len(start), doc.index(end)
doc = doc[:a] + '\n' + '\n'.join(parts) + '\n' + doc[b:]
open(page, 'w', encoding='utf-8', newline='\n').write(doc)
print('wrote the static list into recordings.html')
