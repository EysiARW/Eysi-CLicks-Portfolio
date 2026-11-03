---

description: "Task list for Default Museum Mat & Legend-Free Photo Viewer (002-default-museum-mat)"
---

# Tasks: Default Museum Mat & Legend-Free Photo Viewer

**Input**: Design documents from `/specs/002-default-museum-mat/`

**Prerequisites**: [plan.md](plan.md) (required), [spec.md](spec.md) (required for user stories), [research.md](research.md), [data-model.md](data-model.md), [contracts/ui-lightbox-contract.md](contracts/ui-lightbox-contract.md)

**Tests**: Automated unit (`unit.test.js`) and real-browser E2E (`e2e.test.js`) updates and execution are included in Phase 5 per Principle V of `.specify/memory/constitution.md`.

**Organization**: Tasks are grouped by user story (`US1`, `US2`, `US3`) to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., `US1`, `US2`, `US3`)
- Includes exact file paths in descriptions

---

## Phase 1: Setup & Baseline Inspection

**Purpose**: Verify baseline Lightbox DOM, CSS, and `LightboxController` lines before applying surgical modifications.

- [X] T001 Inspect baseline `#lightbox` markup in `index.html`, Section 10 Lightbox styles in `styles.css`, and `LightboxController` in `app.js`

---

## Phase 2: User Story 1 - Permanent Museum Mat Framing in Photo Viewer (Priority: P1) 🎯 MVP

**Goal**: Display every photograph opened in the full-screen Lightbox viewer inside the archival Museum Mat (`EYSI CLICKS · ARCHIVAL PLATE`) permanently by default, and remove the `Museum Mat` toolbar toggle button and `M` keyboard shortcut.

**Independent Test**: Open any photograph from `#gallery` or `.hero-floating-frames` in `#lightbox`; verify `#lightbox-frame-wrap` immediately displays the `#faf8f5` archival mat border and `EYSI CLICKS · ARCHIVAL PLATE` imprint, verify `#lb-mat-btn` is absent from `.lightbox-toolbar`, and verify pressing `M` does not remove or alter the mat.

### Implementation for User Story 1

- [X] T002 [P] [US1] Remove `<button type="button" class="lb-tool-btn" id="lb-mat-btn" ...>` from `.lightbox-toolbar` in `index.html`
- [X] T003 [P] [US1] Fold `.lightbox-frame-wrap.has-mat`, `.lightbox-frame-wrap.has-mat::after`, and `.lightbox-frame-wrap.has-mat .lightbox-img` styles directly into `.lightbox-frame-wrap`, `.lightbox-frame-wrap::after`, and `.lightbox-img` in `styles.css`
- [X] T004 [P] [US1] Remove `#frameWrapEl`, `#matBtn`, `#hasMat`, `toggleMuseumMat()`, `#matBtn` click listener, and the `m` / `M` keyboard shortcut from `LightboxController` in `app.js`

**Checkpoint**: User Story 1 is complete — every photograph opened in `#lightbox` is permanently framed inside the Museum Mat with no toggle option.

---

## Phase 3: User Story 2 - Removal of Bottom Keyboard Shortcut Legends (Priority: P1)

**Goal**: Remove the bottom keyboard shortcut legend row (`← / → Navigate · M Museum Mat · P Slideshow · Z Zoom · Esc Close`) beneath `#lightbox-filmstrip`.

**Independent Test**: Open `#lightbox` at desktop (`1440px`) and mobile (`375px`) viewports and verify `.lightbox-hints`, `.hint-key`, and `.hint-sep` are completely absent from the DOM and stylesheet.

### Implementation for User Story 2

- [X] T005 [P] [US2] Remove `<div class="lightbox-hints" aria-hidden="true">...</div>` below `#lightbox-filmstrip` in `index.html`
- [X] T006 [P] [US2] Remove `.lightbox-hints`, `.hint-key`, `.hint-sep`, and mobile `@media (max-width: 640px) { .lightbox-hints }` rules from `styles.css`

**Checkpoint**: User Stories 1 AND 2 are complete — `#lightbox` renders with permanent Museum Mat framing and a clean bottom stage without keyboard legends.

---

## Phase 4: User Story 3 - Preserved Viewer Navigation, Slideshow, and Zoom Controls (Priority: P2)

**Goal**: Ensure all remaining Lightbox interactions (Previous/Next navigation, Filmstrip thumbnail selection, Slideshow toggle via `#lb-play-btn` or `P`, Loupe Zoom toggle via `#lb-zoom-btn`, image click, or `Z`, and Close via `.lightbox-close`, backdrop click, or `Escape`) operate cleanly with zero errors.

**Independent Test**: Open `#lightbox`, navigate forward/backward, toggle Zoom and Slideshow, and close with `Escape`, verifying all controls and focus trapping work with the permanent Museum Mat.

### Implementation for User Story 3

- [X] T007 [US3] Verify `LightboxController` focus trap, Zoom (`#lb-zoom-btn` / `Z`), Slideshow (`#lb-play-btn` / `P`), Filmstrip thumbnails (`#lightbox-filmstrip`), and `Escape` behavior in `app.js` and `index.html`

**Checkpoint**: All three user stories (`US1`, `US2`, `US3`) are complete and independently functional.

---

## Phase 5: Polish & Automated Verification (Constitution Principle V)

**Purpose**: Update and execute the Node unit test suite and Headless Chrome CDP E2E test suite to verify 100% pass rate and zero regressions.

- [X] T008 [P] Update `LightboxController` unit tests in `/Users/manalili/.gemini/antigravity/brain/1a6fac08-d52a-4e5c-9965-ebc6bfa23e94/scratch/unit.test.js` to assert `toggleMuseumMat` is removed and static DOM IDs match `index.html`
- [X] T009 [P] Update Lightbox E2E tests in `/Users/manalili/.gemini/antigravity/brain/1a6fac08-d52a-4e5c-9965-ebc6bfa23e94/scratch/e2e.test.js` (`E2E 5`) to assert permanent Museum Mat framing (`#faf8f5` background & `ARCHIVAL PLATE` imprint on open), absence of `#lb-mat-btn` and `.lightbox-hints`, and `M` key no-op
- [X] T010 Execute syntax check (`node --check app.js`) and full unit + E2E test suites (`node --test unit.test.js e2e.test.js`) per `specs/002-default-museum-mat/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies — starts immediately.
- **Phase 2 (US1 - P1)** & **Phase 3 (US2 - P1)**: Depend on Phase 1; touch distinct sections of `index.html`, `styles.css`, and `app.js`.
- **Phase 4 (US3 - P2)**: Depends on Phase 2 and Phase 3 completion.
- **Phase 5 (Polish & Automated Verification)**: Depends on Phases 2–4 completion.

### Parallel Opportunities

- `T002` (`index.html`), `T003` (`styles.css`), and `T004` (`app.js`) modify different files and can be executed in parallel.
- `T005` (`index.html`) and `T006` (`styles.css`) modify different files and can be executed in parallel.
- `T008` (`unit.test.js`) and `T009` (`e2e.test.js`) modify different test files and can be executed in parallel.

---

## Parallel Example: User Story 1

```bash
# Execute HTML, CSS, and JS updates for Permanent Museum Mat in parallel:
Task T002: "Remove <button id='lb-mat-btn'> from .lightbox-toolbar in index.html"
Task T003: "Fold .has-mat styles directly into .lightbox-frame-wrap and .lightbox-img in styles.css"
Task T004: "Remove #frameWrapEl, #matBtn, #hasMat, toggleMuseumMat(), and M shortcut from LightboxController in app.js"
```

---

## Implementation Strategy

### MVP First (User Story 1 + User Story 2)

1. Complete Phase 1: Baseline inspection (`T001`)
2. Complete Phase 2 (`T002`–`T004`): Permanent Museum Mat framing (`US1`)
3. Complete Phase 3 (`T005`–`T006`): Remove bottom keyboard shortcut legends (`US2`)
4. Complete Phase 4 (`T007`): Verify remaining Lightbox controls (`US3`)
5. Complete Phase 5 (`T008`–`T010`): Run Unit + Headless Chrome CDP E2E verification
