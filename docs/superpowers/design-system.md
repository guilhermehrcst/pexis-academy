# Paulex Edu design system (visual V0.1, from the Pexis Academy V0.3 system)

Direction: clear, organised and precise (after Apple, Notion, Stripe, Linear, Google and Figma, copying none).
White pages, a white header and footer separated by hairlines, the Paulex navy for the identity and one
primary blue for every action. The six path tones and their illustrations are kept from Home V2.2.

The stack is Astro with plain CSS:

- Tokens live once, in `:root` of `src/styles/global.css`, and no hex code appears anywhere else (tested).
- Component styles are scoped in their `.astro` files.
- There is no UI framework or animation library. JavaScript: the search on `/buscar/`, and on every page one
  small script that only places the header menus (`src/scripts/menu-placement.ts`).

## Colour

| Token | Value | Use |
| --- | --- | --- |
| `--brand` | `#102a56` | Paulex navy: the wordmark, the primary button, the chosen chip, and text set on the pastel grounds. |
| `--action` | `#175cd3` | Primary blue: links, the search button, eyebrows, focus, interactions on white and light grounds only. |
| `--action-hover` | `#1849a9` | Hover of actions. |
| `--on-action` / `--on-brand` | `#ffffff` | Text on the blue and on the navy (and on photographs). |
| `--paper` / `--raised` | `#ffffff` | Page ground; panels and menus. |
| `--surface` | `#f8fafc` | Bands: the page intro, side rails. |
| `--tint-brand` / `--tint-neutral` | `#eff4ff` / `#f2f4f7` | Hover grounds, menu icons; the featured-courses band. |
| `--ink` / `--ink-soft` / `--muted` | `#182230` / `#344054` / `#475467` | Text; the header's navigation; secondary text. |
| `--rule` / `--rule-strong` | `#e4e7ec` / `#d0d5dd` | Hairlines. |
| `--sage` `--peach` `--sky` `--cream` `--blush` `--sand` | `#d3e5c1` `#fbd2b6` `#cfe0f3` `#f3e2bb` `#f5d3d6` `#e8dcc6` | The six path tones. Never an action colour; text on them is ink, muted or navy (the blue measures 4.27–4.49:1 there, under AA). |
| `--*-deep` | `#a8c98c` `#f3a97c` `#9cbde2` `#dfc07a` `#e3a3a9` `#cdb994` | Illustration panels and the area cards' ground, never under text. |

### Measured contrast (`tests/contrast.test.ts`)

| Pair | Ratio |
| --- | --- |
| Ink on paper | 16.03:1 |
| Ink-soft (navigation) on paper | 10.46:1 |
| Muted on paper | 7.69:1 |
| Navy on paper | 14.12:1 |
| Blue on paper | 5.99:1 |
| White on blue / on hover blue | 5.99:1 / 8.19:1 |
| White on navy | 14.12:1 |
| Navy on the pastel tones | 10.08–11.03:1 |
| Muted on the pastel tones | 5.49–6.01:1 |

**Focus.** The outline is 2px in the primary blue on every ground (the header and footer are white).

## Type

- **Faces.** Newsreader for display (H1, H2, names) and Google Sans Flex for text. Both are SIL OFL 1.1,
  self-hosted and preloaded.
- **Scale.** Fluid tokens, one continuous function of the width: `--fs-small`, `--fs-body`, `--fs-lead`,
  `--fs-h3`, `--fs-h2`, `--fs-h1` and `--fs-hero`.
- **Display weights.** 440–460, with negative tracking.
- **Labels.** Eyebrows and list captions are small uppercase at 0.08em, for one or two words only.

## Space and layout

- **Spacing.** Tokens `--space-1` to `--space-8`; the last two are fluid.
- **Container.** `.wrap`, with a max width of `--page` (72rem) plus gutters `--gutter` (16–40px).
- **Borders.** Never put a border on `.wrap` itself, because its padding is the gutter. Use an inner
  element (fixed twice in V0.3).
- **Breakpoints.**
  - 640px: two columns appear.
  - 900px: editorial rows go to one line.
  - 1024px: the hero becomes two columns; the header shows its line of six paths (where popovers exist)
    and the bottom navigation of /cursos/ gives way.
  - 1180px: five-column modules and the full footer.

## Components

| Component | What it is |
| --- | --- |
| `SiteHeader` (Global Navigation V1, Paulex Edu) | White bar with a hairline; the `BrandMark` wordmark on the left. From 1024px the six paths stand in the centre of the bar (a grid with equal outer columns and the line as a subgrid) and search at its right edge; dark grey at rest, the primary blue on hover and open, a blue hairline under the current path. From 1024px, the six paths in the owner's order (Fundamental, Médio, Pré-Militar, Vestibular, Superior, Tecnologia), each a `<button popovertarget>` that opens a small paper menu anchored under it: Cursos, Livros, Provas (an icon, a line, the published count; "Em preparação" and no link when nothing is published), then "Explorar [caminho]". Escape, a click outside or another menu closes it. Search follows as a named icon. Below 1024px, or without popovers, a single "Menu" `<details>` sheet: the six paths as an accordion of `<details name>`, then the two libraries; at 320px the button keeps only its icon. `aria-current="true"` marks the current path's button (its page or an exam inside it); a library view marks it by `:target`. Sticky, 65px. The menus work natively, with no JavaScript; one small script (`src/scripts/menu-placement.ts`) only tells the stylesheet where each button is, so each panel opens under its own button, clamped to the side margins and safe areas by `clamp()`. Without it the panel hangs from the right margin under the header. No CSS anchor positioning. |
| `SiteFooter` (Paulex Edu, after the Notion footer) | White, wide. Left: the wordmark and, below it, the quote "A simplicidade é o último grau da sofisticação." in Newsreader, attributed "Apple, 1977" (never to a person). Right: Caminhos, Biblioteca, Objetivos, Institucional. Then one quiet area (V1.1, compact): copyright and the verification date, the licences, and one short line on free third-party resources, independent curation and owners' marks; what Paulex is and the note that the quotation implies no tie live in `/sobre/`. Rows are 32px with a pointer, 40px on touch. A phone shows the brand and quote first, then the groups two by two (one column below 360px). |
| `BrandMark` | The wordmark: "Paulex" navy 700, "Edu" blue 500, Google Sans Flex. The official mascot appears beside it only from its file (`src/assets/brand/paulex-mascot.svg` or `.png`, found by `import.meta.glob`); it is pending and never drawn. |
| Library views (Global Navigation V1) | `/cursos/?caminho=X#cursos-X` and `/materiais/?caminho=X&tipo=provas#provas-X` (or `livros`): one static page per library, the view selected by the fragment and answered in CSS (`:target` with `:has`). The view titles itself and states an empty kind; the chips of /cursos/ are links to the same URLs. Provas are past exams and simulados, never practice; Livros are only references an editor classified in `src/lib/books.ts` (empty today). |
| `PageIntro` | Surface band with a breadcrumb (Início → section), a blue eyebrow, a serif H1 and a lead. |
| `PreparingNote` | The state of a path in preparation, said once ([data-preparing]). |
| `HomeHero` (V2, McGill) | Editorial split: "Aprenda" in the serif and "com direção." in the sans bold (one h1), one line, the site search (`/buscar/?q=`, native GET), the library as a navy button and the paths as a large underlined blue link, then three facts (free to study, no account on Paulex Edu, six paths). Beside it one photograph with softened corners (a real course, named in the caption); no seal over it while the mascot is pending. Below 380px the search button shows only the glass, still named "Buscar". |
| `HomePaths` + `PathArt` (V2.2) | Six path cards in one reading order, the header's (`HOME_PATH_ORDER` in `src/lib/home-featured.ts`, a typed order of the Home's own; `PATH_ORDER` is untouched). Each card is one link and reads the same top to bottom: an original editorial scene (`PathArt`, viewBox 400×220, `slice`, tokens only, no photographs) in a rounded panel of the path's deep tone, the serif name, one line, then an outlined label with the real count (`objectiveFacts`) or "Em preparação". The way in is a paper disc at the lower right, the same place in all six. Rows are a subgrid, so names, lines and labels align across a row. Columns: 1 below 640px (a phone card is a row: art left, words right; below 360px a column again), 2 from 640px, 3 from 1080px. Hover only lifts, leans the art and turns the disc blue, and only without `prefers-reduced-motion`; no keyframes. |
| `HomeCourseFeature` (V2, ART Course) | An immersive portrait card: the course photo under a dark veil, or the area's soft ground with its signs; a navy kicker, the title in the serif, the institution, the facts; the stated duration as a chip. One aligned row on a wide screen. No invented metric. |
| `HomeAreas` (V2.3.1, Prolingo) | Tall cards over the picture the owner chose for each area, shown in its own colours (the files untouched, with no filter, blend, fade or layer over them: `src/assets/areas/manifest.json`, `tests/home-areas.test.ts`), and a near-white, almost opaque panel with the name and the subjects as links, turned slightly until hovered or focused. The pictures are decorative (empty alt, hidden from assistive tech). |
| `OfficialSources` | Supplied third-party marks, shown whole, in a ruled panel (Home V2: the body of `#fontes`). |
| `AreaList` | Editorial grid of areas, with subjects as 44px rows. |
| `SectionNav` (V0.4) | In-page navigation of a long path page: ruled rows (label, one muted line), two columns from 768px, each leading to a section id. verify-dist checks it lists every section of the page, in order. |
| `FeaturedResources` (V0.4) | A path's ten editorial highlights (`#destaques`, `[data-featured]`). Renders nothing until the path's selection is complete and valid; never on a path in preparation. |
| `ResourceGroups` (V0.4) | Resources by what the student does: Para estudar, Para praticar (practice, past exams, simulators), Para consultar (reference). Empty groups are omitted. |

**Cards** are used only where a unit is self-contained: an exam on Vestibular, a featured path, a mark, and (Home V2) a path, a featured course and an area of the Home.
Lists are ruled rows.

**Buttons and links.**

- The primary button is the navy (or, for search and "all courses", the blue) with white text, at least 48px tall.
- Secondary actions are text links with an arrow, at least 44px tall.
- Inline links are underlined.

## Motion

Only hover and focus transitions (180ms; on the Home V2 cards a 3–4px lift, a slight zoom of the illustration or photo, and the area cards straightening) and the hero's entrance. All of it is off under
`prefers-reduced-motion` (global rule, checked in dist). There is no scroll hijacking, parallax or
carousel.

## Barriers

`scripts/verify-dist.mjs` checks the built site: the header and footer white, the wordmark in both, the footer quote and its note, the menus (and that
every count and "Em preparação" in them agrees with what the libraries really hold), the
breadcrumbs, the six paths, the preparing pages, the recorded icons, the absence of the former name, the contrast-relevant
tokens, links and anchors.

The unit tests check the tokens, the taxonomy, the routes and the brand file hashes.
