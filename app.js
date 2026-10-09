/* ============================================================
   EYSI CLICKS — app.js
   Single-page portfolio (Home / About / Gallery).
   View-only. No upload logic.
   Sections:
     0. PHOTO DATA — add your photos here
     1. Tab Switching (Gallery)
     2. Lightbox
     3. Init — builds photo grids + restores tab from URL
     4. Nav Scroll Effect + Scrollspy (active link highlight)
   ============================================================ */


/* ── 0. PHOTO DATA — JUST PASTE THE FILE PATH IN ──
   Each category has a portrait list and a landscape list. To add a
   photo, paste its path/filename as a string — that's it, one line
   per photo:

     portrait: [
       "photos/predebut/1.jpg",
       "photos/predebut/2.jpg",
     ],

   - Order in the list = order shown on the page.
   - Caption is generated automatically from the filename (dashes/
     underscores become spaces, first letters capitalized) — so
     "photos/predebut/mica-cake-cutting.jpg" becomes "Mica Cake Cutting".
     Want a specific caption instead? Use an object:
       { src: "photos/predebut/1.jpg", caption: "Golden Hour" }
   - Remove a photo by deleting its line. No HTML editing needed —
     the grids build themselves from these lists.
*/

const CATS = ['predebut', 'events', 'institutional'];

const photoData = {

  predebut: {
    portrait: [
       { src: "predebut/portrait/EYSI-2-22.jpg", caption: "Avegail @18" },
       { src: "predebut/portrait/EYSI-5-5.jpg", caption: "Trisha @20" },
       { src: "predebut/portrait/EYSI-6-3.jpg", caption: "Anne @20" },
       { src: "predebut/portrait/EYSI-7-3.jpg", caption: "Anne @20" },
       { src: "predebut/portrait/EYSI-8-3.jpg", caption: "Anne @20" }
       
    ],
    landscape: [
        { src: "predebut/landscape/EYSI-1-62.jpg", caption: "Avegail @18" },
        { src: "predebut/landscape/EYSI-3-16.jpg", caption: "Avegail @18" },
        { src: "predebut/landscape/EYSI-4-9.jpg", caption: "Trisha @20" }
    ],
  },

  events: {
    portrait: [
       { src: "events/portrait/EYSI-7-3.jpg", caption: "Eddie @75" },
       { src: "events/portrait/EYSI-8-3.jpg", caption: "Eddie @75" },
    ],
    landscape: [
       { src: "events/landscape/EYSI-1-62.jpg", caption: "Pulo Ati-Atihan" },
       { src: "events/landscape/EYSI-1.jpg", caption: "Khel Pangilinan" },
       { src: "events/landscape/EYSI-2-22.jpg", caption: "Pulo Ati-Atihan" },
       { src: "events/landscape/EYSI-3-16.jpg", caption: "Pulo Ati-Atihan" },
       { src: "events/landscape/EYSI-4-9.jpg", caption: "Pulo Ati-Atihan" },
       { src: "events/landscape/EYSI-5-5.jpg", caption: "Eddie @75" },
       { src: "events/landscape/EYSI-5.jpg", caption: "Khel Pangilinan" },
       { src: "events/landscape/EYSI-6-3.jpg", caption: "Eddie @75" },
       { src: "events/landscape/EYSI-9.jpg", caption: "Khel Pangilinan" },
       { src: "events/landscape/EYSI-12.jpg", caption: "Khel Pangilinan" }
    ],
  },

  institutional: {
    landscape: [
      { src: "institutional/EYSI-32.jpg", caption: "Baccalaureate Mass" },
       { src: "institutional/EYSI-37.jpg", caption: "Baccalaureate Mass" },
       { src: "institutional/EYSI-41.jpg", caption: "Baccalaureate Mass" },
       { src: "institutional/EYSI-55.jpg", caption: "Baccalaureate Mass" },
       { src: "institutional/EYSI-109.jpg", caption: "UC - PNC Foundation Week 2026" },
       { src: "institutional/EYSI-145.jpg", caption: "UC - PNC Foundation Week 2026" },
       { src: "institutional/EYSI-152.jpg", caption: "UC - PNC Foundation Week 2026" },
       { src: "institutional/EYSI-189.jpg", caption: "UC - PNC Foundation Week 2026" }
    ],
  },

};

// Each category remembers its own orientation instead of sharing one
// global toggle. Pre-Debut opens in Portrait; Events and Institutional
// open in Landscape. Switching the toggle only changes whichever
// category tab you're currently looking at.
const defaultOrientation = {
  predebut:      'portrait',
  events:        'landscape',
  institutional: 'landscape',
};
let categoryOrientation = { ...defaultOrientation };

// Turns a plain string entry into {src, caption}; leaves object
// entries (custom captions) as-is.
function normalizePhoto(entry) {
  if (typeof entry !== 'string') return entry;
  const filename = entry.split('/').pop().split('.')[0];
  const caption = filename
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());
  return { src: entry, caption };
}


/* ── 1. TAB SWITCHING (Gallery) ── */

function switchTab(cat) {
  if (!CATS.includes(cat)) return;

  document.querySelectorAll('.cat-tab').forEach(tab => {
    const isActive = tab.dataset.tab === cat;
    tab.classList.toggle('active', isActive);
    tab.setAttribute('aria-selected', isActive);
    tab.tabIndex = isActive ? 0 : -1;
  });

  document.querySelectorAll('.cat-panel').forEach(panel => {
    panel.classList.remove('active');
  });

  const panel = document.getElementById('panel-' + cat);
  if (panel) panel.classList.add('active');

  // Build this tab's grid (in its own remembered orientation) the
  // first time it's actually opened, and sync the Portrait/Landscape
  // toggle to reflect that category's current mode.
  ensureRendered(cat);
  updateOrientToggleUI(cat);

  // Keep the URL shareable/refreshable without a full page reload.
  const url = new URL(window.location);
  url.searchParams.set('tab', cat);
  history.replaceState(null, '', url);
}

document.querySelectorAll('.cat-tab[data-tab]').forEach(tab => {
  tab.addEventListener('click', () => switchTab(tab.dataset.tab));
});

// Arrow-key navigation between tabs, per the standard ARIA tablist pattern.
const tabListEl = document.querySelector('.cat-tabs');
if (tabListEl) {
  tabListEl.addEventListener('keydown', e => {
    const tabs = Array.from(tabListEl.querySelectorAll('.cat-tab'));
    const currentIndex = tabs.indexOf(document.activeElement);
    if (currentIndex === -1) return;

    let newIndex = null;
    if (e.key === 'ArrowRight') newIndex = (currentIndex + 1) % tabs.length;
    if (e.key === 'ArrowLeft')  newIndex = (currentIndex - 1 + tabs.length) % tabs.length;
    if (e.key === 'Home')       newIndex = 0;
    if (e.key === 'End')        newIndex = tabs.length - 1;

    if (newIndex !== null) {
      e.preventDefault();
      tabs[newIndex].focus();
      switchTab(tabs[newIndex].dataset.tab);
    }
  });
}


/* ── 2. LIGHTBOX ── */

let lightboxImages = [];  // [{ src, caption }]
let lightboxIdx    = 0;

function triggerShutterFlash() {
  const flash = document.getElementById('shutter-flash');
  if (!flash) return;
  flash.classList.add('flash-active');
  requestAnimationFrame(() => {
    setTimeout(() => {
      flash.classList.remove('flash-active');
    }, 140);
  });
}

let lastFocusedElement = null;

function openLightbox(images, idx) {
  const lightbox = document.getElementById('lightbox');
  if (!lightbox) return;
  lastFocusedElement = document.activeElement;
  triggerShutterFlash();
  lightboxImages = images;
  lightboxIdx    = idx;
  updateLightbox();
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
  const closeBtn = lightbox.querySelector('.lightbox-close');
  if (closeBtn) closeBtn.focus();
}

function updateLightbox() {
  if (!lightboxImages.length) return;
  const { src, caption } = lightboxImages[lightboxIdx];
  const img  = document.getElementById('lightbox-img');
  if (img) { 
    img.src = src; 
    img.alt = caption || 'Portfolio photo'; 
  }

  // Preload neighboring photos for instant transition
  if (lightboxImages.length > 1) {
    const nextIdx = (lightboxIdx + 1) % lightboxImages.length;
    const prevIdx = (lightboxIdx - 1 + lightboxImages.length) % lightboxImages.length;
    const pNext = new Image();
    pNext.src = lightboxImages[nextIdx].src;
    const pPrev = new Image();
    pPrev.src = lightboxImages[prevIdx].src;
  }
}

function closeLightbox() {
  const lightbox = document.getElementById('lightbox');
  if (!lightbox) return;
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
  if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
    lastFocusedElement.focus();
  }
}

function lightboxNav(dir) {
  if (!lightboxImages.length) return;
  lightboxIdx = (lightboxIdx + dir + lightboxImages.length) % lightboxImages.length;
  updateLightbox();
}

// Backdrop click & Touch Swipe support
const lightboxEl = document.getElementById('lightbox');
if (lightboxEl) {
  lightboxEl.addEventListener('click', function (e) {
    if (e.target === this) closeLightbox();
  });

  // Mobile Touch Gestures
  let touchStartX = 0;
  let touchStartY = 0;
  let touchEndX   = 0;
  let touchEndY   = 0;
  let isMultiTouch = false;

  lightboxEl.addEventListener('touchstart', e => {
    if (e.touches.length > 1) {
      isMultiTouch = true;
      return;
    }
    isMultiTouch = false;
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
    touchEndX   = touchStartX;
    touchEndY   = touchStartY;
  }, { passive: true });

  lightboxEl.addEventListener('touchmove', e => {
    if (e.touches.length > 1) isMultiTouch = true;
    if (e.touches.length === 1) {
      touchEndX = e.touches[0].clientX;
      touchEndY = e.touches[0].clientY;
    }
  }, { passive: true });

  lightboxEl.addEventListener('touchend', () => {
    if (isMultiTouch) return;
    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;
    const absX   = Math.abs(deltaX);
    const absY   = Math.abs(deltaY);

    // Horizontal swipe: threshold 45px, clearly horizontal direction
    if (absX > 45 && absX > absY * 1.2) {
      if (deltaX < 0) {
        lightboxNav(1);  // Swipe left -> Next photo
      } else {
        lightboxNav(-1); // Swipe right -> Previous photo
      }
    } else if (deltaY > 80 && absX < 60) {
      // Downward swipe -> Dismiss lightbox
      closeLightbox();
    }
  }, { passive: true });
}

// Keyboard navigation
document.addEventListener('keydown', e => {
  const lb = document.getElementById('lightbox');
  if (!lb || !lb.classList.contains('open')) return;
  if (e.key === 'Escape')     closeLightbox();
  if (e.key === 'ArrowLeft')  lightboxNav(-1);
  if (e.key === 'ArrowRight') lightboxNav(1);
});


/* ── 3. INIT — builds photo grids + restores tab from URL ── */
/*
   Reads the photoData object above and generates the <figure>
   markup for each grid automatically. You never need to touch
   the HTML — just edit the arrays in section 0.
*/

function buildGrid(gridId, rawImages) {
  const grid = document.getElementById(gridId);
  if (!grid) return;

  grid.innerHTML = '';

  if (!rawImages || !rawImages.length) {
    const empty = document.createElement('div');
    empty.className = 'empty-state';
    empty.innerHTML = `
      <p class="empty-state-title">Series Curated in Alternate Format</p>
      <p class="empty-state-sub">Switch orientation above to explore this collection.</p>
    `;
    grid.appendChild(empty);
    return;
  }

  const images = rawImages.map(normalizePhoto);

  images.forEach((image, idx) => {
    const figure = document.createElement('figure');
    figure.className = 'photo-item';

    // 4 Viewfinder focus corners
    ['tl', 'tr', 'bl', 'br'].forEach(pos => {
      const corner = document.createElement('span');
      corner.className = `vf-c vf-c-${pos}`;
      corner.setAttribute('aria-hidden', 'true');
      figure.appendChild(corner);
    });

    // Cherished Moment index badge (e.g. MOMENT 01)
    const tag = document.createElement('span');
    tag.className = 'photo-tag';
    tag.textContent = `MOMENT ${String(idx + 1).padStart(2, '0')}`;
    figure.appendChild(tag);

    const img = document.createElement('img');
    img.src = image.src;
    img.alt = image.caption || '';
    img.loading = 'lazy';     // don't fetch until near viewport
    img.decoding = 'async';   // don't block the main thread decoding it

    const figcaption = document.createElement('figcaption');
    figcaption.className = 'photo-overlay';

    const metaRow = document.createElement('div');
    metaRow.className = 'photo-meta-row';
    metaRow.innerHTML = `<span>STILLED IN LIGHT</span><span>·</span><span>HELD FOREVER</span>`;

    const label = document.createElement('span');
    label.className = 'photo-label';
    label.textContent = image.caption || '';

    figcaption.appendChild(metaRow);
    figcaption.appendChild(label);
    figure.appendChild(img);
    figure.appendChild(figcaption);

    // Interactive 3D micro-tilt only for desktop fine pointers
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      let tiltRAF = null;
      figure.addEventListener('mousemove', e => {
        if (tiltRAF) cancelAnimationFrame(tiltRAF);
        tiltRAF = requestAnimationFrame(() => {
          const w = figure.offsetWidth || 300;
          const h = figure.offsetHeight || 380;
          const x = (e.offsetX / w) - 0.5;
          const y = (e.offsetY / h) - 0.5;
          figure.style.transform = `perspective(700px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-4px)`;
        });
      }, { passive: true });

      figure.addEventListener('mouseleave', () => {
        if (tiltRAF) cancelAnimationFrame(tiltRAF);
        figure.style.transform = '';
      });
    }

    figure.addEventListener('click', () => openLightbox(images, idx));

    // Keyboard support — figures aren't natively focusable/actionable.
    figure.tabIndex = 0;
    figure.setAttribute('role', 'button');
    figure.setAttribute('aria-label', 'View photo: ' + (image.caption || 'Untitled'));
    figure.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightbox(images, idx);
      }
    });

    grid.appendChild(figure);
  });
}

// Squares off an incomplete last row so the gallery never ends in a
// dangling gap. Rather than recompute the column count (fragile — it'd
// have to track every breakpoint/orientation rule in JS), this just
// asks the browser which tiles actually landed in the bottom row (they
// share the same offsetTop) and flags them to grow. CSS (.fill-row)
// then lets flexbox split the leftover width evenly between exactly
// those tiles — so the last row always reaches full width, and since
// they all grow from the same starting width by the same amount, they
// stay the same height as each other too.
function balanceGrid(gridId) {
  const grid = document.getElementById(gridId);
  if (!grid) return;

  const items = Array.from(grid.querySelectorAll('.photo-item'));
  items.forEach(item => item.classList.remove('fill-row'));
  if (!items.length) return;

  const lastRowTop = items[items.length - 1].offsetTop;
  for (let i = items.length - 1; i >= 0 && items[i].offsetTop === lastRowTop; i--) {
    items[i].classList.add('fill-row');
  }
}

// Tracks which orientation each category's grid was most recently
// built with (or undefined if it hasn't been built yet). Used so we
// only rebuild a grid when its orientation actually changed.
let renderedOrientation = {};

function getActiveCat() {
  const activeTab = document.querySelector('.cat-tab.active');
  return activeTab ? activeTab.dataset.tab : CATS[0];
}

function renderCategory(cat) {
  let orientation = categoryOrientation[cat];
  const hasCurrent = Array.isArray(photoData[cat]?.[orientation]) && photoData[cat][orientation].length > 0;

  // Auto-fallback if remembered orientation is empty for this category
  if (!hasCurrent) {
    if (Array.isArray(photoData[cat]?.landscape) && photoData[cat].landscape.length > 0) {
      orientation = 'landscape';
    } else if (Array.isArray(photoData[cat]?.portrait) && photoData[cat].portrait.length > 0) {
      orientation = 'portrait';
    }
    categoryOrientation[cat] = orientation;
    updateOrientToggleUI(cat);
  }

  const images = photoData[cat]?.[orientation] || [];

  const grid = document.getElementById('grid-' + cat);
  if (grid) grid.classList.toggle('orient-landscape', orientation === 'landscape');

  buildGrid('grid-' + cat, images);
  balanceGrid('grid-' + cat);

  renderedOrientation[cat] = orientation;
}

// Builds a category's grid only if it hasn't been built yet, or if
// its orientation has changed since it was last built.
function ensureRendered(cat) {
  if (renderedOrientation[cat] !== categoryOrientation[cat]) renderCategory(cat);
}

// Syncs the Portrait/Landscape toggle buttons to whichever mode the
// given category is currently in, disabling options with 0 photos.
function updateOrientToggleUI(cat) {
  const mode = categoryOrientation[cat];
  const hasPortrait = Array.isArray(photoData[cat]?.portrait) && photoData[cat].portrait.length > 0;
  const hasLandscape = Array.isArray(photoData[cat]?.landscape) && photoData[cat].landscape.length > 0;

  document.querySelectorAll('.orient-btn').forEach(btn => {
    const orient = btn.dataset.orient;
    const isAvailable = (orient === 'portrait' && hasPortrait) || (orient === 'landscape' && hasLandscape);
    const isActive = orient === mode;

    btn.classList.toggle('active', isActive);
    btn.setAttribute('aria-pressed', isActive);
    btn.disabled = !isAvailable;
    btn.classList.toggle('disabled', !isAvailable);
    btn.title = !isAvailable
      ? `No ${orient} photos in this collection`
      : `View ${orient} photos`;
  });
}

// Portrait / Landscape toggle — only changes the orientation of the
// category tab currently being viewed; prevents switching if mode is empty.
function setOrientation(mode) {
  const cat = getActiveCat();
  const available = photoData[cat]?.[mode];
  if (!available || !available.length) return;

  categoryOrientation[cat] = mode;
  updateOrientToggleUI(cat);
  renderCategory(cat);
}

document.querySelectorAll('.orient-btn[data-orient]').forEach(btn => {
  btn.addEventListener('click', () => setOrientation(btn.dataset.orient));
});

// Initial render: build whichever tab is active on load (Pre-Debut,
// per the HTML's default "active" class) in its default orientation.
const initialCat = getActiveCat();
updateOrientToggleUI(initialCat);
renderCategory(initialCat);

// If we arrived via index.html?tab=events (or similar), open that tab.
// switchTab() only builds that tab's grid if it isn't already built,
// so this never triggers a redundant rebuild of the default tab.
const requestedTab = new URLSearchParams(window.location.search).get('tab');
if (requestedTab && CATS.includes(requestedTab)) {
  switchTab(requestedTab);
}


// Column count changes at the 600px/900px breakpoints (and on phone
// rotation), which changes what "a full last row" means — so the grid
// needs to be rebalanced whenever the viewport width crosses one of
// those. We rebuild+rebalance the tab that's actually visible right
// away; other tabs are just marked stale so ensureRendered() rebuilds
// them next time the user opens one, instead of doing invisible work.
let resizeTimer = null;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    renderedOrientation = {};
    renderCategory(getActiveCat());
  }, 150);
});


/* ── 4. NAV SCROLL EFFECT + SCROLLSPY + CAMERA HUD ── */

const navEl         = document.getElementById('navbar');
const navLinks       = document.querySelectorAll('.nav-link[data-section]');
const sections        = Array.from(navLinks)
  .map(link => document.getElementById(link.dataset.section))
  .filter(Boolean);

// Story & Memory Chapter parameters per section
const hudChapter = document.getElementById('hud-chapter');

const chaptersBySection = {
  hero:    'Fleeting Moments Held Forever',
  about:   'The Heart Behind The Lens',
  gallery: 'Heirlooms Preserved in Time',
};

let currentSectionId = null;

function updateTelemetryHUD(sectionId) {
  if (currentSectionId === sectionId) return;
  currentSectionId = sectionId;
  const chapterText = chaptersBySection[sectionId] || chaptersBySection.hero;
  if (hudChapter) hudChapter.textContent = chapterText;
}

// Optical Focal Scale and Parallax Corner Tracking
const focalBar   = document.getElementById('focal-bar');
const focalThumb = document.getElementById('focal-thumb');
const focalMarks = document.querySelectorAll('.focal-val');
const vfTl       = document.querySelector('.vf-tl');
const vfTr       = document.querySelector('.vf-tr');
const vfBl       = document.querySelector('.vf-bl');
const vfBr       = document.querySelector('.vf-br');

function updateOpticalScrollHUD() {
  const isDesktop = window.innerWidth > 1024;
  if (isDesktop) {
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPct = docHeight > 0 ? Math.min(1, Math.max(0, window.scrollY / docHeight)) : 0;

    if (focalBar)   focalBar.style.height = (scrollPct * 100) + '%';
    if (focalThumb) focalThumb.style.top  = (scrollPct * 100) + '%';

    focalMarks.forEach(mark => {
      const target = parseFloat(mark.dataset.scroll || 0);
      mark.classList.toggle('active', Math.abs(scrollPct - target) < 0.18);
    });
  }

  // Viewfinder corner parallax only while hero section is near viewport
  if (window.scrollY < window.innerHeight * 1.1) {
    const shift = Math.min(22, window.scrollY * 0.05);
    if (vfTl) vfTl.style.transform = `translate3d(${-shift}px, ${-shift}px, 0)`;
    if (vfTr) vfTr.style.transform = `translate3d(${shift}px, ${-shift}px, 0)`;
    if (vfBl) vfBl.style.transform = `translate3d(${-shift}px, ${shift}px, 0)`;
    if (vfBr) vfBr.style.transform = `translate3d(${shift}px, ${shift}px, 0)`;
  }
}

function updateNavOnScroll() {
  if (navEl) {
    const isScrolled = window.scrollY > 60;
    navEl.style.background = isScrolled
      ? 'rgba(250, 248, 245, 0.98)'
      : 'linear-gradient(to bottom, rgba(250, 248, 245, 0.95), transparent)';
    navEl.style.boxShadow = isScrolled ? '0 4px 20px rgba(0, 0, 0, 0.04)' : 'none';
    navEl.style.borderBottom = isScrolled ? '1px solid rgba(17, 17, 17, 0.08)' : '1px solid transparent';
  }

  updateOpticalScrollHUD();

  if (!sections.length) return;

  // Highlight active section & update camera HUD telemetry
  const scrollPos = window.scrollY + 140;
  let current = sections[0];
  sections.forEach(section => {
    if (section.offsetTop <= scrollPos) current = section;
  });

  navLinks.forEach(link => {
    link.classList.toggle('active', link.dataset.section === current.id);
  });

  if (current) updateTelemetryHUD(current.id);
}

// requestAnimationFrame-throttled scroll handler
let scrollTicking = false;
window.addEventListener('scroll', () => {
  if (!scrollTicking) {
    window.requestAnimationFrame(() => {
      updateNavOnScroll();
      scrollTicking = false;
    });
    scrollTicking = true;
  }
}, { passive: true });

updateNavOnScroll();