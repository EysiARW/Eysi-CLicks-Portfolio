# Phase 1 Data Model & Controller State: Default Museum Mat & Legend-Free Photo Viewer

**Feature**: `002-default-museum-mat`  
**Date**: 2026-11-03

## Domain & Controller Model Changes

### 1. `PhotoAsset` & `PortfolioRepository` (Unchanged)
- `PhotoAsset` and `PortfolioRepository` require zero modifications. All 28 archival plates continue to supply `src`, `webpSrc`, `caption`, `category`, `orientation`, `plateNumber`, `categoryLabel`, and `opticalTelemetry` to `LightboxController`.

### 2. `LightboxController` (`app.js`)

#### Removed Private Fields & Methods
- `#frameWrapEl` (removed — no longer toggled dynamically by JS)
- `#matBtn` (removed — `#lb-mat-btn` removed from DOM)
- `#hasMat` (removed — Museum Mat is now permanent and unconditional)
- `toggleMuseumMat()` (removed — no user option to toggle Museum Mat)

#### Retained Private Fields & Methods
- `#lightboxEl`, `#imgEl`, `#titleEl`, `#plateNoEl`, `#counterEl`, `#catBadgeEl`, `#exifEl`, `#filmstripEl`, `#slideshowBarEl`, `#playBtn`, `#playLabel`, `#zoomBtn`, `#shutterFlashEl`
- `#transitionCoordinator`, `#cursorLoupe`
- `#images` (`PhotoAsset[]`), `#currentIndex` (`number`), `#isZoomed` (`boolean`), `#slideshowInterval` (`number | null`), `#lastFocusedElement` (`Element | null`), `#activeSourceFigure` (`Element | null`)
- Public interface:
  - `get isOpen(): boolean`
  - `open(images: PhotoAsset[], index: number, sourceFigure?: HTMLElement | null): void`
  - `close(): void`
  - `navigate(dir: 1 | -1): void`
  - `toggleZoom(): void`
  - `toggleSlideshow(): void`
  - `startSlideshow(): void`
  - `stopSlideshow(): void`

#### State Transitions
- **Open Viewer (`open`)**: Populates `#imgEl`, `#titleEl`, `#plateNoEl`, `#counterEl`, `#catBadgeEl`, `#exifEl`, and `#filmstripEl`; displays `#lightbox.open` with `#lightbox-frame-wrap` permanently styled as the archival Museum Mat (`#faf8f5` frame + `EYSI CLICKS · ARCHIVAL PLATE` imprint).
- **Keyboard Events (`keydown` when `isOpen === true`)**:
  - `ArrowLeft` / `ArrowRight`: Calls `navigate(-1)` / `navigate(1)`.
  - `p` / `P`: Calls `toggleSlideshow()`.
  - `z` / `Z`: Calls `toggleZoom()`.
  - `Escape`: Resets zoom if `#isZoomed === true`, otherwise calls `close()`.
  - `Tab`: Traps focus within focusable Lightbox buttons (`#lb-play-btn`, `#lb-zoom-btn`, `.lightbox-close`, `.lightbox-prev`, `.lightbox-next`, and `.filmstrip-thumb` buttons).
  - `m` / `M`: No-op (handler removed).
