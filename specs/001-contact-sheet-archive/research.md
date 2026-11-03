# Phase 0 Research: Contact Sheet Only Archive & Filter Removal

**Feature**: `001-contact-sheet-archive`
**Date**: 2026-11-03

## Research Decisions

### Decision 1: Consolidating `.photo-grid` onto the Contact Sheet Proof Layout
- **Decision**: Make the Contact Sheet proof styling (`.photo-grid` with 2 columns on `<600px`, 4 columns on `600px–959px`, and 5 columns on `≥960px`, plus stacked proof card layout with `PLATE NN` + `35MM PROOF` header, aspect-ratio-bound `<img>`, and visible static `.photo-label` below) the default and sole styling of `.photo-grid` and `.photo-item` in `styles.css`.
- **Rationale**: Eliminates the `.view-contact` modifier class, the Exhibition justified-row `balanceGrid()` resize calculations, the 3D hover tilt effect that was disabled in Contact Sheet mode anyway, and the dark hover overlay gradient—resulting in leaner CSS, faster layout calculation, and a unified analog proof-sheet aesthetic.
- **Alternatives Considered**:
  - *Keep `.view-contact` class hardcoded in HTML/JS while leaving Exhibition CSS in `styles.css`*: Rejected because dead Exhibition CSS and unused JS view-switching branches violate the YAGNI and minimal-footprint principles in the project constitution.

### Decision 2: Removing `.view-toggle` and `.series-filter-wrap` from `index.html` and `GalleryPresenter`
- **Decision**:
  1. In `index.html`, remove `<div class="view-toggle">...</div>` inside `.gallery-right-controls` and remove the entire `<div class="series-filter-wrap">...</div>` block (`#series-filter-bar` and `#archive-status-readout`).
  2. In `app.js`, simplify `PortfolioRepository.getPhotos(cat, orientation)` and remove `getSeriesGroups()`. In `GalleryPresenter`, remove `#categorySeriesFilter`, `#viewMode`, `setSeriesFilter()`, `setViewMode()`, `#renderSeriesFilterBar()`, `#updateStatusReadout()`, and `balanceGrid()`.
- **Rationale**: Directly fulfills `FR-001` through `FR-004` while keeping `GalleryPresenter` and `PortfolioRepository` cohesive, encapsulated, and free of unused state.
- **Alternatives Considered**:
  - *Hide `.series-filter-wrap` and `.view-toggle` with `display: none`*: Rejected because hidden DOM nodes still execute JS rendering logic and clutter the markup.
