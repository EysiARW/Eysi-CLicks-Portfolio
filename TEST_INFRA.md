# EYSI CLICKS — Opaque-Box E2E Test Suite Infrastructure & Architecture

**Document Version:** 1.0.0  
**Target Project:** EysiClicks Freelance Photography Portfolio (`EysiClicks-portfolio-2026.great-site.net`)  
**Test Suite Path:** `tests/`, `test-runner.js`  
**Test Author:** `test_writer_m3`  
**Status:** READY FOR VERIFICATION  

---

## 1. Test Philosophy & Design Principles

The testing architecture for the EYSI CLICKS portfolio elevation project adheres to strict **opaque-box end-to-end (E2E) testing principles**:

1. **Radical Specification Fidelity (Zero Cheating, Zero Facades)**:
   Tests are written exclusively against the documented requirements in `ORIGINAL_REQUEST.md`, `PROJECT.md`, and the Curatorial Benchmarks established by `explorer_survey_1` and `explorer_survey_3`. No test is authored to pass merely to satisfy an unfinished implementation.
2. **Progressive Testability & Dual-Track Independence**:
   The test track (Milestone 3) was developed in parallel with the implementation tracks (Milestones 1 & 2). Tests assert the full contract; where implementation has not yet landed (e.g. Lightbox FSM state transitions, URL hash synchronization, WCAG color contrast token adjustments), the test runner faithfully detects and reports failures.
3. **Zero External Network Dependencies**:
   Tests run in any Node.js environment (v18+) without requiring third-party npm packages, headless browsers, or internet connectivity. The test suite employs an in-memory lightweight DOM parser and state simulator (`tests/harness.js`) supporting DOM elements, classList, attributes, event dispatch, focus tracking, and mathematical relative luminance calculations.
4. **Adversarial & Boundary Verification**:
   Edge cases are rigorously exercised: rapid navigation across cyclical list boundaries, single-photo collections, out-of-bounds indices, keyboard focus trapping, and defensive image failure recovery.

---

## 2. Directory Layout & Architecture

```
.
├── test-runner.js                  # Master CLI test runner (exit 0 on pass, exit 1 on fail)
├── TEST_INFRA.md                   # Test framework architecture & coverage matrix (this file)
├── TEST_READY.md                   # Milestone completion signal & feature checklist
└── tests/
    ├── harness.js                  # Pure Node.js DOM parser, CSS parser & WCAG calculator
    ├── test_tier1_features.js      # Tier 1: Feature Coverage (27 tests)
    ├── test_tier2_boundaries.js    # Tier 2: Boundary & Corner Cases (27 tests)
    ├── test_tier3_combinations.js  # Tier 3: Cross-Feature Interactions (20 tests)
    └── test_tier4_acceptance.js    # Tier 4: Real-World Acceptance Scenarios (21 tests)
```

---

## 3. Runner Invocation & CLI Usage

### Basic Execution
Execute the entire test suite across all 4 tiers:
```bash
node test-runner.js
```

### Targeted Tier Execution
Run a specific tier in isolation:
```bash
node test-runner.js --tier=1   # Feature Coverage only
node test-runner.js --tier=2   # Boundary & Corner Cases only
node test-runner.js --tier=3   # Cross-Feature Interactions only
node test-runner.js --tier=4   # Real-World Acceptance & Audits only
```

### Options & Flags
- `--quiet` or `-q`: Suppress individual test assertion lines and print the summary ledger only.
- `--bail`: Terminate test execution immediately upon encountering the first failed tier.

---

## 4. Feature Inventory & Coverage Matrix

Every feature from `PROJECT.md § Feature Inventory` is mapped to its automated verification tier:

| Feature # | Feature Name | Target Scope | Test File | Test Count | Current Status |
|:---:|:---|:---|:---|:---:|:---:|
| **1** | Portfolio Benchmarks & Anti-Pattern Taxonomy | Visual & code standards | `tests/test_tier4_acceptance.js` | 6 | Evaluated |
| **2** | Telemetry & HUD Chrome Deconstruction | Elimination of viewfinders, GPS, clock | `tests/test_tier4_acceptance.js` | 3 | Evaluated (Clock in app.js pending) |
| **3** | Hero Section Transformation | Removal of floating card clutter | `tests/test_tier4_acceptance.js` | 1 | PASS (Deconstructed by M1) |
| **4** | Gallery CSS Grid & Aspect Harmony | CSS Grid, responsive proof spread | `tests/test_tier1_features.js`, `tests/test_tier2_boundaries.js` | 4 | PASS |
| **5** | Museum Matting & Framing Refinement | Passe-partout padding & borders | `tests/test_tier1_features.js` | 5 | PASS |
| **6** | Typographic System Consolidation | $\le 2$ distinct font families | `tests/test_tier4_acceptance.js` | 1 | Evaluated (3 families pending consolidation) |
| **7** | Philosophy Section De-SaaS-ification | Curatorial statement presentation | `tests/test_tier4_acceptance.js` | 1 | PASS |
| **8** | WCAG 2.2 AA Color Contrast Remediation | Contrast ratio $\ge 4.5:1$ across themes | `tests/test_tier4_acceptance.js` | 5 | Evaluated (Tokens pending M2) |
| **9** | HTML Semantic & ARIA Remediation | Valid `tablist`/`tab`, `aria-live` | `tests/test_tier4_acceptance.js` | 5 | Evaluated (Filmstrip tabs & live region pending M2) |
| **10** | Core Web Vitals & Image Optimization | Lazy loading, async decoding, fallbacks | `tests/test_tier2_boundaries.js` | 5 | PASS |
| **11** | Inline Event Purge & Modular Encapsulation | Zero `onclick="..."` handlers | `tests/test_tier4_acceptance.js` | 1 | Evaluated (3 handlers pending M2) |
| **12** | Lightbox FSM & URL Hash Sync | 4-state FSM, `#photo-...` history sync | `tests/test_tier3_combinations.js` | 10 | Evaluated (FSM & Hash pending M2) |
| **13** | Scrollspy IntersectionObserver Upgrade | Non-blocking viewport scrollspy | `tests/test_tier1_features.js` | 2 | PASS |
| **14** | E2E Test Infrastructure & Runner | Standalone Node.js test harness | `test-runner.js`, `tests/harness.js` | Meta | PASS |
| **15** | Tier 1 Feature Coverage Tests | $\ge 5$ tests per feature | `tests/test_tier1_features.js` | 27 | PASS (100%) |
| **16** | Tier 2 Boundary & Corner Tests | Edge cases, wrap, keyboard, orientation | `tests/test_tier2_boundaries.js` | 27 | 26 PASS / 1 FAIL |
| **17** | Tier 3 Cross-Feature Interaction Tests | State clash, persistence, focus trap | `tests/test_tier3_combinations.js` | 20 | 14 PASS / 6 FAIL |
| **18** | Tier 4 Real-World Acceptance Scenarios | End-to-end journey, audits, anti-patterns | `tests/test_tier4_acceptance.js` | 21 | 14 PASS / 7 FAIL |

---

## 5. Tier Breakdown & Test Specifications

### Tier 1: Feature Coverage (27 Tests)
- **Category Tabs (6 tests)**:
  - Tab existence for 'predebut', 'events', 'institutional'.
  - ARIA attributes: `role="tablist"`, `role="tab"`, `aria-selected`, `aria-controls`.
  - Zero-padded count badge formatting matching repository totals.
  - Active class and `aria-selected` toggling on switch.
  - Panel display synchronization (`.cat-panel.active`).
  - URL query parameter sync (`?tab=...`).
- **Photo Metadata & Contact Sheet Proof Layout (5 tests)**:
  - `PhotoAsset` metadata normalization (src, webpSrc, caption, optical profile).
  - `PortfolioRepository` grouping without asset omission.
  - Proof cards rendered as semantic `<figure class="photo-item">`.
  - Museum plaque element rendering plate number and title.
  - Orientation layout grid class toggling (`orient-landscape`).
- **Museum Matting & Optical Padding (5 tests)**:
  - Lightbox frame wrap element exists for passe-partout framing.
  - Surface mat design tokens (`--surface-mat`: `#f4f1eb` light / `#1c1c20` dark).
  - Stylesheet declarations for matting, borders, and bevel simulation.
  - Figcaption plaque layout positioned beneath matted plate.
  - Image contained securely within frame wrap without overflow.
- **Theme Switching Mechanics (6 tests)**:
  - Toggle button existence with accessible `aria-label`.
  - Default initialization in archival daylight mode.
  - Clicking toggle flips `data-theme` between `light` and `dark`.
  - Label text and `aria-label` update dynamically ('Darkroom' / 'Daylight').
  - Persistence in `localStorage['eysiclicks-theme']`.
  - `<meta name="theme-color">` updates dynamically (`#faf8f5` vs `#0a0a0b`).
- **Lightbox Modal Markup & Controls (5 tests)**:
  - Dialog container with `role="dialog"`, `aria-modal="true"`, `aria-label`.
  - Accessible close button.
  - Navigation buttons (`.lightbox-prev`, `.lightbox-next`) with `aria-label`.
  - Exhibition toolbar buttons for zoom and slideshow with `aria-pressed`.
  - Stage hierarchy: image element, caption strip, and filmstrip container.

### Tier 2: Boundary & Corner Cases (27 Tests)
- **Wrap & Clamp Boundaries (6 tests)**:
  - Step backward from index 0 wraps to last photo.
  - Step forward from last index wraps to index 0.
  - Multiple rapid cyclical navigations retain valid zero-padded bounds.
  - Single-photo array handles wrap gracefully without NaN.
  - Out-of-bounds indices in `open()` clamp safely to `[0, length - 1]`.
  - Empty photo list calls execute without unhandled exceptions.
- **Keyboard Navigation (6 tests)**:
  - `Escape` key closes open modal.
  - `Escape` key first resets zoom to 1x before closing if zoomed.
  - `ArrowRight` key navigates to next photo.
  - `ArrowLeft` key navigates to previous photo.
  - Keys are inert when modal is closed.
  - Shortcut keys 'Z' (zoom) and 'P' (slideshow) toggle modes.
- **Empty Orientation States (5 tests)**:
  - Requesting orientation with zero photos returns empty array safely.
  - `GalleryPresenter` automatically falls back to valid orientation.
  - Orientation buttons reflect `aria-pressed` states.
  - Orientation count badges display accurate item counts per tab.
  - Orientation switching preserves category active state.
- **Responsive Breakpoints (5 tests)**:
  - Mobile breakpoint media query declared (`max-width: 640px` or `768px`).
  - Tablet/intermediate breakpoint declared (between `760px` and `1080px`).
  - Reduced motion media query declared (`prefers-reduced-motion: reduce`).
  - Fluid typography uses at least 3 `clamp(...)` rules.
  - Responsive column adjustments defined for `.photo-grid`.
- **Image Fallback Handling (5 tests)**:
  - Proof card `onerror` handler updates alt text defensively.
  - Filmstrip thumbnail `onerror` handler falls back to original JPEG if WebP fails.
  - Grid images declare `decoding="async"`.
  - Grid images declare `loading="lazy"`.
  - `PhotoAsset` constructor handles null/empty entries defensively.

### Tier 3: Cross-Feature Interactions (20 Tests)
- **Zoom + Slideshow Conflicts (5 tests)**:
  - Starting slideshow while zoomed in resets zoom to 1x.
  - Toggling zoom while slideshow is running terminates slideshow.
  - Navigating while zoomed resets zoom to 1x.
  - Closing lightbox cancels active slideshow timer and resets zoom.
  - Rapid alternating toggles do not leak orphaned timers.
- **Category Filter Persistence with Theme Toggles (5 tests)**:
  - Active category filter persists after toggling theme to dark.
  - Category panel remains visible and populated across theme cycles.
  - Orientation mode persists across theme changes.
  - Count badges remain intact across theme changes.
  - Theme button maintains its own state without disrupting gallery presenter.
- **URL Hash Synchronization (5 tests)**:
  - Opening photo updates URL hash to `#photo-...`.
  - Navigating to next photo updates URL hash.
  - Closing lightbox removes photo URL hash.
  - Clicking filmstrip thumbnail synchronizes URL hash.
  - Browser `hashchange` event handled gracefully.
- **Modal Focus Trapping & Return (5 tests)**:
  - Opening lightbox stores originating `activeElement`.
  - Opening lightbox shifts focus to close button.
  - Closing lightbox restores focus to originating element.
  - Tab key on last button wraps focus to first button.
  - Shift+Tab on first button wraps focus to last button.

### Tier 4: Real-World Acceptance Scenarios (21 Tests)
- **Complete User Journey (5 tests)**:
  - Step 1: Initial load in daylight theme with valid landmarks.
  - Step 2: Gallery navigation and category filtering.
  - Step 3: Photo inspection in lightbox.
  - Step 4: Zoom inspection and forward navigation.
  - Step 5: In-viewer theme toggle, modal dismissal, and return-of-focus.
- **Automated WCAG 2.2 AA Color Contrast Audit (5 tests)**:
  - Daylight primary text (`--text`) vs `--bg` ($\ge 4.5:1$).
  - Daylight muted text (`--text-muted`) vs `--bg` ($\ge 4.5:1$).
  - Daylight subtle text (`--text-subtle`) vs `--bg` ($\ge 4.5:1$).
  - Darkroom primary text (`--text`) vs `--bg` ($\ge 4.5:1$).
  - Darkroom subtle text (`--text-subtle`) vs `--bg` ($\ge 4.5:1$).
- **Automated Semantic ARIA Audit (5 tests)**:
  - `role="tablist"` elements require children with `role="tab"`.
  - Polite `aria-live` announcement region presence.
  - Lightbox dialog specifies `role="dialog"`, `aria-modal="true"`, and label.
  - All interactive buttons declare accessible names.
  - Document landmark structure (`<nav>`, `<main>`, `<footer>`).
- **Automated Anti-Pattern Check (6 tests)**:
  - Zero corner viewfinder telemetry overlays (`.vf-tl`, `35MM · f/1.4`, GPS).
  - Zero sparkle unicode glyphs (`✦`, `✨`, `🪄`).
  - Zero live clock or digital GPS widgets.
  - Zero inline `onclick` handlers in HTML markup.
  - Zero tilted miniature floating cards in hero section.
  - Typographic consolidation to $\le 2$ distinct primary font families.
