# Quickstart & Validation Guide: Contact Sheet Only Archive & Filter Removal

**Feature**: `001-contact-sheet-archive`
**Date**: 2026-11-03

## Prerequisites

- Node.js `v26+` (for `node:test` and syntax checks)
- Google Chrome installed at `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome` (for Headless CDP E2E tests)

## Validation Scenarios

1. **Syntax & Static DOM Binding Verification**:
   ```bash
   node --check app.js
   ```
   - Expected: Exits with code `0` and zero missing DOM ID references.

2. **Unit Test Suite Execution**:
   ```bash
   node --test "/Users/manalili/.gemini/antigravity/brain/1a6fac08-d52a-4e5c-9965-ebc6bfa23e94/scratch/unit.test.js"
   ```
   - Expected: All unit suites pass (`PhotoAsset`, `PortfolioRepository`, `ViewTransitionCoordinator`, `ThemeManager`, `LightboxController`, and `GalleryPresenter` Contact Sheet rendering).

3. **Real-Browser Headless Chrome E2E / UI Verification**:
   ```bash
   node --test "/Users/manalili/.gemini/antigravity/brain/1a6fac08-d52a-4e5c-9965-ebc6bfa23e94/scratch/e2e.test.js"
   ```
   - Expected:
     - `.view-toggle`, `#series-filter-bar`, and `#archive-status-readout` are absent (`count === 0`).
     - `#grid-predebut`, `#grid-events`, and `#grid-institutional` render all plates directly in the Contact Sheet proof layout (`5` Pre-Debut Portrait, `3` Pre-Debut Landscape, `10` Events Landscape, `8` Institutional Landscape).
     - Clicking any Contact Sheet proof opens the Lightbox with the full collection sequence.
     - Zero console errors, zero page exceptions, and zero horizontal overflow at `375px` and `1440px`.
