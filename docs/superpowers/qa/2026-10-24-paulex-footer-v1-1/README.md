# Paulex Edu · Footer V1.1 — QA

Branch `feat/paulex-footer-v1-1`, base `main` 863f33e. Measured on 2026-10-24 on the built site, in Chromium,
same viewport before and after (`.site-footer` bounding box; the margin above it in brackets). Local only.

## Height

| Viewport | Before | After | Reduction |
| --- | --- | --- | --- |
| 1440 (reference) | 718px (822) | 409px (465) | **−43.0%** (−43.4% with margin) |
| 1024 | 879px | 559px | −36.4% |
| 768 | 854px | 594px | −30.4% |
| 390 | 1201px | 829px | −31.0% |
| 320 | 1700px | 1215px | −28.5% |

No fixed height: the reduction comes from paddings, the gap between the wordmark and the quote, the row
height of the groups (40 → 32px with a pointer; 40px kept on touch) and a bottom area of two lines.

## What moved

- Out of the footer, into `/sobre/`: "empresa fundada em 1984 no Rio de Janeiro" (the intro) and the note that
  quoting Apple (1977) implies no tie (section Independência). `/sobre/` stays linked as "Sobre a Paulex Edu".
- The footer keeps one line: free third-party resources, independent editorial curation, owners' marks.
- Kept: the quote and "Apple, 1977", the four groups and every link, copyright, the verification date (still
  the same as `/sobre/`, checked), the three licence links.

## Evidence

| Check | Result |
| --- | --- |
| `npm test` | 424/424 |
| `npm run check` | 0 errors, 0 warnings, 0 hints |
| `npm run build` | verify-dist (now checks the footer's short statement and, on `/sobre/`, the moved text) and project-base: green |
| axe-core, 19 pages × 320/390/768/1024/1440 | 0 violations, 0 overflow, 0 console errors |
| Keyboard | Tab reaches all 21 footer links in order, each with a visible 2px outline |
| Targets | smallest 24px (inline licence links; WCAG 2.5.8 minimum); group rows 32px; 40px on a touch phone |
| Scope | 34 pages: `<header>` and `<main>` identical to `main`, but `/sobre/` (the moved text) |

## Not verified

Chromium only (no Safari or Firefox).
