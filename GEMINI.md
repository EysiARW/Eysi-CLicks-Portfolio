# EYSI CLICKS — Project Guidelines & UI Invariants

## 1. Brand & Communication Invariants
- **Brand Wordmark**: Always write the studio name uniformly as "EYSI CLICKS" (all caps, single space).
- **Social Profiles**:
  - Facebook Page: `https://www.facebook.com/profile.php?id=61564911851468`
  - Personal Facebook: `https://www.facebook.com/Barneylooo/`
  - Do not link to Instagram or mailto unless explicitly instructed.
- **Tone & Mood**: Quiet, warm cream/natural-light fine-art aesthetic with generous whitespace and photo-led priority. Avoid SaaS dashboard jargon ("Monograph", "Archive No.", "Auteur", "Archivist").
- **Zero-Cost Dependency Invariant**: Never introduce third-party libraries, CDNs, fonts, or external services that may incur usage fees, subscriptions, or credit card requirements. Maintain a 100% self-hosted, zero-fee vanilla architecture.

## 2. Interactive Card Decks & Fanned Layouts
- **Idle State Visibility**: When arranging photo cards in a fanned deck or overlapping layout, each card must have at least 50%–60% of its surface exposed in the resting/idle state so all photo subjects are clearly visible without requiring interaction.
- **Zero-Jitter In-Place Hover Vectoring**:
  - Never animate fanned elements to a shared center (e.g. `translate(0, -y)`) on hover, as horizontal jumps cause the cursor to slip off the card edge, triggering rapid flicker loops.
  - Hover and `:focus-visible` states must elevate each card strictly along its **own local axis in place** (preserving its resting x-translation offset, e.g. `translate(-130px, -14px)` for left cards, `translate(130px, -14px)` for right cards).
  - Always apply `z-index: 10 !important` immediately on hover and focus to guarantee clean visual layering over adjacent elements.
- **Responsive Viewport Bounding**:
  - Scale card widths and fan offsets proportionally across mobile (<600px), tablet (600px–959px), and desktop (960px+) viewports.
  - Guarantee zero horizontal scroll and zero element clipping on small mobile viewports down to **320px** (e.g. iPhone SE 1st gen).
- **Landscape Phone Modal Bounding**:
  - Fullscreen overlays and lightboxes must implement specific handling for mobile landscape orientations (height ≤ 520px, e.g. `667×375`, `844×390`).
  - Constrain image/stage max-height (≤ 50vh / 50dvh) and reduce topbar padding so toolbars and captions never overlap stage media.
- **Motion Accessibility**:
  - Respect `prefers-reduced-motion: reduce` by disabling entrance and hover transform transitions.

## 3. Media, State & Architectural Invariants
- **Metadata**: Keep `<link rel="canonical">`, `<meta property="og:url">`, and Open Graph / Twitter image tags pointing to `https://eysiarw.github.io/Eysi-CLicks-Portfolio/EYSI-3-15.jpg` or `og-preview.jpg`.
- **JSON-LD**: Use `LocalBusiness` / `Photographer` schema containing `name`, `url` (`https://eysiarw.github.io/Eysi-CLicks-Portfolio/`), `areaServed`, `image`, and `sameAs` array matching verified Facebook URLs.
- **Image Assets**: Never rename or delete original images. Grid cards use WebP thumbnails with explicit `width`/`height`; Lightbox loads full-resolution source. Preload the hero LCP image via `<link rel="preload">`.
- **View Transition Safety**: When orchestrating animations with `document.startViewTransition()`, always attach `.catch(() => {})` on `transition.finished` before `.finally()` to suppress unhandled `AbortError` rejections when transitions are superseded by rapid interactions.
- **Browser History & URL State Synchronization**: Any tabbed view or archive filter reflecting URL query parameters (`?tab=`) must synchronize bidirectionally with `history.pushState()` on user click and handle `window.addEventListener('popstate', ...)` for browser Back/Forward navigation.
