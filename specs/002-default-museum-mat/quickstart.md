# Quickstart & Validation Guide: Default Museum Mat & Legend-Free Photo Viewer

**Feature**: `002-default-museum-mat`  
**Date**: 2026-11-03

## Prerequisites

- Node.js (`v20+`)
- Google Chrome installed locally (for Headless Chrome CDP E2E tests)

## Validation Scenarios

1. **Syntax & Static DOM Contract Check**:
   - Run `node --check app.js` to confirm zero syntax errors.
   - Verify every `document.getElementById(...)` call in `app.js` matches an existing `id` in `index.html`.

2. **Permanent Museum Mat Verification**:
   - Open any photograph from `#gallery` or `.hero-floating-frames`.
   - Confirm `#lightbox-frame-wrap` immediately has computed `backgroundColor === 'rgb(250, 248, 245)'` (`#faf8f5`) and non-zero padding without clicking any toolbar button.
   - Confirm `document.getElementById('lb-mat-btn')` is `null`.
   - Dispatch `keydown` with `key: 'm'` and `key: 'M'` and confirm `#lightbox-frame-wrap` retains its Museum Mat styling.

3. **Absence of Bottom Keyboard Legends**:
   - Confirm `document.querySelector('.lightbox-hints')` is `null` and zero `.hint-key` elements exist in `#lightbox`.

4. **Automated Test Execution**:
   ```bash
   node --check app.js && node --test "/Users/manalili/.gemini/antigravity/brain/1a6fac08-d52a-4e5c-9965-ebc6bfa23e94/scratch/unit.test.js" "/Users/manalili/.gemini/antigravity/brain/1a6fac08-d52a-4e5c-9965-ebc6bfa23e94/scratch/e2e.test.js"
   ```
   - Expected outcome: 100% of unit and real-browser E2E tests pass with `0` failures and `0` console/page errors.
