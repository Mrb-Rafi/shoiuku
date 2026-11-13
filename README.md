# Project ShoiUku

Website and design system for **Project ShoiUku**, part of the Project Korikath family. The project documents, digitises and promotes the Chak language, spoken by about 4,000 people in Bangladesh and Myanmar.

Live site: https://shoiuku.korikath.org/

## What is in this repository

| Path | What it holds |
|---|---|
| `index.html` | The home page. |
| `recordings.html` | Every project recording, playable from Wikimedia Commons. |
| `assets/` | The site's CSS, JavaScript, images and recordings data. |
| `tools/` | Two helper scripts (below). |
| `design-system/` | The ShoiUku design system: colour, type and spacing tokens (`tokens.json`), component styles and guidelines, and the brand book (`README.md`). The whole system is also in one PDF: [ShoiUku-Design-System.pdf](design-system/ShoiUku-Design-System.pdf). |
| `brand/` | The original brand guideline PDF and the two official logos. |
| `content-outline.md`, `details.txt` | The project facts and content plan the site was built from. |

The site is plain HTML, CSS and a little JavaScript, with no build step. GitHub Pages serves it straight from the root of the `main` branch; `.nojekyll` tells Pages not to run Jekyll.

## Files
- `assets/css/tokens.css`: colours, spacing, radii and fonts, generated from the design system. Do not edit it by hand.
- `assets/css/shoiuku.css`: the design system's component styles, copied in.
- `assets/css/site.css`: the page layout.
- `assets/js/site.js`: the mobile menu, number animation and audio players on the home page.
- `assets/js/recordings.js` and `assets/data/recordings.json`: the recordings page.
- `assets/img/`: the official logos and partner logos.

## Updating the design
After changing `design-system/tokens.json` or `design-system/components/bundle.css`, regenerate the site CSS:

```
python tools/build-tokens.py design-system
```

After changing any CSS or JS file, raise the `?v=` number on its link in `index.html` and `recordings.html` so browsers fetch the new version.

## Search engines and AI assistants
- Each page has a canonical URL on `shoiuku.korikath.org`, Open Graph and Twitter cards (`assets/img/og-image.png`) and schema.org JSON-LD (project, Chak language, FAQ, recordings dataset).
- `robots.txt` allows all crawlers, including AI assistants, and points to `sitemap.xml`.
- `llms.txt` is a short guide for AI assistants (llmstxt.org format); `llms-full.txt` has all the facts and the complete word list.
- `recordings.html` contains the full word list in its HTML, so it can be read without JavaScript.
- Rebuild the share image and icons with `python tools/build-social-images.py`.

## Updating the recordings list
`recordings.html` lists every file in the Commons audio categories (sessions, Swadesh list, master elicitation list). When new recordings are uploaded to Commons, refresh the list with:

```
python tools/build-recordings.py
python tools/build-llms.py
```

`build-recordings.py` refreshes `assets/data/recordings.json` and the list inside `recordings.html`; `build-llms.py` refreshes `llms.txt`, `llms-full.txt` and `sitemap.xml`.

## Preview locally
```
python -m http.server 8080
```
Then open http://localhost:8080.

## Still to fill in
- Team names: the team cards describe each group (native speakers, consultants, field team) without names for now.

## Licence
The website, its text and its code are open source under [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/). See [LICENSE](LICENSE), which also lists what it does not cover: the Commons photos and recordings (CC BY-SA 4.0, Wasiul Bahar), the logo (CC BY 4.0, Ahnaf Tahmid Manan) and the partner logos in `assets/img/partners/` (their owners' trademarks).
