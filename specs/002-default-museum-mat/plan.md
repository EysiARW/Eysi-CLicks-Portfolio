# Implementation Plan: Default Museum Mat & Legend-Free Photo Viewer

**Branch**: `002-default-museum-mat` | **Date**: 2026-11-03 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/002-default-museum-mat/spec.md`

## Summary

Streamline the full-screen Lightbox photo viewer (`#lightbox`) so every inspected photograph is permanently framed inside the archival Museum Mat passe-partout border (`EYSI CLICKS · ARCHIVAL PLATE`) with no option to toggle it off, and remove the bottom keyboard shortcut legend row (`.lightbox-hints`) beneath the thumbnail filmstrip. Technically, this removes `#lb-mat-btn` and `.lightbox-hints` from `index.html`, promotes the Museum Mat styling from an optional `.has-mat` modifier into the default `.lightbox-frame-wrap` rules in `styles.css` while removing unused `.lightbox-hints` / `.hint-key` / `.hint-sep` rules, and removes `#matBtn`, `#hasMat`, `#frameWrapEl`, `toggleMuseumMat()`, and the `M` key shortcut from `LightboxController` in `app.js`.

## Technical Context

**Language/Version**: HTML5, CSS3 (Custom Properties, Grid/Flexbox, View Transitions), Vanilla JavaScript (ES2022+ Classes with private `#fields`)

**Primary Dependencies**: Zero external runtime dependencies (Vanilla Web Standards)

**Storage**: `localStorage` (`eysiclicks-theme` for Daylight/Darkroom persistence only; no state storage needed for Museum Mat since it is permanently active)

**Testing**: Node.js built-in test runner (`node:test`, `node:assert/strict`) + Headless Google Chrome via Chrome DevTools Protocol (CDP) WebSocket E2E suite

**Target Platform**: Modern evergreen desktop and mobile browsers (`375px` mobile through `1440px+` desktop viewports)

**Project Type**: Static luxury photography portfolio web application

**Performance Goals**: Instant 60fps Lightbox transitions, zero layout shift (`CLS = 0`), zero console/page errors, zero horizontal overflow across viewports

**Constraints**: Strict adherence to OOP principles (`Encapsulation`, `Single Responsibility`, `Composition over Inheritance`), WCAG 2.2 AA accessibility, and smallest surgical change footprint

**Scale/Scope**: 3 core source files (`index.html`, `styles.css`, `app.js`) + 2 automated test suites (`unit.test.js`, `e2e.test.js`) covering 28 archival photographs

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Gate I — Object-Oriented Domain & Controller Architecture**: **PASS**. `LightboxController` retains cohesive encapsulation over the photo viewer lifecycle (`open`, `close`, `navigate`, `toggleZoom`, `toggleSlideshow`, `startSlideshow`, `stopSlideshow`) while eliminating obsolete `#matBtn`, `#hasMat`, `#frameWrapEl`, and `toggleMuseumMat()` state/methods.
- **Gate II — Zero-Dependency Vanilla Web Standards**: **PASS**. Pure HTML5, CSS3, and ES2022+ changes with zero external libraries.
- **Gate III — Luxury Editorial UI/UX & Accessibility (WCAG 2.2 AA)**: **PASS**. Permanent archival Museum Mat (`#faf8f5` passe-partout with `EYSI CLICKS · ARCHIVAL PLATE` colophon imprint) elevates gallery presentation while remaining toolbar buttons (`#lb-play-btn`, `#lb-zoom-btn`, `.lightbox-close`), navigation controls, and keyboard focus trapping remain WCAG 2.2 AA compliant.
- **Gate IV — Effortless Archival Photo Management**: **PASS**. `photoData` at the top of `app.js` is untouched.
- **Gate V — Automated Unit & Real-Browser E2E Verification**: **PASS**. Both `unit.test.js` and `e2e.test.js` will be updated and executed to verify permanent Museum Mat framing, absence of `#lb-mat-btn` and `.lightbox-hints`, and `M` key no-op behavior.

## Project Structure

### Documentation (this feature)

```text
specs/002-default-museum-mat/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output (/speckit-plan command)
├── data-model.md        # Phase 1 output (/speckit-plan command)
├── quickstart.md        # Phase 1 output (/speckit-plan command)
├── contracts/           # Phase 1 output (/speckit-plan command)
│   └── ui-lightbox-contract.md
└── tasks.md             # Phase 2 output (/speckit-tasks command)
```

### Source Code (repository root)

```text
/Users/manalili/Desktop/Desktop/PORTFOLIO PROJECTS WEBSITE/EysiClicks-portfolio-2026.great-site.net/
├── index.html           # Lightbox markup (#lightbox-toolbar, #lightbox-frame-wrap, .lightbox-stage)
├── styles.css           # Section 10 Lightbox & Museum Mat styles (.lightbox-frame-wrap, .lightbox-img)
├── app.js               # LightboxController class (Section 5)
└── specs/
    └── 002-default-museum-mat/
```

**Structure Decision**: Existing root-level static portfolio architecture (`index.html`, `styles.css`, `app.js`) is preserved with minimal surgical edits to Section 10 of `styles.css`, the `#lightbox` dialog in `index.html`, and `LightboxController` in `app.js`.

## Complexity Tracking

> No Constitution Check violations. Complexity is strictly reduced by removing a toggle state (`#hasMat`), a toolbar button (`#lb-mat-btn`), a keyboard handler branch (`M`), and the bottom keyboard legend DOM/CSS.
