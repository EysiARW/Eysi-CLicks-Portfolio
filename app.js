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
      { src: "events/portrait/EYSI-8-3.jpg", caption: "Eddie @75" }
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


/* ── 1. DOMAIN MODEL & REPOSITORY ── */

class PhotoAsset {
  #src;
  #webpSrc;
  #caption;
  #category;
  #orientation;
  #index;

  static #OPTICAL_PROFILES = {
    predebut:      '85MM PRIME · f/1.4 · ISO 100 · NATURAL LIGHT',
    events:        '35MM REPORTAGE · f/1.8 · ISO 400 · AMBIENT',
    institutional: '24-70MM ARCHIVAL · f/2.8 · ISO 200 · DOCUMENTARY',
  };

  constructor(entry, category, orientation, index) {
    const normalized = PhotoAsset.#normalizeEntry(entry);
    this.#src         = normalized.src;
    this.#webpSrc     = normalized.src.replace(/\.jpe?g$/i, '.webp');
    this.#caption     = normalized.caption;
    this.#category    = category;
    this.#orientation = orientation;
    this.#index       = index;
  }

  static #normalizeEntry(entry) {
    if (!entry || (typeof entry !== 'object' && typeof entry !== 'string')) {
      return { src: '', caption: 'Cherished Moment' };
    }
    if (typeof entry !== 'string') {
      return { src: (entry && entry.src) || '', caption: (entry && entry.caption) || 'Untitled Moment' };
    }
    const filename = entry.split('/').pop().split('.')[0];
    const caption = filename
      .replace(/[-_]+/g, ' ')
      .replace(/\b\w/g, c => c.toUpperCase());
    return { src: entry, caption: caption || 'Cherished Moment' };
  }

  get src()         { return this.#src; }
  get webpSrc()     { return this.#webpSrc; }
  get caption()     { return this.#caption; }
  get category()    { return this.#category; }
  get orientation() { return this.#orientation; }
  get index()       { return this.#index; }

  get plateNumber() {
    return `PLATE ${String(this.#index + 1).padStart(2, '0')}`;
  }

  get momentTag() {
    return `PLATE ${String(this.#index + 1).padStart(2, '0')}`;
  }

  get categoryLabel() {
    const labels = {
      predebut:      'PRE-DEBUT MONOGRAPH',
      events:        'EVENTS CHRONICLE',
      institutional: 'INSTITUTIONAL ARCHIVE',
    };
    return labels[this.#category] || 'ARCHIVE PLATE';
  }

  get opticalTelemetry() {
    return PhotoAsset.#OPTICAL_PROFILES[this.#category] || '35MM FULL-FRAME · NATURAL LIGHT';
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

  getPhotos(cat, orientation) {
    const rawList = this.#rawStore[cat]?.[orientation] || [];
    return rawList.map((entry, idx) => new PhotoAsset(entry, cat, orientation, idx));
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
      this.#toggleLabel.textContent = isDark ? 'Daylight' : 'Darkroom';
    }
    if (this.#toggleBtn) {
      this.#toggleBtn.setAttribute(
        'aria-label',
        isDark ? 'Switch to Archival Daylight Mode' : 'Switch to Darkroom Mode'
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

  attachInteractiveTarget(element, label = 'INSPECT PLATE') {
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
  #plateNoEl;
  #counterEl;
  #catBadgeEl;
  #exifEl;
  #filmstripEl;
  #slideshowBarEl;
  #playBtn;
  #playLabel;
  #zoomBtn;
  #shutterFlashEl;
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
    this.#plateNoEl      = document.getElementById('lightbox-plate-no');
    this.#counterEl      = document.getElementById('lightbox-counter');
    this.#catBadgeEl     = document.getElementById('lightbox-cat-badge');
    this.#exifEl         = document.getElementById('lightbox-exif');
    this.#filmstripEl    = document.getElementById('lightbox-filmstrip');
    this.#slideshowBarEl = document.getElementById('lightbox-slideshow-bar');
    this.#playBtn        = document.getElementById('lb-play-btn');
    this.#playLabel      = document.getElementById('lb-play-label');
    this.#zoomBtn        = document.getElementById('lb-zoom-btn');
    this.#shutterFlashEl = document.getElementById('shutter-flash');

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

    this.#triggerShutterFlash();
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

  #triggerShutterFlash() {
    if (!this.#shutterFlashEl || this.#transitionCoordinator.prefersReducedMotion) return;
    this.#shutterFlashEl.classList.add('flash-active');
    requestAnimationFrame(() => {
      setTimeout(() => {
        this.#shutterFlashEl.classList.remove('flash-active');
      }, 130);
    });
  }

  #updateView() {
    if (!this.#images.length) return;
    const current = this.#images[this.#currentIndex];

    if (this.#imgEl) {
      this.#imgEl.src = current.src;
      const catLabel = current.categoryLabel || 'ARCHIVE PLATE';
      const plateNo = current.plateNumber || `PLATE ${String(this.#currentIndex + 1).padStart(2, '0')}`;
      const captionText = current.caption || 'Archival photograph';
      this.#imgEl.alt = `${captionText} — ${catLabel} (${plateNo})`;
    }
    if (this.#titleEl) {
      this.#titleEl.textContent = current.caption || 'Cherished Moment';
    }
    if (this.#plateNoEl) {
      this.#plateNoEl.textContent = current.plateNumber || `PLATE ${String(this.#currentIndex + 1).padStart(2, '0')}`;
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

  #categoryOrientation = {
    predebut:      'portrait',
    events:        'landscape',
    institutional: 'landscape',
  };
  #renderedSignature = {};

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

      this.#ensureValidOrientation(cat);
      this.#updateOrientToggleUI(cat);
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

  setOrientation(mode) {
    const cat = this.activeCategory;
    if (!this.#repository.hasOrientation(cat, mode)) return;
    if (this.#categoryOrientation[cat] === mode) return;

    this.#transitionCoordinator.run(() => {
      this.#categoryOrientation[cat] = mode;
      this.#updateOrientToggleUI(cat);
      this.renderCategory(cat);
    });
  }

  renderCategory(cat) {
    this.#ensureValidOrientation(cat);
    const orientation = this.#categoryOrientation[cat];
    const photos      = this.#repository.getPhotos(cat, orientation);

    const grid = document.getElementById('grid-' + cat);
    if (grid) {
      grid.classList.toggle('orient-landscape', orientation === 'landscape');
    }

    this.#buildGridDOM('grid-' + cat, photos);
    this.#renderedSignature[cat] = orientation;
  }

  #ensureValidOrientation(cat) {
    let orientation = this.#categoryOrientation[cat];
    if (!this.#repository.hasOrientation(cat, orientation)) {
      if (this.#repository.hasOrientation(cat, 'landscape')) {
        orientation = 'landscape';
      } else if (this.#repository.hasOrientation(cat, 'portrait')) {
        orientation = 'portrait';
      }
      this.#categoryOrientation[cat] = orientation;
    }
  }

  #ensureRendered(cat) {
    const expectedSig = this.#categoryOrientation[cat];
    if (this.#renderedSignature[cat] !== expectedSig) {
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

    const totalEl = document.getElementById('ledger-total-plates');
    if (totalEl) {
      totalEl.textContent = String(this.#repository.getTotalArchivalPlates());
    }
  }

  #updateOrientToggleUI(cat) {
    const mode = this.#categoryOrientation[cat];
    const portraitCount  = this.#repository.getOrientationCount(cat, 'portrait');
    const landscapeCount = this.#repository.getOrientationCount(cat, 'landscape');

    const pCountEl = document.getElementById('orient-count-portrait');
    const lCountEl = document.getElementById('orient-count-landscape');
    if (pCountEl) pCountEl.textContent = portraitCount > 0 ? `(${portraitCount})` : '';
    if (lCountEl) lCountEl.textContent = landscapeCount > 0 ? `(${landscapeCount})` : '';

    document.querySelectorAll('.orient-btn').forEach(btn => {
      const orient = btn.dataset.orient;
      const isAvailable = this.#repository.hasOrientation(cat, orient);
      const isActive = orient === mode;

      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-pressed', String(isActive));
      btn.disabled = !isAvailable;
      btn.classList.toggle('disabled', !isAvailable);
      btn.title = !isAvailable
        ? `No ${orient} photos in this collection`
        : `View ${orient} photos`;
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

    if (!photos.length) {
      const empty = document.createElement('div');
      empty.className = 'empty-state';
      empty.innerHTML = `
        <p class="empty-state-title">Series Curated in Alternate Format</p>
        <p class="empty-state-sub">Switch orientation above to explore this collection.</p>
      `;
      grid.appendChild(empty);
      return;
    }

    photos.forEach((asset, idx) => {
      const figure = document.createElement('figure');
      figure.className = 'photo-item';
      figure.style.transitionDelay = `${Math.min(idx * 45, 280)}ms`;

      if (!this.#revealObserver || this.#transitionCoordinator.prefersReducedMotion) {
        figure.classList.add('is-revealed');
      } else {
        this.#revealObserver.observe(figure);
      }

      // Archival Plate Index Header Strip
      const tag = document.createElement('span');
      tag.className = 'photo-tag';
      tag.textContent = asset.momentTag;
      figure.appendChild(tag);

      const picture = document.createElement('picture');
      const sourceWebp = document.createElement('source');
      sourceWebp.srcset = asset.webpSrc;
      sourceWebp.type = 'image/webp';

      const img = document.createElement('img');
      img.src = asset.src;
      img.alt = `${asset.caption} — ${asset.categoryLabel} (${asset.plateNumber})`;
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

      this.#cursorLoupe?.attachInteractiveTarget(figure, `INSPECT ${asset.plateNumber}`);

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

    document.querySelectorAll('.orient-btn[data-orient]').forEach(btn => {
      btn.addEventListener('click', () => this.setOrientation(btn.dataset.orient));
    });

    window.addEventListener('popstate', e => {
      const tab = e?.state?.tab || new URLSearchParams(window.location?.search || '').get('tab');
      if (tab && this.#repository.isValidCategory(tab) && tab !== this.activeCategory) {
        this.switchTab(tab, true, false);
      }
    });
  }

  #bindHeroFloatingFrames() {
    document.querySelectorAll('.hero-frame').forEach(frame => {
      this.#cursorLoupe?.attachInteractiveTarget(frame, 'OPEN ARCHIVE PLATE');

      const handler = () => {
        const cat    = frame.dataset.cat;
        const orient = frame.dataset.orient || 'portrait';
        const idx    = parseInt(frame.dataset.idx, 10) || 0;
        const photos = this.#repository.getPhotos(cat, orient);
        if (photos.length) {
          this.#lightbox.open(photos, Math.min(idx, photos.length - 1), null);
        }
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
      for (const orient of ['portrait', 'landscape']) {
        const photos = this.#repository.getPhotos(cat, orient);
        const idx = photos.findIndex((p, i) => {
          const s = (p.src && p.src.split('/').pop().replace(/\.[^.]+$/, '')) || String(i + 1);
          return s.toLowerCase() === targetSlug;
        });
        if (idx !== -1) {
          this.switchTab(cat, false);
          this.setOrientation(orient);
          this.#lightbox.open(photos, idx, null);
          return;
        }
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
    hero:    'Fleeting Moments Held Forever',
    about:   'The Heart Behind The Lens',
    gallery: 'Heirlooms Preserved in Time',
    inquire: 'Commissions & Private Bookings',
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
  #inquireSection;
  #heroMonument;
  #counterEl;
  #isCounterAnimated = false;
  #scrollTicking = false;
  #transitionCoordinator;

  constructor(transitionCoordinator) {
    this.#transitionCoordinator = transitionCoordinator;
    this.#aboutSection   = document.getElementById('about');
    this.#aboutWrap      = document.querySelector('.about-wrap');
    this.#inquireSection = document.getElementById('inquire');
    this.#heroMonument   = document.querySelector('.hero-monument');
    this.#counterEl      = document.getElementById('ledger-total-plates');

    this.#initScrollObservers();
    this.#initHeroParallax();
  }

  #initScrollObservers() {
    if (this.#transitionCoordinator?.prefersReducedMotion) {
      if (this.#aboutWrap) this.#aboutWrap.classList.add('is-in-view');
      if (this.#inquireSection) this.#inquireSection.classList.add('is-in-view');
      if (this.#counterEl) this.#counterEl.textContent = '28';
      return;
    }

    if (typeof IntersectionObserver === 'undefined') {
      if (this.#aboutWrap) this.#aboutWrap.classList.add('is-in-view');
      if (this.#inquireSection) this.#inquireSection.classList.add('is-in-view');
      return;
    }

    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (entry.target === this.#aboutSection) {
            if (this.#aboutWrap) this.#aboutWrap.classList.add('is-in-view');
            this.#animateCounter(28);
          } else if (entry.target === this.#inquireSection) {
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
    if (this.#inquireSection) revealObserver.observe(this.#inquireSection);
  }

  #animateCounter(target) {
    if (this.#isCounterAnimated || !this.#counterEl) return;
    this.#isCounterAnimated = true;

    if (this.#transitionCoordinator?.prefersReducedMotion) {
      this.#counterEl.textContent = String(target);
      return;
    }

    const duration = 1100;
    const startVal = 1;
    const startTime = performance.now();

    const step = (now) => {
      const elapsed = Math.min(now - startTime, duration);
      const progress = elapsed / duration;
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(startVal + (target - startVal) * ease);
      this.#counterEl.textContent = String(current);

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        this.#counterEl.textContent = String(target);
      }
    };

    requestAnimationFrame(step);
  }

  #initHeroParallax() {
    if (!this.#heroMonument || this.#transitionCoordinator?.prefersReducedMotion) return;

    window.addEventListener('scroll', () => {
      if (!this.#scrollTicking) {
        requestAnimationFrame(() => {
          this.#applyParallax();
          this.#scrollTicking = false;
        });
        this.#scrollTicking = true;
      }
    }, { passive: true });
  }

  #applyParallax() {
    if (window.innerWidth < 960) return;
    const scrollY = window.scrollY || 0;
    if (scrollY < window.innerHeight) {
      const offset = Math.min(scrollY * 0.07, 36);
      this.#heroMonument.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0)`;
    }
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
