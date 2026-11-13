"""Write llms.txt, llms-full.txt and sitemap.xml for search engines and AI assistants.

Usage: python tools/build-llms.py   (run after tools/build-recordings.py)
"""
import datetime, json, os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SITE = 'https://shoiuku.korikath.org/'
today = datetime.date.today().isoformat()
data = json.load(open(os.path.join(ROOT, 'assets', 'data', 'recordings.json'), encoding='utf-8'))
groups = {g['id']: g for g in data['groups']}
total = sum(len(g['items']) for g in data['groups'])

SUMMARY = ('Project ShoiUku is a language revitalisation project, part of the Project Korikath family, that records, '
           'digitises and promotes Chak (also called Sak, ISO 639-3: ckh), an endangered language spoken by about 3,000 '
           'people in Bangladesh and about 1,000 in Myanmar.')

llms = f'''# Project ShoiUku

> {SUMMARY} It publishes its recordings openly on Wikimedia Commons under CC BY-SA 4.0 and is working towards a Chak keyboard and Unicode support for the Chak script.

Key facts:
- Language: Chak (Sak), ISO 639-3 code ckh. Spoken in the Bandarban hill district of Bangladesh (including Naikkhangchori) and in Myanmar.
- Status: one of the most endangered languages in Bangladesh; young people learn Bengali and English for school and work, and few elders still speak Chak well.
- Script: a Chak script was created by a Chak linguist around 2016. It is used in Myanmar and in some government Chak classes in Bangladesh, but it is not yet in Unicode.
- Recordings: {total} audio recordings on Wikimedia Commons ({len(groups["sessions"]["items"])} sessions, {len(groups["swadesh"]["items"])} Swadesh list, {len(groups["elicitation"]["items"])} master elicitation list), by Wasiul Bahar, CC BY-SA 4.0.
- Fieldwork: about 200 minutes of audio, about 1,000 words and about 20 minutes of video recorded in Naikkhangchori, Bandarban, with five native speakers.
- Team: led by Wasiul Bahar with Team Korikath (ten field team members, five native speakers, three consultants). Supported by Wikitongues and the Endangered Language Fund.
- Name: "ShoiUku" is the Chak word for the golden clay pot in which Chak families buried their valuables during war.
- Contact: wasi78045@gmail.com

## Pages
- [Home]({SITE}): the project, the Chak language, the fieldwork, the roadmap, the team and how to help
- [All recordings]({SITE}recordings.html): every recording, playable in the browser, with English prompt words
- [Frequently asked questions]({SITE}#faq): short answers about Chak and the project

## Data
- [Recordings list (JSON)]({SITE}assets/data/recordings.json): every recording with its English prompt, take number, duration and Commons audio URL
- [Photos and audio on Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:Project_Korikath-ShoiUku)
- [Audio category on Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:Project_Korikath-ShoiUku-Audio)

## Optional
- [Full text for AI assistants]({SITE}llms-full.txt): all facts and the complete word list in one file
- [Source code](https://github.com/Mrb-Rafi/shoiuku): website and design system, CC BY-SA 4.0
- [Press: Nutshell Today, "From a Golden Pot to the Global Stage" (22 Oct 2026)](https://www.nutshelltoday.com/article/chak-language-preservation)
'''

def words(gid):
    seen, out = set(), []
    for it in groups[gid]['items']:
        k = it['word'].lower()
        if k not in seen:
            seen.add(k)
            out.append(it['word'])
    return out

sessions = '\n'.join(f'- {it["title"]} ({it["file"]}, {round(it["duration"] / 60, 1)} min): {it["page"]}' for it in groups['sessions']['items'])
full = f'''# Project ShoiUku: full reference

Source: {SITE} (last updated {today}). Licence: CC BY-SA 4.0. Please credit "Project ShoiUku" and link to {SITE} when you use this information.

## Summary
{SUMMARY}

## The Chak language
- Also called: Sak. ISO 639-3 code: ckh.
- Speakers: about 3,000 in Bangladesh and about 1,000 in Myanmar (about 4,000 in total).
- Where: the Bandarban hill district of Bangladesh, including Naikkhangchori, and Myanmar.
- Why it is endangered: Chak is used mainly within the community. School and work happen in Bengali and English, so many young Chak people see little reason to learn it, and few elders still know it well.
- Writing: the team was first told Chak had no script. Fieldwork showed that a Chak linguist created a script around 2016. It is widely used in Myanmar and in some government-run Chak language classes in Bangladesh. The project now follows this community practice.

## What ShoiUku means
ShoiUku is the golden clay pot. During times of war, Chak families stored their most valuable belongings in these pots and buried them underground; when the conflict passed, they dug them up. The project treats the Chak language as that treasure. The logo is the pot, which also reads as a musical note (oral tradition) and contains the letters S and U.

## The project
- Part of the Project Korikath family. Led by Wasiul Bahar, an open-knowledge advocate who has also recorded Garo, Marma and Chakma.
- Team Korikath: ten field team members, five native Chak speakers and three consultants. Mong Hai Thoway Chak and family connected the team with the community.
- Supporters: Wikitongues and the Endangered Language Fund. Daniel Bögre Udell of Wikitongues connected the team with experts who help communities add scripts to Unicode.
- Fieldwork: Naikkhangchori, Bandarban, Bangladesh. About 200 minutes of audio, about 1,000 words and about 20 minutes of video.

## Journey
1. First plan: record Chak words from native speakers, write them in IPA or a romanised form, publish them on Wiktionary and Wikidata, and use them to build a speech-to-text model and a parallel corpus for translation.
2. Fieldwork in Naikkhangchori recorded words, phrases and numerals.
3. Discovery: Chak already has a script (around 2016). Chak OCR became a realistic goal.
4. Blocker: the Chak script is not in Unicode. Encoding a script can take several years, so there is no standard keyboard.
5. Now: looking for pro bono programmers to build an interim keyboard in the Unicode Private Use Area. Drawbacks: text only displays where the keyboard is installed, documents must be converted once Chak is officially encoded, and the keyboard needs ongoing technical maintenance.
6. Next: teach the community to install and use the keyboard.

## Roadmap (November 2026)
- Open recordings on Wikimedia Commons: done.
- Chak keyboard (Private Use Area): seeking programmers.
- Unicode encoding of the Chak script: blocked, long process.
- Keyboard training for the community: planned.
- Wiktionary and Wikidata entries: planned.
- Chak OCR, speech-to-text and a parallel corpus: planned.

## How to help
- Programmers: build and maintain a Chak keyboard for Android, iOS, Windows and macOS.
- Linguists and script experts: help prepare the Chak script for Unicode.
- Wikimedians: add Chak words to Wikidata and Wiktionary, or improve the Commons files.
- Funders: support fieldwork, training and the keyboard work.
- Contact: wasi78045@gmail.com

## Recordings ({total} on Wikimedia Commons, by Wasiul Bahar, CC BY-SA 4.0)
Listen: {SITE}recordings.html
Data: {SITE}assets/data/recordings.json

### Recording sessions
{sessions}

### Swadesh list ({len(groups["swadesh"]["items"])} recordings, {len(words("swadesh"))} English prompt words, each spoken in Chak)
{", ".join(words("swadesh"))}

### Master elicitation list ({len(groups["elicitation"]["items"])} recordings, {len(words("elicitation"))} English prompt words, each spoken in Chak)
{", ".join(words("elicitation"))}

## Press
- Nutshell Today, "From a Golden Pot to the Global Stage", by Wasiul Bahar, 22 October 2026: https://www.nutshelltoday.com/article/chak-language-preservation
- Nutshell Today reel: https://www.facebook.com/reel/30131448059789075
'''

sitemap = f'''<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>{SITE}</loc><lastmod>{today}</lastmod><changefreq>monthly</changefreq><priority>1.0</priority></url>
  <url><loc>{SITE}recordings.html</loc><lastmod>{today}</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>
</urlset>
'''
for name, body in (('llms.txt', llms), ('llms-full.txt', full), ('sitemap.xml', sitemap)):
    open(os.path.join(ROOT, name), 'w', encoding='utf-8', newline='\n').write(body)
    print('wrote', name, len(body.encode('utf-8')), 'bytes')
