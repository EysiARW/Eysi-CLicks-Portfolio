# Handoff Report — Visual & UI/UX Audit (`explorer_survey_2`)

## 1. Observation

Direct code observations from inspecting the codebase:

1. **Camera Viewfinder & Telemetry HUD Chrome**:
   - `index.html:94-97` defines `<div class="camera-hud memory-hud"><span class="hud-pill">EXHIBITION</span><span class="hud-item hud-chapter" id="hud-chapter">Fleeting Moments Held Forever</span></div>`.
   - `index.html:122-134` defines `<aside class="focal-scale">` with vertical bar, cursor thumb, and labels `Now`, `Passing`, `Preserved`, `Forever`, titled `IN LIGHT & TIME`.
   - `index.html:195-198` defines 4 corner viewfinders `.vf-tl`, `.vf-tr`, `.vf-bl`, `.vf-br` displaying `35MM · f/1.4`, `ISO 100 · RAW`, `14°16'N 121°07'E`, `EDITION 2026`.
   - `app.js:895-900` dynamically injects 4 viewfinder focus corners into every card: `['tl', 'tr', 'bl', 'br'].forEach(pos => ... figure.appendChild(corner))`, styled at `styles.css:1689-1709` with hover shifts `translate(-4px, -4px)`.
   - `app.js:280-326` tracks mouse movements to animate a custom `.cursor-loupe` element (`index.html:76-82`), adding `translate3d(${this.#targetX + 16}px, ${this.#targetY + 16}px, 0)`.
   - `index.html:433-436` displays GPS coordinates `14.2726° N, 121.1239° E` and `ft-local-time` clock updated via `Intl.DateTimeFormat` at `app.js:1140-1157`.

2. **Hero Staggering & Tilted Cards**:
   - `styles.css:610-631` creates opening letterbox curtain pseudo-elements (`#hero::before, #hero::after`) animating over `1.1s cubic-bezier(0.76, 0, 0.24, 1)`.
   - `styles.css:644-881` cascades 12 staggered entrance delays up to `animation-delay: 1.95s` before the scroll hint settles.
   - `styles.css:999-1034` tilts 4 hero floating frames (`rotate(-4.5deg)`, `rotate(3.5deg)`, `rotate(4deg)`, `rotate(-3.2deg)`), which are completely hidden under 960px (`@media (max-width: 960px) { .hero-floating-frames { display: none; } }` at `styles.css:1044`).

3. **Typographic Stack & Sub-10px Micro-Type**:
   - `styles.css:21-59` and `styles.css:92-97` register and declare:
     - `--font-dreamer`: `'Dreamer', 'Impact', sans-serif`
     - `--font-tropikal`: `'Tropikal', 'EB Garamond', serif`
     - `--font-garamond`: `'EB Garamond', 'Playfair Display', Georgia, serif`
     - `--font-interphases`: `'TT Interphases', 'Inter', ...`
     - `--font-mono`: `ui-monospace, SFMono-Regular, ...`
   - Plus Google Fonts loaded at `index.html:37-40` for `EB Garamond` and `Playfair Display`.
   - Micro-typography font sizes: `.vf-coord` at `0.48rem` (`styles.css:851`), `.nav-logo-folio` at `0.48rem` (`styles.css:323`), `.focal-scale-title` at `0.48rem` (`styles.css:565`), `.photo-tag` at `0.5rem` (`styles.css:1717`), `.about-plate-badge` at `0.5rem` (`styles.css:1093`).

4. **Philosophy SaaS Metrics Ledger**:
   - `index.html:274-290` presents a 3-column stats ledger: `03 Curated Chapters`, `28 Archival Plates`, `IV-A Cabuyao, Laguna`, styled at `styles.css:1207-1247`.

5. **Gallery Collection Orientation Split**:
   - `photoData` in `app.js:21-70` defines:
     - `predebut.landscape`: 3 photos.
     - `events.portrait`: 2 photos.
     - `events.landscape`: 10 photos.
     - `institutional.landscape`: 8 photos (`institutional.portrait`: 0 photos).
   - `styles.css:1621-1624` enforces `--cols: 5` on desktop (`min-width: 960px`). In `events.portrait`, 2 photos occupy 2 of 5 columns, leaving 3/5ths empty.

---

## 2. Logic Chain

1. **Premise 1**: The user's explicit objective (`ORIGINAL_REQUEST.md`) is to *"search for improvements across the freelance photography portfolio website and ensure it does not look like any vibe coded projects, elevating both its visual design and underlying code quality."*
2. **Premise 2**: Leading photography portfolio benchmarks (Awwwards SOTD, Siteinspire, Aperture, Kinfolk) and modern UX guidelines prioritize transparent interface chrome, generous negative space, high-resolution visual gravitas, and disciplined 2-family typography, keeping 100% of the visitor's focus on the photographic art.
3. **Premise 3**: Features such as fake camera viewfinder brackets, hover reticles, GPS coordinates, live digital terminal clocks, right-hand scroll chronicle bars, centered HUD navigation capsules, trailing cursor pills, and tilted floating cards are textbook hallmarks of unedited AI prompts attempting to simulate "photography/tech luxury" through decorative gimmicks.
4. **Premise 4**: Concurrently deploying 5 distinct typefaces (`Dreamer`, `Tropikal`, `EB Garamond`, `TT Interphases`, `ui-monospace`) and setting micro-copy to sub-8px violates typographic cohesion, hierarchy, and basic readability standards.
5. **Premise 5**: Partitioning photo collections strictly by orientation causes extreme row sparsity (e.g. 2 photos across a 5-column grid), diminishing the perceived depth of the artist's monograph.
6. **Inference / Conclusion**: Removing the synthetic telemetry/HUD chrome, consolidating typography into a refined 2-family pairing (`EB Garamond` + `TT Interphases`), replacing the tilted hero cards with a photography-first presentation, and unifying the gallery into an organic mixed-aspect editorial layout will eliminate the vibe-coded stigma and establish a bespoke, world-class gallery exhibition experience.

---

## 3. Caveats

- **Existing Feature Spec Integrity**: Feature Spec 001 (`specs/001-contact-sheet-archive`) removed the secondary series filters and exhibition toggle, and Feature Spec 002 (`specs/002-default-museum-mat`) made the museum mat permanent in the lightbox. The recommendations in this audit respect and build upon those foundational user preferences (retaining the museum mat and contact sheet proof identification).
- **Asset Constraints**: The portfolio currently contains 28 curated photographic assets. Recommendations for hero image treatments utilize existing high-resolution assets (`EYSI-3-15.jpg`, `predebut/portrait/EYSI-2-22.jpg`, etc.) without requiring external stock photography.
- **Read-Only Scope**: In strict compliance with read-only explorer constraints, no production files (`index.html`, `styles.css`, `app.js`) were modified during this audit. All proposals are documented in `visual_ui_audit.md`.

---

## 4. Conclusion

The current EysiClicks website exhibits a high-potential visual identity that is currently weighed down by synthetic "vibe-coded" tropes. The path to elevating the site is not adding more effects, but practicing **curatorial restraint**:
1. Strip the camera-HUD / telemetry chrome (viewfinder brackets, hover reticles, focal scroll bar, nav chapter pill, cursor loupe, GPS coordinates, live clock).
2. Unify the type system into a disciplined two-family pairing (`EB Garamond` for classical editorial authority; `TT Interphases` for clean functional UI), eliminating `Dreamer` and sub-10px micro-type.
3. Elevate the hero area into a commanding photography-first exhibition rather than a 2-second staggered animation of tilted cards and brutalist headlines.
4. Unify the gallery grid into a harmonious mixed-aspect ratio editorial proof layout, eliminating sparse 2-item rows.
5. Soften the lightbox transitions (gentle cross-fade instead of harsh shutter flash) and embed captioning into the lower museum mat margin.

---

## 5. Verification Method

To independently verify the observations and conclusions in this report:

1. **Verify HUD / Telemetry Gimmicks in Source**:
   - Inspect `index.html` lines 76-82 (loupe cursor), lines 94-97 (nav HUD pill), lines 122-134 (focal scale), lines 195-198 (hero viewfinders), and lines 433-436 (GPS/clock).
   - Inspect `app.js` lines 895-900 (dynamic injection of 4 viewfinder reticles on every photo item).
2. **Verify Font Proliferation**:
   - Run: `grep -E "font-family|@font-face" styles.css` to confirm 5 distinct font declarations and fallback stacks.
   - Inspect `styles.css` lines 851, 323, 565, 1717, and 1093 to confirm sub-10px font declarations (`0.48rem`, `0.5rem`).
3. **Verify Row Sparsity**:
   - Open `#gallery` in a browser at viewport width > 960px.
   - Select the `Events` tab and `Portrait` orientation. Observe that only 2 photos are rendered on a 5-column flex grid (`--cols: 5`), leaving 3 columns empty.
4. **Inspect Detailed Report**:
   - View `/Users/manalili/Desktop/Desktop/PORTFOLIO PROJECTS WEBSITE/EysiClicks-portfolio-2026.great-site.net/.agents/teamwork/explorer_survey_2/visual_ui_audit.md`.
