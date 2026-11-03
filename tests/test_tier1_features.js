/**
 * TIER 1: Feature Coverage Test Suite
 * Minimum 5 tests per major feature area:
 * 1. Category Tabs (predebut, events, institutional)
 * 2. Photo Metadata & Contact Sheet Proof Layout
 * 3. Museum Matting & Optical Padding
 * 4. Darkroom / Daylight Theme Switching Mechanics
 * 5. Lightbox Modal Markup & Controls Existence
 */

const { createDOMEnvironment, loadAppEnvironment, parseCSSFile, AssertionContext } = require('./harness.js');

function runTier1Tests() {
  const ctx = new AssertionContext('Tier 1: Feature Coverage');

  // ══════════════════════════════════════════════════════════════════════════
  // FEATURE 1: Category Tabs
  // ══════════════════════════════════════════════════════════════════════════

  ctx.test('CategoryTabs: Tab buttons exist for all required categories', () => {
    const { document } = createDOMEnvironment();
    const tabs = document.querySelectorAll('.cat-tab');
    ctx.assertGreaterOrEqual(tabs.length, 3, 'Expected at least 3 category tabs');

    const expectedTabs = ['predebut', 'events', 'institutional'];
    const tabNames = tabs.map(t => t.dataset.tab);
    for (const exp of expectedTabs) {
      ctx.assert(tabNames.includes(exp), `Category tab for "${exp}" must exist`);
    }
  });

  ctx.test('CategoryTabs: Tabs container and buttons have proper ARIA attributes', () => {
    const { document } = createDOMEnvironment();
    const tablist = document.querySelector('.cat-tabs');
    ctx.assert(tablist !== null, '.cat-tabs container must exist');
    ctx.assertEqual(tablist.getAttribute('role'), 'tablist', '.cat-tabs must have role="tablist"');

    const tabs = document.querySelectorAll('.cat-tab');
    for (const tab of tabs) {
      ctx.assertEqual(tab.getAttribute('role'), 'tab', 'Each category tab must have role="tab"');
      ctx.assert(tab.hasAttribute('aria-selected'), 'Each category tab must declare aria-selected');
      ctx.assert(tab.hasAttribute('aria-controls'), 'Each category tab must declare aria-controls');
      const controlsId = tab.getAttribute('aria-controls');
      const targetPanel = document.getElementById(controlsId);
      ctx.assert(targetPanel !== null, `Panel referenced by aria-controls="${controlsId}" must exist in DOM`);
    }
  });

  ctx.test('CategoryTabs: Tab badges display zero-padded counts matching repository', () => {
    const appEnv = loadAppEnvironment();
    try {
      const { document, eval: vmEval } = appEnv;
      const repo = vmEval('repository');
      const categories = ['predebut', 'events', 'institutional'];

      for (const cat of categories) {
        const badge = document.getElementById('count-' + cat);
        ctx.assert(badge !== null, `Count badge for category "${cat}" must exist`);
        const totalInRepo = repo.getCategoryTotalCount(cat);
        const expectedPadded = String(totalInRepo).padStart(2, '0');
        ctx.assertEqual(badge.textContent.trim(), expectedPadded, `Count badge for ${cat} must match repository count`);
      }
    } finally {
      appEnv.teardown();
    }
  });

  ctx.test('CategoryTabs: Switching tab updates active class and aria-selected', () => {
    const appEnv = loadAppEnvironment();
    try {
      const { document, eval: vmEval } = appEnv;
      const presenter = vmEval('galleryPresenter');

      presenter.switchTab('events', false);

      const eventsTab = document.getElementById('tab-events');
      const predebutTab = document.getElementById('tab-predebut');

      ctx.assert(eventsTab.classList.contains('active'), 'Events tab must have .active class');
      ctx.assertEqual(eventsTab.getAttribute('aria-selected'), 'true', 'Events tab must have aria-selected="true"');
      ctx.assertEqual(eventsTab.getAttribute('tabindex'), '0', 'Events tab must have tabindex="0"');

      ctx.assert(!predebutTab.classList.contains('active'), 'Predebut tab must not have .active class');
      ctx.assertEqual(predebutTab.getAttribute('aria-selected'), 'false', 'Predebut tab must have aria-selected="false"');
      ctx.assertEqual(predebutTab.getAttribute('tabindex'), '-1', 'Predebut tab must have tabindex="-1"');
    } finally {
      appEnv.teardown();
    }
  });

  ctx.test('CategoryTabs: Switching tab shows corresponding panel and hides others', () => {
    const appEnv = loadAppEnvironment();
    try {
      const { document, eval: vmEval } = appEnv;
      const presenter = vmEval('galleryPresenter');

      presenter.switchTab('institutional', false);

      const instPanel = document.getElementById('panel-institutional');
      const predebutPanel = document.getElementById('panel-predebut');
      const eventsPanel = document.getElementById('panel-events');

      ctx.assert(instPanel.classList.contains('active'), 'Institutional panel must have .active class');
      ctx.assert(!predebutPanel.classList.contains('active'), 'Predebut panel must not be active');
      ctx.assert(!eventsPanel.classList.contains('active'), 'Events panel must not be active');
    } finally {
      appEnv.teardown();
    }
  });

  ctx.test('CategoryTabs: Active category updates URL query parameter', () => {
    const appEnv = loadAppEnvironment();
    try {
      const { window: win, eval: vmEval } = appEnv;
      const presenter = vmEval('galleryPresenter');

      presenter.switchTab('events', false);
      const url = new URL(win.location.href);
      ctx.assertEqual(url.searchParams.get('tab'), 'events', 'URL search parameter "tab" should be updated to "events"');
    } finally {
      appEnv.teardown();
    }
  });

  // ══════════════════════════════════════════════════════════════════════════
  // FEATURE 2: Photo Metadata Extraction & Contact Sheet Proof Layout
  // ══════════════════════════════════════════════════════════════════════════

  ctx.test('PhotoMetadata: PhotoAsset normalizes source paths and optical profiles', () => {
    const appEnv = loadAppEnvironment();
    try {
      const { eval: vmEval } = appEnv;
      const PhotoAsset = vmEval('PhotoAsset');

      const asset1 = new PhotoAsset('predebut/portrait/EYSI-2-22.jpg', 'predebut', 'portrait', 0);
      ctx.assertEqual(asset1.src, 'predebut/portrait/EYSI-2-22.jpg', 'Source path should match');
      ctx.assertEqual(asset1.webpSrc, 'predebut/portrait/EYSI-2-22.webp', 'WebP source should replace .jpg');
      ctx.assertEqual(asset1.category, 'predebut', 'Category should match');
      ctx.assertEqual(asset1.orientation, 'portrait', 'Orientation should match');
      ctx.assertEqual(asset1.plateNumber, 'PLATE 01', 'Plate number should be zero-padded PLATE 01');

      const asset2 = new PhotoAsset({ src: 'events/landscape/EYSI-1.jpg', caption: 'Khel Pangilinan' }, 'events', 'landscape', 3);
      ctx.assertEqual(asset2.caption, 'Khel Pangilinan', 'Caption object should be normalized');
      ctx.assertEqual(asset2.plateNumber, 'PLATE 04', 'Index 3 should produce PLATE 04');
    } finally {
      appEnv.teardown();
    }
  });

  ctx.test('PhotoMetadata: PortfolioRepository organizes all photos by category and orientation', () => {
    const appEnv = loadAppEnvironment();
    try {
      const { eval: vmEval } = appEnv;
      const repo = vmEval('repository');

      const predebutPortraits = repo.getPhotos('predebut', 'portrait');
      ctx.assertGreaterOrEqual(predebutPortraits.length, 5, 'Predebut should have at least 5 portrait photos');

      const eventsLandscapes = repo.getPhotos('events', 'landscape');
      ctx.assertGreaterOrEqual(eventsLandscapes.length, 10, 'Events should have at least 10 landscape photos');

      const instLandscapes = repo.getPhotos('institutional', 'landscape');
      ctx.assertGreaterOrEqual(instLandscapes.length, 8, 'Institutional should have at least 8 landscape photos');
    } finally {
      appEnv.teardown();
    }
  });

  ctx.test('PhotoMetadata: GalleryPresenter renders contact sheet proof cards with semantic figure', () => {
    const appEnv = loadAppEnvironment();
    try {
      const { document, eval: vmEval } = appEnv;
      const presenter = vmEval('galleryPresenter');

      presenter.renderCategory('predebut');
      const grid = document.getElementById('grid-predebut');
      ctx.assert(grid !== null, 'grid-predebut must exist');

      const items = grid.querySelectorAll('.photo-item');
      ctx.assertGreaterOrEqual(items.length, 1, 'Expected proof items rendered in grid-predebut');

      const firstItem = items[0];
      ctx.assertEqual(firstItem.tagName, 'FIGURE', 'Proof item should be a semantic <figure> element');
      ctx.assert(firstItem.classList.contains('photo-item'), 'Proof item should have .photo-item class');
      ctx.assert(firstItem.hasAttribute('data-idx') || firstItem.hasAttribute('role'), 'Proof item must specify interactive or data attributes');
    } finally {
      appEnv.teardown();
    }
  });

  ctx.test('PhotoMetadata: Proof cards render museum plaque with plate number and caption', () => {
    const appEnv = loadAppEnvironment();
    try {
      const { document, eval: vmEval } = appEnv;
      const presenter = vmEval('galleryPresenter');

      presenter.renderCategory('predebut');
      const grid = document.getElementById('grid-predebut');
      const firstPlaque = grid.querySelector('.photo-overlay, figcaption, .plaque-details');

      ctx.assert(firstPlaque !== null, 'Proof item must contain a museum plaque / figcaption');
      const plateTag = grid.querySelector('.photo-tag, .photo-plate-no, .plaque-plate');
      ctx.assert(plateTag !== null, 'Plaque or proof item must contain a plate tag element');
      ctx.assertMatches(plateTag.textContent.trim(), /PLATE/i, 'Plate tag should reference PLATE designation');
    } finally {
      appEnv.teardown();
    }
  });

  ctx.test('PhotoMetadata: Contact sheet grid updates orientation layout class', () => {
    const appEnv = loadAppEnvironment();
    try {
      const { document, eval: vmEval } = appEnv;
      const presenter = vmEval('galleryPresenter');

      presenter.switchTab('predebut', false);
      const grid = document.getElementById('grid-predebut');

      presenter.setOrientation('landscape');
      ctx.assert(grid.classList.contains('orient-landscape'), 'Grid must receive orient-landscape class when set to landscape');

      presenter.setOrientation('portrait');
      ctx.assert(!grid.classList.contains('orient-landscape'), 'Grid must remove orient-landscape class when set to portrait');
    } finally {
      appEnv.teardown();
    }
  });

  // ══════════════════════════════════════════════════════════════════════════
  // FEATURE 3: Museum Matting & Optical Padding
  // ══════════════════════════════════════════════════════════════════════════

  ctx.test('MuseumMatting: Lightbox frame wrap element exists for passe-partout mounting', () => {
    const { document } = createDOMEnvironment();
    const frameWrap = document.getElementById('lightbox-frame-wrap');
    ctx.assert(frameWrap !== null, '#lightbox-frame-wrap container must exist in DOM');
  });

  ctx.test('MuseumMatting: Surface mat background token is declared in design system', () => {
    const css = parseCSSFile();
    const lightTokens = css.extractTokens('light');
    const darkTokens = css.extractTokens('dark');

    ctx.assert(Boolean(lightTokens['--surface-mat']), 'Daylight mode must declare --surface-mat token');
    ctx.assert(Boolean(darkTokens['--surface-mat']), 'Darkroom mode must declare --surface-mat token');
    ctx.assertEqual(lightTokens['--surface-mat'].toLowerCase(), '#f4f1eb', 'Daylight surface-mat should be archival cream #f4f1eb');
    ctx.assertEqual(darkTokens['--surface-mat'].toLowerCase(), '#1c1c20', 'Darkroom surface-mat should be deep charcoal #1c1c20');
  });

  ctx.test('MuseumMatting: Stylesheet declares passe-partout matting or border rules for photo cards', () => {
    const css = parseCSSFile();
    const raw = css.raw;
    const hasMatRule = raw.includes('.lightbox-frame-wrap') && (raw.includes('--surface-mat') || raw.includes('padding') || raw.includes('border'));
    ctx.assert(hasMatRule, 'Stylesheet must declare matting styling for .lightbox-frame-wrap');
  });

  ctx.test('MuseumMatting: Figcaption plaque is structured beneath photographic plate', () => {
    const { document } = createDOMEnvironment();
    const lbCaption = document.getElementById('lightbox-caption');
    ctx.assert(lbCaption !== null, '#lightbox-caption must exist');
    const plateNo = document.getElementById('lightbox-plate-no');
    const title = document.getElementById('lightbox-title');
    ctx.assert(plateNo !== null, '#lightbox-plate-no must exist in caption');
    ctx.assert(title !== null, '#lightbox-title must exist in caption');
  });

  ctx.test('MuseumMatting: Lightbox stage structure ensures image is contained in frame wrap', () => {
    const { document } = createDOMEnvironment();
    const stage = document.querySelector('.lightbox-stage');
    ctx.assert(stage !== null, '.lightbox-stage must exist');
    const imgInsideWrap = stage.querySelector('#lightbox-frame-wrap #lightbox-img');
    ctx.assert(imgInsideWrap !== null, '#lightbox-img must be nested inside #lightbox-frame-wrap for mat containment');
  });

  // ══════════════════════════════════════════════════════════════════════════
  // FEATURE 4: Darkroom / Daylight Theme Switching Mechanics
  // ══════════════════════════════════════════════════════════════════════════

  ctx.test('ThemeSwitching: Theme toggle button exists with accessible label', () => {
    const { document } = createDOMEnvironment();
    const btn = document.getElementById('theme-toggle');
    ctx.assert(btn !== null, '#theme-toggle button must exist');
    ctx.assertEqual(btn.tagName, 'BUTTON', '#theme-toggle must be a <button>');
    ctx.assert(btn.hasAttribute('aria-label'), '#theme-toggle must have aria-label');
  });

  ctx.test('ThemeSwitching: Initial theme state is daylight mode on documentElement', () => {
    const { document } = createDOMEnvironment();
    const theme = document.documentElement.getAttribute('data-theme') || 'light';
    ctx.assertEqual(theme, 'light', 'Default theme must be light (archival daylight)');
  });

  ctx.test('ThemeSwitching: Clicking toggle button flips data-theme between light and dark', () => {
    const appEnv = loadAppEnvironment();
    try {
      const { document } = appEnv;
      const btn = document.getElementById('theme-toggle');

      // Click to dark
      btn.click();
      ctx.assertEqual(document.documentElement.getAttribute('data-theme'), 'dark', 'Theme should switch to "dark"');

      // Click back to light
      btn.click();
      ctx.assertEqual(document.documentElement.getAttribute('data-theme'), 'light', 'Theme should switch back to "light"');
    } finally {
      appEnv.teardown();
    }
  });

  ctx.test('ThemeSwitching: Toggle button text and aria-label update dynamically', () => {
    const appEnv = loadAppEnvironment();
    try {
      const { document } = appEnv;
      const btn = document.getElementById('theme-toggle');
      const label = document.getElementById('theme-toggle-label');

      // Default light mode
      ctx.assertEqual(label.textContent.trim(), 'Darkroom', 'In light mode, label should offer "Darkroom"');

      // Switch to dark
      btn.click();
      ctx.assertEqual(label.textContent.trim(), 'Daylight', 'In dark mode, label should offer "Daylight"');
      ctx.assertMatches(btn.getAttribute('aria-label'), /Daylight/i, 'aria-label should reference Daylight');
    } finally {
      appEnv.teardown();
    }
  });

  ctx.test('ThemeSwitching: Theme choice persists in localStorage', () => {
    const appEnv = loadAppEnvironment();
    try {
      const { document, window: win } = appEnv;
      const btn = document.getElementById('theme-toggle');

      btn.click(); // to dark
      ctx.assertEqual(win.localStorage.getItem('eysiclicks-theme'), 'dark', 'localStorage should record "dark"');

      btn.click(); // to light
      ctx.assertEqual(win.localStorage.getItem('eysiclicks-theme'), 'light', 'localStorage should record "light"');
    } finally {
      appEnv.teardown();
    }
  });

  ctx.test('ThemeSwitching: Meta theme-color attribute updates on theme switch', () => {
    const appEnv = loadAppEnvironment();
    try {
      const { document } = appEnv;
      const btn = document.getElementById('theme-toggle');
      const meta = document.getElementById('meta-theme-color');
      ctx.assert(meta !== null, '#meta-theme-color must exist');

      btn.click(); // to dark
      ctx.assertEqual(meta.getAttribute('content'), '#0a0a0b', 'Meta theme-color should match darkroom obsidian');

      btn.click(); // to light
      ctx.assertEqual(meta.getAttribute('content'), '#faf8f5', 'Meta theme-color should match daylight ivory');
    } finally {
      appEnv.teardown();
    }
  });

  // ══════════════════════════════════════════════════════════════════════════
  // FEATURE 5: Lightbox Modal Markup & Controls Existence
  // ══════════════════════════════════════════════════════════════════════════

  ctx.test('LightboxModal: Modal container exists with accessible dialog attributes', () => {
    const { document } = createDOMEnvironment();
    const lb = document.getElementById('lightbox');
    ctx.assert(lb !== null, '#lightbox element must exist');
    ctx.assertEqual(lb.getAttribute('role'), 'dialog', '#lightbox must have role="dialog"');
    ctx.assertEqual(lb.getAttribute('aria-modal'), 'true', '#lightbox must have aria-modal="true"');
    ctx.assert(lb.hasAttribute('aria-label'), '#lightbox must have aria-label');
  });

  ctx.test('LightboxModal: Close button exists and declares accessible label', () => {
    const { document } = createDOMEnvironment();
    const closeBtn = document.querySelector('.lightbox-close');
    ctx.assert(closeBtn !== null, '.lightbox-close button must exist');
    ctx.assertEqual(closeBtn.tagName, 'BUTTON', 'Close button must be a <button>');
    ctx.assert(closeBtn.hasAttribute('aria-label') || closeBtn.hasAttribute('title'), 'Close button must have aria-label or title');
  });

  ctx.test('LightboxModal: Navigation previous and next buttons exist', () => {
    const { document } = createDOMEnvironment();
    const prevBtn = document.querySelector('.lightbox-prev');
    const nextBtn = document.querySelector('.lightbox-next');

    ctx.assert(prevBtn !== null, '.lightbox-prev button must exist');
    ctx.assert(nextBtn !== null, '.lightbox-next button must exist');
    ctx.assert(prevBtn.hasAttribute('aria-label'), '.lightbox-prev must have aria-label');
    ctx.assert(nextBtn.hasAttribute('aria-label'), '.lightbox-next must have aria-label');
  });

  ctx.test('LightboxModal: Exhibition toolbar buttons for zoom and slideshow exist', () => {
    const { document } = createDOMEnvironment();
    const zoomBtn = document.getElementById('lb-zoom-btn');
    const playBtn = document.getElementById('lb-play-btn');

    ctx.assert(zoomBtn !== null, '#lb-zoom-btn must exist');
    ctx.assert(playBtn !== null, '#lb-play-btn must exist');
    ctx.assert(zoomBtn.hasAttribute('aria-pressed'), '#lb-zoom-btn must declare aria-pressed');
    ctx.assert(playBtn.hasAttribute('aria-pressed'), '#lb-play-btn must declare aria-pressed');
  });

  ctx.test('LightboxModal: Stage contains image element, caption strip, and filmstrip container', () => {
    const { document } = createDOMEnvironment();
    const stage = document.querySelector('.lightbox-stage');
    ctx.assert(stage !== null, '.lightbox-stage must exist');

    const img = stage.querySelector('#lightbox-img');
    const caption = stage.querySelector('#lightbox-caption');
    const filmstrip = stage.querySelector('#lightbox-filmstrip');

    ctx.assert(img !== null, '#lightbox-img must exist inside stage');
    ctx.assert(caption !== null, '#lightbox-caption must exist inside stage');
    ctx.assert(filmstrip !== null, '#lightbox-filmstrip must exist inside stage');
    ctx.assertEqual(filmstrip.getAttribute('role'), 'tablist', 'Filmstrip must have role="tablist"');
  });

  return ctx;
}

module.exports = { runTier1Tests };

if (require.main === module) {
  const result = runTier1Tests();
  console.log(`\n${result.tierName} Results:`);
  for (const t of result.tests) {
    console.log(`  [${t.status}] ${t.name} (${t.duration}ms)`);
    if (t.error) console.log(`      Error: ${t.error}`);
  }
  console.log(`\nSummary: Passed: ${result.passed}, Failed: ${result.failed}, Total: ${result.tests.length}`);
  process.exit(result.failed > 0 ? 1 : 0);
}
