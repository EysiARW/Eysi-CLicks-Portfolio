---
description: "Task list for Contact Sheet Only Archive & Filter Removal"
---

# Tasks: Contact Sheet Only Archive & Filter Removal

**Input**: Design documents from `/specs/001-contact-sheet-archive/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/ui-archive-contract.md, quickstart.md

**Tests**: Unit and Headless Chrome E2E verification tasks are included in the Polish phase per Principle V of the project constitution.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (`[US1]`, `[US2]`, `[US3]`)
- Exact file paths are included in every task description

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Baseline syntax and workspace state verification before modifying archive components

- [X] T001 Verify baseline syntax and existing DOM bindings in index.html, styles.css, and app.js

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Simplify the domain repository contract so all downstream Archive user stories consume unfiltered `PhotoAsset[]` collections (`['predebut', 'events', 'institutional']`, `'portrait' | 'landscape'`)

**⚠️ CRITICAL**: Complete before User Story phases

- [X] T002 Simplify `PortfolioRepository.getPhotos(cat, orientation)` to return the full unfiltered `PhotoAsset[]` array and remove `getSeriesGroups()` in app.js

**Checkpoint**: `PortfolioRepository` exposes clean, unfiltered collection queries for `GalleryPresenter`

---

## Phase 3: User Story 1 - Unified Contact Sheet Archive View (Priority: P1) 🎯 MVP

**Goal**: Render all Archive categories (`Pre-Debut`, `Events`, `Institutional`) and orientations (`Portrait` `4:5`, `Landscape` `3:2`) exclusively in the analog 35mm Contact Sheet proof layout and remove the `Exhibition` / `Contact Sheet` layout switcher.

**Independent Test**: Open `#gallery`, switch across `Pre-Debut`, `Events`, and `Institutional` tabs and `Portrait`/`Landscape` orientations, and confirm all frames render as Contact Sheet proofs (`PLATE NN`, `35MM PROOF`, framed image, and static bottom caption) with zero `.view-toggle` buttons in the DOM.

### Implementation for User Story 1

- [X] T003 [P] [US1] Remove the `.view-toggle` button group (`#view-exhibition` and `#view-contact`) from `.gallery-right-controls` in index.html
- [X] T004 [P] [US1] Consolidate `.photo-grid` and `.photo-item` onto the 35mm Contact Sheet proof layout (`2` cols `<600px`, `4` cols `600px–959px`, `5` cols `>=960px`, static `PLATE NN` + `35MM PROOF` header, and static bottom `.photo-label`) and remove `.view-toggle`, `.view-btn`, `.fill-row`, and `.view-contact` rules in styles.css
- [X] T005 [US1] Remove `#viewMode`, `setViewMode()`, `balanceGrid()`, and 3D hover tilt logic from `GalleryPresenter` so all grids render exclusively as Contact Sheet proofs in app.js

**Checkpoint**: User Story 1 is complete — all Archive panels render exclusively in the Contact Sheet layout with no view mode toggle

---

## Phase 4: User Story 2 - Unfiltered Collection Browsing Without Sub-Series Filter Bar (Priority: P1)

**Goal**: Completely remove the horizontal series filter bar (`All Plates` and subject pills) and the archive status readout strip (`EXHIBITION · 05/05 PORTRAIT PLATES · ALL SERIES`) from the Archive section.

**Independent Test**: Inspect `#gallery` between `.gallery-controls` and `.cat-intro` across all categories and confirm `.series-filter-wrap`, `#series-filter-bar`, and `#archive-status-readout` do not exist in the DOM and 100% of plates in each category/orientation are visible.

### Implementation for User Story 2

- [X] T006 [P] [US2] Remove the `.series-filter-wrap` container (`#series-filter-bar` and `#archive-status-readout`) from `#gallery` in index.html
- [X] T007 [P] [US2] Remove `.series-filter-wrap`, `.series-filter-bar`, `.series-pill`, `.series-pill-count`, and `.archive-status-readout` CSS rules from styles.css
- [X] T008 [US2] Remove `#categorySeriesFilter`, `setSeriesFilter()`, `#renderSeriesFilterBar()`, and `#updateStatusReadout()` from `GalleryPresenter` in app.js

**Checkpoint**: User Stories 1 AND 2 are complete — the Archive displays unfiltered Contact Sheet proofs with clean Category + Orientation controls only

---

## Phase 5: User Story 3 - Seamless Lightbox Inspection from Contact Sheet Proofs (Priority: P2)

**Goal**: Ensure clicking or pressing `Enter`/`Space` on any Contact Sheet proof frame opens the Lightbox viewer with the full category/orientation sequence and View Transition morphing.

**Independent Test**: Click or press `Enter` on any `.photo-item` proof frame and verify `#lightbox.open` displays that plate and navigates through the full collection.

### Implementation for User Story 3

- [X] T009 [US3] Verify and preserve keyboard (`Enter`/`Space`), click activation, and `CursorLoupeController` binding on Contact Sheet `.photo-item` elements in `GalleryPresenter.#buildGridDOM()` in app.js

**Checkpoint**: All user stories (`US1`, `US2`, `US3`) are independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Update and run automated Unit and Headless Chrome E2E verification suites per `quickstart.md`

- [X] T010 [P] Update Unit Test Suite to verify unfiltered Contact Sheet rendering and `PortfolioRepository` in /Users/manalili/.gemini/antigravity/brain/1a6fac08-d52a-4e5c-9965-ebc6bfa23e94/scratch/unit.test.js
- [X] T011 [P] Update Headless Chrome E2E Test Suite to assert absence of `.view-toggle` and `.series-filter-wrap` and verify Contact Sheet proof rendering in /Users/manalili/.gemini/antigravity/brain/1a6fac08-d52a-4e5c-9965-ebc6bfa23e94/scratch/e2e.test.js
- [X] T012 Execute quickstart.md validation commands (`node --check app.js`, `unit.test.js`, and `e2e.test.js`) from repository root

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — starts immediately
- **Foundational (Phase 2)**: Depends on Setup (`T001`) — blocks User Stories 1–3
- **User Story 1 (Phase 3)** & **User Story 2 (Phase 4)**: Both depend on Foundational (`T002`); HTML (`T003`, `T006`) and CSS (`T004`, `T007`) tasks touch separate sections and can be applied in parallel before JS consolidation (`T005`, `T008`)
- **User Story 3 (Phase 5)**: Depends on `T005` and `T008` in `app.js`
- **Polish (Phase 6)**: Depends on Phases 3–5 completion

### Parallel Opportunities

- `T003` (`index.html`) and `T004` (`styles.css`) in User Story 1 can run in parallel
- `T006` (`index.html`) and `T007` (`styles.css`) in User Story 2 can run in parallel
- `T010` (`unit.test.js`) and `T011` (`e2e.test.js`) in Phase 6 can run in parallel

---

## Parallel Example: User Story 1 & User Story 2 Markup/CSS

```bash
# Markup & Stylesheet updates across separate files can run concurrently:
Task: "T003 [P] [US1] Remove the .view-toggle button group (#view-exhibition and #view-contact) from .gallery-right-controls in index.html"
Task: "T004 [P] [US1] Consolidate .photo-grid and .photo-item onto the 35mm Contact Sheet proof layout in styles.css"
```

---

## Implementation Strategy

### MVP First (User Story 1 + User Story 2)

1. Complete Phase 1: Setup (`T001`)
2. Complete Phase 2: Foundational (`T002`)
3. Complete Phase 3 (`US1`: Contact Sheet only) and Phase 4 (`US2`: Filter bar removal)
4. Verify Lightbox integration in Phase 5 (`US3`)
5. Run automated Unit + Headless Chrome E2E verification in Phase 6 (`T010`–`T012`)
