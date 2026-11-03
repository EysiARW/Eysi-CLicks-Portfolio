/**
 * TIER 2: Boundary & Corner Cases Test Suite
 * Minimum 5 tests per major area:
 * 1. Boundary Condition Handling (first/last photo wrap or clamp)
 * 2. Keyboard Navigation Handling (Escape, ArrowLeft, ArrowRight, Z, P)
 * 3. Empty Orientation States & Filter Combinations
 * 4. Responsive Breakpoint Declarations in CSS
 * 5. Invalid Image Fallback Handling & Defensive Defaults
 */

const { createDOMEnvironment, loadAppEnvironment, parseCSSFile, AssertionContext } = require('./harness.js');

function runTier2Tests() {
  const ctx = new AssertionContext('Tier 2: Boundary & Corner Cases');

  // ══════════════════════════════════════════════════════════════════════════
  // FEATURE 1: Boundary Condition Handling (Wrap / Clamp)
  // ══════════════════════════════════════════════════════════════════════════

  ctx.test('BoundaryWrap: Navigating backward from index 0 wraps to the last photo', () => {
    const appEnv = loadAppEnvironment();
    try {
      const { document, eval: vmEval } = appEnv;
      const lb = vmEval('lightboxController');
      const repo = vmEval('repository');
      const photos = repo.getPhotos('predebut', 'portrait');

      lb.open(photos, 0);
      lb.navigate(-1);

      const counter = document.getElementById('lightbox-counter');
      const expectedEnd = `${String(photos.length).padStart(2, '0')} / ${String(photos.length).padStart(2, '0')}`;
      ctx.assertEqual(counter.textContent.trim(), expectedEnd, 'Navigating -1 from 0 must wrap to last photo');
    } finally {
      appEnv.teardown();
    }
  });

  ctx.test('BoundaryWrap: Navigating forward from last index wraps to index 0', () => {
    const appEnv = loadAppEnvironment();
    try {
      const { document, eval: vmEval } = appEnv;
      const lb = vmEval('lightboxController');
      const repo = vmEval('repository');
      const photos = repo.getPhotos('predebut', 'portrait');

      lb.open(photos, photos.length - 1);
      lb.navigate(1);

      const counter = document.getElementById('lightbox-counter');
      const expectedStart = `01 / ${String(photos.length).padStart(2, '0')}`;
      ctx.assertEqual(counter.textContent.trim(), expectedStart, 'Navigating +1 from last must wrap to first photo');
    } finally {
      appEnv.teardown();
    }
  });

  ctx.test('BoundaryWrap: Rapid sequential navigation across multiple boundary cycles maintains valid bounds', () => {
    const appEnv = loadAppEnvironment();
    try {
      const { document, eval: vmEval } = appEnv;
      const lb = vmEval('lightboxController');
      const repo = vmEval('repository');
      const photos = repo.getPhotos('events', 'landscape');

      lb.open(photos, 0);
      // Advance by 2.5 full cycles
      for (let i = 0; i < photos.length * 2 + 3; i++) {
        lb.navigate(1);
      }

      const counter = document.getElementById('lightbox-counter');
      ctx.assertMatches(counter.textContent.trim(), /^\d{2} \/ \d{2}$/, 'Counter must retain valid MM / NN format');
      const plateNo = document.getElementById('lightbox-plate-no');
      ctx.assertMatches(plateNo.textContent.trim(), /^PLATE \d{2}$/, 'Plate number must be valid');
    } finally {
      appEnv.teardown();
    }
  });

  ctx.test('BoundaryWrap: Single-item array handles navigation without NaN or index drift', () => {
    const appEnv = loadAppEnvironment();
    try {
      const { document, eval: vmEval } = appEnv;
      const lb = vmEval('lightboxController');
      const PhotoAsset = vmEval('PhotoAsset');

      const singlePhoto = [new PhotoAsset('single.jpg', 'events', 'landscape', 0)];
      lb.open(singlePhoto, 0);

      lb.navigate(1);
      let counter = document.getElementById('lightbox-counter');
      ctx.assertEqual(counter.textContent.trim(), '01 / 01', 'Counter must remain 01 / 01 on next');

      lb.navigate(-1);
      counter = document.getElementById('lightbox-counter');
      ctx.assertEqual(counter.textContent.trim(), '01 / 01', 'Counter must remain 01 / 01 on prev');
    } finally {
      appEnv.teardown();
    }
  });

  ctx.test('BoundaryWrap: Passing out-of-bounds index to open() clamps within [0, length - 1]', () => {
    const appEnv = loadAppEnvironment();
    try {
      const { document, eval: vmEval } = appEnv;
      const lb = vmEval('lightboxController');
      const repo = vmEval('repository');
      const photos = repo.getPhotos('predebut', 'portrait');

      // Test negative index
      lb.open(photos, -10);
      let counter = document.getElementById('lightbox-counter');
      ctx.assertEqual(counter.textContent.trim(), `01 / ${String(photos.length).padStart(2, '0')}`, 'Negative index should clamp to 0');

      // Test oversized index
      lb.open(photos, 9999);
      counter = document.getElementById('lightbox-counter');
      ctx.assertEqual(counter.textContent.trim(), `${String(photos.length).padStart(2, '0')} / ${String(photos.length).padStart(2, '0')}`, 'Oversized index should clamp to length - 1');
    } finally {
      appEnv.teardown();
    }
  });

  ctx.test('BoundaryWrap: Calling navigate when empty does not throw exceptions', () => {
    const appEnv = loadAppEnvironment();
    try {
      const { eval: vmEval } = appEnv;
      const lb = vmEval('lightboxController');
      // Lightbox closed and empty
      lb.navigate(1);
      lb.navigate(-1);
      ctx.assert(true, 'navigate() on empty lightbox must complete without throwing');
    } finally {
      appEnv.teardown();
    }
  });

  // ══════════════════════════════════════════════════════════════════════════
  // FEATURE 2: Keyboard Navigation Handling
  // ══════════════════════════════════════════════════════════════════════════

  ctx.test('KeyboardNav: Escape key closes the open lightbox modal', () => {
    const appEnv = loadAppEnvironment();
    try {
      const { document, eval: vmEval } = appEnv;
      const lb = vmEval('lightboxController');
      const repo = vmEval('repository');
      const photos = repo.getPhotos('predebut', 'portrait');

      lb.open(photos, 0);
      ctx.assert(lb.isOpen, 'Lightbox must be open');

      document.dispatchEvent({
        type: 'keydown',
        key: 'Escape',
        preventDefault() {}
      });

      ctx.assert(!lb.isOpen, 'Escape key must close open lightbox');
    } finally {
      appEnv.teardown();
    }
  });

  ctx.test('KeyboardNav: Escape key resets zoom first if currently zoomed', () => {
    const appEnv = loadAppEnvironment();
    try {
      const { document, eval: vmEval } = appEnv;
      const lb = vmEval('lightboxController');
      const repo = vmEval('repository');
      const photos = repo.getPhotos('predebut', 'portrait');

      lb.open(photos, 0);
      lb.toggleZoom();

      const img = document.getElementById('lightbox-img');
      ctx.assert(img.classList.contains('zoomed'), 'Image must have .zoomed class');

      // First Escape resets zoom
      document.dispatchEvent({
        type: 'keydown',
        key: 'Escape',
        preventDefault() {}
      });

      ctx.assert(!img.classList.contains('zoomed'), 'First Escape key must reset zoom');
      ctx.assert(lb.isOpen, 'Lightbox should remain open after first Escape if zoomed');

      // Second Escape closes modal
      document.dispatchEvent({
        type: 'keydown',
        key: 'Escape',
        preventDefault() {}
      });
      ctx.assert(!lb.isOpen, 'Second Escape key must close modal');
    } finally {
      appEnv.teardown();
    }
  });

  ctx.test('KeyboardNav: ArrowRight key navigates to next photo in sequence', () => {
    const appEnv = loadAppEnvironment();
    try {
      const { document, eval: vmEval } = appEnv;
      const lb = vmEval('lightboxController');
      const repo = vmEval('repository');
      const photos = repo.getPhotos('predebut', 'portrait');

      lb.open(photos, 1);
      document.dispatchEvent({
        type: 'keydown',
        key: 'ArrowRight',
        preventDefault() {}
      });

      const counter = document.getElementById('lightbox-counter');
      ctx.assertEqual(counter.textContent.trim(), `03 / ${String(photos.length).padStart(2, '0')}`, 'ArrowRight must advance to next photo');
    } finally {
      appEnv.teardown();
    }
  });

  ctx.test('KeyboardNav: ArrowLeft key navigates to previous photo in sequence', () => {
    const appEnv = loadAppEnvironment();
    try {
      const { document, eval: vmEval } = appEnv;
      const lb = vmEval('lightboxController');
      const repo = vmEval('repository');
      const photos = repo.getPhotos('predebut', 'portrait');

      lb.open(photos, 2);
      document.dispatchEvent({
        type: 'keydown',
        key: 'ArrowLeft',
        preventDefault() {}
      });

      const counter = document.getElementById('lightbox-counter');
      ctx.assertEqual(counter.textContent.trim(), `02 / ${String(photos.length).padStart(2, '0')}`, 'ArrowLeft must step to previous photo');
    } finally {
      appEnv.teardown();
    }
  });

  ctx.test('KeyboardNav: Keyboard shortcuts are inert when lightbox is closed', () => {
    const appEnv = loadAppEnvironment();
    try {
      const { document, eval: vmEval } = appEnv;
      const lb = vmEval('lightboxController');

      ctx.assert(!lb.isOpen, 'Lightbox must be closed initially');

      // Dispatching keys should not open or throw
      document.dispatchEvent({ type: 'keydown', key: 'ArrowRight', preventDefault() {} });
      document.dispatchEvent({ type: 'keydown', key: 'Escape', preventDefault() {} });
      document.dispatchEvent({ type: 'keydown', key: 'z', preventDefault() {} });
      document.dispatchEvent({ type: 'keydown', key: 'p', preventDefault() {} });

      ctx.assert(!lb.isOpen, 'Keys must not open lightbox or throw errors when closed');
    } finally {
      appEnv.teardown();
    }
  });

  ctx.test('KeyboardNav: Z and P shortcuts toggle zoom and slideshow respectively', () => {
    const appEnv = loadAppEnvironment();
    try {
      const { document, eval: vmEval } = appEnv;
      const lb = vmEval('lightboxController');
      const repo = vmEval('repository');
      const photos = repo.getPhotos('events', 'landscape');

      lb.open(photos, 0);

      // 'z' toggles zoom
      document.dispatchEvent({ type: 'keydown', key: 'z', preventDefault() {} });
      const img = document.getElementById('lightbox-img');
      ctx.assert(img.classList.contains('zoomed'), 'Key "z" must toggle zoom on');

      // 'p' toggles slideshow
      document.dispatchEvent({ type: 'keydown', key: 'p', preventDefault() {} });
      const playBtn = document.getElementById('lb-play-btn');
      ctx.assertEqual(playBtn.getAttribute('aria-pressed'), 'true', 'Key "p" must start slideshow');
    } finally {
      appEnv.teardown();
    }
  });

  // ══════════════════════════════════════════════════════════════════════════
  // FEATURE 3: Empty Orientation States & Filter Combinations
  // ══════════════════════════════════════════════════════════════════════════

  ctx.test('EmptyOrientation: Requesting orientation with zero photos returns empty array safely', () => {
    const appEnv = loadAppEnvironment();
    try {
      const { eval: vmEval } = appEnv;
      const repo = vmEval('repository');

      const count = repo.getOrientationCount('institutional', 'portrait');
      ctx.assertEqual(count, 0, 'Institutional collection currently has 0 portrait photos');

      const photos = repo.getPhotos('institutional', 'portrait');
      ctx.assertEqual(photos.length, 0, 'repo.getPhotos should return empty array');
    } finally {
      appEnv.teardown();
    }
  });

  ctx.test('EmptyOrientation: GalleryPresenter auto-falls back to valid orientation if requested is empty', () => {
    const appEnv = loadAppEnvironment();
    try {
      const { eval: vmEval } = appEnv;
      const presenter = vmEval('galleryPresenter');

      presenter.switchTab('institutional', false);
      // Attempting to set portrait on institutional (which has only landscape)
      presenter.setOrientation('portrait');

      // Should remain or fallback to landscape
      const grid = appEnv.document.getElementById('grid-institutional');
      ctx.assert(grid !== null, 'grid-institutional must exist');
      ctx.assert(grid.children.length > 0, 'Grid must have photos rendered via valid orientation fallback');
    } finally {
      appEnv.teardown();
    }
  });

  ctx.test('EmptyOrientation: Orientation toggle buttons reflect pressed states', () => {
    const appEnv = loadAppEnvironment();
    try {
      const { document, eval: vmEval } = appEnv;
      const presenter = vmEval('galleryPresenter');

      presenter.switchTab('predebut', false);
      presenter.setOrientation('landscape');

      const landscapeBtn = document.getElementById('orient-landscape');
      const portraitBtn = document.getElementById('orient-portrait');

      ctx.assertEqual(landscapeBtn.getAttribute('aria-pressed'), 'true', 'Landscape button should be pressed');
      ctx.assertEqual(portraitBtn.getAttribute('aria-pressed'), 'false', 'Portrait button should not be pressed');
    } finally {
      appEnv.teardown();
    }
  });

  ctx.test('EmptyOrientation: Orientation count badges accurately display counts per active tab', () => {
    const appEnv = loadAppEnvironment();
    try {
      const { document, eval: vmEval } = appEnv;
      const presenter = vmEval('galleryPresenter');

      presenter.switchTab('predebut', false);
      const portCount = document.getElementById('orient-count-portrait');
      const landCount = document.getElementById('orient-count-landscape');

      ctx.assertEqual(portCount.textContent.trim(), '(5)', 'Predebut portrait count should be 5');
      ctx.assertEqual(landCount.textContent.trim(), '(3)', 'Predebut landscape count should be 3');
    } finally {
      appEnv.teardown();
    }
  });

  ctx.test('EmptyOrientation: Switching orientation preserves category active state', () => {
    const appEnv = loadAppEnvironment();
    try {
      const { eval: vmEval } = appEnv;
      const presenter = vmEval('galleryPresenter');

      presenter.switchTab('events', false);
      presenter.setOrientation('portrait');
      ctx.assertEqual(presenter.activeCategory, 'events', 'Active category must remain "events"');

      presenter.setOrientation('landscape');
      ctx.assertEqual(presenter.activeCategory, 'events', 'Active category must still remain "events"');
    } finally {
      appEnv.teardown();
    }
  });

  // ══════════════════════════════════════════════════════════════════════════
  // FEATURE 4: Responsive Breakpoint Declarations in CSS
  // ══════════════════════════════════════════════════════════════════════════

  ctx.test('ResponsiveCSS: Mobile media query breakpoint is declared', () => {
    const css = parseCSSFile();
    const hasMobileQuery = /@media\s*\(\s*max-width:\s*(?:640px|768px|480px)\s*\)/i.test(css.raw);
    ctx.assert(hasMobileQuery, 'Stylesheet must declare a mobile max-width breakpoint (640px or 768px)');
  });

  ctx.test('ResponsiveCSS: Tablet / intermediate media query breakpoint is declared', () => {
    const css = parseCSSFile();
    const hasTabletQuery = /@media\s*\(\s*(?:max-width:\s*(?:1080px|1024px|959px|960px|900px|860px)|min-width:\s*(?:760px|820px|960px))\s*\)/i.test(css.raw);
    ctx.assert(hasTabletQuery, 'Stylesheet must declare a tablet / intermediate breakpoint (between 760px and 1080px)');
  });

  ctx.test('ResponsiveCSS: Reduced motion media query is declared for vestibular safety', () => {
    const css = parseCSSFile();
    const hasReducedMotion = /@media\s*\(\s*prefers-reduced-motion:\s*reduce\s*\)/i.test(css.raw);
    ctx.assert(hasReducedMotion, 'Stylesheet must declare @media (prefers-reduced-motion: reduce)');
  });

  ctx.test('ResponsiveCSS: Fluid typography utilizes clamp() scaling', () => {
    const css = parseCSSFile();
    const clampCount = (css.raw.match(/clamp\s*\([^)]+\)/g) || []).length;
    ctx.assertGreaterOrEqual(clampCount, 3, 'Expected at least 3 clamp() rules for fluid typographic scaling');
  });

  ctx.test('ResponsiveCSS: Photo grid responsive column adjustment is defined', () => {
    const css = parseCSSFile();
    const hasResponsiveGrid = css.raw.includes('.photo-grid') && (css.raw.includes('grid-template-columns') || css.raw.includes('--cols') || css.raw.includes('repeat('));
    ctx.assert(hasResponsiveGrid, 'Stylesheet must define responsive grid layout for .photo-grid');
  });

  // ══════════════════════════════════════════════════════════════════════════
  // FEATURE 5: Invalid Image Fallback Handling & Defensive Defaults
  // ══════════════════════════════════════════════════════════════════════════

  ctx.test('ImageFallback: Image error handler in proof cards sets fallback alt text', () => {
    const appEnv = loadAppEnvironment();
    try {
      const { document, eval: vmEval } = appEnv;
      const presenter = vmEval('galleryPresenter');

      presenter.renderCategory('predebut');
      const img = document.querySelector('#grid-predebut img');
      ctx.assert(img !== null, 'Proof image must exist');

      // Trigger onerror
      img.dispatchEvent({ type: 'error', target: img });
      ctx.assertMatches(img.alt, /preserved|archive|photo/i, 'onerror handler should update alt text defensively');
    } finally {
      appEnv.teardown();
    }
  });

  ctx.test('ImageFallback: Filmstrip thumbnail handles webp loading failure by falling back to original src', () => {
    const appEnv = loadAppEnvironment();
    try {
      const { document, eval: vmEval } = appEnv;
      const lb = vmEval('lightboxController');
      const repo = vmEval('repository');
      const photos = repo.getPhotos('predebut', 'portrait');

      lb.open(photos, 0);

      const filmstripThumbImg = document.querySelector('#lightbox-filmstrip img');
      ctx.assert(filmstripThumbImg !== null, 'Filmstrip thumbnail image must exist');

      const originalSrc = photos[0].src;
      filmstripThumbImg.dispatchEvent({ type: 'error', target: filmstripThumbImg });
      ctx.assertEqual(filmstripThumbImg.src, originalSrc, 'Filmstrip onerror should fallback to original JPEG src');
    } finally {
      appEnv.teardown();
    }
  });

  ctx.test('ImageFallback: Images declare async decoding attribute for non-blocking rendering', () => {
    const appEnv = loadAppEnvironment();
    try {
      const { document, eval: vmEval } = appEnv;
      const presenter = vmEval('galleryPresenter');

      presenter.renderCategory('predebut');
      const img = document.querySelector('#grid-predebut img');
      ctx.assertEqual(img.getAttribute('decoding'), 'async', 'Grid images must declare decoding="async"');
    } finally {
      appEnv.teardown();
    }
  });

  ctx.test('ImageFallback: Off-screen gallery images declare loading="lazy"', () => {
    const appEnv = loadAppEnvironment();
    try {
      const { document, eval: vmEval } = appEnv;
      const presenter = vmEval('galleryPresenter');

      presenter.renderCategory('predebut');
      const img = document.querySelector('#grid-predebut img');
      ctx.assertEqual(img.getAttribute('loading'), 'lazy', 'Grid images must declare loading="lazy"');
    } finally {
      appEnv.teardown();
    }
  });

  ctx.test('ImageFallback: PhotoAsset normalizes malformed entries without throwing', () => {
    const appEnv = loadAppEnvironment();
    try {
      const { eval: vmEval } = appEnv;
      const PhotoAsset = vmEval('PhotoAsset');

      const nullAsset = new PhotoAsset(null, 'events', 'landscape', 0);
      ctx.assertEqual(nullAsset.src, '', 'Null entry should yield empty string src');
      ctx.assertEqual(nullAsset.caption, 'Cherished Moment', 'Null entry should yield default caption');

      const emptyAsset = new PhotoAsset('', 'events', 'landscape', 1);
      ctx.assertEqual(emptyAsset.src, '', 'Empty string entry should yield empty string src');
    } finally {
      appEnv.teardown();
    }
  });

  return ctx;
}

module.exports = { runTier2Tests };

if (require.main === module) {
  const result = runTier2Tests();
  console.log(`\n${result.tierName} Results:`);
  for (const t of result.tests) {
    console.log(`  [${t.status}] ${t.name} (${t.duration}ms)`);
    if (t.error) console.log(`      Error: ${t.error}`);
  }
  console.log(`\nSummary: Passed: ${result.passed}, Failed: ${result.failed}, Total: ${result.tests.length}`);
  process.exit(result.failed > 0 ? 1 : 0);
}
