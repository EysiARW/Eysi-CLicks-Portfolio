# UI Contract: Archive Section (`#gallery`)

**Feature**: `001-contact-sheet-archive`
**Date**: 2026-11-03

## 1. Archive Controls Contract (`.gallery-controls`)

- **Present Elements**:
  - `.cat-tabs[role="tablist"]` containing `#tab-predebut`, `#tab-events`, and `#tab-institutional` with `.cat-tab-count` badges (`08`, `12`, `08`).
  - `.orient-toggle[role="group"]` containing `#orient-portrait` and `#orient-landscape` with `.orient-count` counters.
- **Removed Elements (Must Not Exist in DOM)**:
  - `.view-toggle`, `#view-exhibition`, `#view-contact`
  - `.series-filter-wrap`, `#series-filter-bar`, `.series-pill`, `#archive-status-readout`

## 2. Contact Sheet Grid & Proof Item Contract (`.photo-grid` / `.photo-item`)

- **Grid Layout (`.photo-grid`)**:
  - Always renders as a multi-column Contact Sheet grid (`2` columns `<600px`, `4` columns `600px–959px`, `5` columns `≥960px`).
  - Orientation class `.orient-landscape` switches proof image aspect ratio from `4 / 5` (Portrait) to `3 / 2` (Landscape).
- **Proof Card Structure (`.photo-item`)**:
  - `<span class="photo-tag">PLATE NN</span>` rendered as a static top header row with `::after` content `'35MM PROOF'`.
  - `<picture>` with `<source type="image/webp">` and `<img loading="lazy" decoding="async">`.
  - `<figcaption class="photo-overlay">` rendered as a static bottom caption row containing `<span class="photo-label">{caption}</span>`.
  - Keyboard accessible (`tabindex="0"`, `role="button"`, `aria-label="View photo: {caption} (PLATE NN)"`) and opens `LightboxController` with the full `(category, orientation)` photo list on click or `Enter`/`Space`.
