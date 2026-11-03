# Feature Specification: Default Museum Mat & Legend-Free Photo Viewer

**Feature Branch**: `002-default-museum-mat`

**Created**: 2026-11-03

**Status**: Implemented

**Input**: User description: "when viewing my archives there should not be an option if you can have museum hat. meseum hat should be the default and no other option. also remove the legends below"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Permanent Museum Mat Framing in Photo Viewer (Priority: P1)

When a visitor opens any photograph in the full-screen photo viewer—whether selected from the Archive contact sheet or from the Hero showcase frames—the photograph is always presented inside the signature archival Museum Mat frame (`EYSI CLICKS · ARCHIVAL PLATE`). Visitors no longer see a "Museum Mat" toggle button in the top toolbar and cannot switch the mat off via toolbar click or keyboard shortcut.

**Why this priority**: Enforcing the Museum Mat as the permanent, non-optional presentation guarantees that every photograph is inspected with consistent gallery framing and removes unnecessary toolbar clutter.

**Independent Test**: Can be tested independently by clicking any photograph in the Archive or Hero section to open the photo viewer, verifying that the photograph opens immediately with the archival Museum Mat border displayed, verifying that no "Museum Mat" button exists in the top toolbar, and verifying that pressing the `M` key does not remove or alter the mat.

**Acceptance Scenarios**:

1. **Given** a visitor browsing the portfolio, **When** they click any photograph to open the full-screen photo viewer, **Then** the photograph is immediately displayed inside the white archival Museum Mat frame with the `EYSI CLICKS · ARCHIVAL PLATE` imprint.
2. **Given** the full-screen photo viewer is open, **When** the visitor inspects the top-right action toolbar, **Then** only the Slideshow, Zoom, and Close controls are present, and no Museum Mat toggle button is displayed.
3. **Given** the full-screen photo viewer is open, **When** the visitor presses the `M` key on their keyboard or navigates to adjacent photographs, **Then** the Museum Mat framing remains permanently active and unchanged across all plates.

---

### User Story 2 - Removal of Bottom Keyboard Shortcut Legends (Priority: P1)

When a visitor views photographs inside the full-screen photo viewer, the bottom legend bar listing keyboard shortcuts (`← / → Navigate · M Museum Mat · P Slideshow · Z Zoom · Esc Close`) beneath the thumbnail filmstrip is completely absent, leaving a clean visual hierarchy below the framed plate (caption badge and thumbnail filmstrip only).

**Why this priority**: Removing the technical shortcut legend row eliminates visual noise at the bottom of the darkroom stage and keeps the viewer's focus entirely on the framed photograph and filmstrip.

**Independent Test**: Can be tested independently by opening the photo viewer at desktop and mobile viewport widths and verifying that no keyboard shortcut legend text or key badges appear below the thumbnail filmstrip.

**Acceptance Scenarios**:

1. **Given** the full-screen photo viewer is open on any device or viewport size, **When** the visitor looks below the thumbnail filmstrip, **Then** no keyboard shortcut legend row (`Navigate`, `Museum Mat`, `Slideshow`, `Zoom`, `Close`) is rendered or visible.
2. **Given** the bottom legend row is removed, **When** the visitor views both portrait and landscape photographs inside the permanent Museum Mat frame, **Then** the framed plate, caption badge, and thumbnail filmstrip remain balanced and centered within the viewport without vertical clipping or overflow.

---

### User Story 3 - Preserved Viewer Navigation, Slideshow, and Zoom Controls (Priority: P2)

While the Museum Mat is permanently active and the bottom legend row is removed, visitors can still seamlessly navigate between plates, scrub the thumbnail filmstrip, play or pause the automated slideshow, zoom in on photographic details, and close the viewer using on-screen buttons, keyboard shortcuts (`ArrowLeft`, `ArrowRight`, `P`, `Z`, `Escape`), or touch gestures.

**Why this priority**: Ensures that streamlining the viewer interface preserves all core inspection and browsing capabilities expected of a luxury portfolio.

**Independent Test**: Can be tested independently by opening the photo viewer and exercising next/previous navigation, filmstrip thumbnail selection, Zoom toggle, Slideshow playback, and Close actions via both pointer clicks and keyboard keys.

**Acceptance Scenarios**:

1. **Given** the full-screen photo viewer is open with the permanent Museum Mat, **When** the visitor activates Zoom (via the toolbar Zoom button, clicking the photograph, or pressing `Z`), **Then** the photograph zooms smoothly for detail inspection and resets when toggled again or when navigating to another plate.
2. **Given** the full-screen photo viewer is open, **When** the visitor activates Slideshow (via the toolbar Slideshow button or pressing `P`) or navigates with `ArrowLeft` / `ArrowRight` / `Escape`, **Then** each control functions normally while every plate remains framed inside the Museum Mat.

---

### Edge Cases

- What happens when a visitor opens the photo viewer, closes it, and reopens it on a different category or orientation? The Museum Mat remains permanently present on every opening without needing to be enabled.
- What happens when the visitor zooms into a photograph inside the permanent Museum Mat and presses `Escape`? Pressing `Escape` while zoomed resets the zoom level first while keeping the Museum Mat intact; pressing `Escape` when not zoomed closes the photo viewer.
- How does the permanent Museum Mat behave on smaller mobile viewports (e.g., `375px` width)? The Museum Mat frame, caption pill, and filmstrip fit cleanly within the viewport with zero horizontal overflow.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The full-screen photo viewer MUST display every photograph inside the archival Museum Mat frame (`EYSI CLICKS · ARCHIVAL PLATE`) by default and at all times.
- **FR-002**: The full-screen photo viewer MUST NOT display a "Museum Mat" toggle button in the viewer toolbar.
- **FR-003**: The full-screen photo viewer MUST NOT allow toggling or disabling the Museum Mat via keyboard input (such as the `M` key) or any other user interaction.
- **FR-004**: The full-screen photo viewer MUST NOT render or display the bottom keyboard shortcut legend row (`← / → Navigate · M Museum Mat · P Slideshow · Z Zoom · Esc Close`) beneath the thumbnail filmstrip.
- **FR-005**: The full-screen photo viewer MUST retain all remaining toolbar controls (Slideshow, Zoom, Close), stage navigation controls (Previous, Next, Filmstrip thumbnails), touch swipe gestures, and active keyboard shortcuts (`ArrowLeft`, `ArrowRight`, `P`, `Z`, `Escape`, and `Tab` focus trapping).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of photographs opened in the full-screen photo viewer (across all 3 archive categories, both orientations, and all 4 Hero showcase frames) render with the archival Museum Mat active immediately upon opening.
- **SC-002**: 0 Museum Mat toggle controls or bottom keyboard shortcut legends appear anywhere in the photo viewer across mobile (`375px`) and desktop (`1440px`) viewports.
- **SC-003**: 100% of remaining photo viewer interactions (Previous/Next navigation, Filmstrip selection, Slideshow toggle, Zoom toggle, and Close) pass automated verification with zero console or page errors and zero horizontal viewport overflow.

## Assumptions

- "Viewing my archives" refers to inspecting archival plates in the full-screen Lightbox photo viewer, as shown in the user's attached screenshots highlighting the top-right `MUSEUM MAT` toolbar button and the bottom `← / → NAVIGATE · M MUSEUM MAT · P SLIDESHOW · Z ZOOM · ESC CLOSE` legend bar.
- "Museum hat / meseum hat" refers to the **Museum Mat** passe-partout frame feature in the photo viewer.
- Existing functional keyboard shortcuts for navigation (`←` / `→`), slideshow (`P`), zoom (`Z`), and closing (`Esc`) remain active for keyboard accessibility even though the visual legend bar at the bottom is removed (only the `M` shortcut for toggling Museum Mat is removed).
