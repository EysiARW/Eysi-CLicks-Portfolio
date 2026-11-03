# UI Contract: Lightbox Photo Viewer (`#lightbox`)

**Feature**: `002-default-museum-mat`  
**Date**: 2026-11-03

## 1. DOM Structure Contract (`index.html`)

### Must Exist in `#lightbox`
- `.lightbox-topbar`:
  - `.lightbox-meta-left` containing `#lightbox-cat-badge` and `#lightbox-exif`
  - `.lightbox-toolbar` containing **only** three buttons:
    1. `button#lb-play-btn.lb-tool-btn` (`Slideshow` / `Pause`)
    2. `button#lb-zoom-btn.lb-tool-btn` (`Zoom`)
    3. `button.lightbox-close` (`Close`)
- `.lightbox-stage`:
  - `div#lightbox-frame-wrap.lightbox-frame-wrap` wrapping `img#lightbox-img.lightbox-img` and `div#lightbox-slideshow-bar.lightbox-slideshow-bar`
  - `div#lightbox-caption.lightbox-caption` (`#lightbox-plate-no`, `#lightbox-title`, `#lightbox-counter`)
  - `div#lightbox-filmstrip.lightbox-filmstrip`
- Navigation buttons: `button.lightbox-prev` and `button.lightbox-next`

### Must NOT Exist in `#lightbox`
- `button#lb-mat-btn` (Museum Mat toggle button)
- `div.lightbox-hints` / `.hint-key` / `.hint-sep` (bottom keyboard shortcut legends)

## 2. Visual & Computed Style Contract (`styles.css`)

- `#lightbox-frame-wrap`:
  - Always renders with `background-color: rgb(250, 248, 245)` (`#faf8f5`), non-zero passe-partout padding (`clamp(14px, 2.5vw, 32px)` horizontal/top and `clamp(26px, 3.5vw, 46px)` bottom), and `::after` pseudo-element content `'EYSI CLICKS · ARCHIVAL PLATE'`.
- `#lightbox-img`:
  - Constrained to `max-height: 58dvh` (desktop/tablet) so the permanent Museum Mat frame, caption pill, and thumbnail filmstrip fit comfortably within the viewport without vertical clipping.

## 3. Behavioral Contract (`app.js`)

- `LightboxController.prototype.toggleMuseumMat` MUST be `undefined`.
- Pressing `m` or `M` while `#lightbox` is open MUST NOT change the computed background or padding of `#lightbox-frame-wrap`.
- Static ID references in `app.js` (`document.getElementById(...)`) MUST remain 100% synchronized with `id="..."` attributes in `index.html`.
