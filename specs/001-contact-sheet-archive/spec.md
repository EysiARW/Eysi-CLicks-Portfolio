# Feature Specification: Contact Sheet Only Archive & Filter Removal

**Feature Branch**: `001-contact-sheet-archive`

**Created**: 2026-11-03

**Status**: Draft

**Input**: User description: "i want to remove the exhibition feature on my archives. You should implement only the contact sheet feature on my archive also remove the filtering here"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Unified Contact Sheet Archive View (Priority: P1)

Visitors browsing the Archive section view all photographs exclusively in the analog 35mm Contact Sheet proof layout across every category (`Pre-Debut`, `Events`, `Institutional`) and orientation (`Portrait`, `Landscape`), without having to choose between layout modes or see an Exhibition/Contact Sheet toggle.

**Why this priority**: The Contact Sheet layout is the signature visual presentation requested for the archive; removing the Exhibition mode and view switcher simplifies the interface and establishes a single cohesive editorial proof-sheet identity.

**Independent Test**: Can be fully tested by opening the Archive section, switching across `Pre-Debut`, `Events`, and `Institutional` tabs and `Portrait`/`Landscape` orientations, and verifying that all photographs render in the Contact Sheet proof format with no layout mode toggle buttons present.

**Acceptance Scenarios**:

1. **Given** a visitor lands on the Archive section, **When** any category tab (`Pre-Debut`, `Events`, or `Institutional`) is viewed, **Then** all photographs in that collection are displayed directly in the Contact Sheet proof layout (with plate index header, `35MM PROOF` mark, framed image, and persistent caption below).
2. **Given** a visitor is viewing the Archive controls bar, **When** they inspect the controls next to the Category Tabs, **Then** only the `Portrait` and `Landscape` orientation toggle buttons are displayed, and the `Exhibition` / `Contact Sheet` layout switcher is completely absent.
3. **Given** a visitor switches between `Portrait` and `Landscape` orientations in any category, **When** the collection updates, **Then** the Contact Sheet proof frames adapt their aspect ratio (`4:5` for Portrait, `3:2` for Landscape) while retaining the Contact Sheet presentation.

---

### User Story 2 - Unfiltered Collection Browsing Without Sub-Series Filter Bar (Priority: P1)

Visitors browsing any category and orientation in the Archive immediately see the complete set of photographs for that selection without a secondary horizontal filter bar (`All Plates`, individual subject/event pills, or the `EXHIBITION · 05/05 PORTRAIT PLATES · ALL SERIES` status strip) occupying vertical space between the main controls and the chapter introduction.

**Why this priority**: The user explicitly highlighted and requested removing the secondary series filtering strip so the archive remains clean, direct, and uncluttered.

**Independent Test**: Can be fully tested by inspecting the space between the Category/Orientation controls and the active category's chapter introduction and confirming the secondary filter bar and status readout strip are completely removed while all photographs in the active category and orientation remain visible.

**Acceptance Scenarios**:

1. **Given** a visitor is viewing the Archive section on any screen size, **When** they look below the Category Tabs and Orientation Toggle, **Then** no series filter pills (`All Plates`, `Avegail @18`, `Trisha @20`, `Anne @20`, etc.) and no archive status readout text (`EXHIBITION · ... · ALL SERIES`) are rendered.
2. **Given** a visitor selects `Pre-Debut` (`Portrait` or `Landscape`), `Events` (`Portrait` or `Landscape`), or `Institutional` (`Landscape`), **When** the grid renders, **Then** 100% of the photographs belonging to that category and orientation are displayed simultaneously.

---

### User Story 3 - Seamless Lightbox Inspection from Contact Sheet Proofs (Priority: P2)

Visitors clicking or activating any Contact Sheet proof frame can still inspect the full-resolution photograph in the Lightbox viewer and navigate through the full category/orientation sequence.

**Why this priority**: Preserves full-screen inspection capability so visitors can examine fine photographic details from the Contact Sheet proofs.

**Independent Test**: Can be tested by clicking or pressing `Enter` on any Contact Sheet frame and verifying the Lightbox opens with the selected photograph and cycles through all photographs in that category and orientation.

**Acceptance Scenarios**:

1. **Given** a visitor is viewing Contact Sheet proof frames in any category, **When** they click or press `Enter`/`Space` on a proof frame, **Then** the Lightbox opens displaying that photograph along with the complete filmstrip sequence for the active category and orientation.

---

### Edge Cases

- What happens when a category has no photographs for one of the orientations (such as `Institutional` having no `Portrait` photographs)? The unavailable orientation button remains disabled and clearly labeled as unavailable, while the available orientation (`Landscape`) displays all of its Contact Sheet proofs.
- How does the Contact Sheet layout behave across mobile (`375px`), tablet (`768px`), and desktop (`1440px`) screens? The Contact Sheet proof grid wraps cleanly into 2 columns on mobile, 4 columns on tablet, and 5 columns on desktop with zero horizontal overflow and no stretched trailing items.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The Archive section MUST display all photograph collections exclusively in the Contact Sheet proof format across all categories (`Pre-Debut`, `Events`, `Institutional`) and orientations (`Portrait`, `Landscape`).
- **FR-002**: The Archive controls bar MUST remove the layout density/view toggle (`Exhibition` and `Contact Sheet` buttons), retaining only the Category Tabs (`Pre-Debut`, `Events`, `Institutional`) and the Orientation Toggle (`Portrait`, `Landscape`).
- **FR-003**: The Archive section MUST completely remove the secondary series filter bar (including `All Plates` and subject-specific filter pills) and the archive status readout strip located below the primary gallery controls.
- **FR-004**: Selecting a category tab or switching orientation MUST always display the complete, unfiltered list of photographs for that category and orientation.
- **FR-005**: Each Contact Sheet proof item MUST display its sequential plate identifier (`PLATE 01`, `PLATE 02`, etc.), the `35MM PROOF` designation, the photograph in its proper orientation aspect ratio, and its visible caption beneath the frame.
- **FR-006**: Activating any Contact Sheet proof frame via pointer click or keyboard (`Enter`/`Space`) MUST open the Lightbox viewer populated with all photographs in the current category and orientation.

### Key Entities

- **Archival Plate**: A single photograph entry belonging to a category and orientation, presented as a Contact Sheet proof frame with plate number, image preview, and caption.
- **Archive Collection**: A grouping of Archival Plates organized by Category (`Pre-Debut`, `Events`, `Institutional`) and Orientation (`Portrait`, `Landscape`).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of Archive categories and orientations render exclusively in the Contact Sheet proof layout immediately upon page load and tab/orientation switching.
- **SC-002**: Zero layout-switcher buttons (`Exhibition` / `Contact Sheet`) and zero series-filter pills or status readout strips appear anywhere in the Archive interface.
- **SC-003**: 100% of photographs within the selected category and orientation (`5` in Pre-Debut Portrait, `3` in Pre-Debut Landscape, `2` in Events Portrait, `10` in Events Landscape, `8` in Institutional Landscape) are visible without requiring any secondary filter interaction.
- **SC-004**: Responsive layouts across `375px` mobile and `1440px` desktop viewports exhibit zero horizontal scroll overflow and maintain full keyboard and screen-reader accessibility.

## Assumptions

- The top navigation bar's centered chapter indicator pill and the Lightbox viewer's internal features (Museum Mat frame toggle, Slideshow, Zoom, and Filmstrip) remain part of the site experience, as the user's request and screenshot specifically target the Archive section's Exhibition view mode and series filter bar.
- Category tabs (`Pre-Debut`, `Events`, `Institutional`) and Orientation toggles (`Portrait`, `Landscape`) remain the sole browsing controls for the Archive.
