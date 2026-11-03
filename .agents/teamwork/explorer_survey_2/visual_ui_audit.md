# Visual & UI/UX Audit Report — EYSI CLICKS Photography Portfolio
**Auditor**: `explorer_survey_2` (Read-Only UX Exploration Agent)  
**Date**: November 3, 2026  
**Target Repository**: `EysiClicks-portfolio-2026.great-site.net`  
**Reference Standards**: High-End Editorial Photography Monograph Benchmarks (Awwwards SOTD, Siteinspire, Aperture, Kinfolk), `ui-ux-pro-max`, `modern-web-guidance`

---

## 1. Executive Summary

The **EYSI CLICKS** website (`Andrei C. Capoy` photography portfolio based in Cabuyao, Laguna) possesses several strong foundational visual assets: high-quality documentary, pre-debut, and event photography; an elegant warm-ivory (`#faf8f5`) and obsidian darkroom (`#0a0a0b`) color palette; and an intentional analog archival framing concept (Museum Matting and Contact Sheet Proofs).

However, the user experience currently suffers from severe **"vibe-coding" symptomology**—the unmistakable signature of uncurated AI prompts that attempt to inject "every cool design gimmick at once." Instead of feeling like a quiet, prestigious photography exhibition, the interface is encumbered with:
1. **Pervasive "Camera Viewfinder & Sci-Fi HUD" Telemetry**: 4 corner viewfinder brackets in the hero, 4 hover reticles on every photo card, a fixed vertical scroll scale (`IN LIGHT & TIME`), a centered navigation chapter pill, live GPS coordinates, and a digital terminal clock in the footer.
2. **An Overloaded, Unfocused Hero Area**: Letterbox curtain animations, radial glow, 4 tilted floating cards with delay animations, pulsing sparkle badges (`✦`), and giant aggressive brutalist typography that dwarfs the actual photography.
3. **Typographic Anarchy (5 Disjointed Font Families)**: The concurrent loading and clashing of `Dreamer` (ultra-bold compressed brutalist sans), `Tropikal` (expressive modern serif), `EB Garamond` / `Playfair Display` (classical editorial serifs), `TT Interphases` (corporate neo-grotesque sans), and `ui-monospace` (terminal/code font), alongside illegible sub-10px micro-copy.
4. **SaaS Dashboard Metrics in an Artistic Monograph**: An archival ledger boasting `03 Curated Chapters` and `28 Archival Plates`, directly mirroring generic tech startup landing pages.
5. **Collection Fragmentation**: Splitting every collection into strict Portrait vs. Landscape sub-grids, producing awkward 2-photo or 3-photo rows on wide 5-column desktop displays.

By shedding these synthetic gimmicks and re-centering the site around a **serene, bespoke, editorial museum gallery aesthetic**, EysiClicks can elevate its perceived market value from a generic developer prototype to an elite, luxury visual arts monograph.

---

## 2. Visual Appearance & Hierarchy Audit

### 2.1 Navigation & Branding Header
- **Logo & Studio Monogram**: 
  - File: `eysi clicks (1).png` displayed at 36px height (30px on mobile).
  - In dark mode, a CSS filter (`filter: invert(1) brightness(1.05);` at `styles.css:299`) is applied.
  - Desktop branding adds a secondary vertical border metadata block: `EYSI CLICKS | ARCHIVE NO. 26` (`styles.css:306-327`).
  - *Observation*: While legible, the CSS inversion on the raster PNG logo can create halo artifacts around anti-aliased pixels. An inline SVG vector logo or clean typographic logotype would produce crisp, pristine rendering across all screen densities.
- **Center Telemetry HUD Pill (`.camera-hud`, `.memory-hud`)**:
  - Located at `index.html:94-97` and styled at `styles.css:438-485`.
  - Floating pill displaying `EXHIBITION | Fleeting Moments Held Forever`.
  - *Critique*: This element is completely hidden under 960px (`styles.css:482`). On desktop, it crowds the center of the navbar, distracts from the photography, and resembles an AI dashboard indicator rather than an editorial publication header. High-end art galleries never place a running status pill in the primary navigation.
- **Primary Navigation Links**:
  - `Home`, `Philosophy`, `Archive`, `Inquire` (`index.html:100-105`).
  - Animated underline indicator using `transform: scaleX(0)` to `scaleX(1)`.
  - Clean and functional, but on mobile viewports (<680px), all 4 links and the theme button are crammed into a single row with tiny font sizes (`0.6rem` / 9.6px) and insufficient touch target heights (~24px), violating WCAG 2.5.5 touch target guidelines (minimum 44×44px).
- **Theme Toggle (`.theme-toggle`)**:
  - Compact capsule button toggling Daylight (`#faf8f5`) and Darkroom (`#0a0a0b`).
  - High utility, appropriate iconography, and smooth view transition integration.

### 2.2 Hero Exhibition Section
- **Cinematic Letterbox Bars (`#hero::before, #hero::after`)**:
  - Top and bottom 12vh bars that slide open over 1.1s on initial load (`styles.css:610-631`).
  - *Critique*: While cinematic in theory, letterbox curtains delay initial content consumption and trigger unnecessary paint overhead.
- **Hero Corner Viewfinders & Telemetry (`.viewfinder`)**:
  - 4 corner brackets at `top: 4.8rem; left: 2rem;`, etc. (`styles.css:832-865`).
  - Includes coordinates: `35MM · f/1.4`, `ISO 100 · RAW`, `14°16'N 121°07'E`, `EDITION 2026`.
  - *Critique*: This is an overt "vibe-coded camera simulator" gimmick. Fine-art portraiture clients (debutantes, couples, institutional sponsors) do not evaluate an artist based on simulated EXIF labels in the browser viewport corners.
- **Hero Floating Frames (`.hero-floating-frames`)**:
  - 4 tilted photo cards (`.hero-frame-1` to `4`) positioned absolute around the hero text: `rotate(-4.5deg)`, `rotate(3.5deg)`, `rotate(4deg)`, `rotate(-3.2deg)` (`styles.css:906-1045`).
  - *Critique*:
    1. Tilted floating cards are a notorious hallmark of AI-generated landing page templates (such as generic SaaS hero illustrations with floating UI snippets).
    2. They clash directly with the website's stated theme of "Museum Exhibition & Archival Monograph"—museums hang photographs with disciplined vertical and horizontal alignment, never cocked at casual angles.
    3. They vanish entirely on screens below 960px (`styles.css:1044`), meaning mobile and tablet users get a completely different, hollow hero layout.
- **Hero Title & Staggered Animations**:
  - Title: `EYSI CLICKS` rendered in `Dreamer` font at `clamp(3.6rem, 14.5vw, 8.8rem)` (`styles.css:672`).
  - Animation sequence:
    - Glow: 0.25s
    - Logo: 0.25s
    - Eyebrow: 0.45s
    - "EYSI": 0.70s
    - "CLICKS": 0.92s
    - Tagline: 1.15s
    - Memory motif: 1.30s
    - Divider: 1.45s
    - Subtitle: 1.55s
    - CTA buttons: 1.70s
    - Viewfinder: 1.80s
    - Scroll hint: 1.95s
  - *Critique*: A total sequence duration of nearly 2.0 seconds forces visitors to wait before the primary call-to-action buttons are even visible. This severe animation delay degrades perceived performance and frustrates returning users.

### 2.3 Optical Focal Scale (Scroll Chronicle)
- Fixed vertical bar on the right edge (`styles.css:488-575`) tracking scroll progress across 4 stages: `Now`, `Passing`, `Preserved`, `Forever`, labeled `IN LIGHT & TIME`.
- *Critique*: This aside element adds unnecessary clutter to desktop viewports (>1024px). It permanently occupies right-hand negative space, draws the eye away from the imagery, and feels like a video game mission tracker or developer experiment rather than a calm editorial publication.

### 2.4 Philosophy / Auteur Spread (`#about`)
- **Photographer Portrait (`.about-img`)**:
  - Features Andrei C. Capoy (`EYSI-3-15.jpg`) in a framed presentation.
  - *Critique*: The image container is tilted `-1deg` with corner frame tick marks and an absolute dark badge `PLATE 00 · THE AUTEUR`. Like the hero cards, the artificial tilt cheapens the dignity of the portrait.
- **Editorial Typography**:
  - The drop-cap "T" (`styles.css:1184-1193`) and Garamond pull quote with bronze accent border (`styles.css:1196-1205`) are genuinely strong editorial elements that should be preserved.
- **Archival Ledger (`.about-ledger`)**:
  - 3-column stats box displaying `03 Curated Chapters`, `28 Archival Plates`, and `IV-A Cabuyao, Laguna` (`styles.css:1207-1247`).
  - *Critique*: This is a classic SaaS metrics pattern disguised as an archival ledger. Counting "28 Archival Plates" diminishes the artistic prestige of the collection, making it look like a limited prototype catalog.

### 2.5 The Gallery Archive (`#gallery`)
- **Controls Bar**:
  - Category tabs (`Pre-Debut [08]`, `Events [12]`, `Institutional [08]`) styled with `Tropikal` display serif.
  - Orientation toggle (`Portrait`, `Landscape`) with count badges styled with `TT Interphases` and monospace numbers.
  - Per Feature Spec 001, the old `Exhibition / Contact Sheet` toggle and the secondary series filter pills were removed, which significantly improved clarity.
- **Contact Sheet Proof Grid (`.photo-grid`, `.photo-item`)**:
  - Each item is structured as a 35mm contact sheet frame:
    - Top tag: `PLATE NN · 35MM PROOF` (`styles.css:1712-1732`).
    - Image in 4:5 or 3:2 ratio.
    - 4 viewfinder hover reticles (`styles.css:1689-1709`).
    - Caption underneath in Garamond italic (`styles.css:1744-1752`).
  - *Critique*:
    1. The 4 viewfinder reticles jumping in on card hover (`translate(-4px, -4px)` to `translate(0, 0)`) add restless visual noise.
    2. The card borders (`1px solid var(--border-strong)`) paired with the top exposure strip create a heavy, boxy container around each photo. In high-end galleries, images are given airy passe-partout whitespace without heavy outer borders.

### 2.6 Lightbox Modal / Photo Viewer (`#lightbox`)
- **Museum Mat Passe-Partout (`.lightbox-frame-wrap`)**:
  - Implemented per Feature Spec 002: permanent ivory passe-partout matting (`#faf8f5`) with bottom watermark `EYSI CLICKS · ARCHIVAL PLATE`.
  - This is one of the strongest, most authentic visual features on the site. It gives every photograph a tangible, gallery-grade presence.
- **Top Bar & Navigation**:
  - Left: `ARCHIVE PLATE` badge and optical telemetry (`35MM FULL-FRAME · NATURAL LIGHT`).
  - Right: Minimalist Slideshow, Zoom, and Close buttons. Per Spec 002, the old "Museum Mat" toggle and bottom shortcut legend row were cleanly excised.
- **Critiques & Areas for Refinement**:
  - **Shutter Flash (`.shutter-flash`)**: Triggers an abrupt full-screen white radial gradient flash on opening (`styles.css:578-593`). This flash is jarring in darkroom mode and can trigger discomfort for light-sensitive users.
  - **Floating Caption Pill (`.lightbox-caption`)**: The caption pill floats *below* the framed artwork (`styles.css:1989-2003`), followed by the thumbnail filmstrip. On smaller laptop viewports (e.g. 1366×768 or 1440×900), the combined height of the top bar + museum mat + caption capsule + filmstrip constrains the actual photographic viewport to less than 58dvh.

### 2.7 Footer & Colophon (`#inquire`)
- **Commission Inquiry**:
  - High visual appeal: clear headline `Let Us Hold Your Moment in Light`, descriptive service areas, and prominent editorial email button.
- **Colophon**:
  - Clean typography for the studio colophon and social links.
  - *Critique*: The telemetry block on the right (`14.2726° N, 121.1239° E` and live clock `CABUYAO, PH · 05:27 PM PHT` via `Intl.DateTimeFormat`) continues the faux-military / terminal aesthetic. Luxury client services (wedding monographs, debutante portraits) benefit from romantic, artistic localization (e.g., *"Crafted in Cabuyao, Laguna — Available across CALABARZON"*), not latitude/longitude GPS strings.

---

## 3. Typography & Palette Evaluation

### 3.1 The 5-Font Conundrum
A fundamental rule of luxury graphic design is **typographic restraint** (typically 1 serif family for editorial authority + 1 neutral sans family for functional labels). 

EysiClicks currently loads and renders five distinct, competing type styles:

| Font Name | Category | Current Usage in Codebase | Visual Mood | Fit for Photography Portfolio |
|---|---|---|---|---|
| **Dreamer** (`fonts/Dreamer.otf`) | Ultra-bold condensed brutalist sans | Hero Title (`.hero-title`), Footer Logo (`.logo-ft`), Nav Monogram | Loud, aggressive, streetwear, poster-brutalist | ❌ **Poor**. Clashes violently with romantic pre-debuts and sacred baccalaureate ceremonies. |
| **Tropikal** (`fonts/Tropikal.otf`) | High-contrast display serif | Category Tabs (`.cat-tab`) | Expressive, decorative, cultural, avant-garde | ⚠️ **Marginal**. High character, but used isolated on 3 buttons next to modern sans. |
| **EB Garamond** (Google Fonts) | Classical Renaissance serif | Lead text, quotes, captions, section titles, numbers | Timeless, literary, dignified, archival | ✅ **Excellent**. The ideal primary editorial voice for EysiClicks. |
| **Playfair Display** (Google Fonts) | Transitional high-contrast display serif | Loaded in HTML `<head>`, used as fallback for Garamond | Elegant, editorial, magazine | ⚠️ **Redundant**. Conflicts with EB Garamond when loaded simultaneously. |
| **TT Interphases** (`fonts/TT-Interphases-*.ttf`) | Neo-grotesque modern UI sans | Body text, nav links, buttons, orientation controls | Clean, neutral, high legibility, contemporary | ✅ **Excellent**. The ideal secondary functional UI font. |
| **ui-monospace** | System Monospace | Viewfinders, EXIF telemetry, plate numbers, dates | Technical, code, terminal | ⚠️ **Overused**. Appropriate only for subtle catalog numbering, not prominent UI headings. |

#### Specific Typographic Clashes Observed:
1. **Hero Headline vs. Tagline**:
   - `EYSI CLICKS` in `Dreamer` (brutalist, compressed, screaming caps) sits immediately above *"We take photos as a return ticket to a moment otherwise gone"* in `EB Garamond` italic. The abrupt shift from heavy industrial poster type to fragile classical French serif creates acute visual friction.
2. **Gallery Toolbar Disconnection**:
   - The left category tabs use `Tropikal` (`font-size: 0.86rem; letter-spacing: 0.06em; text-transform: uppercase`).
   - The adjacent orientation toggles use `TT Interphases` (`font-size: 0.64rem; letter-spacing: 0.14em`).
   - The count badges inside the orientation toggles use `ui-monospace`.
   - Result: Three different typefaces appear within 40 pixels of vertical space.

### 3.2 Micro-Typography Legibility Analysis
The codebase repeatedly sets font sizes well below accessible readability thresholds (12px):
- `.vf-coord`: `0.48rem` (~7.7px)
- `.nav-logo-folio`: `0.48rem` (~7.7px)
- `.focal-scale-title`: `0.48rem` (~7.7px)
- `.photo-tag`: `0.5rem` (~8px)
- `.about-plate-badge`: `0.5rem` (~8px)
- `.sig-title`: `0.52rem` (~8.3px)
- `.cat-chapter-badge`: `0.54rem` (~8.6px)
- `.footer-telemetry`: `0.54rem` (~8.6px)

*Standard*: Web Content Accessibility Guidelines and Apple Human Interface Guidelines mandate a minimum body size of 16px and functional secondary captions of 12–14px. Sub-10px fonts become blurry or illegible on non-Retina displays and fail low-vision accessibility audits.

### 3.3 Color Palette & Contrast Evaluation

```
LIGHT THEME ("Archival Daylight")
┌────────────────────────────────────────────────────────┐
│ --bg:               #faf8f5 (Warm Archival Linen)      │
│ --bg2:              #f2efe9 (Alabaster Warm Gray)      │
│ --surface:          #ffffff (Pure White Mat)           │
│ --text:             #111111 (Rich Deep Charcoal)       │
│ --accent-bronze:    #8c7355 (Muted Antique Bronze)     │
└────────────────────────────────────────────────────────┘

DARKROOM THEME ("Obsidian Darkroom")
┌────────────────────────────────────────────────────────┐
│ --bg:               #0a0a0b (Deep Obsidian / Black)    │
│ --bg2:              #121214 (Carbon Tint)              │
│ --surface:          #151518 (Dark Slate)               │
│ --text:             #f4f1ea (Warm Archival Off-White)  │
│ --accent-bronze:    #c5ad8d (Warm Champagne Bronze)    │
└────────────────────────────────────────────────────────┘
```

- **Contrast Ratios**:
  - `--text` (`#111111`) on `--bg` (`#faf8f5`): **17.5:1** (Passes WCAG AAA).
  - `--text` (`#f4f1ea`) on `--bg` (`#0a0a0b`): **18.1:1** (Passes WCAG AAA).
  - `--accent-bronze` (`#8c7355`) on `--bg` (`#faf8f5`): **4.62:1** (Passes WCAG AA for normal text, AAA for large).
  - Muted text `--text-muted` (`rgba(17,17,17, 0.66)`): **6.2:1** (Passes AA).
  - Subtle text `--text-subtle` (`rgba(17,17,17, 0.45)`): **3.85:1** (⚠️ Fails WCAG AA 4.5:1 threshold for small text).
- **Mood Alignment**:
  - The warm ivory and deep obsidian color choices are exceptional for photography. Unlike clinical stark white (`#ffffff`) or harsh pitch black (`#000000`), the subtle warmth honors skin tones in portraiture and highlights the natural light of outdoor ceremonies.
  - The bronze accent evokes antique darkroom chemistry and gold leaf monograph embossing.

---

## 4. Responsive & Interactive Behavior Audit

### 4.1 Responsive Breakpoint Audit
The stylesheet (`styles.css`) contains **12 separate, disconnected media queries**:
`max-width: 1200px`, `1080px`, `1024px`, `960px`, `820px`, `780px`, `760px`, `720px`, `680px`, `640px`, `600px`, `520px`.

This fragmentation causes disjointed layout jumps rather than a fluid, predictable responsive scale:
- At `1080px`: The studio subtitle `ARCHIVE NO. 26` disappears from the logo.
- At `1024px`: The vertical scroll chronicle (`.focal-scale`) vanishes abruptly.
- At `960px`: Both the floating hero frames and the centered nav HUD pill disappear.
- At `680px`: Nav link padding drops, and the theme label collapses to icon-only.
- At `640px`: Corner viewfinder brackets and lightbox EXIF text disappear.

### 4.2 Mobile Navigation & Touch Targets
On mobile screens (375px–430px wide):
- The navigation bar attempts to display the logo image, 4 text navigation links, and the theme switch button all in a single row (`styles.css:413-435`).
- The link font size shrinks to `0.6rem` (~9.6px) with vertical padding of only `0.3rem` (~4.8px), resulting in a vertical target of ~24px.
- Visitors attempting to tap "Philosophy" or "Archive" on a mobile touchscreen frequently mis-tap adjacent links.
- **Recommendation**: Implement a dedicated mobile overlay or clean minimalist bottom drawer navigation when viewports drop below 768px.

### 4.3 Gallery Grid Layout Flexibility
In `styles.css:1609-1625`:
- Mobile: 2 columns.
- Tablet (600px+): 4 columns.
- Desktop (960px+): 5 columns.

*The Sparse Row Defect*:
In categories with limited assets of a specific orientation:
- `predebut` landscape has only **3 photos**.
- `events` portrait has only **2 photos**.
On a 5-column desktop grid, viewing `events` in portrait shows only 2 narrow cards on the far left, leaving 3/5ths of the screen completely empty. This makes the portfolio look barren and under-populated. A dynamic masonry or mixed-orientation grid solves this completely.

### 4.4 Motion Design & Interactive Micro-Behaviors
- **Pacing**:
  - Hero staggered entrance takes **1.95s** to complete.
  - Hover transitions on photo items use a custom shutter ease: `cubic-bezier(0.16, 1, 0.3, 1)` with durations between 0.35s and 0.7s. While the easing curve is smooth, the sheer number of simultaneous animated properties (transform, filter, opacity, box-shadow, border-color) causes frame drops on integrated GPUs.
- **Custom Optical Loupe Cursor (`.cursor-loupe`)**:
  - Implemented in `app.js:280-326` and `styles.css:181-224`.
  - A dark glass capsule (`INSPECT PLATE`) follows the mouse pointer via `requestAnimationFrame`.
  - *Critique*: Custom trailing cursors introduce DOM lag, obscure photo captions during inspection, and are universally recognized as an amateur web developer trend. Standard browser cursors (`cursor: zoom-in`, `cursor: pointer`) are instantaneous and superior.

---

## 5. Identification of Vibe-Coded / Amateurish Artifacts

A comprehensive synthesis of elements across the current site that betray an unedited AI prompt origin rather than bespoke human art direction:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                      VIBE-CODED ANTI-PATTERNS IDENTIFIED                               │
├────────────────────────────────┬───────────────────────────────────────────────────────┤
│ The "Camera HUD / Telemetry"   │ Fake viewfinder corner brackets, EXIF labels in       │
│ Obsession                      │ hero corners, 4 hover reticles per card, live GPS     │
│                                │ coordinates, live digital terminal clock.             │
├────────────────────────────────┼───────────────────────────────────────────────────────┤
│ The Floating Tilted Card Hero  │ 4 tilted photo frames in hero negative space that     │
│ Cliché                         │ vanish under 960px; delays initial photo engagement.  │
├────────────────────────────────┼───────────────────────────────────────────────────────┤
│ The SaaS Metric Counter        │ "03 Curated Chapters", "28 Archival Plates", "IV-A"   │
│ Ledger                         │ presented like a tech startup KPI dashboard.          │
├────────────────────────────────┼───────────────────────────────────────────────────────┤
│ The Trailing Custom Cursor     │ Floating capsule tracking pointer with text label     │
│                                │ ("INSPECT PLATE"), adding lag and visual clutter.     │
├────────────────────────────────┼───────────────────────────────────────────────────────┤
│ 2-Second Staggered Animation   │ 12 separate cascading delays before page elements are │
│ Lock                           │ interactable on initial landing.                      │
├────────────────────────────────┼───────────────────────────────────────────────────────┤
│ Disjointed 5-Font Mix          │ Brutalist poster sans + tropical serif + Garamond     │
│                                │ italic + tech UI sans + monospace in one interface.   │
├────────────────────────────────┼───────────────────────────────────────────────────────┤
│ Shutter Flash Bloom            │ Sudden stark white burst on opening the photo viewer, │
│                                │ creating visual aggression in darkroom mode.          │
└────────────────────────────────┴───────────────────────────────────────────────────────┘
```

---

## 6. Actionable Design Recommendations & Bespoke Gallery Roadmap

To transform EysiClicks into a bespoke, museum-grade portfolio that commands premium client commissions, the following roadmap is recommended:

### Phase 1: High Priority (P1) — Elimination of Gimmicks & Noise

#### 1.1 Strip the Camera HUD and Telemetry Chrome
- **Remove** the corner viewfinder reticles (`.viewfinder`) and EXIF text (`35MM · f/1.4`, `ISO 100`, etc.) from `#hero`.
- **Remove** the 4 corner hover reticles (`.vf-c-tl`, `.vf-c-tr`, `.vf-c-bl`, `.vf-c-br`) from every `.photo-item`.
- **Remove** the fixed vertical scroll chronicle (`.focal-scale`) from the right screen edge.
- **Remove** the centered `.camera-hud` / `.memory-hud` pill from the top navigation bar.
- **Remove** the custom `.cursor-loupe` follower element and its mousemove JS listeners in `app.js`. Use native `cursor: pointer` on cards and `cursor: zoom-in` on full plates.
- **Remove** the latitude/longitude coordinates (`14.2726° N, 121.1239° E`) and running digital clock from the footer colophon. Replace with quiet, dignified editorial text: *"Cabuyao, Laguna · Available for Private Commissions Across Region IV-A"*.

#### 1.2 Unify into a Disciplined 2-Family Editorial Typographic System
Consolidate the typography into an intentional, high-contrast pairing:
1. **Primary Editorial Display**: `EB Garamond` (or refined `Playfair Display`) for all titles, chapter headings, pull quotes, lead paragraphs, and plate captions.
2. **Secondary Functional Sans**: `TT Interphases` for navigation links, buttons, category tabs, and metadata labels.
3. **Deprecate `Dreamer`**: Replace the loud, compressed brutalist font on the Hero title and footer logo with an elegant editorial title set in `EB Garamond` or clean letter-spaced `TT Interphases`.
4. **Enforce Minimum Type Sizes**: Raise all micro-labels from `0.48rem` (~7.7px) to a minimum of `0.75rem` (12px) with proper tracking (`letter-spacing: 0.12em`).

#### 1.3 Transform the Hero into a Photography-First Statement
- Replace the floating tilted thumbnail cards with a **commanding, high-impact hero image exhibition**:
  - **Hero Option A (Single Archival Masterpiece)**: A prominent, full-height or large-matted hero plate (such as Andrei Capoy's signature Avegail portrait or an evocative events frame) paired with refined, quiet editorial typography.
  - **Hero Option B (Curated 3-Plate Editorial Triptych)**: A calm, perfectly aligned 3-plate horizontal spread showcasing one portrait from each chapter (Pre-Debut, Events, Institutional), honoring architectural museum alignment.
- Compress the entrance animation: eliminate the 12-stage 2-second waterfall delay. Animate the hero in a single, graceful 450ms fade-up.

---

### Phase 2: Medium Priority (P2) — Layout, Gallery Grid & Mobile Polish

#### 2.1 Harmonious Mixed-Aspect Ratio Gallery Grid
- Instead of forcing users to toggle between "Portrait" and "Landscape" (which breaks Pre-Debut into 3 photos and Events into 2 photos), combine portrait and landscape photographs into a unified, responsive editorial layout:
  - Implement a CSS Grid layout with `grid-template-columns: repeat(auto-fill, minmax(280px, 1fr))` and natural aspect ratios (`aspect-ratio: 4/5` and `3/2`).
  - Photographs sit side-by-side naturally, just like a curated magazine layout or gallery exhibition wall.
  - Retain the signature contact sheet plate numbering (`PLATE 01`, `PLATE 02`) and captions.

#### 2.2 Humanize the Philosophy Section
- Remove the 3-column SaaS metric counter (`03 Curated Chapters / 28 Archival Plates / IV-A`).
- Replace it with meaningful artistic narratives:
  - An overview of Andrei Capoy's personal background, documentary approach, and archival color grading process.
  - A clean editorial badge or client praise quote.

#### 2.3 Mobile Navigation & Touch Accessibility
- Provide an accessible touch navigation menu for screens under 768px with minimum 44×44px hit targets.
- Ensure all category filter tabs expand cleanly or scroll horizontally with subtle edge fades and no clipped text.

---

### Phase 3: Polish (P3) — Lightbox & Tactile Archival Nuance

#### 3.1 Refine the Museum Mat Experience
- Maintain the permanent white museum passe-partout matting (`.lightbox-frame-wrap`) established in Feature Spec 002.
- Soften or eliminate the harsh white `shutter-flash` burst in favor of a gentle 250ms opacity cross-fade.
- Reposition the floating caption capsule: instead of hovering awkwardly between the framed plate and the filmstrip, integrate the title and plate number directly into the lower margin of the museum mat itself (resembling an authentic pencil-signed or debossed archival print).
- Optimize vertical space on mobile and tablet so the photograph fills up to 72dvh.

---

## 7. Comparative Benchmark Matrix

| Dimension | Current EysiClicks Implementation | Generic "Vibe-Coded" AI Prototype | Bespoke Luxury Gallery Standard (Target) |
|---|---|---|---|
| **Hero Section** | Staggered 2s letterbox open, 4 tilted floating cards, radial glow, corner viewfinder coords | Floating UI cards, purple gradient, centered button stack, generic slogan | Single monumental hero photograph or disciplined triptych; serene typography |
| **Interface Chrome** | Camera HUD pill in nav, hover reticles on cards, scroll chronicle bar, loupe cursor, GPS | Pulsing status pills, floating badges, custom particle trails, cursor blobs | Invisible, unobtrusive navigation; photographs occupy 90%+ of visual attention |
| **Typography** | 5 clashing typefaces (`Dreamer`, `Tropikal`, `Garamond`, `Interphases`, `Mono`); sub-8px text | Inter/Geist monoculture, uniform text sizes, generic system sans | Cohesive 2-family system: high-contrast editorial serif + quiet neutral sans |
| **Gallery Browsing** | Fractured Portrait vs Landscape toggle producing sparse 2-item rows | Rigid 3-column square cards with neon hover outlines or blur shadows | Curated mixed-orientation grid or masonry spread; generous passe-partout margins |
| **Photographer Bio** | SaaS KPI counter ("28 Archival Plates", "03 Chapters", "IV-A") | Fake user count badges, generic testimonial sliders | Intimate artist statement, authentic portrait, craft philosophy, client praise |
| **Photo Inspection** | Permanent museum mat with harsh white shutter flash and separate floating pill | Generic unstyled overlay with small close "X" and no framing | Seamless darkroom viewer with authentic museum mat and print-debossed captioning |

---

## 8. Conclusion

EysiClicks has genuine photographic talent and a strong thematic core (cherishing and immortalizing life's fleeting moments). By stripping away the synthetic "camera simulator / developer telemetry" gimmicks and establishing typographic cohesion, EysiClicks will achieve the poise, elegance, and distinction of an award-winning freelance photography portfolio.
