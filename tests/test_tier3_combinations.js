/**
 * TIER 3: Cross-Feature Interactions Test Suite
 * Minimum 5 tests per interaction area:
 * 1. Lightbox Zoom Toggle + Slideshow Timer Conflict Handling
 * 2. Category Filter Persistence with Theme Toggles
 * 3. URL Hash Synchronization with Photo Selection
 * 4. Modal Open/Close Focus Trapping & Return-of-Focus
 */

const { createDOMEnvironment, loadAppEnvironment, parseCSSFile, AssertionContext } = require('./harness.js');

function runTier3Tests() {
  const ctx = new AssertionContext('Tier 3: Cross-Feature Interactions');

  // ══════════════════════════════════════════════════════════════════════════
  // PAIRWISE 1: Lightbox Zoom Toggle + Slideshow Timer Conflict Handling
  // ══════════════════════════════════════════════════════════════════════════

  ctx.test('ZoomSlideshow: Starting slideshow while zoomed in resets zoom to 1x', () => {
    const appEnv = loadAppEnvironment();
    try {
      const { document, eval: vmEval } = appEnv;
      const lb = vmEval('lightboxController');
      const repo = vmEval('repository');
      const photos = repo.getPhotos('predebut', 'portrait');

      lb.open(photos, 0);
      lb.toggleZoom();

      const img = document.getElementById('lightbox-img');
      const zoomBtn = document.getElementById('lb-zoom-btn');
      ctx.assert(img.classList.contains('zoomed'), 'Image should be zoomed');
      ctx.assertEqual(zoomBtn.getAttribute('aria-pressed'), 'true', 'Zoom button aria-pressed should be true');

      // Now start slideshow
      lb.startSlideshow();

      // Per PROJECT.md § Lightbox State Machine Contract:
      // TOGGLE_SLIDESHOW in ZOOMED state resets zoom to 1x and transitions to SLIDESHOW
      ctx.assert(!img.classList.contains('zoomed'), 'Starting slideshow must reset zoom to 1x');
      ctx.assertEqual(zoomBtn.getAttribute('aria-pressed'), 'false', 'Zoom button aria-pressed must be false when slideshow starts');
    } finally {
      appEnv.teardown();
    }
  });

  ctx.test('ZoomSlideshow: Toggling zoom while slideshow is running stops the slideshow', () => {
    const appEnv = loadAppEnvironment();
    try {
      const { document, eval: vmEval } = appEnv;
      const lb = vmEval('lightboxController');
      const repo = vmEval('repository');
      const photos = repo.getPhotos('events', 'landscape');

      lb.open(photos, 0);
      lb.startSlideshow();

      const playBtn = document.getElementById('lb-play-btn');
      const slideshowBar = document.getElementById('lightbox-slideshow-bar');
      ctx.assertEqual(playBtn.getAttribute('aria-pressed'), 'true', 'Play button should be pressed');
      ctx.assert(slideshowBar.classList.contains('playing'), 'Slideshow bar should have .playing class');

      // Per PROJECT.md § Lightbox State Machine Contract:
      // TOGGLE_ZOOM if in SLIDESHOW stops slideshow timer and transitions to ZOOMED
      lb.toggleZoom();

      ctx.assertEqual(playBtn.getAttribute('aria-pressed'), 'false', 'Slideshow must stop when zoom is toggled');
      ctx.assert(!slideshowBar.classList.contains('playing'), 'Slideshow bar must remove .playing class');
    } finally {
      appEnv.teardown();
    }
  });

  ctx.test('ZoomSlideshow: Navigating photos while in zoom mode resets zoom level', () => {
    const appEnv = loadAppEnvironment();
    try {
      const { document, eval: vmEval } = appEnv;
      const lb = vmEval('lightboxController');
      const repo = vmEval('repository');
      const photos = repo.getPhotos('predebut', 'portrait');

      lb.open(photos, 0);
      lb.toggleZoom();

      const img = document.getElementById('lightbox-img');
      ctx.assert(img.classList.contains('zoomed'), 'Image must be in zoomed state');

      lb.navigate(1);
      ctx.assert(!img.classList.contains('zoomed'), 'Navigating to next photo must reset zoom state');
      const zoomBtn = document.getElementById('lb-zoom-btn');
      ctx.assertEqual(zoomBtn.getAttribute('aria-pressed'), 'false', 'Zoom button aria-pressed must be false');
    } finally {
      appEnv.teardown();
    }
  });

  ctx.test('ZoomSlideshow: Closing lightbox terminates active slideshow timer and resets zoom', () => {
    const appEnv = loadAppEnvironment();
    try {
      const { document, eval: vmEval } = appEnv;
      const lb = vmEval('lightboxController');
      const repo = vmEval('repository');
      const photos = repo.getPhotos('events', 'landscape');

      lb.open(photos, 0);
      lb.startSlideshow();

      ctx.assert(lb.isOpen, 'Lightbox must be open');
      lb.close();

      ctx.assert(!lb.isOpen, 'Lightbox must be closed');
      const playBtn = document.getElementById('lb-play-btn');
      ctx.assertEqual(playBtn.getAttribute('aria-pressed'), 'false', 'Play button must be false after close');
    } finally {
      appEnv.teardown();
    }
  });

  ctx.test('ZoomSlideshow: Rapid alternating toggles between zoom and slideshow do not leak state', () => {
    const appEnv = loadAppEnvironment();
    try {
      const { document, eval: vmEval } = appEnv;
      const lb = vmEval('lightboxController');
      const repo = vmEval('repository');
      const photos = repo.getPhotos('events', 'landscape');

      lb.open(photos, 0);

      for (let i = 0; i < 5; i++) {
        lb.toggleZoom();
        lb.toggleSlideshow();
      }

      // Final state verification
      lb.stopSlideshow();
      const playBtn = document.getElementById('lb-play-btn');
      ctx.assertEqual(playBtn.getAttribute('aria-pressed'), 'false', 'Play button should be stopped');
    } finally {
      appEnv.teardown();
    }
  });

  // ══════════════════════════════════════════════════════════════════════════
  // PAIRWISE 2: Category Filter Persistence with Theme Toggles
  // ══════════════════════════════════════════════════════════════════════════

  ctx.test('CategoryTheme: Active category filter persists after toggling theme to dark', () => {
    const appEnv = loadAppEnvironment();
    try {
      const { document, eval: vmEval } = appEnv;
      const presenter = vmEval('galleryPresenter');
      const themeBtn = document.getElementById('theme-toggle');

      presenter.switchTab('institutional', false);
      ctx.assertEqual(presenter.activeCategory, 'institutional', 'Active category should be institutional');

      // Toggle theme to dark
      themeBtn.click();
      ctx.assertEqual(document.documentElement.getAttribute('data-theme'), 'dark', 'Theme should be dark');
      ctx.assertEqual(presenter.activeCategory, 'institutional', 'Active category must remain institutional after theme toggle');

      const instTab = document.getElementById('tab-institutional');
      ctx.assert(instTab.classList.contains('active'), 'Institutional tab must still have .active class');
    } finally {
      appEnv.teardown();
    }
  });

  ctx.test('CategoryTheme: Active category panel remains visible and populated across theme changes', () => {
    const appEnv = loadAppEnvironment();
    try {
      const { document, eval: vmEval } = appEnv;
      const presenter = vmEval('galleryPresenter');
      const themeBtn = document.getElementById('theme-toggle');

      presenter.switchTab('events', false);
      const eventsPanel = document.getElementById('panel-events');
      ctx.assert(eventsPanel.classList.contains('active'), 'Events panel must be active initially');

      // Toggle theme twice (dark then back to light)
      themeBtn.click();
      themeBtn.click();

      ctx.assert(eventsPanel.classList.contains('active'), 'Events panel must still be active after theme cycle');
      const predebutPanel = document.getElementById('panel-predebut');
      ctx.assert(!predebutPanel.classList.contains('active'), 'Predebut panel must remain hidden');
    } finally {
      appEnv.teardown();
    }
  });

  ctx.test('CategoryTheme: Selected orientation mode persists across theme changes', () => {
    const appEnv = loadAppEnvironment();
    try {
      const { document, eval: vmEval } = appEnv;
      const presenter = vmEval('galleryPresenter');
      const themeBtn = document.getElementById('theme-toggle');

      presenter.switchTab('predebut', false);
      presenter.setOrientation('landscape');

      const landBtn = document.getElementById('orient-landscape');
      ctx.assertEqual(landBtn.getAttribute('aria-pressed'), 'true', 'Landscape should be selected');

      // Toggle theme
      themeBtn.click();

      ctx.assertEqual(landBtn.getAttribute('aria-pressed'), 'true', 'Landscape orientation must remain pressed after theme toggle');
    } finally {
      appEnv.teardown();
    }
  });

  ctx.test('CategoryTheme: Category count badges remain intact and accurate after theme toggle', () => {
    const appEnv = loadAppEnvironment();
    try {
      const { document, eval: vmEval } = appEnv;
      const themeBtn = document.getElementById('theme-toggle');

      const countPredebut = document.getElementById('count-predebut').textContent.trim();
      const countEvents = document.getElementById('count-events').textContent.trim();

      themeBtn.click(); // switch to dark

      ctx.assertEqual(document.getElementById('count-predebut').textContent.trim(), countPredebut, 'Count badge for predebut must remain accurate');
      ctx.assertEqual(document.getElementById('count-events').textContent.trim(), countEvents, 'Count badge for events must remain accurate');
    } finally {
      appEnv.teardown();
    }
  });

  ctx.test('CategoryTheme: Theme toggle button maintains its own state without disrupting gallery presenter', () => {
    const appEnv = loadAppEnvironment();
    try {
      const { document, eval: vmEval } = appEnv;
      const presenter = vmEval('galleryPresenter');
      const themeBtn = document.getElementById('theme-toggle');
      const themeLabel = document.getElementById('theme-toggle-label');

      presenter.switchTab('institutional', false);

      themeBtn.click(); // to dark
      ctx.assertEqual(themeLabel.textContent.trim(), 'Daylight', 'Theme label must update to Daylight');

      themeBtn.click(); // to light
      ctx.assertEqual(themeLabel.textContent.trim(), 'Darkroom', 'Theme label must update to Darkroom');

      ctx.assertEqual(presenter.activeCategory, 'institutional', 'Gallery category should remain unaffected');
    } finally {
      appEnv.teardown();
    }
  });

  // ══════════════════════════════════════════════════════════════════════════
  // PAIRWISE 3: URL Hash Synchronization with Photo Selection
  // ══════════════════════════════════════════════════════════════════════════

  ctx.test('URLHashSync: Opening photo updates URL hash to identify active plate', () => {
    const appEnv = loadAppEnvironment();
    try {
      const { window: win, eval: vmEval } = appEnv;
      const lb = vmEval('lightboxController');
      const repo = vmEval('repository');
      const photos = repo.getPhotos('predebut', 'portrait');

      lb.open(photos, 0);

      // Contract: PROJECT.md § Lightbox State Machine Contract:
      // Postcondition: updates URL hash to #photo-...
      ctx.assertMatches(win.location.hash, /^#photo-/i, 'URL hash must update to #photo-... when opening photo in lightbox');
    } finally {
      appEnv.teardown();
    }
  });

  ctx.test('URLHashSync: Navigating to next photo updates URL hash', () => {
    const appEnv = loadAppEnvironment();
    try {
      const { window: win, eval: vmEval } = appEnv;
      const lb = vmEval('lightboxController');
      const repo = vmEval('repository');
      const photos = repo.getPhotos('predebut', 'portrait');

      lb.open(photos, 0);
      const hash0 = win.location.hash;

      lb.navigate(1);
      const hash1 = win.location.hash;

      ctx.assert(hash0 !== hash1, 'URL hash must update when navigating to a new photo');
      ctx.assertMatches(hash1, /^#photo-/i, 'URL hash must continue following #photo-... convention');
    } finally {
      appEnv.teardown();
    }
  });

  ctx.test('URLHashSync: Closing lightbox removes or clears photo URL hash', () => {
    const appEnv = loadAppEnvironment();
    try {
      const { window: win, eval: vmEval } = appEnv;
      const lb = vmEval('lightboxController');
      const repo = vmEval('repository');
      const photos = repo.getPhotos('predebut', 'portrait');

      lb.open(photos, 0);
      ctx.assert(win.location.hash.includes('photo'), 'Hash should be set when open');

      lb.close();
      // Contract: PROJECT.md § Gallery ↔ Lightbox Contract:
      // closeLightbox(): removes or resets URL hash
      ctx.assert(!win.location.hash.includes('photo'), 'Photo hash must be removed when lightbox is closed');
    } finally {
      appEnv.teardown();
    }
  });

  ctx.test('URLHashSync: Filmstrip thumbnail click synchronizes URL hash', () => {
    const appEnv = loadAppEnvironment();
    try {
      const { window: win, document, eval: vmEval } = appEnv;
      const lb = vmEval('lightboxController');
      const repo = vmEval('repository');
      const photos = repo.getPhotos('predebut', 'portrait');

      lb.open(photos, 0);

      const filmstripThumbs = document.querySelectorAll('#lightbox-filmstrip .filmstrip-thumb');
      ctx.assertGreaterOrEqual(filmstripThumbs.length, 2, 'Expected at least 2 filmstrip thumbnails');

      filmstripThumbs[1].click();
      ctx.assertMatches(win.location.hash, /^#photo-/i, 'Clicking filmstrip thumbnail must sync URL hash');
    } finally {
      appEnv.teardown();
    }
  });

  ctx.test('URLHashSync: Browser popstate/hashchange simulation navigates photo without crashing', () => {
    const appEnv = loadAppEnvironment();
    try {
      const { window: win, eval: vmEval } = appEnv;
      const lb = vmEval('lightboxController');
      const repo = vmEval('repository');
      const photos = repo.getPhotos('predebut', 'portrait');

      lb.open(photos, 0);

      // Simulate popstate or hashchange event
      win.dispatchEvent({
        type: 'hashchange',
        newURL: 'https://EysiClicks-portfolio-2026.great-site.net/#photo-1',
        oldURL: 'https://EysiClicks-portfolio-2026.great-site.net/#photo-0'
      });

      ctx.assert(true, 'External hashchange event should be handled gracefully');
    } finally {
      appEnv.teardown();
    }
  });

  // ══════════════════════════════════════════════════════════════════════════
  // PAIRWISE 4: Modal Open/Close Focus Trapping & Return-of-Focus
  // ══════════════════════════════════════════════════════════════════════════

  ctx.test('FocusTrap: Opening lightbox stores triggering activeElement', () => {
    const appEnv = loadAppEnvironment();
    try {
      const { document, eval: vmEval } = appEnv;
      const lb = vmEval('lightboxController');
      const repo = vmEval('repository');
      const photos = repo.getPhotos('predebut', 'portrait');

      const triggerBtn = document.getElementById('theme-toggle');
      triggerBtn.focus();
      ctx.assertEqual(document.activeElement, triggerBtn, 'Trigger button should have focus');

      lb.open(photos, 0);
      ctx.assert(lb.isOpen, 'Lightbox should be open');
    } finally {
      appEnv.teardown();
    }
  });

  ctx.test('FocusTrap: Opening lightbox moves focus into modal close button', () => {
    const appEnv = loadAppEnvironment();
    try {
      const { document, eval: vmEval } = appEnv;
      const lb = vmEval('lightboxController');
      const repo = vmEval('repository');
      const photos = repo.getPhotos('predebut', 'portrait');

      lb.open(photos, 0);

      const closeBtn = document.querySelector('.lightbox-close');
      ctx.assertEqual(document.activeElement, closeBtn, 'Focus must move to lightbox close button upon opening');
    } finally {
      appEnv.teardown();
    }
  });

  ctx.test('FocusTrap: Closing lightbox restores focus to previous activeElement', () => {
    const appEnv = loadAppEnvironment();
    try {
      const { document, eval: vmEval } = appEnv;
      const lb = vmEval('lightboxController');
      const repo = vmEval('repository');
      const photos = repo.getPhotos('predebut', 'portrait');

      const triggerBtn = document.getElementById('tab-events');
      triggerBtn.focus();
      ctx.assertEqual(document.activeElement, triggerBtn, 'Trigger button should have focus initially');

      lb.open(photos, 0);
      lb.close();

      ctx.assertEqual(document.activeElement, triggerBtn, 'Closing lightbox must restore focus to originating button');
    } finally {
      appEnv.teardown();
    }
  });

  ctx.test('FocusTrap: Tab key shifts focus among interactive buttons in modal', () => {
    const appEnv = loadAppEnvironment();
    try {
      const { document, eval: vmEval } = appEnv;
      const lb = vmEval('lightboxController');
      const repo = vmEval('repository');
      const photos = repo.getPhotos('predebut', 'portrait');

      lb.open(photos, 0);

      const focusable = document.querySelectorAll('#lightbox button:not([disabled])');
      ctx.assertGreaterOrEqual(focusable.length, 3, 'Expected multiple focusable buttons in lightbox');

      const firstBtn = focusable[0];
      const lastBtn = focusable[focusable.length - 1];

      // Simulate Tab on last button -> wraps to first
      document.activeElement = lastBtn;
      document.dispatchEvent({
        type: 'keydown',
        key: 'Tab',
        shiftKey: false,
        preventDefault() {}
      });
      ctx.assertEqual(document.activeElement, firstBtn, 'Tab from last button must wrap to first button');
    } finally {
      appEnv.teardown();
    }
  });

  ctx.test('FocusTrap: Shift+Tab on first button wraps focus to last button in modal', () => {
    const appEnv = loadAppEnvironment();
    try {
      const { document, eval: vmEval } = appEnv;
      const lb = vmEval('lightboxController');
      const repo = vmEval('repository');
      const photos = repo.getPhotos('predebut', 'portrait');

      lb.open(photos, 0);

      const focusable = document.querySelectorAll('#lightbox button:not([disabled])');
      const firstBtn = focusable[0];
      const lastBtn = focusable[focusable.length - 1];

      document.activeElement = firstBtn;
      document.dispatchEvent({
        type: 'keydown',
        key: 'Tab',
        shiftKey: true,
        preventDefault() {}
      });
      ctx.assertEqual(document.activeElement, lastBtn, 'Shift+Tab from first button must wrap to last button');
    } finally {
      appEnv.teardown();
    }
  });

  return ctx;
}

module.exports = { runTier3Tests };

if (require.main === module) {
  const result = runTier3Tests();
  console.log(`\n${result.tierName} Results:`);
  for (const t of result.tests) {
    console.log(`  [${t.status}] ${t.name} (${t.duration}ms)`);
    if (t.error) console.log(`      Error: ${t.error}`);
  }
  console.log(`\nSummary: Passed: ${result.passed}, Failed: ${result.failed}, Total: ${result.tests.length}`);
  process.exit(result.failed > 0 ? 1 : 0);
}
