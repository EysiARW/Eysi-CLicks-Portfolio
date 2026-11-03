# Comprehensive Code Quality & Technical Standards Audit: EYSI CLICKS

**Auditor**: `explorer_survey_3`  
**Date**: November 3, 2026  
**Target Codebase**: EYSI CLICKS Photography Portfolio (`index.html`, `styles.css`, `app.js`, `specs/`)  
**Applicable Standards**: WCAG 2.2 AA/AAA, W3C HTML5/Modern Web Standards, ES2022+ OOP Architecture, Core Web Vitals (CWV)

---

## Executive Summary

The EYSI CLICKS codebase exhibits an ambitious, luxury editorial visual identity with notable strengths, including ES2022 private class fields (`#field`), CSS custom properties for dual light/dark themes, native View Transitions API integration, and rich photographic assets.

However, a rigorous technical inspection reveals significant architectural deficiencies, accessibility non-compliance, performance bottlenecks, and telltale "vibe-coded" anti-patterns. These issues betray an AI-assisted or hasty development origin:
- **Simulated native dialogs** using legacy `div[role="dialog"]` with incomplete focus traps, missing `aria-live` screen-reader announcements, and body overflow lock hacks instead of modern HTML `<dialog>`.
- **Widespread WCAG 2.2 AA color contrast failures** in secondary and subtle text tokens (contrast ratios dropping to **3.01:1** in light mode and **3.72:1** in dark mode against the required 4.5:1 minimum).
- **Severe asset over-fetching**: 2048px high-resolution images are served unconditionally for tiny 44px filmstrip thumbnails and 200px contact sheet cards, downloading 3–4 MB of unscaled raster data per panel.
- **Above-the-fold Core Web Vitals penalties**: Hero images use `loading="lazy"` (delaying LCP) and lack explicit `width` and `height` dimensions (causing CLS).
- **Brittle Flexbox layout math** (`calc((100% - (var(--cols) - 1) * var(--gap)) / var(--cols))`) instead of modern CSS Grid.
- **Hacky inline event handlers and global leaks** (`onclick="closeLightbox()"`, `window.closeLightbox = ...`) coupled with inline style transforms injected on every scroll frame.
- **Absence of a formal state machine** in the Lightbox viewer, allowing slideshow auto-advancement to clash with user zoom inspections and lacking browser history/hash syncing for individual plates.
- **Zero automated test suite** despite constitutional mandates claiming unit and E2E verification.

Below is the comprehensive technical breakdown across all seven audit dimensions, complete with exact line citations, evidence chains, and an actionable, prioritized improvement plan.

---

## 1. HTML Architecture & Semantic Structure

### 1.1 Document Metadata & SEO
- **Relative Open Graph & Twitter Card Image URLs**:
  - *Location*: `index.html:17` and `index.html:24`
    ```html
    17:   <meta property="og:image" content="EYSI-3-15.jpg">
    24:   <meta name="twitter:image" content="EYSI-3-15.jpg">
    ```
  - *Defect*: The Open Graph and Twitter Card specifications explicitly require canonical, fully qualified absolute URLs (e.g. `https://EysiClicks-portfolio-2026.great-site.net/EYSI-3-15.jpg`). While JSON-LD (line 64) uses the full absolute URL, the `<meta>` tags provide relative filenames, causing social media preview crawlers (Facebook, X/Twitter, LinkedIn, Discord) to fail image extraction.
- **Resource Preloading Mismatch & Malformed Asset Naming**:
  - *Location*: `index.html:31-32`
    ```html
    31:   <link rel="preload" href="fonts/Dreamer.otf" as="font" type="font/otf" crossorigin>
    32:   <link rel="preload" href="eysi clicks (1).png" as="image">
    ```
  - *Defect 1*: Preloading prioritizes `Dreamer.otf` (used only for the hero display title), while the primary body font family `TT-Interphases-Regular.ttf` is not preloaded. This causes visible Flash of Unstyled Text (FOUT) on slow connections.
  - *Defect 2*: Filename `eysi clicks (1).png` contains unencoded whitespace and parentheses. In standard HTTP server environments, unencoded special characters risk 404 cache misses, broken CDN rewrites, and URI decoding inconsistencies.

### 1.2 Semantic Structure & Heading Hierarchy
- **Landmark Organization**:
  - `index.html:84`: `<nav id="navbar" aria-label="Primary">` (Proper semantic nav).
  - `index.html:140`: `<main>` encapsulates `#hero`, `#about`, and `#gallery` (Proper document landmark).
  - `index.html:398`: `<footer id="inquire">` (Proper semantic footer).
- **Heading Progression Incompleteness**:
  - Progression: `<h1>` (`index.html:204`, hero title) &rarr; `<h2>` (`index.html:266`, Philosophy) &rarr; `<h2>` (`index.html:315`, Gallery) &rarr; `<h2>` (`index.html:401`, Inquire).
  - *Defect*: Inside the category panels (`panel-predebut`, `panel-events`, `panel-institutional`), chapter headers are marked up as purely decorative spans:
    ```html
    361:   <span class="cat-chapter-badge">CHAPTER I · YOUTH &amp; BECOMING</span>
    ```
    Screen reader heading navigation tools (e.g., NVDA/JAWS `H` key) cannot discover or jump to individual chapters because these are not semantic `<h3>` elements.

### 1.3 Figure Semantics vs. Interactive Elements
- **Conflicting Semantics on Interactive Cards**:
  - *Location*: `index.html:149-191` and `app.js:940-942`
    ```html
    149:   <figure class="hero-frame hero-frame-1" data-cat="predebut" data-orient="portrait" data-idx="0" role="button" tabindex="0" aria-label="View Avegail @18 in Lightbox">
    ```
    ```javascript
    940:   figure.tabIndex = 0;
    941:   figure.setAttribute('role', 'button');
    942:   figure.setAttribute('aria-label', `View photo: ${asset.caption} (${asset.plateNumber})`);
    ```
  - *Defect*: Applying `role="button"` directly to a `<figure>` element overwrites its native composite role in the accessibility tree, creating confusing semantics where assistive technology is instructed that a structural illustration/caption container is a simple button. Best practice is either nesting an explicit `<button>` or anchor inside the figure or wrapping the figure with an interactive component.

### 1.4 Native `<dialog>` vs. Div-based Modal
- **Simulated Dialog Implementation**:
  - *Location*: `index.html:449`
    ```html
    449:   <div class="lightbox" id="lightbox" role="dialog" aria-modal="true" aria-label="Photo viewer">
    ```
  - *Defect*: Modern Web Standards (HTML 5.2+, Modern Web Guidance) mandate using native `<dialog>` elements for full-screen photo inspectors. Simulating modals via `div` forces manual focus trapping, manual `body.style.overflow = 'hidden'` scroll locking, custom backdrop rendering, and manual Escape listeners, all of which introduce edge-case bugs and fail to leverage the browser's native Top Layer API.

---

## 2. Accessibility (a11y) & Usability

### 2.1 Color Contrast Failures (WCAG 2.2 AA Compliance)
Mathematical luminance and contrast calculations on the declared design tokens reveal multiple critical contrast violations (< 4.5:1 for normal body text):

| Token / Context | Tested Color | Background | Measured Ratio | WCAG 2.2 AA Status | Affected Selectors / Lines |
|---|---|---|---|---|---|
| `--text-subtle` (Light) | `rgba(17,17,17, 0.45)` &rarr; `rgb(145,144,142)` | `--bg` (`#faf8f5`) | **3.01:1** | **FAIL** (Min 4.5:1) | `.focal-val` (`styles.css:549`), `.focal-scale-title` (`styles.css:567`), `.vf-coord` (`styles.css:853`), `.hero-frame-index` (`styles.css:935`), `.sig-title` (`styles.css:1278`), `.footer-telemetry` (`styles.css:2276`) |
| `--accent-bronze` (Light) | `#8c7355` (`rgb(140,115,85)`) | `--bg` (`#faf8f5`) | **4.22:1** | **FAIL** (Min 4.5:1) | `.eyebrow-index` (`styles.css:1369`), `.cat-chapter-badge` (`styles.css:1594`) |
| `--text-subtle` (Dark) | `rgba(244,241,234, 0.42)` &rarr; `rgb(108,107,105)` | `--bg` (`#0a0a0b`) | **3.72:1** | **FAIL** (Min 4.5:1) | `.focal-val`, `.vf-coord`, `.hero-frame-index`, `.sig-title`, `.footer-telemetry` |

*Impact*: Users with low vision, contrast sensitivity deficits, or those browsing under direct daylight cannot read plate indexes, telemetry coordinates, chapter titles, or footer metadata.

### 2.2 Unreadable Micro-Typography
- In several locations, font sizes are set below `0.55rem` (8.8px down to 7.04px):
  - `styles.css:933`: `.hero-frame-index { font-size: 0.44rem; }` (~7.0px)
  - `styles.css:1942`: `.lightbox-frame-wrap::after { font-size: 0.46rem; }` (~7.3px)
  - `styles.css:323`: `.nav-logo-folio { font-size: 0.48rem; }` (~7.7px)
  - `styles.css:851`: `.vf-coord { font-size: 0.48rem; }` (~7.7px)
  - *Defect*: Typography rendered below 10px severely degrades legibility, fails WCAG text scaling thresholds, and triggers font anti-aliasing blurring on mobile devices.

### 2.3 Broken ARIA Parent-Child Hierarchy in Filmstrip
- *Location*: `index.html:501` vs `app.js:538-542`
  ```html
  501:   <div class="lightbox-filmstrip" id="lightbox-filmstrip" role="tablist" aria-label="Photo series thumbnails"></div>
  ```
  ```javascript
  538:   const thumb = document.createElement('button');
  539:   thumb.type = 'button';
  540:   thumb.className = 'filmstrip-thumb' + (idx === this.#currentIndex ? ' active' : '');
  541:   thumb.setAttribute('aria-label', `View photo ${idx + 1}: ${image.caption || 'Untitled'}`);
  ```
- *Defect*: The container specifies `role="tablist"`, but the dynamically injected child buttons do **not** declare `role="tab"` or `aria-selected="true|false"`. This violates the WAI-ARIA specification (ARIA parent-child relationship violation). Automated accessibility linters (axe-core, Lighthouse) flag this as an invalid role structure.

### 2.4 Missing Live Announcements (`aria-live`)
- *Location*: `index.html:449-510` (`.lightbox`)
- *Defect*: The Lightbox viewer lacks an `aria-live="polite"` status region. When navigating via arrow keys, clicking filmstrip thumbnails, or running the automated slideshow, sighted users observe visual slide transitions, but screen-reader users receive **zero auditory notification** that the photo plate has changed, what the new plate number is, or what caption is displayed.

### 2.5 Focus Trap Leaks & Navigation Semantics
- *Location*: `app.js:680-693`
  ```javascript
  680:   if (e.key === 'Tab') {
  681:     const focusable = Array.from(this.#lightboxEl.querySelectorAll('button:not([disabled])'));
  ```
  - *Defect*: The manual Tab focus trap only queries `button:not([disabled])`. If links or custom focusable elements exist, or if focus is moved before the query executes, keyboard focus can escape the modal into the inert underlying page.
- *Location*: `index.html:339-352`
  - *Defect*: Orientation buttons use `aria-pressed="true|false"`, which indicates independent toggle buttons. Because Portrait and Landscape are mutually exclusive options, they should be modeled as a `role="radiogroup"` with `role="radio"` and `aria-checked="true|false"`.

---

## 3. CSS Architecture & Maintainability

### 3.1 Primitive Layout Math vs. Modern CSS Grid
- *Location*: `styles.css:1608-1634`
  ```css
  1608: .photo-grid {
  1609:   --cols: 2;
  1610:   --gap: 1.1rem;
  1611:   display: flex;
  1612:   flex-wrap: wrap;
  1613:   gap: var(--gap);
  1614: }
  1630: .photo-item {
  1631:   flex: 0 0 calc((100% - (var(--cols) - 1) * var(--gap)) / var(--cols));
  ```
- *Defect*: This is an obsolete Flexbox column hack with manual floating-point arithmetic. Sub-pixel browser rendering frequently causes the last item in a row to prematurely wrap or create awkward trailing spaces. In modern CSS, this should be replaced with native CSS Grid:
  ```css
  .photo-grid {
    display: grid;
    grid-template-columns: repeat(var(--cols, 2), 1fr);
    gap: var(--gap, 1.1rem);
  }
  ```

### 3.2 Design Token Hygiene & Magic Numbers
- **Missing Spacing & Typography Scale**: While color tokens are organized in `:root` and `html[data-theme="dark"]`, there is no standardized scale for spacing (`--space-xs`, `--space-sm`, `--space-md`) or typography (`--text-sm`, `--text-base`, `--text-lg`). Arbitrary values (`0.38rem`, `0.42rem`, `0.55rem`, `0.68rem`, `1.35rem`) are hardcoded throughout `styles.css`.
- **Magic Line-Height**:
  - `styles.css:675`: `.hero-title { line-height: 0.86; }`
  - Hardcoding a line-height of `0.86` risks clipping glyph ascenders and descenders on custom serif display fonts across differing OS font renderers.
- **Fixed Zoom Scale**:
  - `styles.css:1962`: `.lightbox-img.zoomed { transform: scale(1.85); }`
  - Fixed `scale(1.85)` fails to account for source image natural dimensions vs. viewport aspect ratios, resulting in image blurring or vertical clipping on smaller laptop viewports.

### 3.3 Dead Code, Orphaned Classes & Outdated Comments
- **Orphaned HTML Classes**:
  - `index.html:244` & `index.html:311`: `<section class="page-section">` exists on both `#about` and `#gallery`, but `.page-section` **does not exist anywhere** in `styles.css`.
  - `index.html:96`: `<span class="hud-item hud-chapter">` contains `.hud-item`, which has no styling rules.
- **Stale Section Header Comments**:
  - `styles.css:10`: Comment reads `7. Gallery Archive Controls, Series Filter & View Switcher`, retaining obsolete references to the removed Exhibition view and series filter bar.

---

## 4. JavaScript Quality & Architecture

### 4.1 State Machine Fragility in `LightboxController`
- *Location*: `app.js:348-354` & `app.js:439-465`
  ```javascript
  348:   #images = [];
  349:   #currentIndex = 0;
  350:   #isZoomed = false;
  351:   #slideshowInterval = null;
  ```
- *Defect 1: State Conflict (Zoom during Slideshow)*:
  When a user starts a slideshow (`startSlideshow()`) and then clicks the image or presses `Z` to zoom in (`toggleZoom()`), `toggleZoom()` does **not** cancel or pause `#slideshowInterval`. As a result, while the user is inspecting fine details, the interval timer fires `navigate(1)`, which calls `#resetZoom()`, abruptly kicking the user out of zoom every 3.5 seconds!
- *Defect 2: Lack of Explicit State Enum*:
  The controller relies on mutable boolean flags (`#isZoomed`, `#slideshowInterval != null`) rather than a finite state machine (`CLOSED`, `VIEWING`, `ZOOMED`, `SLIDESHOW`). Transitions between states have unhandled permutations.

### 4.2 Lack of URL Hash / Deep Linking in Lightbox
- *Location*: `app.js:755-757` vs `LightboxController`
  - `GalleryPresenter.switchTab()` synchronizes the tab state to URL query parameters (`?tab=predebut`).
  - *Defect*: When opening the Lightbox to inspect specific plates, no URL hash (e.g. `#plate-03` or `?plate=3`) or History API state (`history.pushState`) is pushed. If a user presses the browser's hardware "Back" button expecting to close the photo inspector, the browser unloads the website or jumps to the preceding web domain.

### 4.3 Inefficient Event Handling vs. Event Delegation
- *Location*: `app.js:883-950` (`#buildGridDOM`) and `app.js:538-561` (`#renderFilmstrip`)
  - Every time an orientation or category tab is rendered, every individual photo card (`figure`) and every filmstrip thumbnail (`thumb`) has multiple dedicated event listeners attached:
    - `figure.addEventListener('click', activate)`
    - `figure.addEventListener('keydown', ...)`
    - `cursorLoupe.attachInteractiveTarget(figure, ...)` &rarr; attaches `mouseenter` and `mouseleave` listeners to every node!
  - *Defect*: Attaching 4–6 listeners per card across 28 plates creates unnecessary event listener allocations and DOM memory churn. A single delegated listener on `.photo-grid` and `.lightbox-filmstrip` checking `e.target.closest('.photo-item')` is far cleaner and more performant.

### 4.4 Global Scope Pollutions & Inline Event Handlers
- *Location*: `index.html:473, 481, 504` vs `app.js:1171-1175`
  ```html
  473:   <button type="button" class="lightbox-close" onclick="closeLightbox()" aria-label="Close">
  481:   <button type="button" class="lightbox-nav lightbox-prev" onclick="lightboxNav(-1)" ...>
  504:   <button type="button" class="lightbox-nav lightbox-next" onclick="lightboxNav(1)" ...>
  ```
  ```javascript
  1171:  // Global bindings preserved for declarative HTML attributes
  1172:  window.closeLightbox = () => lightboxController.close();
  1173:  window.lightboxNav   = dir => lightboxController.navigate(dir);
  1174:  window.switchTab     = cat => galleryPresenter.switchTab(cat);
  ```
- *Defect*: Modern Web Standards, Content Security Policy (CSP `script-src 'self'`), and strict OOP architecture prohibit inline `onclick` attributes. Exposing `window.closeLightbox` and `window.lightboxNav` pollutes the global execution context and bypasses encapsulated controller event binding.

### 4.5 Synchronous Layout Thrashing in Scrollspy
- *Location*: `app.js:1079-1082`
  ```javascript
  1079:   const scrollPos = window.scrollY + 180;
  1080:   let current = this.#sections[0];
  1081:   this.#sections.forEach(section => {
  1082:     if (section.offsetTop <= scrollPos) current = section;
  1083:   });
  ```
- *Defect*: Calling `section.offsetTop` inside the scroll event callback forces synchronous layout recalculation (reflow) on every scroll frame. An `IntersectionObserver` with appropriate root margins completely eliminates layout thrashing.

---

## 5. Asset & Performance Optimization

### 5.1 Image Loading Anti-Patterns & Core Web Vitals (CWV)
- **Lazy Loading Above the Fold (LCP Penalty)**:
  - *Location*: `index.html:154, 165, 176, 187` (Hero floating frames)
    ```html
    154:   <img src="predebut/portrait/EYSI-2-22.jpg" alt="Avegail @18" loading="lazy" decoding="async">
    ```
  - *Defect*: Applying `loading="lazy"` to above-the-fold viewport elements delays image discovery and scheduling until after the browser executes layout and painting. Per Google CWV guidelines, above-the-fold images should use `loading="eager"` or `fetchpriority="high"`.
- **Missing Explicit Width & Height Attributes (CLS Penalty)**:
  - *Location*: `index.html:86` (`nav-logo-img`), `index.html:200` (`hero-logo`), `index.html:154, 165, 176, 187` (`hero-frame` images), and `app.js:913-917` (dynamic gallery images).
  - *Defect*: Images lack explicit `width` and `height` (or intrinsic dimension attributes) in HTML. Before stylesheets finish parsing and applying CSS aspect ratios, the layout collapses to 0 height and abruptly expands when the image loads, causing layout shifts.
- **Unscaled Asset Delivery (Bandwidth Bloat)**:
  - *Evidence*: Analysis with PIL confirms that all WebP files in `events/`, `predebut/`, and `institutional/` are full 2048x1365 or 1365x2048 master assets (averaging 250KB–600KB each).
  - *Defect*: The full 2048px master image is delivered to:
    1. Grid proof cards (~180px–280px rendered width).
    2. Filmstrip thumbnails (`styles.css:2054`, rendered at **44x44px**).
  - When loading the Events Landscape tab (10 items), the browser downloads ~3.5MB of image data for tiny preview thumbnails. Responsive `srcset` with multi-resolution renditions (`400w`, `800w`, `1600w`, `2048w`) and dedicated thumbnail sizes are missing.

### 5.2 Font Loading & Delivery
- **Uncompressed TTF Formats**:
  - `fonts/TT-Interphases-Regular.ttf` (139.3 KB), `TT-Interphases-Medium.ttf` (139.2 KB), and `TT-Interphases-Bold.ttf` (138.7 KB) are served as raw TrueType (`.ttf`) files. Converting these to WOFF2 (`.woff2`) would reduce payload sizes by 65–70% (~45 KB each) with universal browser support.
- **Invalid Font Weight Syntax**:
  - *Location*: `styles.css:24`
    ```css
    24:   font-weight: 700 900;
    ```
  - *Defect*: In CSS `@font-face`, range syntax `700 900` is only valid for variable fonts. `Dreamer.otf` is a 13KB static font file. Declaring a weight range on a static font is invalid CSS syntax in strict parsers.

---

## 6. Vibe-Coded / Hacky Technical Anti-Patterns

A code audit specifically screening for "vibe-coded" shortcuts reveals clear symptoms of unreviewed, auto-generated code:

1. **Repetitive DOM Generation Boilerplate**:
   - In `app.js:895-900`, JavaScript loops through `['tl', 'tr', 'bl', 'br']` and creates 4 separate `<span>` DOM elements per image card to render camera viewfinder corners. This adds 112 extraneous DOM nodes for a 28-photo gallery. Modern CSS can render reticle corners using CSS border techniques or pseudo-elements (`::before` / `::after`) with zero JavaScript DOM overhead.
2. **Gimmicky Inline Style Animations on Scroll**:
   - In `TelemetryHudController.#updateOpticalContinuum()` (`app.js:1111-1119`):
     ```javascript
     const shift = Math.min(22, window.scrollY * 0.05);
     if (tl) tl.style.transform = `translate3d(${-shift}px, ${-shift}px, 0)`;
     if (tr) tr.style.transform = `translate3d(${shift}px, ${-shift}px, 0)`;
     if (bl) bl.style.transform = `translate3d(${-shift}px, ${shift}px, 0)`;
     if (br) br.style.transform = `translate3d(${shift}px, ${shift}px, 0)`;
     ```
     Recalculating and directly mutating 4 separate inline CSS transform strings on every scroll event is a classic vibe-coded gimmick. If desired, this effect should be driven by CSS custom properties or native scroll-driven animations.
3. **Hardcoded Magic Constants**:
   - `window.scrollY > 50` (navbar scrolled).
   - `window.scrollY > 480` (back-to-top button visible).
   - `window.scrollY + 180` (scrollspy threshold).
   - `setTimeout(..., 130)` (shutter flash timeout).
   - `3500ms` (slideshow timer).
   - None of these are exposed as configurable options or encapsulated constants.
4. **Missing Automated Verification Suite**:
   - Principle V of `.specify/memory/constitution.md` states: *"Automated Unit & Real-Browser E2E Verification: No revision is complete until verified by executing both the Node unit test suite (node:test) and the Headless Chrome CDP E2E/UI test suite"*.
   - *Reality*: Zero unit tests (`*.test.js`), zero test configurations, and zero test scripts exist in the repository. The claim of automated testing is purely aspirational.

---

## 7. Concrete Technical Improvement Plan

To elevate the codebase to clean, enterprise-grade, professional quality, the following prioritized refactoring roadmap is recommended:

### Priority 1 (P1): Critical Accessibility, Standards & CWV Fixes
1. **Fix Color Contrast Failures (WCAG 2.2 AA Compliance)**:
   - In `styles.css`, adjust `--text-subtle` in Light mode from `rgba(17, 17, 17, 0.45)` to `rgba(17, 17, 17, 0.68)` (contrast ratio &ge; 4.5:1).
   - Adjust `--accent-bronze` in Light mode from `#8c7355` to `#755d40` (contrast ratio &ge; 4.6:1).
   - Adjust `--text-subtle` in Dark mode from `rgba(244, 241, 234, 0.42)` to `rgba(244, 241, 234, 0.60)` (contrast ratio &ge; 4.5:1).
   - Raise micro-typography minimums: ensure all plate indexes and metadata labels are at least `0.65rem` (~10.5px).
2. **Eliminate CLS & Optimize LCP on Hero Images**:
   - Add explicit `width` and `height` attributes to `index.html` hero images, nav logo, and dynamically created gallery `<img>` elements.
   - Change hero floating frame images from `loading="lazy"` to `loading="eager"`.
   - Add `fetchpriority="high"` to primary hero imagery.
3. **Resolve ARIA Specification Violations**:
   - In `app.js:#renderFilmstrip`, add `role="tab"` and `aria-selected="true|false"` to `.filmstrip-thumb` buttons so they satisfy the `role="tablist"` parent contract.
   - Add a visually hidden `<div id="lb-live-region" class="sr-only" aria-live="polite" aria-atomic="true"></div>` inside `.lightbox` that announces photo title and index changes.
   - Remove `role="button"` and `tabindex="0"` from `<figure>` elements; use nested interactive elements or wrap with semantic triggers.

### Priority 2 (P2): Architectural & State Machine Refactoring
1. **Implement Formal Lightbox State Machine**:
   - Refactor `LightboxController` to use a cohesive State Machine:
     ```javascript
     const LightboxState = Object.freeze({
       CLOSED: 'CLOSED',
       VIEWING: 'VIEWING',
       ZOOMED: 'ZOOMED',
       SLIDESHOW: 'SLIDESHOW',
     });
     ```
   - Ensure entering `ZOOMED` automatically pauses `SLIDESHOW`.
   - Ensure clicking filmstrip or navigating smoothly transitions state without timing conflicts.
2. **Add History & Deep-Linking Support**:
   - Integrate `window.location.hash` or `history.pushState` on Lightbox opening (e.g. `#plate-01`).
   - Listen to `window.addEventListener('popstate', ...)` so the browser's native Back button cleanly closes the Lightbox without leaving the page.
3. **Eliminate Global Window Leaks & Inline Event Handlers**:
   - Remove `onclick="closeLightbox()"`, `onclick="lightboxNav(-1)"`, and `onclick="lightboxNav(1)"` from `index.html`.
   - Bind event listeners directly within `LightboxController.#bindEvents()`.
   - Remove `window.closeLightbox`, `window.lightboxNav`, and `window.switchTab` from `app.js`.

### Priority 3 (P3): CSS Modernization & Code Cleanup
1. **Migrate Photo Grid to Native CSS Grid**:
   - Replace the Flexbox `calc()` column hack in `styles.css:1608-1634` with `grid-template-columns: repeat(var(--cols, 2), 1fr); gap: var(--gap, 1.1rem);`.
2. **Replace Scroll Layout Thrashing with `IntersectionObserver`**:
   - Replace synchronous `section.offsetTop` queries in `TelemetryHudController` with an `IntersectionObserver` observing section entry and exit.
3. **Clean Up Dead Code & Orphaned Classes**:
   - Remove orphaned class `.page-section` from `index.html` or declare its styling in `styles.css`.
   - Remove unused `.hud-item` class.
   - Update stale section headers in `styles.css:10` to reflect current features.
4. **Font Optimization**:
   - Convert `.ttf` fonts (`TT-Interphases-*.ttf`) to `.woff2`.
   - Correct `@font-face` static `font-weight: 700 900` in `styles.css:24` to `font-weight: 700;`.
   - Preload `fonts/TT-Interphases-Regular.woff2` alongside `Dreamer.otf`.
5. **Establish Node Unit & Accessibility Test Suite**:
   - Create `tests/` directory with `node:test` suites verifying repository counts, photo asset normalization, state transitions, and HTML accessibility contracts.

---

## Conclusion

The EYSI CLICKS portfolio has a compelling artistic vision and sophisticated aesthetic, but its technical execution carries unmistakable vibe-coded artifacts: simulated native dialogs, broken ARIA hierarchies, failing color contrast ratios, unscaled image deliveries, inline event handlers, and layout-thrashing scroll listeners.

By executing the prioritized 3-stage technical improvement plan detailed above, the portfolio can eliminate all vibe-coded shortcuts, achieve strict WCAG 2.2 AA compliance, boost Core Web Vitals performance, and establish a clean, maintainable, enterprise-standard codebase.
