# Implementation Plan: Contact Sheet Only Archive & Filter Removal

**Branch**: `001-contact-sheet-archive` | **Date**: 2026-11-03 | **Spec**: [specs/001-contact-sheet-archive/spec.md](file:///Users/manalili/Desktop/Desktop/PORTFOLIO PROJECTS WEBSITE/EysiClicks-portfolio-2026.great-site.net/specs/001-contact-sheet-archive/spec.md)

**Input**: Feature specification from `/specs/001-contact-sheet-archive/spec.md`

## Summary

Remove the "Exhibition" layout mode, the `Exhibition` / `Contact Sheet` layout switcher, and the secondary horizontal series filter & status readout strip from the Archive section (`#gallery`). Consolidate the Archive grid onto the 35mm Contact Sheet proof presentation across all categories (`Pre-Debut`, `Events`, `Institutional`) and orientations (`Portrait`, `Landscape`), displaying 100% of each selection's photographs without secondary filtering while retaining full Lightbox inspection.

## Technical Context

**Language/Version**: HTML5, CSS3, Vanilla JavaScript (ES2022+ classes with private `#fields`)

**Primary Dependencies**: None (Zero-dependency static web application)

**Storage**: Static file catalog (`photoData` in `app.js`) + `localStorage` for theme preference

**Testing**: Node.js built-in test runner (`node:test`, `node:assert/strict`) + Headless Google Chrome via Chrome DevTools Protocol (CDP over native `WebSocket`)

**Target Platform**: Modern desktop and mobile web browsers (`375px` to `1440px+`)

**Project Type**: Static web application (Luxury photography portfolio gallery)

**Performance Goals**: 60fps compositor animations, zero layout shift (`CLS < 0.1`), lazy-loaded `.webp` + `.jpg` fallbacks

**Constraints**: Zero external runtime packages; preserve 1-line `photoData` editing at top of `app.js`; maintain WCAG 2.2 AA contrast in both Archival Daylight and Darkroom Obsidian themes

**Scale/Scope**: Single-page portfolio (`index.html`, `styles.css`, `app.js`) showcasing 3 chapters and 28 archival plates

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **I. Object-Oriented Domain & Controller Architecture**: **PASS** — `PortfolioRepository` and `GalleryPresenter` remain cohesive ES6+ classes with private state (`#categoryOrientation`, `#renderedSignature`), and become even cleaner by removing unused view-mode and series-filter state.
- **II. Zero-Dependency Vanilla Web Standards**: **PASS** — No external dependencies introduced; uses native `<picture>`, `IntersectionObserver`, and `document.startViewTransition`.
- **III. Luxury Editorial UI/UX & Accessibility (WCAG 2.2 AA)**: **PASS** — Contact Sheet proof cards use high-contrast semantic tokens (`var(--surface)`, `var(--border-strong)`, `var(--text)`, `var(--text-muted)`) that adapt across Daylight and Darkroom themes, with visible `:focus-visible` outlines and keyboard activation.
- **IV. Effortless Archival Photo Management**: **PASS** — `photoData` at the top of `app.js` is untouched.
- **V. Automated Unit & Real-Browser E2E Verification**: **PASS** — Both `unit.test.js` and `e2e.test.js` will be updated and executed to verify the Contact Sheet-only archive and absence of filter/view-toggle controls.

*Post-Phase 1 Design Re-check*: All 5 constitutional gates continue to pass with zero violations.

## Project Structure

### Documentation (this feature)

```text
specs/001-contact-sheet-archive/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output (/speckit-plan command)
├── data-model.md        # Phase 1 output (/speckit-plan command)
├── quickstart.md        # Phase 1 output (/speckit-plan command)
├── contracts/
│   └── ui-archive-contract.md
└── checklists/
    └── requirements.md
```

### Source Code (repository root)

```text
/Users/manalili/Desktop/Desktop/PORTFOLIO PROJECTS WEBSITE/EysiClicks-portfolio-2026.great-site.net/
├── index.html           # Markup: remove .view-toggle and .series-filter-wrap from #gallery
├── styles.css           # Styles: make Contact Sheet proof layout the sole .photo-grid / .photo-item style; remove .view-toggle and .series-filter-* rules
├── app.js               # OOP Logic: simplify PortfolioRepository and GalleryPresenter to render unfiltered Contact Sheet proofs
├── predebut/            # Pre-Debut portrait (5) & landscape (3) JPG + WebP plates
├── events/              # Events portrait (2) & landscape (10) JPG + WebP plates
├── institutional/       # Institutional landscape (8) JPG + WebP plates
└── fonts/               # Local display & UI fonts (Dreamer, Tropikal, TT Interphases)
```

**Structure Decision**: Single static web project at repository root (`index.html`, `styles.css`, `app.js`), with automated unit and headless Chrome E2E verification scripts in the conversation scratch directory.

## Complexity Tracking

No Constitution Check violations. In fact, this feature reduces codebase complexity by removing secondary view-mode switching and series-filtering state.
