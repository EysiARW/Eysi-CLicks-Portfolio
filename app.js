/* ============================================================
   EYSI CLICKS — app.js
   Object-Oriented Luxury Portfolio Architecture
   Sections:
     0. PHOTO DATA — add or remove your photos here
     1. Domain Model & Value Objects (PhotoAsset, PortfolioRepository)
     2. ViewTransitionCoordinator (Same-Document View Transitions API)
     3. ThemeManager (Archival Daylight / Darkroom Obsidian)
     4. CursorLoupeController (Fine-Pointer Optical Reticle)
     5. LightboxController (Darkroom Loupe, Museum Mat, Slideshow)
     6. GalleryPresenter (Tabs, Orientation, Contact Sheet Proofs)
     7. TelemetryHudController (Scrollspy, Focal Continuum, Local Clock)
     8. Application Bootstrap
   ============================================================ */


/* ── 0. PHOTO DATA — JUST PASTE THE FILE PATH IN ── */

const CATS = ['predebut', 'events', 'institutional'];

const photoData = {

  predebut: {
    portrait: [
      { src: "predebut/portrait/EYSI-2-22.jpg", caption: "Avegail @18", alt: "Debutante in an off-shoulder ivory gown seated gracefully outdoors in golden natural light" },
      { src: "predebut/portrait/EYSI-5-5.jpg", caption: "Trisha @20", alt: "Portrait of a smiling young woman outdoors in soft evening sunlight" },
      { src: "predebut/portrait/EYSI-6-3.jpg", caption: "Anne @20", alt: "Close-up portrait of a young woman in an outdoor natural light setting" },
      { src: "predebut/portrait/EYSI-7-3.jpg", caption: "Anne @20", alt: "Portrait of a smiling young woman with lush green foliage background" },
      { src: "predebut/portrait/EYSI-8-3.jpg", caption: "Anne @20", alt: "Candid outdoor portrait of a young woman bathed in soft daylight" }
    ],
    landscape: [
      { src: "predebut/landscape/EYSI-1-62.jpg", caption: "Avegail @18", alt: "Young woman in an elegant evening gown walking through an outdoor landscaped garden" },
      { src: "predebut/landscape/EYSI-3-16.jpg", caption: "Avegail @18", alt: "Wide shot of a debutante posed in an evening gown outdoors during sunset" },
      { src: "predebut/landscape/EYSI-4-9.jpg", caption: "Trisha @20", alt: "Outdoor portrait of a young woman posed gracefully in warm ambient light" }
    ],
  },

  events: {
    portrait: [
      { src: "events/portrait/EYSI-7-3.jpg", caption: "Eddie @75", alt: "Portrait of an elderly celebrant smiling warmly at a milestone birthday gathering" },
      { src: "events/portrait/EYSI-8-3.jpg", caption: "Eddie @75", alt: "Candid portrait of an elderly man celebrating a milestone surrounded by family" }
    ],
    landscape: [
      { src: "events/landscape/EYSI-1-62.jpg", caption: "Pulo Ati-Atihan", alt: "Festival performers dancing in vibrant colorful feathered headdresses and traditional attire" },
      { src: "events/landscape/EYSI-1.jpg", caption: "Khel Pangilinan", alt: "Gathering of friends and celebrants smiling together at a celebration" },
      { src: "events/landscape/EYSI-2-22.jpg", caption: "Pulo Ati-Atihan", alt: "Street dancers in ornate headdresses performing energetically during a cultural festival" },
      { src: "events/landscape/EYSI-3-16.jpg", caption: "Pulo Ati-Atihan", alt: "Vibrant festival dancers in traditional regalia participating in a street parade" },
      { src: "events/landscape/EYSI-4-9.jpg", caption: "Pulo Ati-Atihan", alt: "Dynamic group portrait of cultural festival performers in elaborate costumes" },
      { src: "events/landscape/EYSI-5-5.jpg", caption: "Eddie @75", alt: "Celebrant seated with family and guests at a milestone banquet celebration" },
      { src: "events/landscape/EYSI-5.jpg", caption: "Khel Pangilinan", alt: "Event guests conversing and smiling warmly during an evening reception" },
      { src: "events/landscape/EYSI-6-3.jpg", caption: "Eddie @75", alt: "Family members gathered around a celebration table sharing a joyful moment" },
      { src: "events/landscape/EYSI-9.jpg", caption: "Khel Pangilinan", alt: "Candid moment of event attendees socializing and laughing together" },
      { src: "events/landscape/EYSI-12.jpg", caption: "Khel Pangilinan", alt: "Group of smiling guests posing together at an celebratory event" },
      { src: "events/landscape/EYSI-19.jpg", caption: "Eddie @75", alt: "Illuminated neon Happy Birthday sign behind a blue milestone cake with gold candles" },
      { src: "events/landscape/EYSI-5-e75.jpg", caption: "Eddie @75", alt: "Matriarch in white lace seated gracefully in a tufted armchair surrounded by balloons" },
      { src: "events/landscape/EYSI-45.jpg", caption: "Eddie @75", alt: "Celebrant Eddie waving joyfully to cheering guests upon his grand entrance" },
      { src: "events/landscape/EYSI-53.jpg", caption: "Eddie @75", alt: "Daughter tenderly cupping Eddie's cheek during an affectionate embrace" },
      { src: "events/landscape/EYSI-57.jpg", caption: "Eddie @75", alt: "Eddie and his partner walking hand-in-hand smiling warmly at guests" },
      { src: "events/landscape/EYSI-77.jpg", caption: "Eddie @75", alt: "Eddie blowing out his birthday candles as delicate smoke drifts before a glowing neon sign" },
      { src: "events/landscape/EYSI-78.jpg", caption: "Eddie @75", alt: "Celebrant Eddie addressing his family and guests with a microphone from his armchair" },
      { src: "events/landscape/EYSI-100.jpg", caption: "Eddie @75", alt: "Eddie smiling joyfully as he opens a lucky red envelope during the celebration" },
      { src: "events/landscape/EYSI-114.jpg", caption: "Eddie @75", alt: "Daughter wiping away tears of joy during a heartfelt speech for her father" },
      { src: "events/landscape/EYSI-165.jpg", caption: "Eddie @75", alt: "Eddie smiling warmly while watching video messages from overseas family on an iPad" }
    ],
  },

  institutional: {
    landscape: [
      { src: "institutional/EYSI-32.jpg", caption: "Baccalaureate Mass", alt: "Graduates and faculty gathered in formal attire during a baccalaureate mass" },
      { src: "institutional/EYSI-37.jpg", caption: "Baccalaureate Mass", alt: "Academic procession of graduates and university faculty in church ceremonies" },
      { src: "institutional/EYSI-41.jpg", caption: "Baccalaureate Mass", alt: "Students and attendees standing solemnly during a formal academic ceremony" },
      { src: "institutional/EYSI-55.jpg", caption: "Baccalaureate Mass", alt: "Large gathering of graduates and educators attending a formal university service" },
      { src: "institutional/EYSI-109.jpg", caption: "UC - PNC Foundation Week 2026", alt: "University students and faculty participating in outdoor foundation week celebrations" },
      { src: "institutional/EYSI-145.jpg", caption: "UC - PNC Foundation Week 2026", alt: "Campus community gathered outdoors during an institutional celebration" },
      { src: "institutional/EYSI-152.jpg", caption: "UC - PNC Foundation Week 2026", alt: "Group of students in university uniform smiling during campus festivities" },
      { src: "institutional/EYSI-189.jpg", caption: "UC - PNC Foundation Week 2026", alt: "Wide view of university grounds with students and staff celebrating foundation week" },
      { src: "institutional/EYSI-1.jpg", caption: "Academic Excellence Award", alt: "Wide view of an awards hall with a lit stage, banner and decorated banquet tables" },
      { src: "institutional/EYSI-21.jpg", caption: "Academic Excellence Award", alt: "Guest raising a phone to photograph the awards ceremony in a softly lit hall" },
      { src: "institutional/EYSI-26.jpg", caption: "Academic Excellence Award", alt: "Live band in matching mint outfits performing on stage during the awards night" },
      { src: "institutional/EYSI-35.jpg", caption: "Academic Excellence Award", alt: "Guests in barong shirts smiling and applauding at a banquet table" },
      { src: "institutional/EYSI-36.jpg", caption: "Academic Excellence Award", alt: "Man in a white barong standing near the stage as colorful beams of light fan out" },
      { src: "institutional/EYSI-42.jpg", caption: "Academic Excellence Award", alt: "Graduates wearing yellow sashes standing together at the awards dinner" },
      { src: "institutional/EYSI-5.jpg", caption: "Academic Excellence Award", alt: "Table number card glowing among crystal glasses and warm candlelight" },
      { src: "institutional/EYSI-57.jpg", caption: "Academic Excellence Award", alt: "Three awardees on stage holding framed plaques beneath the Academic Excellence Award banner" },
      { src: "institutional/EYSI-63.jpg", caption: "Academic Excellence Award", alt: "Host presenting an awardee on stage under bright pink stage lighting" },
      { src: "institutional/EYSI-7.jpg", caption: "Academic Excellence Award", alt: "Two guests taking a selfie amid golden stage light at the venue" }
    ],
  },

};


/* ── 1. DOMAIN MODEL & REPOSITORY ── */

class PhotoAsset {
  #src;
  #webpSrc;
  #caption;
  #alt;
  #category;
  #orientation;
  #index;

  static #OPTICAL_PROFILES = {
    predebut:      'NATURAL LIGHT',
    events:        'NATURAL LIGHT',
    institutional: 'NATURAL LIGHT',
  };

  constructor(entry, category, orientation, index) {
    const normalized = PhotoAsset.#normalizeEntry(entry);
    this.#src         = normalized.src;
    this.#webpSrc     = normalized.src.replace(/\.jpe?g$/i, '.webp');
    this.#caption     = normalized.caption;
    this.#alt         = normalized.alt || '';
    this.#category    = category;
    this.#orientation = orientation;
    this.#index       = index;
  }

  static #normalizeEntry(entry) {
    if (!entry || (typeof entry !== 'object' && typeof entry !== 'string')) {
      return { src: '', caption: 'Cherished Moment', alt: '' };
    }
    if (typeof entry !== 'string') {
      return {
        src: (entry && entry.src) || '',
        caption: (entry && entry.caption) || 'Untitled Moment',
        alt: (entry && entry.alt) || ''
      };
    }
    const filename = entry.split('/').pop().split('.')[0];
    const caption = filename
      .replace(/[-_]+/g, ' ')
      .replace(/\b\w/g, c => c.toUpperCase());
    return { src: entry, caption: caption || 'Cherished Moment', alt: '' };
  }

  get src()         { return this.#src; }
  get webpSrc()     { return this.#webpSrc; }
  get caption()     { return this.#caption; }
  get alt()         { return this.#alt; }
  get category()    { return this.#category; }
  get orientation() { return this.#orientation; }
  get index()       { return this.#index; }

  get visualAlt() {
    if (this.#alt) {
      return `${this.#caption} — ${this.#alt} (${this.plateNumber})`;
    }
    return `${this.#caption} — ${this.categoryLabel} (${this.plateNumber})`;
  }

  get plateNumber() {
    return `PLATE ${String(this.#index + 1).padStart(2, '0')}`;
  }

  get categoryLabel() {
    const labels = {
      predebut:      'PRE-DEBUT',
      events:        'EVENTS',
      institutional: 'INSTITUTIONAL',
    };
    return labels[this.#category] || 'PORTFOLIO';
  }

  get opticalTelemetry() {
    return 'NATURAL LIGHT';
  }
}


class PortfolioRepository {
  #rawStore;
  #categories;

  constructor(rawStore, categories = CATS) {
    this.#rawStore   = rawStore;
    this.#categories = [...categories];
  }

  getCategories() {
    return [...this.#categories];
  }

  isValidCategory(cat) {
    return this.#categories.includes(cat);
  }

  hasOrientation(cat, orientation) {
    const list = this.#rawStore[cat]?.[orientation];
    return Array.isArray(list) && list.length > 0;
  }

  getOrientationCount(cat, orientation) {
    const list = this.#rawStore[cat]?.[orientation];
    return Array.isArray(list) ? list.length : 0;
  }

  getCategoryTotalCount(cat) {
    return this.getOrientationCount(cat, 'portrait') + this.getOrientationCount(cat, 'landscape');
  }

  getTotalArchivalPlates() {
    return this.#categories.reduce((sum, cat) => sum + this.getCategoryTotalCount(cat), 0);
  }

  getPhotos(cat, orientation = null) {
    if (!this.#rawStore[cat]) return [];
    if (orientation) {
      const rawList = this.#rawStore[cat][orientation] || [];
      return rawList.map((entry, idx) => new PhotoAsset(entry, cat, orientation, idx));
    }
    const portraits = (this.#rawStore[cat].portrait || []).map(entry => ({ entry, orient: 'portrait' }));
    const landscapes = (this.#rawStore[cat].landscape || []).map(entry => ({ entry, orient: 'landscape' }));
    const merged = [...portraits, ...landscapes];
    return merged.map(({ entry, orient }, idx) => new PhotoAsset(entry, cat, orient, idx));
  }
}


/* ── 2. VIEW TRANSITION COORDINATOR ── */

class ViewTransitionCoordinator {
  #reducedMotionQuery;

  constructor() {
    this.#reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  }

  get prefersReducedMotion() {
    return this.#reducedMotionQuery.matches;
  }

  run(mutationCallback, afterCallback = null) {
    if (!document.startViewTransition || this.prefersReducedMotion) {
      mutationCallback();
      if (typeof afterCallback === 'function') afterCallback();
      return;
    }

    try {
      const transition = document.startViewTransition(() => {
        mutationCallback();
      });
      if (typeof afterCallback === 'function') {
        transition.finished
          .catch(() => {})
          .finally(() => {
            afterCallback();
          });
      }
    } catch {
      mutationCallback();
      if (typeof afterCallback === 'function') afterCallback();
    }
  }
}


/* ── 3. THEME MANAGER (DAYLIGHT / DARKROOM) ── */

class ThemeManager {
  #storageKey = 'eysiclicks-theme';
  #toggleBtn;
  #toggleLabel;
  #metaThemeColor;
  #transitionCoordinator;

  constructor(transitionCoordinator) {
    this.#transitionCoordinator = transitionCoordinator;
    this.#toggleBtn      = document.getElementById('theme-toggle');
    this.#toggleLabel    = document.getElementById('theme-toggle-label');
    this.#metaThemeColor = document.getElementById('meta-theme-color');
    this.#init();
  }

  #init() {
    const saved = localStorage.getItem(this.#storageKey);
    const initial = saved === 'dark' ? 'dark' : 'light';
    this.#applyTheme(initial, false);

    if (this.#toggleBtn) {
      this.#toggleBtn.addEventListener('click', () => {
        const next = this.currentTheme === 'dark' ? 'light' : 'dark';
        this.#transitionCoordinator.run(() => {
          this.#applyTheme(next, true);
        });
      });
    }
  }

  get currentTheme() {
    return document.documentElement.getAttribute('data-theme') || 'light';
  }

  #applyTheme(theme, persist) {
    document.documentElement.setAttribute('data-theme', theme);
    if (persist) {
      try { localStorage.setItem(this.#storageKey, theme); } catch {}
    }

    const isDark = theme === 'dark';
    if (this.#toggleLabel) {
      this.#toggleLabel.textContent = isDark ? 'Light Mode' : 'Dark Mode';
    }
    if (this.#toggleBtn) {
      this.#toggleBtn.setAttribute(
        'aria-label',
        isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'
      );
    }
    if (this.#metaThemeColor) {
      this.#metaThemeColor.setAttribute('content', isDark ? '#0a0a0b' : '#faf8f5');
    }
  }
}


/* ── 4. BESPOKE OPTICAL LOUPE CURSOR CONTROLLER ── */

class CursorLoupeController {
  #el;
  #textEl;
  #finePointerQuery;
  #targetX = -100;
  #targetY = -100;
  #rafId = null;

  constructor() {
    this.#el     = document.getElementById('cursor-loupe');
    this.#textEl = document.getElementById('cursor-loupe-text');
    this.#finePointerQuery = window.matchMedia('(hover: hover) and (pointer: fine)');
    if (this.#el && this.#finePointerQuery.matches) {
      this.#bindGlobalTracking();
    }
  }

  #bindGlobalTracking() {
    window.addEventListener('mousemove', e => {
      this.#targetX = e.clientX;
      this.#targetY = e.clientY;
      if (!this.#rafId) {
        this.#rafId = requestAnimationFrame(() => {
          if (this.#el) {
            this.#el.style.transform = `translate3d(${this.#targetX + 16}px, ${this.#targetY + 16}px, 0) scale(1)`;
          }
          this.#rafId = null;
        });
      }
    }, { passive: true });
  }

  attachInteractiveTarget(element, label = 'INSPECT PHOTO') {
    if (!this.#el || !this.#finePointerQuery.matches || !element) return;
    element.addEventListener('mouseenter', () => {
      if (this.#textEl) this.#textEl.textContent = label;
      this.#el.classList.add('active');
    });
    element.addEventListener('mouseleave', () => {
      this.#el.classList.remove('active');
    });
  }

  hide() {
    if (this.#el) this.#el.classList.remove('active');
  }
}


/* ── 5. LIGHTBOX CONTROLLER ("THE DARKROOM LOUPE") ── */

const LightboxState = Object.freeze({
  CLOSED: 0,
  VIEWING: 1,
  ZOOMED: 2,
  SLIDESHOW: 3,
});

class LightboxController {
  #lightboxEl;
  #imgEl;
  #titleEl;
  #counterEl;
  #catBadgeEl;
  #exifEl;
  #filmstripEl;
  #slideshowBarEl;
  #playBtn;
  #playLabel;
  #zoomBtn;
  #transitionCoordinator;
  #cursorLoupe;

  #state = LightboxState.CLOSED;
  #images = [];
  #currentIndex = 0;
  #isZoomed = false;
  #panX = 0;
  #panY = 0;
  #isPanning = false;
  #dragStartX = 0;
  #dragStartY = 0;
  #startPanX = 0;
  #startPanY = 0;
  #hasDragged = false;
  #slideshowInterval = null;
  #lastFocusedElement = null;
  #activeSourceFigure = null;

  constructor(transitionCoordinator, cursorLoupe) {
    this.#transitionCoordinator = transitionCoordinator;
    this.#cursorLoupe    = cursorLoupe;
    this.#lightboxEl     = document.getElementById('lightbox');
    this.#imgEl          = document.getElementById('lightbox-img');
    this.#titleEl        = document.getElementById('lightbox-title');
    this.#counterEl      = document.getElementById('lightbox-counter');
    this.#catBadgeEl     = document.getElementById('lightbox-cat-badge');
    this.#exifEl         = document.getElementById('lightbox-exif');
    this.#filmstripEl    = document.getElementById('lightbox-filmstrip');
    this.#slideshowBarEl = document.getElementById('lightbox-slideshow-bar');
    this.#playBtn        = document.getElementById('lb-play-btn');
    this.#playLabel      = document.getElementById('lb-play-label');
    this.#zoomBtn        = document.getElementById('lb-zoom-btn');

    this.#bindEvents();
  }

  get state() {
    return this.#state;
  }

  get isOpen() {
    return Boolean(this.#lightboxEl && this.#lightboxEl.classList.contains('open'));
  }

  get currentIndex() {
    return this.#currentIndex;
  }

  open(images, index, sourceFigure = null) {
    if (!images || !images.length || !this.#lightboxEl) return;
    this.#cursorLoupe?.hide();
    this.#lastFocusedElement = document.activeElement;
    this.#images = images;
    this.#currentIndex = Math.max(0, Math.min(index, images.length - 1));
    this.#state = LightboxState.VIEWING;

    this.#clearSourceTransitionClass();
    if (sourceFigure) {
      this.#activeSourceFigure = sourceFigure;
      sourceFigure.classList.add('vt-source');
    }

    this.#renderFilmstrip();
    this.#updateView();

    this.#transitionCoordinator.run(
      () => {
        if (sourceFigure) sourceFigure.classList.remove('vt-source');
        this.#lightboxEl.classList.add('open');
        document.body.style.overflow = 'hidden';
      },
      () => {
        const closeBtn = this.#lightboxEl.querySelector('.lightbox-close');
        if (closeBtn) closeBtn.focus();
      }
    );
  }

  close() {
    if (!this.#lightboxEl || !this.isOpen) return;
    this.stopSlideshow();
    this.#resetZoom();
    this.#state = LightboxState.CLOSED;

    // Clear photo URL hash cleanly
    if (window.history && typeof window.history.replaceState === 'function') {
      try {
        const cleanUrl = window.location.pathname + (window.location.search || '');
        window.history.replaceState(null, '', cleanUrl);
      } catch (_) {}
    }
    if (window.location && window.location.hash) {
      window.location.hash = '';
    }

    const restoreTarget = this.#lastFocusedElement;
    const sourceFigure = this.#activeSourceFigure;

    this.#transitionCoordinator.run(
      () => {
        this.#lightboxEl.classList.remove('open');
        document.body.style.overflow = '';
        if (sourceFigure) sourceFigure.classList.add('vt-source');
      },
      () => {
        this.#clearSourceTransitionClass();
        if (restoreTarget && typeof restoreTarget.focus === 'function') {
          restoreTarget.focus();
        }
      }
    );
  }

  navigate(dir) {
    if (!this.#images.length) return;
    if (this.#state === LightboxState.ZOOMED || this.#isZoomed) {
      this.#resetZoom();
      this.#state = LightboxState.VIEWING;
    } else if (this.#state === LightboxState.SLIDESHOW || this.#slideshowInterval) {
      if (this.#slideshowInterval) {
        clearInterval(this.#slideshowInterval);
        this.#slideshowInterval = window.setInterval(() => {
          this.navigate(1);
        }, 3500);
      }
    }
    this.#currentIndex = (this.#currentIndex + dir + this.#images.length) % this.#images.length;
    if (this.#imgEl && !this.#transitionCoordinator.prefersReducedMotion) {
      this.#imgEl.classList.remove('frame-crossfade');
      void this.#imgEl.offsetWidth;
      this.#imgEl.classList.add('frame-crossfade');
    }
    this.#updateView();
  }

  toggleZoom() {
    if (!this.#imgEl) return;
    if (this.#state === LightboxState.SLIDESHOW || this.#slideshowInterval) {
      this.stopSlideshow();
      this.#isZoomed = true;
      this.#state = LightboxState.ZOOMED;
      this.#imgEl.classList.add('zoomed');
      if (this.#zoomBtn) {
        this.#zoomBtn.setAttribute('aria-pressed', 'true');
      }
    } else if (this.#state === LightboxState.ZOOMED || this.#isZoomed) {
      this.#resetZoom();
      this.#state = LightboxState.VIEWING;
    } else {
      this.#isZoomed = true;
      this.#state = LightboxState.ZOOMED;
      this.#imgEl.classList.add('zoomed');
      if (this.#zoomBtn) {
        this.#zoomBtn.setAttribute('aria-pressed', 'true');
      }
    }
  }

  toggleSlideshow() {
    if (this.#state === LightboxState.SLIDESHOW || this.#slideshowInterval) {
      this.stopSlideshow();
    } else {
      this.startSlideshow();
    }
  }

  startSlideshow() {
    if (this.#slideshowInterval || this.#images.length <= 1) return;
    this.#resetZoom();
    this.#state = LightboxState.SLIDESHOW;
    if (this.#playBtn) this.#playBtn.setAttribute('aria-pressed', 'true');
    if (this.#playLabel) this.#playLabel.textContent = 'Pause';
    if (this.#slideshowBarEl) this.#slideshowBarEl.classList.add('playing');

    this.#slideshowInterval = window.setInterval(() => {
      this.navigate(1);
    }, 3500);
  }

  stopSlideshow() {
    if (this.#slideshowInterval) {
      clearInterval(this.#slideshowInterval);
      this.#slideshowInterval = null;
    }
    if (this.#state === LightboxState.SLIDESHOW) {
      this.#state = LightboxState.VIEWING;
    }
    if (this.#playBtn) this.#playBtn.setAttribute('aria-pressed', 'false');
    if (this.#playLabel) this.#playLabel.textContent = 'Slideshow';
    if (this.#slideshowBarEl) this.#slideshowBarEl.classList.remove('playing');
  }

  #resetZoom() {
    this.#isZoomed = false;
    this.#panX = 0;
    this.#panY = 0;
    this.#isPanning = false;
    this.#hasDragged = false;
    if (this.#state === LightboxState.ZOOMED) {
      this.#state = LightboxState.VIEWING;
    }
    if (this.#imgEl) {
      this.#imgEl.classList.remove('zoomed');
      this.#imgEl.classList.remove('is-panning');
      this.#imgEl.style.transform = '';
    }
    if (this.#zoomBtn) this.#zoomBtn.setAttribute('aria-pressed', 'false');
  }

  #clearSourceTransitionClass() {
    document.querySelectorAll('.photo-item.vt-source').forEach(el => el.classList.remove('vt-source'));
    this.#activeSourceFigure = null;
  }

  #updateView() {
    if (!this.#images.length) return;
    const current = this.#images[this.#currentIndex];

    if (this.#imgEl) {
      this.#imgEl.src = current.src;
      const catLabel = current.categoryLabel || 'PORTFOLIO';
      const plateNo = current.plateNumber || `PLATE ${String(this.#currentIndex + 1).padStart(2, '0')}`;
      const captionText = current.caption || 'Photograph';
      this.#imgEl.alt = current.visualAlt || `${captionText} — ${catLabel} (${plateNo})`;
    }
    const hasCaption = Boolean(current.caption && current.caption.trim());
    if (this.#titleEl) {
      this.#titleEl.textContent = hasCaption ? current.caption : '';
      this.#titleEl.style.display = hasCaption ? '' : 'none';
    }
    if (this.#counterEl) {
      this.#counterEl.textContent = `${String(this.#currentIndex + 1).padStart(2, '0')} / ${String(this.#images.length).padStart(2, '0')}`;
    }
    if (this.#catBadgeEl && current.categoryLabel) {
      this.#catBadgeEl.textContent = current.categoryLabel;
    }
    if (this.#exifEl && current.opticalTelemetry) {
      this.#exifEl.textContent = current.opticalTelemetry;
    }

    // ARIA live announcement
    const announcer = document.getElementById('gallery-announcer');
    if (announcer && current) {
      const plate = current.plateNumber || `Plate ${this.#currentIndex + 1}`;
      const caption = current.caption || 'Photo';
      announcer.textContent = `${plate}: ${caption} (${this.#currentIndex + 1} of ${this.#images.length})`;
    }

    // Synchronize URL hash with active photo slug
    const slug = (current.src && current.src.split('/').pop().replace(/\.[^.]+$/, '')) || String(this.#currentIndex + 1);
    const newHash = `#photo-${slug}`;
    if (window.location && window.location.hash !== newHash) {
      window.location.hash = newHash;
    }

    this.#syncFilmstripActive();

    // Preload adjacent frames for zero-latency browsing
    if (this.#images.length > 1) {
      const nextIdx = (this.#currentIndex + 1) % this.#images.length;
      const prevIdx = (this.#currentIndex - 1 + this.#images.length) % this.#images.length;
      new Image().src = this.#images[nextIdx].src;
      new Image().src = this.#images[prevIdx].src;
    }
  }

  #renderFilmstrip() {
    if (!this.#filmstripEl) return;
    this.#filmstripEl.innerHTML = '';

    this.#images.forEach((image, idx) => {
      const thumb = document.createElement('button');
      thumb.type = 'button';
      const isActive = idx === this.#currentIndex;
      thumb.className = 'filmstrip-thumb' + (isActive ? ' active' : '');
      thumb.setAttribute('role', 'tab');
      thumb.setAttribute('aria-selected', String(isActive));
      thumb.setAttribute('aria-label', `View photo ${idx + 1}: ${image.caption || 'Untitled'}`);

      const img = document.createElement('img');
      img.src = image.webpSrc || image.src.replace(/\.jpe?g$/i, '.webp');
      img.alt = `Thumbnail preview for ${image.caption || 'plate'} (${image.plateNumber || String(idx + 1).padStart(2, '0')})`;
      img.loading = 'lazy';
      img.decoding = 'async';
      img.onerror = () => { img.src = image.src; };

      thumb.appendChild(img);
      thumb.addEventListener('click', e => {
        e.stopPropagation();
        if (this.#currentIndex !== idx) {
          this.#resetZoom();
          this.#currentIndex = idx;
          this.#updateView();
        }
      });

      this.#filmstripEl.appendChild(thumb);
    });
  }

  #syncFilmstripActive() {
    if (!this.#filmstripEl) return;
    const thumbs = this.#filmstripEl.querySelectorAll('.filmstrip-thumb');
    thumbs.forEach((thumb, idx) => {
      const isActive = idx === this.#currentIndex;
      thumb.classList.toggle('active', isActive);
      thumb.setAttribute('aria-selected', String(isActive));
      if (isActive) {
        thumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    });
  }

  #handleHashChange(evt) {
    let hash = window.location?.hash || '';
    if (evt && evt.newURL) {
      try {
        const u = new URL(evt.newURL);
        if (u.hash) hash = u.hash;
      } catch (_) {
        const hashIdx = evt.newURL.indexOf('#');
        if (hashIdx !== -1) hash = evt.newURL.slice(hashIdx);
      }
    }
    if (!hash || !hash.startsWith('#photo-')) {
      if (this.isOpen) {
        this.close();
      }
      return;
    }

    const current = this.#images[this.#currentIndex];
    const currentSlug = (current?.src && current.src.split('/').pop().replace(/\.[^.]+$/, '')) || String(this.#currentIndex + 1);
    if (`#photo-${currentSlug}` === hash) return;

    const targetSlug = hash.replace(/^#photo-/, '').toLowerCase();
    const foundIdx = this.#images.findIndex((img, idx) => {
      const slug = (img.src && img.src.split('/').pop().replace(/\.[^.]+$/, '')) || String(idx + 1);
      return slug.toLowerCase() === targetSlug;
    });

    if (foundIdx !== -1) {
      this.#resetZoom();
      this.#currentIndex = foundIdx;
      this.#updateView();
    }
  }

  #bindEvents() {
    if (!this.#lightboxEl) return;

    this.#lightboxEl.addEventListener('click', e => {
      if (e.target === this.#lightboxEl || e.target.classList.contains('lightbox-stage')) {
        this.close();
      }
    });

    const closeBtn = document.getElementById('lightbox-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', e => {
        e.stopPropagation();
        this.close();
      });
    }

    const prevBtn = document.getElementById('lightbox-prev');
    if (prevBtn) {
      prevBtn.addEventListener('click', e => {
        e.stopPropagation();
        this.navigate(-1);
      });
    }

    const nextBtn = document.getElementById('lightbox-next');
    if (nextBtn) {
      nextBtn.addEventListener('click', e => {
        e.stopPropagation();
        this.navigate(1);
      });
    }

    if (this.#imgEl) {
      this.#imgEl.addEventListener('mousedown', e => {
        if (!this.#isZoomed) return;
        e.preventDefault();
        this.#dragStartX = e.clientX;
        this.#dragStartY = e.clientY;
        this.#startPanX  = this.#panX;
        this.#startPanY  = this.#panY;
        this.#hasDragged = false;
        this.#isPanning  = true;
      });

      window.addEventListener('mousemove', e => {
        if (!this.#isPanning || !this.#isZoomed) return;
        const deltaX = e.clientX - this.#dragStartX;
        const deltaY = e.clientY - this.#dragStartY;
        if (Math.hypot(deltaX, deltaY) > 4) {
          this.#hasDragged = true;
          this.#imgEl.classList.add('is-panning');
        }
        const maxPan = 180;
        this.#panX = Math.max(-maxPan, Math.min(maxPan, this.#startPanX + deltaX));
        this.#panY = Math.max(-maxPan, Math.min(maxPan, this.#startPanY + deltaY));
        this.#imgEl.style.transform = `scale(1.85) translate3d(${this.#panX / 1.85}px, ${this.#panY / 1.85}px, 0)`;
      });

      window.addEventListener('mouseup', () => {
        if (this.#isPanning) {
          this.#isPanning = false;
          this.#imgEl?.classList.remove('is-panning');
        }
      });

      this.#imgEl.addEventListener('click', e => {
        e.stopPropagation();
        if (this.#hasDragged) {
          this.#hasDragged = false;
          return;
        }
        this.toggleZoom();
      });
    }

    if (this.#playBtn) {
      this.#playBtn.addEventListener('click', e => {
        e.stopPropagation();
        this.toggleSlideshow();
      });
    }

    if (this.#zoomBtn) {
      this.#zoomBtn.addEventListener('click', e => {
        e.stopPropagation();
        this.toggleZoom();
      });
    }

    window.addEventListener('hashchange', evt => {
      this.#handleHashChange(evt);
    });
    window.addEventListener('popstate', evt => {
      this.#handleHashChange(evt);
    });

    // Touch swipe navigation and zoom drag-to-pan
    let touchStartX = 0;
    let touchStartY = 0;
    let touchEndX   = 0;
    let touchEndY   = 0;
    let isMultiTouch = false;

    this.#lightboxEl.addEventListener('touchstart', e => {
      if (e.touches.length > 1) {
        isMultiTouch = true;
        return;
      }
      isMultiTouch = false;
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
      touchEndX   = touchStartX;
      touchEndY   = touchStartY;

      if (this.#isZoomed && e.touches.length === 1) {
        this.#dragStartX = touchStartX;
        this.#dragStartY = touchStartY;
        this.#startPanX  = this.#panX;
        this.#startPanY  = this.#panY;
        this.#hasDragged = false;
        this.#isPanning  = true;
      }
    }, { passive: true });

    this.#lightboxEl.addEventListener('touchmove', e => {
      if (e.touches.length > 1) isMultiTouch = true;
      if (e.touches.length === 1) {
        touchEndX = e.touches[0].clientX;
        touchEndY = e.touches[0].clientY;

        if (this.#isZoomed && this.#isPanning) {
          const deltaX = touchEndX - this.#dragStartX;
          const deltaY = touchEndY - this.#dragStartY;
          if (Math.hypot(deltaX, deltaY) > 4) {
            this.#hasDragged = true;
            this.#imgEl?.classList.add('is-panning');
          }
          const maxPan = 180;
          this.#panX = Math.max(-maxPan, Math.min(maxPan, this.#startPanX + deltaX));
          this.#panY = Math.max(-maxPan, Math.min(maxPan, this.#startPanY + deltaY));
          if (this.#imgEl) {
            this.#imgEl.style.transform = `scale(1.85) translate3d(${this.#panX / 1.85}px, ${this.#panY / 1.85}px, 0)`;
          }
        }
      }
    }, { passive: true });

    this.#lightboxEl.addEventListener('touchend', () => {
      if (this.#isZoomed) {
        this.#isPanning = false;
        this.#imgEl?.classList.remove('is-panning');
        return;
      }
      if (isMultiTouch) return;
      const deltaX = touchEndX - touchStartX;
      const deltaY = touchEndY - touchStartY;
      const absX   = Math.abs(deltaX);
      const absY   = Math.abs(deltaY);

      if (absX > 45 && absX > absY * 1.2) {
        this.navigate(deltaX < 0 ? 1 : -1);
      } else if (deltaY > 80 && absX < 60) {
        this.close();
      }
    }, { passive: true });

    // Keyboard shortcuts & Focus Trap
    document.addEventListener('keydown', e => {
      if (!this.isOpen) return;

      if (e.key === 'Escape') {
        e.preventDefault();
        if (this.#isZoomed) {
          this.#resetZoom();
        } else {
          this.close();
        }
        return;
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        this.navigate(-1);
        return;
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        this.navigate(1);
        return;
      }
      if (e.key === 'p' || e.key === 'P') {
        e.preventDefault();
        this.toggleSlideshow();
        return;
      }
      if (e.key === 'z' || e.key === 'Z') {
        e.preventDefault();
        this.toggleZoom();
        return;
      }
      if (e.key === 'Tab') {
        const focusable = Array.from(this.#lightboxEl.querySelectorAll('button:not([disabled])'));
        if (!focusable.length) return;
        const first = focusable[0];
        const last  = focusable[focusable.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    });
  }
}


/* ── 6. GALLERY PRESENTER ── */

class GalleryPresenter {
  #repository;
  #transitionCoordinator;
  #lightbox;
  #cursorLoupe;
  #revealObserver = null;
  #renderedCategories = new Set();

  constructor(repository, transitionCoordinator, lightbox, cursorLoupe) {
    this.#repository            = repository;
    this.#transitionCoordinator = transitionCoordinator;
    this.#lightbox              = lightbox;
    this.#cursorLoupe           = cursorLoupe;

    this.#setupIntersectionObserver();
    this.#populateStaticCounts();
    this.#bindControls();
    this.#bindHeroFloatingFrames();
    this.#initDefaultView();
  }

  get activeCategory() {
    const activeTab = document.querySelector('.cat-tab.active');
    return activeTab ? activeTab.dataset.tab : this.#repository.getCategories()[0];
  }

  switchTab(cat, animate = true, updateHistory = true) {
    if (!this.#repository.isValidCategory(cat)) return;

    const performSwitch = () => {
      document.querySelectorAll('.cat-tab').forEach(tab => {
        const isActive = tab.dataset.tab === cat;
        tab.classList.toggle('active', isActive);
        tab.setAttribute('aria-selected', String(isActive));
        tab.tabIndex = isActive ? 0 : -1;
      });

      document.querySelectorAll('.cat-panel').forEach(panel => {
        panel.classList.remove('active');
      });

      const panel = document.getElementById('panel-' + cat);
      if (panel) panel.classList.add('active');

      this.#ensureRendered(cat);

      if (window.location && typeof history !== 'undefined') {
        const url = new URL(window.location.href);
        const currentParam = url.searchParams.get('tab');
        if (currentParam !== cat) {
          url.searchParams.set('tab', cat);
          if (updateHistory && typeof history.pushState === 'function') {
            history.pushState({ tab: cat }, '', url);
          } else if (typeof history.replaceState === 'function') {
            history.replaceState({ tab: cat }, '', url);
          }
        }
      }
    };

    if (animate) {
      this.#transitionCoordinator.run(performSwitch);
    } else {
      performSwitch();
    }
  }

  renderCategory(cat) {
    const photos = this.#repository.getPhotos(cat);
    this.#buildGridDOM('grid-' + cat, photos);
    this.#renderedCategories.add(cat);
  }

  #ensureRendered(cat) {
    if (!this.#renderedCategories.has(cat)) {
      this.renderCategory(cat);
    }
  }

  #populateStaticCounts() {
    this.#repository.getCategories().forEach(cat => {
      const badge = document.getElementById('count-' + cat);
      if (badge) {
        const count = this.#repository.getCategoryTotalCount(cat);
        badge.textContent = String(count).padStart(2, '0');
      }
    });
  }

  #setupIntersectionObserver() {
    if (!('IntersectionObserver' in window) || this.#transitionCoordinator.prefersReducedMotion) {
      return;
    }
    this.#revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px 40px 0px' });
  }

  #buildGridDOM(gridId, photos) {
    const grid = document.getElementById(gridId);
    if (!grid) return;

    grid.innerHTML = '';
    if (!photos.length) return;

    photos.forEach((asset, idx) => {
      const figure = document.createElement('figure');
      figure.className = 'photo-item';
      figure.style.transitionDelay = `${Math.min(idx * 45, 280)}ms`;

      if (!this.#revealObserver || this.#transitionCoordinator.prefersReducedMotion) {
        figure.classList.add('is-revealed');
      } else {
        this.#revealObserver.observe(figure);
      }

      const picture = document.createElement('picture');
      const sourceWebp = document.createElement('source');
      sourceWebp.srcset = asset.webpSrc;
      sourceWebp.type = 'image/webp';

      const img = document.createElement('img');
      img.src = asset.src;
      img.alt = asset.visualAlt || `${asset.caption} — ${asset.categoryLabel} (${asset.plateNumber})`;
      img.width = asset.orientation === 'portrait' ? 800 : 1200;
      img.height = asset.orientation === 'portrait' ? 1000 : 800;
      img.loading = 'lazy';
      img.decoding = 'async';
      img.onerror = () => {
        img.alt = 'Photograph currently being preserved in archive';
      };

      if (img.complete) {
        img.classList.add('is-loaded');
      } else {
        img.addEventListener('load', () => img.classList.add('is-loaded'), { once: true });
      }

      picture.appendChild(sourceWebp);
      picture.appendChild(img);

      const figcaption = document.createElement('figcaption');
      figcaption.className = 'photo-overlay';

      const label = document.createElement('span');
      label.className = 'photo-label';
      label.textContent = asset.caption;

      figcaption.appendChild(label);
      figure.appendChild(picture);
      figure.appendChild(figcaption);

      this.#cursorLoupe?.attachInteractiveTarget(figure, 'INSPECT');

      const activate = () => this.#lightbox.open(photos, idx, figure);
      figure.addEventListener('click', activate);
      figure.tabIndex = 0;
      figure.setAttribute('role', 'button');
      figure.setAttribute('aria-label', `View photo: ${asset.caption} (${asset.plateNumber})`);
      figure.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          activate();
        }
      });

      grid.appendChild(figure);
    });
  }

  #bindControls() {
    document.querySelectorAll('.cat-tab[data-tab]').forEach(tab => {
      tab.addEventListener('click', () => this.switchTab(tab.dataset.tab));
    });

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
          this.switchTab(tabs[newIndex].dataset.tab);
        }
      });
    }

    window.addEventListener('popstate', e => {
      const tab = e?.state?.tab || new URLSearchParams(window.location?.search || '').get('tab');
      if (tab && this.#repository.isValidCategory(tab) && tab !== this.activeCategory) {
        this.switchTab(tab, true, false);
      }
    });
  }

  #bindHeroFloatingFrames() {
    document.querySelectorAll('.hero-frame').forEach(frame => {
      this.#cursorLoupe?.attachInteractiveTarget(frame, 'VIEW PHOTO');

      const handler = () => {
        const cat = frame.dataset.cat;
        const slug = (frame.dataset.slug || '').toLowerCase();
        const idx = parseInt(frame.dataset.idx, 10) || 0;
        const photos = this.#repository.getPhotos(cat);
        if (!photos.length) return;

        let targetIdx = idx;
        if (slug) {
          const found = photos.findIndex(p => {
            const s = (p.src && p.src.split('/').pop().replace(/\.[^.]+$/, '')) || '';
            return s.toLowerCase() === slug;
          });
          if (found !== -1) targetIdx = found;
        }

        this.#lightbox.open(photos, Math.min(targetIdx, photos.length - 1), null);
      };

      frame.addEventListener('click', handler);
      frame.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handler();
        }
      });
    });
  }

  #initDefaultView() {
    const requestedTab = new URLSearchParams(window.location?.search || '').get('tab');
    const startCat = (requestedTab && this.#repository.isValidCategory(requestedTab))
      ? requestedTab
      : this.activeCategory;
    this.switchTab(startCat, false, false);
    if (window.location && history?.replaceState) {
      const url = new URL(window.location.href);
      url.searchParams.set('tab', startCat);
      history.replaceState({ tab: startCat }, '', url);
    }
    this.#initHashPhoto();
  }

  #initHashPhoto() {
    const hash = window.location?.hash || '';
    if (!hash || !hash.startsWith('#photo-')) return;
    const targetSlug = hash.replace(/^#photo-/, '').toLowerCase();

    for (const cat of this.#repository.getCategories()) {
      const photos = this.#repository.getPhotos(cat);
      const idx = photos.findIndex((p, i) => {
        const s = (p.src && p.src.split('/').pop().replace(/\.[^.]+$/, '')) || String(i + 1);
        return s.toLowerCase() === targetSlug;
      });
      if (idx !== -1) {
        this.switchTab(cat, false);
        this.#lightbox.open(photos, idx, null);
        return;
      }
    }
  }
}


/* ── 7. TELEMETRY HUD & SCROLL CONTINUUM CONTROLLER ── */

class TelemetryHudController {
  #navEl;
  #navLinks;
  #sections;
  #hudChapter;
  #bttBtn;
  #currentSectionId = null;
  #lastScrollY = 0;

  static #CHAPTERS = {
    hero:    'EYSI CLICKS',
    about:   'Andrei C. Capoy',
    gallery: 'Selected Works',
  };

  constructor() {
    this.#navEl      = document.getElementById('navbar');
    this.#navLinks   = Array.from(document.querySelectorAll('.nav-link[data-section]'));
    this.#sections   = this.#navLinks
      .map(link => document.getElementById(link.dataset.section))
      .filter(Boolean);
    this.#hudChapter = document.getElementById('hud-chapter');
    this.#bttBtn     = document.getElementById('back-to-top');

    this.#bindScroll();
    this.#setupScrollspy();
    this.updateOnScroll();
  }

  updateOnScroll() {
    const scrollY = window.scrollY || 0;
    if (this.#navEl) {
      this.#navEl.classList.toggle('is-scrolled', scrollY > 50);

      // Smart hide-on-scroll-down / show-on-scroll-up
      if (scrollY > 120 && scrollY > this.#lastScrollY + 6) {
        this.#navEl.classList.add('nav-hidden');
      } else if (scrollY < this.#lastScrollY - 6 || scrollY <= 50) {
        this.#navEl.classList.remove('nav-hidden');
      }
    }
    if (this.#bttBtn) {
      this.#bttBtn.classList.toggle('visible', scrollY > 480);
    }
    if (scrollY <= 80 && this.#currentSectionId !== 'hero') {
      this.#setActiveSection('hero');
    }
    this.#lastScrollY = scrollY;
  }

  #setupScrollspy() {
    if (!this.#sections.length) return;
    if (typeof IntersectionObserver !== 'undefined') {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.#setActiveSection(entry.target.id);
          }
        });
      }, {
        rootMargin: '-20% 0px -60% 0px',
        threshold: 0.1
      });
      this.#sections.forEach(sec => observer.observe(sec));
    }
  }

  #setActiveSection(id) {
    if (!id || this.#currentSectionId === id) return;
    this.#currentSectionId = id;
    this.#navLinks.forEach(link => {
      link.classList.toggle('active', link.dataset.section === id);
    });
    if (this.#hudChapter) {
      this.#hudChapter.textContent = TelemetryHudController.#CHAPTERS[id] || TelemetryHudController.#CHAPTERS.hero;
    }
  }

  #bindScroll() {
    if (this.#bttBtn) {
      this.#bttBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    let scrollTicking = false;
    window.addEventListener('scroll', () => {
      if (!scrollTicking) {
        window.requestAnimationFrame(() => {
          this.updateOnScroll();
          scrollTicking = false;
        });
        scrollTicking = true;
      }
    }, { passive: true });
  }
}


/* ── 8. EDITORIAL MONOGRAPH MOTION CONTROLLER ── */

class EditorialMotionController {
  #aboutSection;
  #aboutWrap;
  #footerSection;
  #transitionCoordinator;

  constructor(transitionCoordinator) {
    this.#transitionCoordinator = transitionCoordinator;
    this.#aboutSection   = document.getElementById('about');
    this.#aboutWrap      = document.querySelector('.about-wrap');
    this.#footerSection  = document.getElementById('footer');

    this.#initScrollObservers();
    this.#initEntranceCleanup();
  }

  #initScrollObservers() {
    if (this.#transitionCoordinator?.prefersReducedMotion) {
      if (this.#aboutWrap) this.#aboutWrap.classList.add('is-in-view');
      if (this.#footerSection) this.#footerSection.classList.add('is-in-view');
      return;
    }

    if (typeof IntersectionObserver === 'undefined') {
      if (this.#aboutWrap) this.#aboutWrap.classList.add('is-in-view');
      if (this.#footerSection) this.#footerSection.classList.add('is-in-view');
      return;
    }

    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (entry.target === this.#aboutSection) {
            if (this.#aboutWrap) this.#aboutWrap.classList.add('is-in-view');
          } else if (entry.target === this.#footerSection) {
            entry.target.classList.add('is-in-view');
          }
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    if (this.#aboutSection) revealObserver.observe(this.#aboutSection);
    if (this.#footerSection) revealObserver.observe(this.#footerSection);
  }

  #initEntranceCleanup() {
    let settled = false;
    const settle = () => {
      if (settled) return;
      settled = true;
      document.documentElement.classList.add('hero-settled');
    };

    if (this.#transitionCoordinator?.prefersReducedMotion) {
      settle();
      return;
    }

    const cards = document.querySelectorAll('.hero-card');
    let endedCount = 0;
    cards.forEach(card => {
      card.addEventListener('animationend', (e) => {
        if (e.target === card) {
          card.style.willChange = 'auto';
          endedCount++;
          if (endedCount >= cards.length) {
            settle();
          }
        }
      });
    });

    // Fallback timer: ensure hero is marked settled even if animations are suppressed or run in background tab
    setTimeout(settle, 1650);
  }
}


/* ── 9. APPLICATION BOOTSTRAP ── */

const repository            = new PortfolioRepository(photoData, CATS);
const transitionCoordinator = new ViewTransitionCoordinator();
const themeManager          = new ThemeManager(transitionCoordinator);
const cursorLoupe           = new CursorLoupeController();
const lightboxController    = new LightboxController(transitionCoordinator, cursorLoupe);
const galleryPresenter      = new GalleryPresenter(repository, transitionCoordinator, lightboxController, cursorLoupe);
const telemetryHud          = new TelemetryHudController();
const editorialMotion       = new EditorialMotionController(transitionCoordinator);
