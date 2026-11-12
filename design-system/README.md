Project ShoiUku, part of the Project Korikath family, documents, digitises and promotes the Chak language, which about 4,000 people speak in Bangladesh and Myanmar. *ShoiUku* is the golden clay pot: Chak families buried their most valuable things in these pots during war and dug them up when peace returned. Every surface in this system should feel like that pot: warm, earthy, rounded, and holding something precious.

This system extends the 2025 brand guideline (`assets/Guidelines/Project_Korikath-ShoiUku_Brand_Guideline.pdf`) into tokens and components for the web. The guideline's four colours, two typefaces and logo are used exactly; everything else here is added for screens and marked as such.

## Content fundamentals

- **Voice:** a community project speaking plainly and with respect. "We" is the team; the Chak community is named, never "they" in the abstract. Write "native speakers" and "the Chak community", not "informants" or "subjects".
- **Credit people.** Name speakers, field team members and consultants when they have agreed to it. Every photo and recording carries its licence and source line (`caption` style).
- **Be exact about numbers.** Keep the source's approximations: "~200 minutes of audio", "about 1,000 words". Never inflate a figure.
- **Headings are UPPERCASE Space Mono**, short and concrete: "THE GOLDEN POT", "OUR JOURNEY", "HELP BUILD THE KEYBOARD". Body copy is sentence case.
- **Explain technical terms once.** Unicode, Private Use Area, OCR and speech-to-text each get one plain sentence the first time they appear (use a `Notice`).
- **Chak words** appear romanised in `word` style, with IPA in `ink-muted` only when verified, and the meaning beside them. Mark Chak text with `lang="ckh"` (or `ckh-Latn` for romanised).
- **Name:** always "Project ShoiUku" (or "ShoiUku" once introduced), never "Korikath-ShoiUku". Mention that it is part of the Project Korikath family where the project is introduced (hero, footer, about). Commons category and file names keep their original "Project_Korikath-ShoiUku" spelling in links.
- No emoji, no exclamation marks, no urgency language.

## Colour

- Light theme ("Clay") puts `ink` (French Puce) on `surface` (cream). Dark theme ("Earth") puts `ink` (cream) on a deeper brown `surface`. Both pass 12:1.
- **Orange is a fill, not small text.** `orange` (#FF8400) on cream is only 2.2:1. Use it for primary buttons, stat rules, timeline dots and display headings of 24px or larger on brown. For orange text on light grounds use `orange-text`.
- Text on an orange or yellow fill is always `on-orange` (brown), never white.
- The signature look is a **brown band**: a full-width section on `brown` with `cream` text and a headline in the gold gradient (`.su-gold-text`, `yellow` to `orange`). Use it for the hero, the quote/press section and the footer. `brown` and `cream` stay fixed in both themes, so bands look the same in light and dark mode.
- `gold-light`, `gold-deep` and `gold-shadow` belong to the logo artwork. Do not use them in UI.
- Status colours are added for the roadmap: `teal` (Done), `orange-text` (In progress), `rust` (Blocked), `ink-muted` (Planned). Done is teal rather than green so it never depends on telling red from green. Each badge also shows its word.

## Typography

- **Space Mono Bold** (`display` family) for headings, labels, buttons and numbers, as the guideline sets it. Uppercase for headings and labels; `label` has 0.1em tracking.
- **Darker Grotesque** (`body` family) for running text. It runs small and light, so `body` is 20px at weight 500, and nothing goes below `caption` (16px, 600).
- Keep running text within `measure` (65ch). Balance heading lines (`text-wrap: balance`).
- Both faces load from Google Fonts (`components/bundle.css` imports them). Fallbacks are a system mono and a system sans.

## Spacing, shape and layout

- 4px base: `space-6` pads cards, `space-8` separates a section header from its content, `space-24` pads sections (64px on phones). Page gutter is `space-12` on desktop and never less than `space-4`.
- Content sits within `content-max` (1160px).
- **Shapes come from the logo.** The mark is a clay pot drawn as one flowing stroke with round ends, so the system reuses three of its curves:
  - **The pot.** Cards, notices and media frames have a narrow neck and a round belly: `radius-neck` on the top corners, `radius-belly` (or `radius-belly-lg` for photos, hero media and the reel) on the bottom ones. Use the `.su-pot` and `.su-pot-lg` classes; do not give cards four equal corners.
  - **The hook.** The logo's top swirl becomes a short tapered rule (`.su-hook`), drawn above each impact number, under section titles (`SectionHeader hook`) and as an underline for one or two words in a headline (`.su-hook-under`). Once per section at most.
  - **The bowl.** `PotCurve` ends a brown band with the pot's belly curve instead of a straight edge: after the hero and before the footer only.
  - Buttons, badges and the play button are pills (`radius-pill`), echoing the stroke's round ends. Only full-bleed bands have square corners.
- Surfaces are flat by default. `shadow-sm` only for cards on a same-coloured band; `shadow-lg` only for things that float or play.
- The guideline's **oversized faded numeral** (0, 1, 2, ...) is a chapter marker. Use it through `SectionHeader numeral` only when the sections are a real sequence.
- Motion is minimal: a 1px lift on button hover, nothing on scroll. Respect `prefers-reduced-motion`.

## Focus and accessibility

- Every control shows `focus-ring` on keyboard focus: a 2px gap in the ground colour, then 2px of `brown` (light) or `yellow` (dark).
- Touch targets are at least 44px tall (buttons, the 56px play button).
- Audio never autoplays. The reel embed always has a text or poster fallback.

## Logo

- Two marks: `assets/Logos/logo.svg` (the pot/note mark) and `assets/Logos/logo-vertical.svg` (mark with the wordmark). Use them as given; never recolour, outline, stretch or redraw them.
- The mark reads as a golden clay pot, a musical note (oral tradition) and the letters S and U.
- Best on `brown` or `surface`. Not on `orange` or `yellow`, where the gold disappears.
- Minimum size: 24px tall for the mark on screen.

## Imagery

- Real photographs from the fieldwork (the Commons category "Project Korikath-ShoiUku": fieldwork in Naikkhangchori, Chak women in traditional attire). No stock photos, no illustrations of people.
- Crop with `radius-lg`; always show a credit line in `caption`.
- Behind the hero, a dark warm photo or the brown band with the faded logo used large as a watermark, as on the guideline's cover.

## Iconography

The guideline defines no icon set. The components draw only two glyphs (play and pause, inline SVG with `currentColor`). If more icons are needed, use simple rounded-stroke icons at 2px stroke, in `ink` or `on-orange`. This is an added rule, not part of the original guideline.

## Components

All components live in `components/bundle.js` as `window.ShoiUku` and expect React 18 on the page. Class names are prefixed `su-`.

- `Button`, `StatusBadge`, `SectionHeader`, `Stat`, `WordCard`, `Timeline`, `RoadmapCard`, `PressCard`, `Notice`, `PotCurve`.
- Pages that do not use React can use the same classes directly (`su-btn su-btn-primary`, `su-word`, `su-rm`, ...): the markup each component renders is the contract.
- They were made for the project website: hero, impact strip, journey timeline, roadmap, archive of recorded words, press (the Nutshell Today reel and article) and the call for programmers.
