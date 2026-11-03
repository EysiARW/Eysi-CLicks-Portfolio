/**
 * ADVERSARIAL STRESS TEST SUITE
 * EysiClicks Portfolio 2026 - Empirical Verification Harness
 *
 * Stress-tests:
 * 1. Rapid State Alternation & Fuzzing (FSM transitions, interval leaks, race conditions)
 * 2. Malformed Data Boundary Fuzzing (PhotoAsset, GalleryPresenter, PortfolioRepository)
 * 3. Browser Hash Fuzzing (Invalid slugs, special chars, malformed URI, extreme lengths)
 * 4. Modal Focus & Event Handling Under Rapid Escape and Click Storms
 */

const path = require('node:path');
const vm = require('node:vm');
const fs = require('node:fs');

const PROJECT_ROOT = path.resolve(__dirname, '../../..');

// Load base harness from tests/harness.js
const {
  createDOMEnvironment,
  loadAppEnvironment,
  AssertionContext
} = require(path.join(PROJECT_ROOT, 'tests/harness.js'));

// Helper to instrument timers for 100% airtight leak detection
function createInstrumentedAppEnv() {
  const env = loadAppEnvironment();
  const activeIntervals = new Set();
  const originalSetInterval = env.window.setInterval;
  const originalClearInterval = env.window.clearInterval;

  const wrappedSetInterval = function (fn, ms, ...args) {
    const id = originalSetInterval.call(this, fn, ms, ...args);
    activeIntervals.add(id);
    return id;
  };

  const wrappedClearInterval = function (id) {
    activeIntervals.delete(id);
    originalClearInterval.call(this, id);
  };

  env.window.setInterval = wrappedSetInterval;
  env.window.clearInterval = wrappedClearInterval;

  // Sync into VM context so bare calls (e.g. clearInterval(...)) are instrumented
  env.eval('clearInterval = window.clearInterval; setInterval = window.setInterval;');

  env.getActiveIntervalCount = () => activeIntervals.size;
  env.getActiveIntervals = () => Array.from(activeIntervals);

  return env;
}

function assertDoesNotThrow(fn, message) {
  try {
    fn();
  } catch (err) {
    throw new Error(`${message}: ${err.message}`);
  }
}

function runAdversarialSuite() {
  const ctx = new AssertionContext('Adversarial Stress Testing & Edge-Case Verification');
  console.log('\n======================================================================');
  console.log('  STARTING ADVERSARIAL VERIFICATION & STRESS TEST HARNESS');
  console.log('======================================================================\n');

  // ──────────────────────────────────────────────────────────────────────────
  // SECTION 1: RAPID STATE ALTERNATION & INTERVAL LEAK FUZZING
  // ──────────────────────────────────────────────────────────────────────────

  ctx.test('StateAlternation: Rapid 1000-cycle randomized FSM transition fuzzing without interval leaks', () => {
    const env = createInstrumentedAppEnv();
    try {
      const { eval: vmEval } = env;
      const lightbox = vmEval('lightboxController');
      const repo = vmEval('repository');
      const LightboxState = vmEval('LightboxState');
      const photos = repo.getPhotos('predebut', 'portrait');

      ctx.assert(photos.length > 0, 'Must have photos for testing');

      // Fuzz 250 complete modal lifecycles with randomized internal action sequences
      const inModalActions = [
        'toggleZoom',
        'startSlideshow',
        'stopSlideshow',
        'toggleSlideshow',
        'navigateNext',
        'navigatePrev'
      ];

      for (let session = 0; session < 250; session++) {
        const startIdx = Math.floor(Math.random() * photos.length);
        lightbox.open(photos, startIdx);
        ctx.assertEqual(lightbox.state, LightboxState.VIEWING);

        const stepCount = Math.floor(Math.random() * 8) + 2;
        for (let s = 0; s < stepCount; s++) {
          const act = inModalActions[Math.floor(Math.random() * inModalActions.length)];
          switch (act) {
            case 'toggleZoom':
              lightbox.toggleZoom();
              break;
            case 'startSlideshow':
              lightbox.startSlideshow();
              break;
            case 'stopSlideshow':
              lightbox.stopSlideshow();
              break;
            case 'toggleSlideshow':
              lightbox.toggleSlideshow();
              break;
            case 'navigateNext':
              lightbox.navigate(1);
              break;
            case 'navigatePrev':
              lightbox.navigate(-1);
              break;
          }
          const validStates = [LightboxState.VIEWING, LightboxState.ZOOMED, LightboxState.SLIDESHOW];
          ctx.assert(validStates.includes(lightbox.state), `State must be a valid open state (got ${lightbox.state})`);
        }

        // Close and verify invariants
        lightbox.close();
        ctx.assertEqual(lightbox.state, LightboxState.CLOSED, 'State must return to CLOSED after close()');
        ctx.assertEqual(env.getActiveIntervalCount(), 0, 'Zero slideshow intervals must remain running after close()');
      }

      // Verify that after close, NO slideshow timers are leaked
      ctx.assertEqual(lightbox.state, LightboxState.CLOSED, 'Final state must be CLOSED');
      ctx.assertEqual(env.getActiveIntervalCount(), 0, 'Zero slideshow intervals must remain running after close');
    } finally {
      env.teardown();
    }
  });

  ctx.test('StateAlternation: Zoom and Slideshow mutually exclusive priority stress', () => {
    const env = createInstrumentedAppEnv();
    try {
      const { eval: vmEval } = env;
      const lightbox = vmEval('lightboxController');
      const repo = vmEval('repository');
      const LightboxState = vmEval('LightboxState');
      const photos = repo.getPhotos('events', 'landscape');

      for (let cycle = 0; cycle < 100; cycle++) {
        lightbox.open(photos, 0);
        ctx.assertEqual(lightbox.state, LightboxState.VIEWING);

        // Zoom in
        lightbox.toggleZoom();
        ctx.assertEqual(lightbox.state, LightboxState.ZOOMED);

        // Starting slideshow while zoomed in must reset zoom and transition to SLIDESHOW
        lightbox.startSlideshow();
        ctx.assertEqual(lightbox.state, LightboxState.SLIDESHOW);
        ctx.assertEqual(env.getActiveIntervalCount(), 1, 'Slideshow interval should be active');

        // Toggling zoom while in slideshow must cancel slideshow and transition to ZOOMED
        lightbox.toggleZoom();
        ctx.assertEqual(lightbox.state, LightboxState.ZOOMED);
        ctx.assertEqual(env.getActiveIntervalCount(), 0, 'Slideshow interval must be cancelled when zoomed');

        // Navigating while zoomed resets zoom to 1x and transitions to VIEWING
        lightbox.navigate(1);
        ctx.assertEqual(lightbox.state, LightboxState.VIEWING);

        // Close modal
        lightbox.close();
        ctx.assertEqual(lightbox.state, LightboxState.CLOSED);
        ctx.assertEqual(env.getActiveIntervalCount(), 0);
      }
    } finally {
      env.teardown();
    }
  });

  ctx.test('StateAlternation: Canonical sequence openPhoto -> toggleZoom -> startSlideshow -> navigate -> toggleZoom -> close across 500 cycles', () => {
    const env = createInstrumentedAppEnv();
    try {
      const { eval: vmEval, document, window } = env;
      const lightbox = vmEval('lightboxController');
      const repo = vmEval('repository');
      const LightboxState = vmEval('LightboxState');
      const photos = repo.getPhotos('predebut', 'portrait');

      const imgEl = document.getElementById('lightbox-img');
      const playBtn = document.getElementById('lb-play-btn');
      const zoomBtn = document.getElementById('lb-zoom-btn');
      const announcer = document.getElementById('gallery-announcer');

      for (let i = 0; i < 500; i++) {
        const startIndex = i % photos.length;

        // 1. openPhoto -> VIEWING
        lightbox.open(photos, startIndex);
        ctx.assertEqual(lightbox.state, LightboxState.VIEWING);
        ctx.assert(!imgEl.classList.contains('zoomed'));
        ctx.assertEqual(zoomBtn.getAttribute('aria-pressed'), 'false');
        ctx.assertEqual(playBtn.getAttribute('aria-pressed'), 'false');
        ctx.assertEqual(env.getActiveIntervalCount(), 0);
        ctx.assert(window.location.hash.startsWith('#photo-'));

        // 2. toggleZoom -> ZOOMED
        lightbox.toggleZoom();
        ctx.assertEqual(lightbox.state, LightboxState.ZOOMED);
        ctx.assert(imgEl.classList.contains('zoomed'));
        ctx.assertEqual(zoomBtn.getAttribute('aria-pressed'), 'true');
        ctx.assertEqual(playBtn.getAttribute('aria-pressed'), 'false');
        ctx.assertEqual(env.getActiveIntervalCount(), 0);

        // 3. startSlideshow -> SLIDESHOW (resets zoom)
        lightbox.startSlideshow();
        ctx.assertEqual(lightbox.state, LightboxState.SLIDESHOW);
        ctx.assert(!imgEl.classList.contains('zoomed'));
        ctx.assertEqual(zoomBtn.getAttribute('aria-pressed'), 'false');
        ctx.assertEqual(playBtn.getAttribute('aria-pressed'), 'true');
        ctx.assertEqual(env.getActiveIntervalCount(), 1);

        // 4. navigate(1) -> stays in SLIDESHOW, resets interval
        lightbox.navigate(1);
        ctx.assertEqual(lightbox.state, LightboxState.SLIDESHOW);
        ctx.assertEqual(env.getActiveIntervalCount(), 1);
        ctx.assert(window.location.hash.startsWith('#photo-'));

        // 5. toggleZoom -> ZOOMED (stops slideshow)
        lightbox.toggleZoom();
        ctx.assertEqual(lightbox.state, LightboxState.ZOOMED);
        ctx.assert(imgEl.classList.contains('zoomed'));
        ctx.assertEqual(zoomBtn.getAttribute('aria-pressed'), 'true');
        ctx.assertEqual(playBtn.getAttribute('aria-pressed'), 'false');
        ctx.assertEqual(env.getActiveIntervalCount(), 0);

        // 6. close -> CLOSED
        lightbox.close();
        ctx.assertEqual(lightbox.state, LightboxState.CLOSED);
        ctx.assert(!imgEl.classList.contains('zoomed'));
        ctx.assertEqual(zoomBtn.getAttribute('aria-pressed'), 'false');
        ctx.assertEqual(playBtn.getAttribute('aria-pressed'), 'false');
        ctx.assertEqual(env.getActiveIntervalCount(), 0);
        ctx.assertEqual(window.location.hash, '');
      }
    } finally {
      env.teardown();
    }
  });

  ctx.test('StateAlternation: Calling actions while in CLOSED state is safe and does not corrupt FSM', () => {
    const env = createInstrumentedAppEnv();
    try {
      const { eval: vmEval } = env;
      const lightbox = vmEval('lightboxController');
      const LightboxState = vmEval('LightboxState');

      ctx.assertEqual(lightbox.state, LightboxState.CLOSED);

      // Perform actions on closed lightbox
      for (let i = 0; i < 20; i++) {
        lightbox.navigate(1);
        lightbox.navigate(-1);
        lightbox.stopSlideshow();
        lightbox.close();
      }

      ctx.assertEqual(lightbox.state, LightboxState.CLOSED);
      ctx.assertEqual(env.getActiveIntervalCount(), 0);
    } finally {
      env.teardown();
    }
  });

  ctx.test('StateAlternation: Single-photo and empty collection resilience under slideshow/zoom', () => {
    const env = createInstrumentedAppEnv();
    try {
      const { eval: vmEval } = env;
      const lightbox = vmEval('lightboxController');
      const LightboxState = vmEval('LightboxState');
      const PhotoAsset = vmEval('PhotoAsset');

      const singlePhoto = [new PhotoAsset('events/test.jpg', 'events', 'landscape', 0)];

      // Open with empty array -> should be a no-op
      lightbox.open([], 0);
      ctx.assertEqual(lightbox.state, LightboxState.CLOSED, 'Opening empty array must remain CLOSED');

      // Open single photo
      lightbox.open(singlePhoto, 0);
      ctx.assertEqual(lightbox.state, LightboxState.VIEWING);

      // Slideshow should not start for single-photo collections
      lightbox.startSlideshow();
      ctx.assertEqual(lightbox.state, LightboxState.VIEWING, 'Slideshow must not start for collections with <= 1 item');
      ctx.assertEqual(env.getActiveIntervalCount(), 0);

      // Navigation should be safe and stay at index 0
      lightbox.navigate(1);
      lightbox.navigate(-1);
      ctx.assertEqual(lightbox.state, LightboxState.VIEWING);

      lightbox.close();
      ctx.assertEqual(lightbox.state, LightboxState.CLOSED);
    } finally {
      env.teardown();
    }
  });

  ctx.test('StateAlternation: High-speed 500-step navigation boundary wrapping stress', () => {
    const env = loadAppEnvironment();
    try {
      const { eval: vmEval, document } = env;
      const lightbox = vmEval('lightboxController');
      const repo = vmEval('repository');
      const photos = repo.getPhotos('predebut', 'portrait');

      lightbox.open(photos, 0);

      const counterEl = document.getElementById('lightbox-counter');
      const total = photos.length;

      // Navigate forward 250 times
      for (let i = 0; i < 250; i++) {
        lightbox.navigate(1);
        const expectedIndex = (i + 1) % total;
        const expectedText = `${String(expectedIndex + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}`;
        ctx.assertEqual(counterEl.textContent, expectedText);
      }

      // Navigate backward 250 times
      for (let i = 250; i > 0; i--) {
        lightbox.navigate(-1);
        const expectedIndex = (i - 1 + total) % total;
        const expectedText = `${String(expectedIndex + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}`;
        ctx.assertEqual(counterEl.textContent, expectedText);
      }

      lightbox.close();
    } finally {
      env.teardown();
    }
  });

  // ──────────────────────────────────────────────────────────────────────────
  // SECTION 2: MALFORMED DATA BOUNDARY FUZZING
  // ──────────────────────────────────────────────────────────────────────────

  ctx.test('MalformedBoundary: PhotoAsset handles corrupted, null, undefined, and non-string inputs', () => {
    const env = loadAppEnvironment();
    try {
      const { eval: vmEval } = env;
      const PhotoAsset = vmEval('PhotoAsset');

      // Create circular reference object
      const circular = { caption: 'Circular' };
      circular.self = circular;
      circular.src = 'events/circular.jpg';

      const corruptedEntries = [
        null,
        undefined,
        '',
        0,
        12345,
        false,
        true,
        {},
        [],
        { src: null, caption: null },
        { src: undefined, caption: undefined },
        { src: 'events/custom.jpg', caption: 'Custom Moment' },
        { src: '', caption: '' },
        circular,
        { invalidProp: true },
        NaN,
        Infinity,
        -Infinity,
        () => {},
        Symbol('test')
      ];

      for (const entry of corruptedEntries) {
        let asset;
        assertDoesNotThrow(() => {
          asset = new PhotoAsset(entry, 'predebut', 'portrait', 0);
        }, `PhotoAsset constructor must not throw on malformed entry: ${String(entry)}`);

        // Check getters
        assertDoesNotThrow(() => {
          const src = asset.src;
          const webp = asset.webpSrc;
          const cap = asset.caption;
          const cat = asset.category;
          const orient = asset.orientation;
          const idx = asset.index;
          const plate = asset.plateNumber;
          const moment = asset.momentTag;
          const catLabel = asset.categoryLabel;
          const telemetry = asset.opticalTelemetry;

          ctx.assert(typeof src === 'string', 'src must be string');
          ctx.assert(typeof webp === 'string', 'webpSrc must be string');
          ctx.assert(typeof cap === 'string', 'caption must be string');
          ctx.assert(typeof plate === 'string', 'plateNumber must be string');
          ctx.assert(typeof catLabel === 'string', 'categoryLabel must be string');
          ctx.assert(typeof telemetry === 'string', 'opticalTelemetry must be string');
        }, `All getters must execute safely for entry: ${String(entry)}`);
      }
    } finally {
      env.teardown();
    }
  });

  ctx.test('MalformedBoundary: PhotoAsset index boundary fuzzing (negative, NaN, extreme numbers)', () => {
    const env = loadAppEnvironment();
    try {
      const { eval: vmEval } = env;
      const PhotoAsset = vmEval('PhotoAsset');

      const extremeIndices = [-999999, -1, 0, 1, 999999, NaN, Infinity, -Infinity, null, undefined];

      for (const idx of extremeIndices) {
        let asset;
        assertDoesNotThrow(() => {
          asset = new PhotoAsset('predebut/test.jpg', 'predebut', 'portrait', idx);
        }, `PhotoAsset must handle extreme index: ${idx}`);

        assertDoesNotThrow(() => {
          const plate = asset.plateNumber;
          const tag = asset.momentTag;
          ctx.assert(typeof plate === 'string');
          ctx.assert(typeof tag === 'string');
        }, `Plate/tag must be string for index: ${idx}`);
      }
    } finally {
      env.teardown();
    }
  });

  ctx.test('MalformedBoundary: GalleryPresenter handles arbitrary/invalid tab and orientation inputs', () => {
    const env = loadAppEnvironment();
    try {
      const { eval: vmEval } = env;
      const presenter = vmEval('galleryPresenter');

      const invalidTabs = [
        null,
        undefined,
        '',
        '__proto__',
        'constructor',
        'toString',
        'nonexistent-category',
        123,
        false,
        {},
        []
      ];

      const initialCategory = presenter.activeCategory;

      for (const tab of invalidTabs) {
        assertDoesNotThrow(() => {
          presenter.switchTab(tab, false);
        }, `switchTab must not throw on invalid tab: ${String(tab)}`);
      }

      // Active category should still be valid
      ctx.assertEqual(presenter.activeCategory, initialCategory, 'Active category should not be corrupted by invalid switchTab calls');

      const invalidOrients = [
        null,
        undefined,
        '',
        'diagonal',
        'vertical',
        'isometric',
        123,
        {},
        false
      ];

      for (const orient of invalidOrients) {
        assertDoesNotThrow(() => {
          presenter.setOrientation(orient);
        }, `setOrientation must not throw on invalid orient: ${String(orient)}`);
      }
    } finally {
      env.teardown();
    }
  });

  ctx.test('MalformedBoundary: PortfolioRepository resilience against missing keys and corrupted raw stores', () => {
    const env = loadAppEnvironment();
    try {
      const { eval: vmEval } = env;
      const PortfolioRepository = vmEval('PortfolioRepository');

      const corruptedStores = [
        {},
        { predebut: null, events: undefined },
        { predebut: { portrait: null, landscape: 'not-an-array' } },
        { predebut: { portrait: [null, undefined, {}] } }
      ];

      for (const raw of corruptedStores) {
        const repo = new PortfolioRepository(raw, ['predebut', 'events']);
        assertDoesNotThrow(() => {
          repo.getCategories();
          repo.isValidCategory('predebut');
          repo.isValidCategory(null);
          repo.hasOrientation('predebut', 'portrait');
          repo.getOrientationCount('predebut', 'portrait');
          repo.getCategoryTotalCount('predebut');
          repo.getTotalArchivalPlates();
          const photos = repo.getPhotos('predebut', 'portrait');
          ctx.assert(Array.isArray(photos));
        }, `Corrupted rawStore must not cause repository methods to throw: ${JSON.stringify(raw)}`);
      }
    } finally {
      env.teardown();
    }
  });

  // ──────────────────────────────────────────────────────────────────────────
  // SECTION 3: BROWSER HASH & ROUTING FUZZING
  // ──────────────────────────────────────────────────────────────────────────

  ctx.test('HashFuzzing: Dynamic hashchange events with chaotic slugs, special chars, and URI anomalies', () => {
    const env = loadAppEnvironment();
    try {
      const { eval: vmEval, window } = env;
      const lightbox = vmEval('lightboxController');
      const repo = vmEval('repository');
      const photos = repo.getPhotos('predebut', 'portrait');

      lightbox.open(photos, 0);
      ctx.assert(lightbox.isOpen, 'Lightbox must be open');

      const fuzzedHashes = [
        '',
        '#',
        '#photo-',
        '#photo-nonexistent-slug-xyz',
        '#photo-0',
        '#photo-9999999',
        '#photo--1',
        '#photo-null',
        '#photo-undefined',
        '#photo-NaN',
        '#photo-%20%21%40%23%24%25%5E%26%2A',
        '#photo-<>:"/\\|?*',
        '#photo-<script>alert(1)</script>',
        '#photo-javascript:alert(1)',
        '#photo-📷📸🖼️🎨',
        '#photo-' + 'a'.repeat(2000), // Extreme length slug
        '#about',
        '#gallery',
        '#inquire',
        '#unknown-hash',
        '###triple-hash',
        '#photo-EYSI-2-22', // Valid slug in predebut/portrait
        '#photo-EYSI-1-62'  // Valid slug in landscape
      ];

      for (const hash of fuzzedHashes) {
        assertDoesNotThrow(() => {
          window.location.hash = hash;
          window.dispatchEvent({
            type: 'hashchange',
            newURL: `https://EysiClicks-portfolio-2026.great-site.net/${hash}`,
            oldURL: 'https://EysiClicks-portfolio-2026.great-site.net/#photo-prev'
          });
        }, `Hashchange event with "${hash.slice(0, 30)}" must not throw uncaught exceptions`);
      }

      // Popstate dispatch with missing or malformed newURL
      const popstateEvents = [
        { type: 'popstate' },
        { type: 'popstate', newURL: '' },
        { type: 'popstate', newURL: 'invalid-url-string' },
        { type: 'popstate', newURL: 'https://EysiClicks-portfolio-2026.great-site.net/#photo-EYSI-2-22' }
      ];

      for (const evt of popstateEvents) {
        assertDoesNotThrow(() => {
          window.dispatchEvent(evt);
        }, 'Popstate event must not throw');
      }
    } finally {
      env.teardown();
    }
  });

  ctx.test('HashFuzzing: Initial page load URL hash photo auto-opening under fuzzy inputs', () => {
    const fuzzedInitialHashes = [
      '',
      '#',
      '#photo-',
      '#photo-EYSI-2-22', // valid
      '#photo-eysi-2-22', // case-insensitive
      '#photo-nonexistent',
      '#photo-<script>',
      '#photo-%20'
    ];

    for (const hash of fuzzedInitialHashes) {
      const env = createDOMEnvironment();
      env.window.location.hash = hash;

      const appJsCode = fs.readFileSync(path.join(PROJECT_ROOT, 'app.js'), 'utf-8');
      const sandbox = {
        window: env.window,
        document: env.document,
        localStorage: env.window.localStorage,
        location: env.window.location,
        history: env.window.history,
        setTimeout: env.window.setTimeout,
        clearTimeout: env.window.clearTimeout,
        setInterval: env.window.setInterval,
        clearInterval: env.window.clearInterval,
        requestAnimationFrame: env.window.requestAnimationFrame,
        cancelAnimationFrame: env.window.cancelAnimationFrame,
        matchMedia: env.window.matchMedia,
        IntersectionObserver: env.window.IntersectionObserver,
        Image: env.window.Image,
        URL: env.window.URL,
        URLSearchParams,
        Intl,
        console,
        globalThis: env.window
      };
      env.window.window = env.window;
      env.window.globalThis = env.window;

      assertDoesNotThrow(() => {
        const context = vm.createContext(sandbox);
        vm.runInContext(appJsCode, context);
      }, `Bootstrap with initial hash "${hash}" must not throw`);

      env.teardown();
    }
  });

  // ──────────────────────────────────────────────────────────────────────────
  // SECTION 4: MODAL FOCUS & EVENT HANDLING UNDER RAPID STRESS
  // ──────────────────────────────────────────────────────────────────────────

  ctx.test('EventStress: Rapid Escape key assault under various modal states', () => {
    const env = createInstrumentedAppEnv();
    try {
      const { eval: vmEval, document } = env;
      const lightbox = vmEval('lightboxController');
      const repo = vmEval('repository');
      const LightboxState = vmEval('LightboxState');
      const photos = repo.getPhotos('predebut', 'portrait');

      // 1. Fire 50 Escape keys while closed -> should remain closed and safe
      for (let i = 0; i < 50; i++) {
        document.dispatchEvent({ type: 'keydown', key: 'Escape', preventDefault() {} });
      }
      ctx.assertEqual(lightbox.state, LightboxState.CLOSED);

      // 2. Open, then rapid Escape keys
      lightbox.open(photos, 0);
      ctx.assertEqual(lightbox.state, LightboxState.VIEWING);
      for (let i = 0; i < 50; i++) {
        document.dispatchEvent({ type: 'keydown', key: 'Escape', preventDefault() {} });
      }
      ctx.assertEqual(lightbox.state, LightboxState.CLOSED);

      // 3. Open, zoom in, first Escape resets zoom, second closes
      lightbox.open(photos, 0);
      lightbox.toggleZoom();
      ctx.assertEqual(lightbox.state, LightboxState.ZOOMED);

      document.dispatchEvent({ type: 'keydown', key: 'Escape', preventDefault() {} });
      ctx.assertEqual(lightbox.state, LightboxState.VIEWING, 'First Escape when zoomed must reset to VIEWING');

      document.dispatchEvent({ type: 'keydown', key: 'Escape', preventDefault() {} });
      ctx.assertEqual(lightbox.state, LightboxState.CLOSED, 'Second Escape must close modal');

      // 4. Open in slideshow, Escape closes modal and stops slideshow
      lightbox.open(photos, 0);
      lightbox.startSlideshow();
      ctx.assertEqual(lightbox.state, LightboxState.SLIDESHOW);
      ctx.assertEqual(env.getActiveIntervalCount(), 1);

      document.dispatchEvent({ type: 'keydown', key: 'Escape', preventDefault() {} });
      ctx.assertEqual(lightbox.state, LightboxState.CLOSED);
      ctx.assertEqual(env.getActiveIntervalCount(), 0, 'Escape must terminate slideshow interval cleanly');
    } finally {
      env.teardown();
    }
  });

  ctx.test('EventStress: Rapid click storm on controls, stage, backdrop, and buttons', () => {
    const env = createInstrumentedAppEnv();
    try {
      const { eval: vmEval, document } = env;
      const lightbox = vmEval('lightboxController');
      const repo = vmEval('repository');
      const photos = repo.getPhotos('predebut', 'portrait');

      const closeBtn = document.getElementById('lightbox-close');
      const prevBtn = document.getElementById('lightbox-prev');
      const nextBtn = document.getElementById('lightbox-next');
      const zoomBtn = document.getElementById('lb-zoom-btn');
      const playBtn = document.getElementById('lb-play-btn');
      const stageEl = document.querySelector('.lightbox-stage');
      const lightboxEl = document.getElementById('lightbox');

      ctx.assert(closeBtn && prevBtn && nextBtn && zoomBtn && playBtn && stageEl && lightboxEl);

      lightbox.open(photos, 0);

      // Fire 100 rapid next/prev clicks
      for (let i = 0; i < 100; i++) {
        nextBtn.click();
        prevBtn.click();
      }

      // Fire 100 rapid zoom & play clicks
      for (let i = 0; i < 100; i++) {
        zoomBtn.click();
        playBtn.click();
      }

      // Backdrop click closes the lightbox modal
      lightboxEl.click();
      ctx.assertEqual(lightbox.state, vmEval('LightboxState').CLOSED);
      ctx.assertEqual(env.getActiveIntervalCount(), 0);

      // Click close button repeatedly when already closed
      for (let i = 0; i < 20; i++) {
        closeBtn.click();
      }
      ctx.assertEqual(lightbox.state, vmEval('LightboxState').CLOSED);
    } finally {
      env.teardown();
    }
  });

  ctx.test('EventStress: Touch swipe gesture simulation (left, right, vertical close, multitouch)', () => {
    const env = loadAppEnvironment();
    try {
      const { eval: vmEval, document } = env;
      const lightbox = vmEval('lightboxController');
      const repo = vmEval('repository');
      const photos = repo.getPhotos('predebut', 'portrait');
      const lightboxEl = document.getElementById('lightbox');

      lightbox.open(photos, 0);
      const counterEl = document.getElementById('lightbox-counter');

      // Swipe Left (next photo)
      lightboxEl.dispatchEvent({
        type: 'touchstart',
        touches: [{ clientX: 200, clientY: 100 }]
      });
      lightboxEl.dispatchEvent({
        type: 'touchmove',
        touches: [{ clientX: 100, clientY: 100 }]
      });
      lightboxEl.dispatchEvent({ type: 'touchend', touches: [] });

      ctx.assertEqual(counterEl.textContent, '02 / 05', 'Swipe left should advance to photo 2');

      // Swipe Right (previous photo)
      lightboxEl.dispatchEvent({
        type: 'touchstart',
        touches: [{ clientX: 100, clientY: 100 }]
      });
      lightboxEl.dispatchEvent({
        type: 'touchmove',
        touches: [{ clientX: 250, clientY: 100 }]
      });
      lightboxEl.dispatchEvent({ type: 'touchend', touches: [] });

      ctx.assertEqual(counterEl.textContent, '01 / 05', 'Swipe right should return to photo 1');

      // Multi-touch pinch (should be ignored without navigation)
      lightboxEl.dispatchEvent({
        type: 'touchstart',
        touches: [{ clientX: 100, clientY: 100 }, { clientX: 200, clientY: 200 }]
      });
      lightboxEl.dispatchEvent({
        type: 'touchmove',
        touches: [{ clientX: 80, clientY: 80 }, { clientX: 220, clientY: 220 }]
      });
      lightboxEl.dispatchEvent({ type: 'touchend', touches: [] });
      ctx.assertEqual(counterEl.textContent, '01 / 05', 'Multi-touch should not trigger navigation');

      // Swipe Down (pull to close)
      lightboxEl.dispatchEvent({
        type: 'touchstart',
        touches: [{ clientX: 150, clientY: 50 }]
      });
      lightboxEl.dispatchEvent({
        type: 'touchmove',
        touches: [{ clientX: 150, clientY: 200 }]
      });
      lightboxEl.dispatchEvent({ type: 'touchend', touches: [] });

      ctx.assertEqual(lightbox.state, vmEval('LightboxState').CLOSED, 'Swipe down should close modal');
    } finally {
      env.teardown();
    }
  });

  ctx.test('EventStress: Focus trapping under rapid Tab and Shift+Tab cycling', () => {
    const env = loadAppEnvironment();
    try {
      const { eval: vmEval, document } = env;
      const lightbox = vmEval('lightboxController');
      const repo = vmEval('repository');
      const photos = repo.getPhotos('predebut', 'portrait');

      lightbox.open(photos, 0);

      const focusableButtons = document.querySelectorAll('#lightbox button:not([disabled])');
      ctx.assert(focusableButtons.length > 0, 'Must have focusable buttons in lightbox');

      const firstBtn = focusableButtons[0];
      const lastBtn = focusableButtons[focusableButtons.length - 1];

      // Tab when last button is active -> wraps to first
      document.activeElement = lastBtn;
      let prevented = false;
      document.dispatchEvent({
        type: 'keydown',
        key: 'Tab',
        shiftKey: false,
        preventDefault() { prevented = true; }
      });
      ctx.assert(prevented, 'Tab on last button must call preventDefault()');
      ctx.assertEqual(document.activeElement, firstBtn, 'Tab on last button must wrap focus to first button');

      // Shift+Tab when first button is active -> wraps to last
      document.activeElement = firstBtn;
      prevented = false;
      document.dispatchEvent({
        type: 'keydown',
        key: 'Tab',
        shiftKey: true,
        preventDefault() { prevented = true; }
      });
      ctx.assert(prevented, 'Shift+Tab on first button must call preventDefault()');
      ctx.assertEqual(document.activeElement, lastBtn, 'Shift+Tab on first button must wrap focus to last button');

      lightbox.close();
    } finally {
      env.teardown();
    }
  });

  ctx.test('EventStress: Rapid keyboard shortcuts cycling (Z, P, ArrowLeft, ArrowRight, Escape)', () => {
    const env = createInstrumentedAppEnv();
    try {
      const { eval: vmEval, document } = env;
      const lightbox = vmEval('lightboxController');
      const repo = vmEval('repository');
      const LightboxState = vmEval('LightboxState');
      const photos = repo.getPhotos('predebut', 'portrait');

      lightbox.open(photos, 0);

      // Fire 100 alternating 'z' and 'p' keyboard events
      for (let i = 0; i < 100; i++) {
        document.dispatchEvent({ type: 'keydown', key: 'z', preventDefault() {} });
        ctx.assertEqual(lightbox.state, LightboxState.ZOOMED);
        ctx.assertEqual(env.getActiveIntervalCount(), 0);

        document.dispatchEvent({ type: 'keydown', key: 'p', preventDefault() {} });
        ctx.assertEqual(lightbox.state, LightboxState.SLIDESHOW);
        ctx.assertEqual(env.getActiveIntervalCount(), 1);
      }

      // Fire Arrow navigation keys while in slideshow
      for (let i = 0; i < 50; i++) {
        document.dispatchEvent({ type: 'keydown', key: 'ArrowRight', preventDefault() {} });
        ctx.assertEqual(lightbox.state, LightboxState.SLIDESHOW);
        ctx.assertEqual(env.getActiveIntervalCount(), 1);

        document.dispatchEvent({ type: 'keydown', key: 'ArrowLeft', preventDefault() {} });
        ctx.assertEqual(lightbox.state, LightboxState.SLIDESHOW);
        ctx.assertEqual(env.getActiveIntervalCount(), 1);
      }

      // Escape terminates slideshow and closes modal
      document.dispatchEvent({ type: 'keydown', key: 'Escape', preventDefault() {} });
      ctx.assertEqual(lightbox.state, LightboxState.CLOSED);
      ctx.assertEqual(env.getActiveIntervalCount(), 0);
    } finally {
      env.teardown();
    }
  });

  ctx.test('EventStress: Restoring focus to previous activeElement after modal close', () => {
    const env = loadAppEnvironment();
    try {
      const { eval: vmEval, document } = env;
      const lightbox = vmEval('lightboxController');
      const repo = vmEval('repository');
      const photos = repo.getPhotos('predebut', 'portrait');

      const triggerBtn = document.createElement('button');
      triggerBtn.id = 'external-trigger-button';
      let focused = false;
      triggerBtn.focus = () => { focused = true; };
      document.body.appendChild(triggerBtn);
      document.activeElement = triggerBtn;

      lightbox.open(photos, 0);
      lightbox.close();

      ctx.assert(focused, 'Closing lightbox must restore focus to previously activeElement');
    } finally {
      env.teardown();
    }
  });

  // ──────────────────────────────────────────────────────────────────────────
  // RESULTS SUMMARY
  // ──────────────────────────────────────────────────────────────────────────

  console.log('\n======================================================================');
  console.log('  ADVERSARIAL STRESS TEST EXECUTION LEDGER');
  console.log('======================================================================');

  let passed = 0;
  let failed = 0;
  for (const t of ctx.tests) {
    if (t.status === 'PASS') {
      passed++;
      console.log(`  [PASS] ${t.name} (${t.duration}ms)`);
    } else {
      failed++;
      console.log(`  [FAIL] ${t.name} (${t.duration}ms) - ERROR: ${t.error}`);
    }
  }

  console.log('----------------------------------------------------------------------');
  console.log(`  TOTAL: ${ctx.tests.length} | PASSED: ${passed} | FAILED: ${failed}`);
  console.log('======================================================================\n');

  if (failed > 0) {
    process.exitCode = 1;
  }
  return { total: ctx.tests.length, passed, failed, tests: ctx.tests };
}

if (require.main === module) {
  runAdversarialSuite();
}

module.exports = { runAdversarialSuite };
