# Handoff Report: Adversarial Accessibility, Performance & Typography Verification

**Agent Identity:** `challenger_2` (Empirical Challenger)  
**Milestone:** M4 (Final Integration & Adversarial Verification)  
**Date:** 2026-11-03T02:16:00Z  
**Verdict:** **REQUEST_CHANGES**  

---

## 1. Observation

### 1.1 Baseline Test Runner Execution
Executing `node test-runner.js` against the codebase:
```
$ node test-runner.js
═══════════════════════════════════════════════════════════════════════════════
  EYSI CLICKS — Opaque-Box Automated E2E Test Suite
  Museum Monograph Architecture & Dual-Track Verification Runner
═══════════════════════════════════════════════════════════════════════════════

[PASS] Tier 1: Feature Coverage (27/27 passed, 61ms)
[PASS] Tier 2: Boundary & Corner Cases (27/27 passed, 70ms)
[PASS] Tier 3: Cross-Feature Interactions (20/20 passed, 66ms)
[PASS] Tier 4: Real-World Acceptance Scenarios (21/21 passed, 20ms)

───────────────────────────────────────────────────────────────────────────────
  TEST SUITE EXECUTION SUMMARY
───────────────────────────────────────────────────────────────────────────────
  Tier Name                                        Total    Pass    Fail     Time
  ────────────────────────────────────────────── ─────── ─────── ─────── ────────
  Tier 1: Feature Coverage                            27      27       0     61ms
  Tier 2: Boundary & Corner Cases                     27      27       0     70ms
  Tier 3: Cross-Feature Interactions                  20      20       0     66ms
  Tier 4: Real-World Acceptance Scenarios             21      21       0     20ms
  ────────────────────────────────────────────── ─────── ─────── ─────── ────────
  TOTAL                                               95      95       0    226ms
───────────────────────────────────────────────────────────────────────────────

  OVERALL RESULT: ALL TESTS PASSED (95/95 tests)
```

### 1.2 Adversarial Verification Script Execution
Authored and executed `.agents/teamwork/challenger_2/a11y_perf_stress_test.js`:
```
$ node .agents/teamwork/challenger_2/a11y_perf_stress_test.js
======================================================================
  Adversarial Stress Test: A11y, Performance, Typography
======================================================================

  ✓ [PASS] WCAGContrast [Light]: --text against --bg >= 4.5:1 (0ms)
  ✓ [PASS] WCAGContrast [Light]: --text against --bg2 >= 4.5:1 (0ms)
  ✓ [PASS] WCAGContrast [Light]: --text against --surface >= 4.5:1 (0ms)
  ✓ [PASS] WCAGContrast [Light]: --text against --surface-mat >= 4.5:1 (0ms)
  ✓ [PASS] WCAGContrast [Light]: --text-muted against --bg >= 4.5:1 (0ms)
  ✓ [PASS] WCAGContrast [Light]: --text-muted against --bg2 >= 4.5:1 (0ms)
  ✓ [PASS] WCAGContrast [Light]: --text-muted against --surface >= 4.5:1 (0ms)
  ✓ [PASS] WCAGContrast [Light]: --text-muted against --surface-mat >= 4.5:1 (0ms)
  ✓ [PASS] WCAGContrast [Light]: --text-subtle against --bg >= 4.5:1 (0ms)
  ✓ [PASS] WCAGContrast [Light]: --text-subtle against --bg2 >= 4.5:1 (0ms)
  ✓ [PASS] WCAGContrast [Light]: --text-subtle against --surface >= 4.5:1 (0ms)
  ✓ [PASS] WCAGContrast [Light]: --text-subtle against --surface-mat >= 4.5:1 (0ms)
  ✓ [PASS] WCAGContrast [Dark]: --text against --bg >= 4.5:1 (0ms)
  ✓ [PASS] WCAGContrast [Dark]: --text against --bg2 >= 4.5:1 (0ms)
  ✓ [PASS] WCAGContrast [Dark]: --text against --surface >= 4.5:1 (0ms)
  ✓ [PASS] WCAGContrast [Dark]: --text against --surface-mat >= 4.5:1 (0ms)
  ✓ [PASS] WCAGContrast [Dark]: --text-muted against --bg >= 4.5:1 (0ms)
  ✓ [PASS] WCAGContrast [Dark]: --text-muted against --bg2 >= 4.5:1 (0ms)
  ✓ [PASS] WCAGContrast [Dark]: --text-muted against --surface >= 4.5:1 (0ms)
  ✓ [PASS] WCAGContrast [Dark]: --text-muted against --surface-mat >= 4.5:1 (0ms)
  ✓ [PASS] WCAGContrast [Dark]: --text-subtle against --bg >= 4.5:1 (0ms)
  ✓ [PASS] WCAGContrast [Dark]: --text-subtle against --bg2 >= 4.5:1 (0ms)
  ✓ [PASS] WCAGContrast [Dark]: --text-subtle against --surface >= 4.5:1 (0ms)
  ✓ [PASS] WCAGContrast [Dark]: --text-subtle against --surface-mat >= 4.5:1 (0ms)
  ✓ [PASS] WCAGContrast [Accent]: --accent-bronze evaluates relative to 3.0:1 UI/large text threshold (0ms)
  ✓ [PASS] ImageAudit: Document contains images to audit (0ms)
  ✗ [FAIL] ImageAudit: Image .nav-logo-img has explicit width and height attributes (0ms)
      Error: Image .nav-logo-img (eysi clicks (1).png) is missing explicit "width" attribute (causes layout shifts/CLS)
  ✗ [FAIL] ImageAudit: Image .nav-logo-img specifies decoding="async" for non-blocking main thread (0ms)
      Error: Image .nav-logo-img (eysi clicks (1).png) must specify decoding="async" for optimal CWV — Expected: "async", Actual: null
  ✗ [FAIL] ImageAudit: Image .hero-logo has explicit width and height attributes (0ms)
      Error: Image .hero-logo (eysi clicks (1).png) is missing explicit "width" attribute (causes layout shifts/CLS)
  ✓ [PASS] ImageAudit: Image .hero-logo specifies decoding="async" for non-blocking main thread (0ms)
  ✓ [PASS] ImageAudit: Image predebut/portrait/EYSI-2-22.jpg has explicit width and height attributes (0ms)
  ✓ [PASS] ImageAudit: Image predebut/portrait/EYSI-2-22.jpg specifies decoding="async" for non-blocking main thread (0ms)
  ✓ [PASS] ImageAudit: Image EYSI-3-15.jpg has explicit width and height attributes (0ms)
  ✓ [PASS] ImageAudit: Image EYSI-3-15.jpg specifies decoding="async" for non-blocking main thread (0ms)
  ✗ [FAIL] ImageAudit: Image #lightbox-img has explicit width and height attributes (0ms)
      Error: Image #lightbox-img (EYSI-3-15.jpg) is missing explicit "width" attribute (causes layout shifts/CLS)
  ✗ [FAIL] ImageAudit: Image #lightbox-img specifies decoding="async" for non-blocking main thread (0ms)
      Error: Image #lightbox-img (EYSI-3-15.jpg) must specify decoding="async" for optimal CWV — Expected: "async", Actual: null
  ✗ [FAIL] ImageAudit: Image EYSI-3-15.webp has explicit width and height attributes (0ms)
      Error: Image EYSI-3-15.webp (EYSI-3-15.webp) is missing explicit "width" attribute (causes layout shifts/CLS)
  ✗ [FAIL] ImageAudit: Image EYSI-3-15.webp specifies decoding="async" for non-blocking main thread (0ms)
      Error: Image EYSI-3-15.webp (EYSI-3-15.webp) must specify decoding="async" for optimal CWV — Expected: "async", Actual: null
  ✓ [PASS] ImageAudit: Hero monument image is loaded eagerly without loading="lazy" (0ms)
  ✓ [PASS] ImageAudit: Hero monument image specifies fetchpriority="high" (1ms)
  ✓ [PASS] ImageAudit: Below-the-fold about portrait image specifies loading="lazy" (0ms)
  ✓ [PASS] FontAudit: @font-face blocks are present for local typefaces (0ms)
  ✓ [PASS] FontAudit: @font-face declarations do NOT load obsolete font "Dreamer" (0ms)
  ✗ [FAIL] FontAudit: @font-face declarations do NOT load obsolete font "Tropikal" (0ms)
      Error: Obsolete font "Tropikal" is declared in @font-face:
font-family: 'Tropikal';
  src: url('fonts/Tropikal.otf') format('opentype');
  font-weight: 700;
  font-style: normal;
  font-display: swap;
  ✓ [PASS] FontAudit: All declared @font-face rules specify font-display: swap (0ms)
  ✓ [PASS] FontAudit: Local font asset files referenced in @font-face exist on disk (0ms)
  ✓ [PASS] ARIAContract: Document contains at least one role="tablist" container (0ms)
  ✓ [PASS] ARIAContract: Container .cat-tabs contains valid role="tab" children (0ms)
  ✓ [PASS] ARIAContract: Container .cat-tabs has valid aria-selected bindings on tabs (0ms)
  ✓ [PASS] ARIAContract: Container #lightbox-filmstrip contains valid role="tab" children (0ms)
  ✓ [PASS] ARIAContract: Container #lightbox-filmstrip has valid aria-selected bindings on tabs (0ms)
  ✓ [PASS] ARIAContract: Dynamic tab switching updates aria-selected attributes in GalleryPresenter (9ms)
  ✓ [PASS] ARIAContract: Lightbox filmstrip tab updates aria-selected on photo navigation (4ms)

──────────────────────────────────────────────────────────────────────
  Summary: Passed: 45, Failed: 8, Total: 53
──────────────────────────────────────────────────────────────────────
```

### 1.3 Verbatim Code Inspection of Discovered Defects

#### Defect 1: Obsolete Font "Tropikal" Still Declared in `@font-face`
In `styles.css` lines 21–27:
```css
@font-face {
  font-family: 'Tropikal';
  src: url('fonts/Tropikal.otf') format('opentype');
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}
```
*Direct observation:* While `--font-tropikal` was removed from `:root`, the `@font-face` block loading `fonts/Tropikal.otf` was left active in `styles.css`, causing redundant font downloads and violating the curatorial 2-family consolidation rule (`EB Garamond` display + `TT Interphases` UI).

#### Defect 2: Navigation Logo Missing Dimensions & `decoding="async"`
In `index.html` line 76:
```html
<img src="eysi clicks (1).png" alt="EYSI CLICKS" class="nav-logo-img">
```
*Direct observation:* The element has no `width`, `height`, or `decoding="async"` attributes. The file on disk has intrinsic dimensions 800×800.

#### Defect 3: Hero Logo Missing Dimensions
In `index.html` line 117:
```html
<img src="eysi clicks (1).png" alt="EYSI CLICKS logo" class="hero-logo" fetchpriority="high" decoding="async">
```
*Direct observation:* The element has `fetchpriority="high"` and `decoding="async"`, but lacks explicit `width` and `height` attributes (CSS declares 92px / 108px responsive width, but missing HTML aspect ratio attributes causes layout shifts before CSS loads).

#### Defect 4: Lightbox Modal Main Image Missing Dimensions & `decoding="async"`
In `index.html` line 418:
```html
<img class="lightbox-img" id="lightbox-img" src="EYSI-3-15.jpg" alt="Portfolio photo" title="Click to zoom / inspect detail">
```
*Direct observation:* Missing explicit `width`, `height`, and `decoding="async"` attributes.

#### Defect 5: Lightbox Filmstrip Initial Thumbnail Missing Dimensions & `decoding="async"`
In `index.html` line 432:
```html
<img src="EYSI-3-15.webp" alt="Plate 01 preview">
```
*Direct observation:* Missing explicit `width`, `height`, and `decoding="async"` attributes.

---

## 2. Logic Chain

1. **Accessibility (WCAG 2.2 AA Contrast)**:
   - Calculation of relative luminance $L = 0.2126 \times R + 0.7152 \times G + 0.0722 \times B$ with alpha blending over backgrounds:
     - Daylight `--text-subtle` (`rgba(17,17,17, 0.60)`) on `--bg` (`#faf8f5`) measures **4.85:1** (exceeds 4.5:1).
     - Daylight `--text-subtle` on `--bg2` (`#f2efe9`) measures **4.68:1** (exceeds 4.5:1).
     - Daylight `--text-subtle` on `--surface-mat` (`#f4f1eb`) measures **4.74:1** (exceeds 4.5:1).
     - Darkroom `--text-subtle` (`rgba(244,241,234, 0.52)`) on `--bg` (`#0a0a0b`) measures **5.24:1** (exceeds 4.5:1).
     - Darkroom `--text-subtle` on `--surface-mat` (`#1c1c20`) measures **4.88:1** (exceeds 4.5:1).
     - All 24 foreground/background text combinations pass the WCAG 2.2 AA threshold $\ge 4.5:1$.
   - **Conclusion on A11y**: Color contrast remediation in Feature 8 is sound and fully compliant.

2. **ARIA Semantic Contracts**:
   - Both `.cat-tabs` (line 251) and `#lightbox-filmstrip` (line 430) declare `role="tablist"` and contain `role="tab"` buttons.
   - Initial states define single `aria-selected="true"` with remaining tabs `aria-selected="false"`.
   - Dynamic tests confirm `GalleryPresenter.switchTab()` and `LightboxController.navigate()` properly toggle `aria-selected` attributes without orphan or stale selections.
   - **Conclusion on ARIA**: ARIA contracts conform to WCAG 2.2 AA and WAI-ARIA tab pattern.

3. **Typography & Font Optimization**:
   - `PROJECT.md` Feature 6 specifies: "Unify to a strict 2-family pairing (`EB Garamond` display + `TT Interphases` UI)".
   - The test in `test_tier4_acceptance.js` checked only CSS custom properties in `:root` (`--font-*`), allowing `styles.css:21-27` to evade detection.
   - Lines 21–27 of `styles.css` actively load `fonts/Tropikal.otf` via `@font-face`.
   - **Conclusion on Typography**: Loading `Tropikal` is an obsolete asset leak that must be removed.

4. **Performance & Core Web Vitals (CLS & LCP)**:
   - Modern CWV standards require explicit `width` and `height` attributes on all image elements to establish intrinsic aspect ratio and allocate layout boxes prior to resource fetch, eliminating Cumulative Layout Shift (CLS).
   - In `index.html`, 4 image tags lack explicit `width` and `height` attributes (nav logo, hero logo, lightbox img, filmstrip img).
   - 3 image tags lack `decoding="async"`, allowing image decode operations to block the main UI thread.
   - Above-the-fold hero content (`.hero-monument img`) is properly configured with `fetchpriority="high"` and no `loading="lazy"`.
   - **Conclusion on Performance**: Image attribute coverage in static markup is incomplete and requires remediation.

---

## 3. Caveats

1. **Headless Browser Rendering**:
   - Testing was performed using Node.js DOM simulation environment (`createDOMEnvironment` / `loadAppEnvironment`). Real-world network throttling and GPU rasterization timings were not benchmarked.
2. **Dynamic Images**:
   - Dynamically generated images inside `#renderFilmstrip()` and `GalleryPresenter.renderCategory()` already specify `loading="lazy"` and `decoding="async"`; the defect is restricted to static elements in `index.html`.

---

## 4. Conclusion & Actionable Verdict

**VERDICT: REQUEST_CHANGES**

To achieve 100% pass on all adversarial tests and meet rigorous production standards, the implementation workers must apply the following specific changes:

### Required Remediation 1: Remove Obsolete `@font-face` for Tropikal
In `styles.css` lines 21–27:
- Delete the `@font-face` declaration for `'Tropikal'`.
- Retain only the `@font-face` declarations for `'TT Interphases'` (Regular, Medium, Bold) alongside Google Fonts `'EB Garamond'`.

### Required Remediation 2: Add Explicit Dimensions & `decoding="async"` to `index.html`
1. Line 76:
   ```html
   <img src="eysi clicks (1).png" alt="EYSI CLICKS" class="nav-logo-img" width="800" height="800" decoding="async">
   ```
2. Line 117:
   ```html
   <img src="eysi clicks (1).png" alt="EYSI CLICKS logo" class="hero-logo" fetchpriority="high" decoding="async" width="800" height="800">
   ```
3. Line 418:
   ```html
   <img class="lightbox-img" id="lightbox-img" src="EYSI-3-15.jpg" alt="Portfolio photo" title="Click to zoom / inspect detail" width="1600" height="1066" decoding="async">
   ```
4. Line 432:
   ```html
   <img src="EYSI-3-15.webp" alt="Plate 01 preview" width="64" height="48" decoding="async">
   ```

---

## 5. Verification Method

To independently verify after changes are applied:

1. Run the base test runner:
   ```bash
   node test-runner.js
   ```
   *Expected:* 95/95 tests PASS.

2. Run the adversarial verification suite:
   ```bash
   node .agents/teamwork/challenger_2/a11y_perf_stress_test.js
   ```
   *Expected:* 53/53 tests PASS (0 failures, exit code 0).

3. Invalidation condition:
   - Any failure in `a11y_perf_stress_test.js` or `test-runner.js` immediately invalidates approval.
