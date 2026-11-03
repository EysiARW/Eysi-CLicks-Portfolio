# Phase 0 Research: Default Museum Mat & Legend-Free Photo Viewer

**Feature**: `002-default-museum-mat`  
**Date**: 2026-11-03

## Research Decisions

### 1. Enforcing Permanent Museum Mat Presentation in `#lightbox-frame-wrap`

- **Decision**: Fold the `.lightbox-frame-wrap.has-mat`, `.lightbox-frame-wrap.has-mat::after`, and `.lightbox-frame-wrap.has-mat .lightbox-img` CSS declarations directly into `.lightbox-frame-wrap`, `.lightbox-frame-wrap::after`, and `.lightbox-img` in `styles.css`, and remove the `#lb-mat-btn` button from `index.html` as well as `toggleMuseumMat()` and the `M` key binding from `LightboxController` in `app.js`.
- **Rationale**: Making the Museum Mat passe-partout (`background: #faf8f5`, archival padding, inset border shadow, and `EYSI CLICKS · ARCHIVAL PLATE` pseudo-element imprint) the intrinsic styling of `.lightbox-frame-wrap` guarantees that every photo opened in the Lightbox is immediately framed in the Museum Mat without relying on JavaScript state toggling or mutable CSS modifier classes.
- **Alternatives Considered**:
  - *Keep `.has-mat` class and initialize `#hasMat = true` in `LightboxController`*: Rejected because it leaves dead toggle logic and unnecessary state for a presentation mode that must never be turned off.
  - *Hide `#lb-mat-btn` with `display: none`*: Rejected because leaving dead controls in the DOM and keyboard listener violates clean architecture and allows pressing `M` to accidentally remove the mat.

### 2. Removing the Bottom Keyboard Shortcut Legends (`.lightbox-hints`)

- **Decision**: Remove the `<div class="lightbox-hints" aria-hidden="true">...</div>` block from `index.html` and delete the `.lightbox-hints`, `.hint-key`, `.hint-sep`, and mobile `.lightbox-hints` media query rules from `styles.css`.
- **Rationale**: Eliminates the visual legend bar (`← / → Navigate · M Museum Mat · P Slideshow · Z Zoom · Esc Close`) below `#lightbox-filmstrip` while keeping the underlying keyboard navigation (`ArrowLeft`, `ArrowRight`, `P`, `Z`, `Escape`, `Tab`) active for accessibility.
- **Alternatives Considered**:
  - *Remove only the `M Museum Mat` item from `.lightbox-hints`*: Rejected because the user explicitly requested "also remove the legends below" and provided a dedicated screenshot of the entire bottom legend bar (`media_1793666194296_3f0e8636.png`).
