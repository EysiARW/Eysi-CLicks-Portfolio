# Project: EysiClicks Freelance Photography Portfolio Elevation

## Architecture
EysiClicks is a bespoke client-side fine-art and commercial photography portfolio website. The architectural model centers on a museum-grade exhibition experience where UI chrome defers entirely to photographic work.

### Core Modules & Responsibilities
1. **Curatorial Presentation Module (`index.html`, `styles.css`)**:
   - Hero exhibition monument with commanding single-plate visual focus and high-contrast editorial serif typography.
   - Transparent, non-intrusive navigation and curated chapter storytelling.
   - Contact sheet proof archive layout using native CSS Grid with mixed aspect-ratio harmony and optical bottom-weighted museum matting (passe-partout).
   - Strict 2-family typographic system (`EB Garamond` for editorial display; `TT Interphases` for UI utility) with zero micro-type (<10px).
   - Pure archival color palettes (Cotton Ivory `#faf8f5` / Gallery Linen `#f2efe9` daylight; Deep Obsidian `#0a0a0b` darkroom) with zero neon glow meshes or pseudo-telemetry.

2. **Client-Side State & Interaction Engine (`app.js`)**:
   - `GalleryPresenter`: Manages proof archive rendering, category filtering, and responsive layout without DOM recreation.
   - `LightboxController`: Robust 4-state Finite State Machine (`CLOSED`, `VIEWING`, `ZOOMED`, `SLIDESHOW`) with timer isolation, browser history/hash syncing (`#photo-...`), and smooth cinematic cross-fade transitions.
   - Modern event delegation architecture without inline `onclick` handlers or leaking global `window.*` bindings.
   - `IntersectionObserver` scrollspy eliminating synchronous layout thrashing.

3. **Accessibility & Core Web Vitals Optimization**:
   - Full compliance with WCAG 2.2 AA (color contrast ratios ≥ 4.5:1 across all themes).
   - Valid ARIA landmark and parent-child hierarchies (`role="tablist"` + `role="tab"`, polite `aria-live` announcement region).
   - LCP and CLS optimization: explicit `width` and `height` attributes on all images, above-the-fold images loaded eagerly with high fetchpriority.

4. **Opaque-Box E2E Testing Suite (`tests/`, `test-runner.js`)**:
   - Requirement-driven, opaque-box test runner validating all four tiers (Feature Coverage, Boundary & Corner, Pairwise Integration, Real-World Scenarios).
   - Validation of accessibility, state transitions, responsive behavior, and complete elimination of vibe-coded artifacts.

---

## Feature Inventory
Every feature from the Survey phase is mapped and assigned to an authoritative milestone:

| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| 1 | Portfolio Benchmarks & Anti-Pattern Taxonomy | Documentation of 10 Curatorial Benchmarks and 14-dimension comparison matrix | M1 | Survey (Explorer 1) |
| 2 | Telemetry & HUD Chrome Deconstruction | Complete removal of corner viewfinders, GPS coords, live digital clock, focal scale bar, nav HUD pill, trailing loupe cursor, and sparkle glyphs | M1 | Survey (Explorers 1 & 2) |
| 3 | Hero Section Transformation | Replace 4 tilted floating miniature cards with a commanding, full-aspect photographic hero monument and editorial headline hierarchy | M1 | Survey (Explorers 1 & 2) |
| 4 | Gallery CSS Grid Refactoring & Aspect Harmony | Replace brittle flexbox calc hack with modern CSS Grid, eliminate sparse orientation rows with an organic mixed-aspect proof spread | M1 | Survey (Explorers 2 & 3) |
| 5 | Museum Matting & Framing Refinement | Apply optical bottom weighting (passe-partout 10-15% taller bottom margin) and archival exhibition borders | M1 | Survey (Explorer 1) |
| 6 | Typographic System Consolidation | Unify to a strict 2-family pairing (`EB Garamond` display + `TT Interphases` UI) and eliminate sub-10px illegible micro-typography | M1 | Survey (Explorer 2) |
| 7 | Philosophy Section De-SaaS-ification | Replace 3-column metric counter ledger with an elegant editorial artist statement and curatorial narrative | M1 | Survey (Explorer 2) |
| 8 | WCAG 2.2 AA Color Contrast Remediation | Adjust secondary text tokens (`--text-subtle`, `--accent-bronze`) in light and dark modes to achieve ≥ 4.5:1 contrast | M2 | Survey (Explorer 3) |
| 9 | HTML Semantic & ARIA Remediation | Fix filmstrip `role="tablist"` / `role="tab"` structure, add `aria-live` polite region for photo announcements, ensure proper dialog semantics | M2 | Survey (Explorer 3) |
| 10 | Core Web Vitals & Image Asset Optimization | Add explicit `width`/`height` to images, eager-load hero assets, remove lazy loading above fold, add social share absolute URLs | M2 | Survey (Explorer 3) |
| 11 | Inline Event Purge & Modular Encapsulation | Remove inline `onclick` handlers, eliminate `window.*` globals, implement robust event delegation | M2 | Survey (Explorer 3) |
| 12 | Lightbox Finite State Machine & URL Hash Sync | Implement 4-state FSM (`CLOSED`, `VIEWING`, `ZOOMED`, `SLIDESHOW`), isolate zoom from timer, sync browser history/hash for Back button support | M2 | Survey (Explorer 3) |
| 13 | Scrollspy IntersectionObserver Upgrade | Replace synchronous `offsetTop` layout thrashing with efficient `IntersectionObserver` | M2 | Survey (Explorer 3) |
| 14 | E2E Test Infrastructure & Test Runner | Standalone test runner executing Tiers 1-4 opaque-box tests without external dependencies | M3 | Dual Track Architecture |
| 15 | Tier 1 Feature Coverage Tests | ≥5 tests per major feature (navigation, gallery, lightbox, matting, theme) | M3 | Dual Track Architecture |
| 16 | Tier 2 Boundary & Corner Tests | Edge cases: rapid clicking, keyboard trapping, Escape key, viewport resizing, extreme aspect ratios | M3 | Dual Track Architecture |
| 17 | Tier 3 Cross-Feature Interaction Tests | Lightbox + slideshow + hash navigation, filter persistence across theme switches | M3 | Dual Track Architecture |
| 18 | Tier 4 Real-World Acceptance Scenarios | Full user journey verification, automated WCAG contrast checks, vibe-coded pattern absence checks | M3 | Dual Track Architecture |
| 19 | 100% E2E Test Suite Pass | Implementation track verification against complete E2E test runner | M4 | Final Milestone Phase 1 |
| 20 | Adversarial Coverage Hardening (Tier 5) | Challenger-driven white-box stress testing, edge-case generation, and bug fixing | M4 | Final Milestone Phase 2 |
| 21 | Forensic Audit Verification | Teamwork forensic auditor verification confirming zero cheating, zero facade code, and genuine implementation | M4 | Final Milestone Gate |

---

## Milestones

| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M1 | Visual & Curatorial De-vibe-coding | Features 1–7: Visual design elevation, hero monument, HUD/telemetry removal, CSS Grid gallery, museum matting, typographic consolidation, editorial narrative | none | DONE |
| M2 | Code Quality, Architecture & Accessibility | Features 8–13: WCAG contrast remediation, ARIA & semantic fixes, image loading & dimensions, inline event elimination, Lightbox FSM & hash syncing, IntersectionObserver | M1 | DONE |
| M3 | E2E Testing Suite Track | Features 14–18: Independent opaque-box test runner, Tiers 1–4 automated tests, publish TEST_READY.md | none (parallel) | DONE |
| M4 | Final Integration, E2E Pass & Adversarial Hardening | Features 19–21: 100% E2E test pass, Tier 5 adversarial stress testing, Forensic Auditor verification | M1, M2, M3 | DONE |

---

## Interface Contracts

### Gallery ↔ Lightbox Contract
- `openPhoto(category, index)`:
  - Invoked when a gallery card or contact sheet thumbnail is selected.
  - Parameters: `category: 'all' | 'events' | 'predebut' | 'institutional'`, `index: number` (0-indexed within current filtered list).
  - Preconditions: Lightbox in `CLOSED` state.
  - Postconditions: Lightbox transitions to `VIEWING` state, updates URL hash to `#photo-<slug>`, updates `aria-live` region, and syncs filmstrip active tab.
- `closeLightbox()`:
  - Transitions state to `CLOSED`, clears any active timer/zoom, restores focus to the invoking card, removes or resets URL hash.

### Lightbox State Machine Contract
- States: `CLOSED` (0), `VIEWING` (1), `ZOOMED` (2), `SLIDESHOW` (3).
- State Transitions:
  - `OPEN(index)`: `CLOSED` &rarr; `VIEWING`
  - `CLOSE`: `VIEWING` | `ZOOMED` | `SLIDESHOW` &rarr; `CLOSED`
  - `TOGGLE_ZOOM`: `VIEWING` &rarr; `ZOOMED`; `ZOOMED` &rarr; `VIEWING`; if in `SLIDESHOW`, stops slideshow timer and transitions to `ZOOMED`.
  - `TOGGLE_SLIDESHOW`: `VIEWING` &rarr; `SLIDESHOW`; `SLIDESHOW` &rarr; `VIEWING`; `ZOOMED` &rarr; resets zoom and transitions to `SLIDESHOW`.
  - `NAVIGATE(dir)`:
    - In `VIEWING`: updates index, renders photo with cross-fade.
    - In `ZOOMED`: resets zoom to 1x, updates index, remains in `VIEWING`.
    - In `SLIDESHOW`: resets timer, updates index, remains in `SLIDESHOW`.

---

## Code Layout

### Production Codebase (Owned by Implementation Track)
- `index.html`: Semantic HTML5 markup, accessible landmarks, metadata, clean content structure.
- `styles.css`: Design tokens, modern CSS Grid, responsive layout, typographic styling, darkroom theme.
- `app.js`: Gallery presenter, Lightbox FSM, event delegation, smooth intersection observers.
- `fonts/`: Local font assets.
- `events/`, `predebut/`, `institutional/`: Curated photography plate directories.

### Test Suite (Owned by E2E Testing Track)
- `tests/test_tier1_features.js`: Tier 1 feature coverage tests.
- `tests/test_tier2_boundaries.js`: Tier 2 boundary and corner case tests.
- `tests/test_tier3_combinations.js`: Tier 3 pairwise integration tests.
- `tests/test_tier4_acceptance.js`: Tier 4 real-world user scenarios and accessibility audits.
- `test-runner.js`: Master test execution harness (Node.js).
- `TEST_INFRA.md`: Test framework architecture, test cases inventory.
- `TEST_READY.md`: Signal from test track that test suite is complete.

---

## Write Ownership
- **Milestone 1 Worker**: Exclusive write access to `index.html` and `styles.css` for visual/layout refactoring.
- **Milestone 2 Worker**: Sequential write access to `app.js`, `index.html`, and `styles.css` for code architecture, state machine, and accessibility after M1 completes.
- **Milestone 3 Test Writer (E2E Testing Track)**: Exclusive write access to `tests/*`, `test-runner.js`, `TEST_INFRA.md`, and `TEST_READY.md`. Concurrent with M1/M2.
- No agent may modify files outside its assigned write boundary.
