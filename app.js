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
     6. GalleryPresenter (Tabs, Orientation, Series Filter, Contact Sheet)
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
    if (typeof entry !== 'string') {
      return { src: entry.src, caption: entry.caption || 'Untitled Moment' };
    }
    const filename = entry.split('/').pop().split('.')[0];
    const caption = filename
      .replace(/[-_]+/g, ' ')
      .replace(/\b\w/g, c => c.toUpperCase());
    return { src: entry, caption };
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

  getPhotos(cat, orientation, seriesFilter = 'ALL') {
    const rawList = this.#rawStore[cat]?.[orientation] || [];
    const assets = rawList.map((entry, idx) => new PhotoAsset(entry, cat, orientation, idx));
    if (!seriesFilter || seriesFilter === 'ALL') return assets;
    return assets.filter(asset => asset.caption === seriesFilter);
  }

  getSeriesGroups(cat, orientation) {
    const assets = this.getPhotos(cat, orientation, 'ALL');
    const counts = new Map();
    assets.forEach(asset => {
      counts.set(asset.caption, (counts.get(asset.caption) || 0) + 1);
    });
    return Array.from(counts.entries()).map(([name, count]) => ({ name, count }));
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
        transition.finished.finally(() => {
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

class LightboxController {
  #lightboxEl;
  #frameWrapEl;
  #imgEl;
  #titleEl;
  #plateNoEl;
  #counterEl;
  #catBadgeEl;
  #exifEl;
  #filmstripEl;
  #slideshowBarEl;
  #matBtn;
  #playBtn;
  #playLabel;
  #zoomBtn;
  #shutterFlashEl;
  #transitionCoordinator;
  #cursorLoupe;

  #images = [];
  #currentIndex = 0;
  #isZoomed = false;
  #hasMat = false;
  #slideshowInterval = null;
  #lastFocusedElement = null;
  #activeSourceFigure = null;

  constructor(transitionCoordinator, cursorLoupe) {
    this.#transitionCoordinator = transitionCoordinator;
    this.#cursorLoupe    = cursorLoupe;
    this.#lightboxEl     = document.getElementById('lightbox');
    this.#frameWrapEl    = document.getElementById('lightbox-frame-wrap');
    this.#imgEl          = document.getElementById('lightbox-img');
    this.#titleEl        = document.getElementById('lightbox-title');
    this.#plateNoEl      = document.getElementById('lightbox-plate-no');
    this.#counterEl      = document.getElementById('lightbox-counter');
    this.#catBadgeEl     = document.getElementById('lightbox-cat-badge');
    this.#exifEl         = document.getElementById('lightbox-exif');
    this.#filmstripEl    = document.getElementById('lightbox-filmstrip');
    this.#slideshowBarEl = document.getElementById('lightbox-slideshow-bar');
    this.#matBtn         = document.getElementById('lb-mat-btn');
    this.#playBtn        = document.getElementById('lb-play-btn');
    this.#playLabel      = document.getElementById('lb-play-label');
    this.#zoomBtn        = document.getElementById('lb-zoom-btn');
    this.#shutterFlashEl = document.getElementById('shutter-flash');

    this.#bindEvents();
  }

  get isOpen() {
    return Boolean(this.#lightboxEl && this.#lightboxEl.classList.contains('open'));
  }

  open(images, index, sourceFigure = null) {
    if (!images || !images.length || !this.#lightboxEl) return;
    this.#cursorLoupe?.hide();
    this.#lastFocusedElement = document.activeElement;
    this.#images = images;
    this.#currentIndex = Math.max(0, Math.min(index, images.length - 1));

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
    this.#resetZoom();
    this.#currentIndex = (this.#currentIndex + dir + this.#images.length) % this.#images.length;
    this.#updateView();
  }

  toggleZoom() {
    if (!this.#imgEl) return;
    this.#isZoomed = !this.#isZoomed;
    this.#imgEl.classList.toggle('zoomed', this.#isZoomed);
    if (this.#zoomBtn) {
      this.#zoomBtn.setAttribute('aria-pressed', String(this.#isZoomed));
    }
  }

  toggleMuseumMat() {
    if (!this.#frameWrapEl) return;
    this.#hasMat = !this.#hasMat;
    this.#frameWrapEl.classList.toggle('has-mat', this.#hasMat);
    if (this.#matBtn) {
      this.#matBtn.setAttribute('aria-pressed', String(this.#hasMat));
    }
  }

  toggleSlideshow() {
    if (this.#slideshowInterval) {
      this.stopSlideshow();
    } else {
      this.startSlideshow();
    }
  }

  startSlideshow() {
    if (this.#slideshowInterval || this.#images.length <= 1) return;
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
    if (this.#playBtn) this.#playBtn.setAttribute('aria-pressed', 'false');
    if (this.#playLabel) this.#playLabel.textContent = 'Slideshow';
    if (this.#slideshowBarEl) this.#slideshowBarEl.classList.remove('playing');
  }

  #resetZoom() {
    this.#isZoomed = false;
    if (this.#imgEl) this.#imgEl.classList.remove('zoomed');
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
      this.#imgEl.alt = current.caption || 'Portfolio photo';
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
      thumb.className = 'filmstrip-thumb' + (idx === this.#currentIndex ? ' active' : '');
      thumb.setAttribute('aria-label', `View photo ${idx + 1}: ${image.caption || 'Untitled'}`);

      const img = document.createElement('img');
      img.src = image.webpSrc || image.src.replace(/\.jpe?g$/i, '.webp');
      img.alt = image.caption || '';
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
      if (isActive) {
        thumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    });
  }

  #bindEvents() {
    if (!this.#lightboxEl) return;

    this.#lightboxEl.addEventListener('click', e => {
      if (e.target === this.#lightboxEl || e.target.classList.contains('lightbox-stage')) {
        this.close();
      }
    });

    if (this.#imgEl) {
      this.#imgEl.addEventListener('click', e => {
        e.stopPropagation();
        this.toggleZoom();
      });
    }

    if (this.#matBtn) {
      this.#matBtn.addEventListener('click', e => {
        e.stopPropagation();
        this.toggleMuseumMat();
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

    // Touch swipe navigation
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
    }, { passive: true });

    this.#lightboxEl.addEventListener('touchmove', e => {
      if (e.touches.length > 1) isMultiTouch = true;
      if (e.touches.length === 1) {
        touchEndX = e.touches[0].clientX;
        touchEndY = e.touches[0].clientY;
      }
    }, { passive: true });

    this.#lightboxEl.addEventListener('touchend', () => {
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
      if (e.key === 'm' || e.key === 'M') {
        e.preventDefault();
        this.toggleMuseumMat();
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
  #categorySeriesFilter = {
    predebut:      'ALL',
    events:        'ALL',
    institutional: 'ALL',
  };
  #viewMode = 'exhibition'; // 'exhibition' | 'contact'
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

  switchTab(cat, animate = true) {
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
      this.#renderSeriesFilterBar(cat);
      this.#ensureRendered(cat);

      requestAnimationFrame(() => {
        this.balanceGrid('grid-' + cat);
      });

      const url = new URL(window.location.href);
      url.searchParams.set('tab', cat);
      history.replaceState(null, '', url);
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
      this.#categorySeriesFilter[cat] = 'ALL';
      this.#updateOrientToggleUI(cat);
      this.#renderSeriesFilterBar(cat);
      this.renderCategory(cat);
    });
  }

  setSeriesFilter(seriesName) {
    const cat = this.activeCategory;
    if (this.#categorySeriesFilter[cat] === seriesName) return;

    this.#transitionCoordinator.run(() => {
      this.#categorySeriesFilter[cat] = seriesName;
      this.#renderSeriesFilterBar(cat);
      this.renderCategory(cat);
    });
  }

  setViewMode(mode) {
    if (mode !== 'exhibition' && mode !== 'contact') return;
    if (this.#viewMode === mode) return;

    this.#transitionCoordinator.run(() => {
      this.#viewMode = mode;
      document.querySelectorAll('.view-btn[data-view]').forEach(btn => {
        const isActive = btn.dataset.view === mode;
        btn.classList.toggle('active', isActive);
        btn.setAttribute('aria-pressed', String(isActive));
      });

      this.#renderedSignature = {};
      this.renderCategory(this.activeCategory);
    });
  }

  renderCategory(cat) {
    this.#ensureValidOrientation(cat);
    const orientation  = this.#categoryOrientation[cat];
    const seriesFilter = this.#categorySeriesFilter[cat] || 'ALL';
    const photos       = this.#repository.getPhotos(cat, orientation, seriesFilter);
    const totalInMode  = this.#repository.getOrientationCount(cat, orientation);

    const grid = document.getElementById('grid-' + cat);
    if (grid) {
      grid.classList.toggle('orient-landscape', orientation === 'landscape');
      grid.classList.toggle('view-contact', this.#viewMode === 'contact');
    }

    this.#buildGridDOM('grid-' + cat, photos);
    this.#updateStatusReadout(photos.length, totalInMode, orientation, seriesFilter);

    requestAnimationFrame(() => {
      this.balanceGrid('grid-' + cat);
    });

    this.#renderedSignature[cat] = `${orientation}:${seriesFilter}:${this.#viewMode}`;
  }

  balanceGrid(gridId) {
    const grid = document.getElementById(gridId);
    if (!grid || grid.offsetParent === null) return;

    const items = Array.from(grid.querySelectorAll('.photo-item'));
    items.forEach(item => item.classList.remove('fill-row'));
    if (!items.length || this.#viewMode === 'contact') return;

    const lastRowTop = items[items.length - 1].offsetTop;
    for (let i = items.length - 1; i >= 0 && items[i].offsetTop === lastRowTop; i--) {
      items[i].classList.add('fill-row');
    }
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
    const expectedSig = `${this.#categoryOrientation[cat]}:${this.#categorySeriesFilter[cat]}:${this.#viewMode}`;
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

  #renderSeriesFilterBar(cat) {
    const bar = document.getElementById('series-filter-bar');
    if (!bar) return;
    bar.innerHTML = '';

    const orientation  = this.#categoryOrientation[cat];
    const activeSeries = this.#categorySeriesFilter[cat] || 'ALL';
    const groups       = this.#repository.getSeriesGroups(cat, orientation);
    const totalCount   = this.#repository.getOrientationCount(cat, orientation);

    const createPill = (label, value, count) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      const isActive = activeSeries === value;
      btn.className = 'series-pill' + (isActive ? ' active' : '');
      btn.setAttribute('aria-pressed', String(isActive));
      btn.innerHTML = `<span>${label}</span><span class="series-pill-count">${String(count).padStart(2, '0')}</span>`;
      btn.addEventListener('click', () => this.setSeriesFilter(value));
      return btn;
    };

    bar.appendChild(createPill('All Plates', 'ALL', totalCount));
    groups.forEach(group => {
      bar.appendChild(createPill(group.name, group.name, group.count));
    });
  }

  #updateStatusReadout(shownCount, totalCount, orientation, seriesFilter) {
    const readout = document.getElementById('archive-status-readout');
    if (!readout) return;
    const modeLabel = this.#viewMode === 'contact' ? 'CONTACT SHEET' : 'EXHIBITION';
    const filterLabel = seriesFilter === 'ALL' ? 'ALL SERIES' : seriesFilter.toUpperCase();
    readout.textContent = `${modeLabel} · ${String(shownCount).padStart(2, '0')}/${String(totalCount).padStart(2, '0')} ${orientation.toUpperCase()} PLATES · ${filterLabel}`;
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
        <p class="empty-state-sub">Switch orientation or series filter above to explore this collection.</p>
      `;
      grid.appendChild(empty);
      return;
    }

    const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    photos.forEach((asset, idx) => {
      const figure = document.createElement('figure');
      figure.className = 'photo-item';
      figure.style.transitionDelay = `${Math.min(idx * 45, 280)}ms`;

      if (!this.#revealObserver || this.#transitionCoordinator.prefersReducedMotion) {
        figure.classList.add('is-revealed');
      } else {
        this.#revealObserver.observe(figure);
      }

      // 4 Viewfinder focus corners
      ['tl', 'tr', 'bl', 'br'].forEach(pos => {
        const corner = document.createElement('span');
        corner.className = `vf-c vf-c-${pos}`;
        corner.setAttribute('aria-hidden', 'true');
        figure.appendChild(corner);
      });

      // Archival Plate Index Badge
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
      img.alt = asset.caption;
      img.loading = 'lazy';
      img.decoding = 'async';
      img.onerror = () => {
        img.alt = 'Photograph currently being preserved in archive';
      };

      picture.appendChild(sourceWebp);
      picture.appendChild(img);

      const figcaption = document.createElement('figcaption');
      figcaption.className = 'photo-overlay';

      const metaRow = document.createElement('div');
      metaRow.className = 'photo-meta-row';
      metaRow.innerHTML = `<span>${asset.plateNumber}</span><span>·</span><span>HELD FOREVER</span>`;

      const label = document.createElement('span');
      label.className = 'photo-label';
      label.textContent = asset.caption;

      figcaption.appendChild(metaRow);
      figcaption.appendChild(label);
      figure.appendChild(picture);
      figure.appendChild(figcaption);

      // Subtle 3D micro-tilt on fine pointers when reduced motion is off
      if (isFinePointer && !this.#transitionCoordinator.prefersReducedMotion && this.#viewMode !== 'contact') {
        let tiltRAF = null;
        figure.addEventListener('mousemove', e => {
          if (tiltRAF) cancelAnimationFrame(tiltRAF);
          tiltRAF = requestAnimationFrame(() => {
            const w = figure.offsetWidth || 300;
            const h = figure.offsetHeight || 380;
            const x = (e.offsetX / w) - 0.5;
            const y = (e.offsetY / h) - 0.5;
            figure.style.transform = `perspective(800px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) translateY(-3px)`;
          });
        }, { passive: true });

        figure.addEventListener('mouseleave', () => {
          if (tiltRAF) cancelAnimationFrame(tiltRAF);
          figure.style.transform = '';
        });
      }

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

    document.querySelectorAll('.view-btn[data-view]').forEach(btn => {
      btn.addEventListener('click', () => this.setViewMode(btn.dataset.view));
    });

    let resizeTimer = null;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        this.#renderedSignature = {};
        this.renderCategory(this.activeCategory);
      }, 150);
    });
  }

  #bindHeroFloatingFrames() {
    document.querySelectorAll('.hero-frame').forEach(frame => {
      this.#cursorLoupe?.attachInteractiveTarget(frame, 'OPEN ARCHIVE PLATE');

      const handler = () => {
        const cat    = frame.dataset.cat;
        const orient = frame.dataset.orient || 'portrait';
        const idx    = parseInt(frame.dataset.idx, 10) || 0;
        const photos = this.#repository.getPhotos(cat, orient, 'ALL');
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
    const requestedTab = new URLSearchParams(window.location.search).get('tab');
    const startCat = (requestedTab && this.#repository.isValidCategory(requestedTab))
      ? requestedTab
      : this.activeCategory;
    this.switchTab(startCat, false);
  }
}


/* ── 7. TELEMETRY HUD & SCROLL CONTINUUM CONTROLLER ── */

class TelemetryHudController {
  #navEl;
  #navLinks;
  #sections;
  #hudChapter;
  #focalBar;
  #focalThumb;
  #focalMarks;
  #bttBtn;
  #vfCorners;
  #clockEl;
  #currentSectionId = null;

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
    this.#focalBar   = document.getElementById('focal-bar');
    this.#focalThumb = document.getElementById('focal-thumb');
    this.#focalMarks = document.querySelectorAll('.focal-val');
    this.#bttBtn     = document.getElementById('back-to-top');
    this.#clockEl    = document.getElementById('ft-local-time');
    this.#vfCorners  = {
      tl: document.querySelector('.vf-tl'),
      tr: document.querySelector('.vf-tr'),
      bl: document.querySelector('.vf-bl'),
      br: document.querySelector('.vf-br'),
    };

    this.#bindScroll();
    this.#initLocalClock();
    this.updateOnScroll();
  }

  updateOnScroll() {
    if (this.#navEl) {
      this.#navEl.classList.toggle('is-scrolled', window.scrollY > 50);
    }

    this.#updateOpticalContinuum();

    if (this.#bttBtn) {
      this.#bttBtn.classList.toggle('visible', window.scrollY > 480);
    }

    if (!this.#sections.length) return;

    const scrollPos = window.scrollY + 180;
    let current = this.#sections[0];
    this.#sections.forEach(section => {
      if (section.offsetTop <= scrollPos) current = section;
    });

    this.#navLinks.forEach(link => {
      link.classList.toggle('active', link.dataset.section === current.id);
    });

    if (current && this.#currentSectionId !== current.id) {
      this.#currentSectionId = current.id;
      if (this.#hudChapter) {
        this.#hudChapter.textContent = TelemetryHudController.#CHAPTERS[current.id] || TelemetryHudController.#CHAPTERS.hero;
      }
    }
  }

  #updateOpticalContinuum() {
    const isDesktop = window.innerWidth > 1024;
    if (isDesktop) {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPct = docHeight > 0 ? Math.min(1, Math.max(0, window.scrollY / docHeight)) : 0;

      if (this.#focalBar)   this.#focalBar.style.height = `${scrollPct * 100}%`;
      if (this.#focalThumb) this.#focalThumb.style.top  = `${scrollPct * 100}%`;

      this.#focalMarks.forEach(mark => {
        const target = parseFloat(mark.dataset.scroll || '0');
        mark.classList.toggle('active', Math.abs(scrollPct - target) < 0.18);
      });
    }

    if (window.scrollY < window.innerHeight * 1.1) {
      const shift = Math.min(22, window.scrollY * 0.05);
      const { tl, tr, bl, br } = this.#vfCorners;
      if (tl) tl.style.transform = `translate3d(${-shift}px, ${-shift}px, 0)`;
      if (tr) tr.style.transform = `translate3d(${shift}px, ${-shift}px, 0)`;
      if (bl) bl.style.transform = `translate3d(${-shift}px, ${shift}px, 0)`;
      if (br) br.style.transform = `translate3d(${shift}px, ${shift}px, 0)`;
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

  #initLocalClock() {
    if (!this.#clockEl) return;
    const updateClock = () => {
      try {
        const formatted = new Intl.DateTimeFormat('en-US', {
          timeZone: 'Asia/Manila',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        }).format(new Date());
        this.#clockEl.textContent = `CABUYAO, PH · ${formatted} PHT`;
      } catch {
        this.#clockEl.textContent = 'CABUYAO, PH · ARCHIVE EDITION';
      }
    };
    updateClock();
    setInterval(updateClock, 30000);
  }
}


/* ── 8. APPLICATION BOOTSTRAP ── */

const repository            = new PortfolioRepository(photoData, CATS);
const transitionCoordinator = new ViewTransitionCoordinator();
const themeManager          = new ThemeManager(transitionCoordinator);
const cursorLoupe           = new CursorLoupeController();
const lightboxController    = new LightboxController(transitionCoordinator, cursorLoupe);
const galleryPresenter      = new GalleryPresenter(repository, transitionCoordinator, lightboxController, cursorLoupe);
const telemetryHud          = new TelemetryHudController();

// Global bindings preserved for declarative HTML attributes
window.closeLightbox = () => lightboxController.close();
window.lightboxNav   = dir => lightboxController.navigate(dir);
window.switchTab     = cat => galleryPresenter.switchTab(cat);
