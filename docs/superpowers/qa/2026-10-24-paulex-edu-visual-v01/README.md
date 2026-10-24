# Paulex Edu · visual V0.1 — QA

Branch `feat/paulex-edu-visual-v01`, base `main` 9b3549b (Home V2.2). Measured on 2026-10-24 against the built
site (`npm run build`, served under `/pexis-academy/`), in Chromium (Playwright). Local only: no push, no merge,
no deploy.

## Preflight (real state, before any change)

- `main` = 9b3549b, the HEAD the reference document ("Contexto Mestre", read in full) audits. Clean tree.
- Astro 7.3.6, TypeScript 6.0.3, plain CSS, static output; Google Sans Flex and Newsreader self-hosted (OFL).
- Catalogue: 44 published resources (33 Cursos, 11 Materiais) in `src/data/academy-release/release.json`;
  six paths, Fundamental in preparation.
- Baseline: `npm ci`, `npm test` 429/429, `npm run check` 0/0/0, `npm run build` (verify-dist and project-base) green.
- Brand assets in the repository: only the Pexis Academy artwork. **The official Paulex mascot was not
  supplied** (not in the repository, not among the files attached to the session). The Notion footer image
  was received. A PDF named "Pexis_Academy_aprenda_com_direção.pdf" exists among earlier uploads; it is not
  confirmed to be the "(4)" version cited and was not used.

## What changed

| Area | Change |
| --- | --- |
| Tokens | White paper, navy `#102a56` (`--brand`), primary blue `#175cd3` (`--action`), neutral greys; the six path tones kept. The values are the proposed ones, unchanged: every pair measured passes. |
| Brand | `BrandMark.astro`: the wordmark "Paulex Edu" (type only). A slot shows the official mascot as soon as `src/assets/brand/paulex-mascot.svg` (or .png) exists; nothing stands in for it. Icons: a provisional white "P" in Google Sans Flex on the navy, recorded as provisional in the manifest. The Pexis artwork and its script are removed from the site (kept in git history). |
| Header | White, hairline, the wordmark left, the six paths centred (equal outer columns, subgrid), search at the right edge; grey at rest, blue on hover/open, blue hairline under the current path. Menus, compact sheet, placement script unchanged. |
| Footer | After the Notion reference: white; the wordmark and the quote "A simplicidade é o último grau da sofisticação." (Newsreader), "Apple, 1977"; four groups (Caminhos, Biblioteca, Objetivos, Institucional) with real routes and anchors only; one quiet legal area (copyright, verification date, institution, editorial independence, a note that the quotation implies no tie, attributions, licences). |
| Home | Hero: no seal over the photograph, three facts (free, no account on Paulex Edu, six paths), navy primary button; the search button becomes a named glass under 380px so the placeholder fits (it was cut at 320–360px on `main`). Navy labels on pastel grounds. Featured courses in one aligned row. |
| Pages | All pages inherit the identity through the tokens and the shared header, footer and intro; no page's structure changed. |
| Copy | "Pexis Academy" → "Paulex Edu" in titles, descriptions, `og:site_name`, FAQ, about. Domain, base path, routes and URLs unchanged. |

## Evidence

| Check | Result |
| --- | --- |
| `npm ci` | ok |
| `npm test` | 424/424 (see "Tests" below for the difference with 429) |
| `npm run check` | 0 errors, 0 warnings, 0 hints |
| `npm run build` | verify-dist: all invariants hold; project-base: 40 pages/styles, 25 sitemap URLs, all internal links |
| axe-core, 19 pages (with filtered library views) × 320/390/768/1024/1440 | 0 violations (colour contrast included), 0 horizontal overflow, 0 console errors |
| Header menus (6 menus × widths, iPad UA, engine without anchor API) | 0 problems: each opens under its button, inside the viewport |
| Navigation battery (line at 1024/1180/1440/1920, keyboard, compact sheet 820/390/320) | 0 problems |
| Home/search battery (390/834/1194/1440) | 0 problems (placeholder fits, no broken image, search and no-JS search work, 44 internal links) |
| Path cards battery (13 widths, focus, hover, reduced motion, no-JS) | 0 problems |
| Content regression vs `main` (34 built HTML pages) | identical `<main>` link sets, resource counts and canonicals on every page; sitemap and robots byte-identical |
| Catalogue | `src/data`, `src/lib` and `docs/academy` identical to `main`: no resource, manifest, ID, digest or editorial state touched |
| Subjects | all 12 still linked from `/materias/` (and the Home's areas); the footer now lists the subjects index, not each subject |

### Tests: 429 → 424

Removed because what they protected no longer exists: the wine header/footer contrast pairs, the four tests
of the Pexis artwork and its manifest, and the "brand red is the action colour" test. Replaced by: navy on
every pastel tone and on paper, ink-soft, the neutral tint, the new manifest (icons hashed, provisional flag
tied to the mascot's absence, no drawn stand-in), the removal of the former artwork, the new header identity,
and "the former wine is gone". `main` also listed four contrast pairs twice. No test was removed to get a
green build; verify-dist additionally denies the word "Pexis" on any built page.

## Order of the Home: trails before featured courses? (not consolidated)

`ordem-trilhas-vs-cursos-1440.jpg` and `-390.jpg` show the current order and the variant, rendered from the
same build. Recommendation: **trails first**. A student who has just chosen a path asks "how do I start?";
the trails answer with numbered first steps and a guide, which is the product's distinctive value, while the
featured courses are a sample of the library already reachable from the hero. The variant keeps the grey band
between white sections. The code keeps the current order until you choose.

## Not verified, or pending

- **Mascot (blocking for the final identity).** Not supplied; not drawn. Add the official file at
  `src/assets/brand/paulex-mascot.svg` (or .png), set `mascot.status` to `supplied` in the manifest, and redo
  the icons from it (the test fails until both happen together).
- **Icons** are provisional (typographic "P").
- **Reference PDF** "(4)" not confirmed (see Preflight); the current site itself, rendered from `main`, was the
  reference for what to preserve.
- **Browsers**: Chromium only. Safari/WebKit and Firefox not exercised (subgrid header centring falls back to
  a right-aligned line where subgrid is missing).
- **Institutional statement** ("plataforma de educação gratuita da Paulex, empresa fundada em 1984 no Rio de
  Janeiro") is taken from the brief; legal wording not reviewed.
- **Copyright year** is written as 2026 (deterministic build); update it yearly.
- The repository name, the public path `/pexis-academy/` and the domain still carry the former name, as asked.
