# Project ShoiUku website

A static one-page site: plain HTML, CSS and a little JavaScript. No build step is needed to host it. Upload the contents of this folder to any static host, such as GitHub Pages or Netlify.

## Files
- `index.html`: the whole page.
- `assets/css/tokens.css`: colours, spacing, radii and fonts, generated from the design system. Do not edit it by hand.
- `assets/css/shoiuku.css`: the design system's component styles, copied in.
- `assets/css/site.css`: the page layout.
- `assets/js/site.js`: the mobile menu, theme switch and audio players.
- `assets/img/`: the two official logos.

## Updating the design
The design system's source lives in `../design-system/`; the published version is the ShoiUku Design System artifact. After changing `tokens.json` or `components/bundle.css` there, regenerate the site CSS:

```
python tools/build-tokens.py ../design-system
```

## Preview locally
```
python -m http.server 8080 --directory site
```
Then open http://localhost:8080.

## Recordings page
`recordings.html` lists every recording in the Commons audio categories (sessions, Swadesh list, master elicitation list) and plays each file straight from Commons. The list comes from `assets/data/recordings.json`. When new recordings are uploaded to Commons, refresh it with:

```
python tools/build-recordings.py
```

After changing any CSS or JS file, raise the `?v=` number on its link in `index.html` so browsers fetch the new version.

## Licence
This website (text, HTML, CSS and JavaScript) is open source under CC BY-SA 4.0. See `LICENSE`, which also lists what it does not cover: the Commons photos and recordings (CC BY-SA 4.0, Wasiul Bahar), the logo (CC BY 4.0, Ahnaf Tahmid Manan) and the partner logos in `assets/img/partners/` (their owners' trademarks).

## Still to fill in
- Team names: the team cards describe each group (native speakers, consultants, field team) without names for now.

Photos, audio and the Nutshell Today reel load from Wikimedia Commons and Facebook.
