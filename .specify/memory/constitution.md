<!--
Sync Impact Report:
- Version change: 0.0.0 → 1.0.0
- Added principles:
  1. I. Object-Oriented Domain & Controller Architecture
  2. II. Zero-Dependency Vanilla Web Standards
  3. III. Luxury Editorial UI/UX & Accessibility (WCAG 2.2 AA)
  4. IV. Effortless Archival Photo Management
  5. V. Automated Unit & Real-Browser E2E Verification
- Added sections: Technical & Performance Standards, Spec-Driven Revision Workflow
- Follow-up TODOs: None
-->
# EYSI CLICKS Portfolio Constitution

## Core Principles

### I. Object-Oriented Domain & Controller Architecture
All JavaScript logic MUST be modeled using cohesive ES6+ classes with private state (`#field`), encapsulation, single responsibility, and composition over inheritance (`PhotoAsset`, `PortfolioRepository`, `ViewTransitionCoordinator`, `ThemeManager`, `CursorLoupeController`, `LightboxController`, `GalleryPresenter`, `TelemetryHudController`).

### II. Zero-Dependency Vanilla Web Standards
The portfolio MUST run directly as a static HTML5, CSS3, and ES6+ application without external runtime dependencies, bundlers, or framework bloat. Modern Web APIs (`document.startViewTransition`, `IntersectionObserver`, `<picture>` with `.webp` + `.jpg` fallbacks) MUST degrade gracefully across browsers.

### III. Luxury Editorial UI/UX & Accessibility (WCAG 2.2 AA)
Every visual revision MUST preserve the museum-grade editorial aesthetic across both Archival Daylight (`data-theme="light"`) and Darkroom Obsidian (`data-theme="dark"`) modes. All interactive controls MUST maintain a minimum 4.5:1 text contrast ratio, visible `:focus-visible` rings, keyboard operability, and `@media (prefers-reduced-motion: reduce)` support.

### IV. Effortless Archival Photo Management
The `photoData` catalog at the top of `app.js` MUST remain a declarative dictionary of category and orientation arrays so adding, reordering, or removing photographs requires only a single-line edit without touching HTML markup.

### V. Automated Unit & Real-Browser E2E Verification
No revision is complete until verified by executing both the Node unit test suite (`node:test`) and the Headless Chrome CDP E2E/UI test suite with zero console errors, zero uncaught page exceptions, and zero layout overflow at `375px` and `1440px`.

## Technical & Performance Standards

- **Image Delivery**: Every gallery plate MUST serve a `<source type="image/webp">` alongside its `.jpg` fallback with `loading="lazy"` and `decoding="async"`.
- **Typography**: Curated local display fonts (`Dreamer`, `Tropikal`, `TT Interphases`) and editorial serifs (`EB Garamond`, `Playfair Display`) MUST use `font-display: swap`.
- **Compositor Motion**: Animations MUST target `transform` and `opacity` and avoid global `0.01ms !important` reduced-motion overrides.

## Spec-Driven Revision Workflow

1. **Specify (`/speckit-specify`)**: Define the revision scope, user stories, and visual/UX acceptance criteria in `.specify/specs/`.
2. **Clarify (`/speckit-clarify`, optional)**: Resolve any visual, interaction, or copy ambiguities before planning.
3. **Plan (`/speckit-plan`)**: Map the technical changes across `index.html`, `styles.css`, and `app.js` classes.
4. **Tasks (`/speckit-tasks`)**: Break the revision into ordered, testable tasks.
5. **Implement (`/speckit-implement`)**: Execute minimal, surgical code changes and verify via unit and E2E suites.

## Governance

This constitution governs all revisions to the EYSI CLICKS portfolio website. Amendments require incrementing the semantic version below and updating `.specify/memory/constitution.md`.

**Version**: 1.0.0 | **Ratified**: 2026-11-03 | **Last Amended**: 2026-11-03
