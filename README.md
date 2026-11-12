# Project ShoiUku

Website and design system for **Project ShoiUku**, part of the Project Korikath family. The project documents, digitises and promotes the Chak language, spoken by about 4,000 people in Bangladesh and Myanmar.

Live site: https://mrb-rafi.github.io/shoiuku/

## What is in this repository

| Folder | What it holds |
|---|---|
| `site/` | The website: a static home page (`index.html`) and an all-recordings page (`recordings.html`). This folder is what GitHub Pages publishes. See [site/README.md](site/README.md). |
| `design-system/` | The ShoiUku design system: colour, type and spacing tokens (`tokens.json`), component styles and guidelines, and the brand book (`README.md`). The site's CSS is generated from it. |
| `brand/` | The original brand guideline PDF and the two official logos. |
| `content-outline.md` | The project facts and the content plan the site was built from. |
| `details.txt` | The original project notes. |

## Publishing

Every push to `main` runs `.github/workflows/pages.yml`, which publishes the `site/` folder to GitHub Pages. No build step is needed.

## Licence

The website, its text and its code are open source under [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/). See [LICENSE](LICENSE) for what the licence does not cover (Commons photos and recordings, the logo, and partner logos).
