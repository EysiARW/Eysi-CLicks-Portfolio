# EYSI CLICKS — Project Guidelines & UI Invariants

## 1. Brand & Communication Invariants
- **Brand Wordmark**: Always write the studio name uniformly as "EYSI CLICKS" (all caps, single space).
- **Social Profiles**:
  - Facebook Page: `https://www.facebook.com/profile.php?id=61564911851468`
  - Personal Facebook: `https://www.facebook.com/Barneylooo/`
  - Do not link to Instagram or mailto unless explicitly instructed.
- **Tone & Mood**: Quiet, warm cream/natural-light fine-art aesthetic with generous whitespace and photo-led priority. Avoid SaaS dashboard jargon ("Monograph", "Archive No.", "Auteur", "Archivist").

## 2. Interactive Card Decks & Fanned Layouts
- **Idle State Visibility**: When arranging photo cards in a fanned deck or overlapping layout, each card must have at least 50%–60% of its surface exposed in the resting/idle state so all photo subjects are clearly visible without requiring interaction.
- **Zero-Jitter In-Place Hover Vectoring**:
  - Never animate fanned elements to a shared center (e.g. `translate(0, -y)`) on hover, as horizontal jumps cause the cursor to slip off the card edge, triggering rapid flicker loops.
  - Hover and `:focus-visible` states must elevate each card strictly along its **own local axis in place** (preserving its resting x-translation offset, e.g. `translate(-130px, -14px)` for left cards, `translate(130px, -14px)` for right cards).
  - Always apply `z-index: 10 !important` immediately on hover and focus to guarantee clean visual layering over adjacent elements.
- **Responsive Viewport Bounding**:
  - Scale card widths and fan offsets proportionally across mobile (<600px), tablet (600px–959px), and desktop (960px+) viewports.
  - Guarantee zero horizontal scroll on small mobile viewports down to 360px.
- **Motion Accessibility**:
  - Respect `prefers-reduced-motion: reduce` by disabling entrance and hover transform transitions.

## 3. Media & SEO Invariants
- **Metadata**: Keep `<link rel="canonical">`, `<meta property="og:url">`, and Open Graph / Twitter image tags pointing to `https://eysiarw.github.io/Eysi-CLicks-Portfolio/og-preview.jpg`.
- **JSON-LD**: Use `LocalBusiness` / `Photographer` schema containing `name`, `url`, `areaServed`, `image`, and `sameAs` array matching the verified Facebook URLs.
- **Image Assets**: Never rename or delete original images. Grid cards use WebP thumbnails with explicit `width`/`height`; Lightbox loads full-resolution source.
