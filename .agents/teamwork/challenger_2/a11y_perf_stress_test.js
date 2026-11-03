/**
 * Adversarial Verification Suite: Accessibility (WCAG 2.2 AA), Performance & Typography
 * Identity: challenger_2 (Empirical Challenger)
 * Working Directory: .agents/teamwork/challenger_2/
 */

const fs = require('node:fs');
const path = require('node:path');

// Resolve repository paths
const ROOT_DIR = path.resolve(__dirname, '../../..');
const INDEX_HTML_PATH = path.join(ROOT_DIR, 'index.html');
const STYLES_CSS_PATH = path.join(ROOT_DIR, 'styles.css');
const APP_JS_PATH = path.join(ROOT_DIR, 'app.js');
const HARNESS_PATH = path.join(ROOT_DIR, 'tests', 'harness.js');

const {
  createDOMEnvironment,
  loadAppEnvironment,
  parseCSSFile,
  calculateContrastRatio,
  AssertionContext
} = require(HARNESS_PATH);

function runStressTests() {
  const ctx = new AssertionContext('Adversarial Stress Test: A11y, Performance, Typography');

  // ══════════════════════════════════════════════════════════════════════════
  // SUITE 1: MATHEMATICAL WCAG 2.2 AA CONTRAST RATIOS (Relative Luminance)
  // ══════════════════════════════════════════════════════════════════════════

  const css = parseCSSFile();
  const lightTokens = css.extractTokens('light');
  const darkTokens = css.extractTokens('dark');

  const lightBackgrounds = ['--bg', '--bg2', '--surface', '--surface-mat'];
  const lightTextTokens = ['--text', '--text-muted', '--text-subtle'];

  const darkBackgrounds = ['--bg', '--bg2', '--surface', '--surface-mat'];
  const darkTextTokens = ['--text', '--text-muted', '--text-subtle'];

  // Test light mode combinations
  for (const textToken of lightTextTokens) {
    for (const bgToken of lightBackgrounds) {
      ctx.test(`WCAGContrast [Light]: ${textToken} against ${bgToken} >= 4.5:1`, () => {
        const fg = lightTokens[textToken];
        const bg = lightTokens[bgToken];
        ctx.assert(Boolean(fg), `Token ${textToken} must be declared in light theme`);
        ctx.assert(Boolean(bg), `Token ${bgToken} must be declared in light theme`);

        const ratio = calculateContrastRatio(fg, bg);
        ctx.assert(ratio !== null, `Failed to parse color values: ${fg} on ${bg}`);
        ctx.assertGreaterOrEqual(
          ratio,
          4.5,
          `Light theme ${textToken} (${fg}) on ${bgToken} (${bg}) contrast ratio ${ratio.toFixed(2)}:1 fails WCAG 2.2 AA (requires >= 4.5:1)`
        );
      });
    }
  }

  // Test dark mode combinations
  for (const textToken of darkTextTokens) {
    for (const bgToken of darkBackgrounds) {
      ctx.test(`WCAGContrast [Dark]: ${textToken} against ${bgToken} >= 4.5:1`, () => {
        const fg = darkTokens[textToken];
        const bg = darkTokens[bgToken];
        ctx.assert(Boolean(fg), `Token ${textToken} must be declared in dark theme`);
        ctx.assert(Boolean(bg), `Token ${bgToken} must be declared in dark theme`);

        const ratio = calculateContrastRatio(fg, bg);
        ctx.assert(ratio !== null, `Failed to parse color values: ${fg} on ${bg}`);
        ctx.assertGreaterOrEqual(
          ratio,
          4.5,
          `Dark theme ${textToken} (${fg}) on ${bgToken} (${bg}) contrast ratio ${ratio.toFixed(2)}:1 fails WCAG 2.2 AA (requires >= 4.5:1)`
        );
      });
    }
  }

  // Bronze accent token audit
  ctx.test('WCAGContrast [Accent]: --accent-bronze evaluates relative to 3.0:1 UI/large text threshold', () => {
    const lightBronze = lightTokens['--accent-bronze'];
    const lightBg = lightTokens['--bg'];
    const darkBronze = darkTokens['--accent-bronze'];
    const darkBg = darkTokens['--bg'];

    const lightRatio = calculateContrastRatio(lightBronze, lightBg);
    const darkRatio = calculateContrastRatio(darkBronze, darkBg);

    ctx.assertGreaterOrEqual(lightRatio, 3.0, `Light bronze ratio ${lightRatio.toFixed(2)}:1 must meet at least 3.0:1 for graphical/large elements`);
    ctx.assertGreaterOrEqual(darkRatio, 3.0, `Dark bronze ratio ${darkRatio.toFixed(2)}:1 must meet at least 3.0:1 for graphical/large elements`);
  });

  // ══════════════════════════════════════════════════════════════════════════
  // SUITE 2: PERFORMANCE & IMAGE AUDIT (index.html)
  // ══════════════════════════════════════════════════════════════════════════

  const { document, rawHTML } = createDOMEnvironment();
  const allImages = Array.from(document.querySelectorAll('img'));

  ctx.test('ImageAudit: Document contains images to audit', () => {
    ctx.assertGreaterOrEqual(allImages.length, 3, `Expected at least 3 images in index.html, found ${allImages.length}`);
  });

  // Audit: explicit dimensions (width & height) on each image
  for (let i = 0; i < allImages.length; i++) {
    const img = allImages[i];
    const identifier = img.id ? `#${img.id}` : (img.className ? `.${img.className}` : img.getAttribute('src') || `index_${i}`);

    ctx.test(`ImageAudit: Image ${identifier} has explicit width and height attributes`, () => {
      const width = img.getAttribute('width');
      const height = img.getAttribute('height');

      ctx.assert(Boolean(width), `Image ${identifier} (${img.getAttribute('src')}) is missing explicit "width" attribute (causes layout shifts/CLS)`);
      ctx.assert(Boolean(height), `Image ${identifier} (${img.getAttribute('src')}) is missing explicit "height" attribute (causes layout shifts/CLS)`);
      ctx.assert(!isNaN(parseInt(width, 10)) && parseInt(width, 10) > 0, `Image ${identifier} width must be a positive integer`);
      ctx.assert(!isNaN(parseInt(height, 10)) && parseInt(height, 10) > 0, `Image ${identifier} height must be a positive integer`);
    });

    ctx.test(`ImageAudit: Image ${identifier} specifies decoding="async" for non-blocking main thread`, () => {
      const decoding = img.getAttribute('decoding');
      ctx.assertEqual(
        decoding,
        'async',
        `Image ${identifier} (${img.getAttribute('src')}) must specify decoding="async" for optimal CWV`
      );
    });
  }

  // Audit: Above-the-fold hero content must not be lazy-loaded
  ctx.test('ImageAudit: Hero monument image is loaded eagerly without loading="lazy"', () => {
    const heroImg = document.querySelector('#hero img') || document.querySelector('.hero-monument img');
    ctx.assert(heroImg !== null, 'Hero section must contain monument image element');
    const loading = heroImg.getAttribute('loading');
    ctx.assert(loading !== 'lazy', `Hero image must NOT have loading="lazy" (found: loading="${loading}")`);
  });

  ctx.test('ImageAudit: Hero monument image specifies fetchpriority="high"', () => {
    const heroImg = document.querySelector('#hero img') || document.querySelector('.hero-monument img');
    ctx.assert(heroImg !== null, 'Hero section must contain monument image element');
    const fetchpriority = heroImg.getAttribute('fetchpriority');
    ctx.assertEqual(fetchpriority, 'high', 'Hero monument image must declare fetchpriority="high" for optimal LCP');
  });

  ctx.test('ImageAudit: Below-the-fold about portrait image specifies loading="lazy"', () => {
    const aboutImg = document.querySelector('#about img');
    ctx.assert(aboutImg !== null, '#about section must contain portrait image element');
    ctx.assertEqual(aboutImg.getAttribute('loading'), 'lazy', 'Below-the-fold portrait image must declare loading="lazy"');
  });

  // ══════════════════════════════════════════════════════════════════════════
  // SUITE 3: TYPOGRAPHY, FONT LOADING & OBSOLETE FONT EXCLUSION
  // ══════════════════════════════════════════════════════════════════════════

  const cssRaw = fs.readFileSync(STYLES_CSS_PATH, 'utf-8');

  // Extract all @font-face blocks
  const fontFaceRegex = /@font-face\s*\{([^}]+)\}/gi;
  const fontFaceBlocks = [];
  let match;
  while ((match = fontFaceRegex.exec(cssRaw)) !== null) {
    fontFaceBlocks.push(match[1]);
  }

  ctx.test('FontAudit: @font-face blocks are present for local typefaces', () => {
    ctx.assertGreaterOrEqual(fontFaceBlocks.length, 1, 'Expected at least one @font-face declaration');
  });

  ctx.test('FontAudit: @font-face declarations do NOT load obsolete font "Dreamer"', () => {
    for (const block of fontFaceBlocks) {
      const declaresDreamer = /font-family\s*:\s*['"]?Dreamer['"]?/i.test(block) || /url\([^)]*Dreamer[^)]*\)/i.test(block);
      ctx.assert(!declaresDreamer, `Obsolete font "Dreamer" is declared in @font-face:\n${block.trim()}`);
    }
  });

  ctx.test('FontAudit: @font-face declarations do NOT load obsolete font "Tropikal"', () => {
    for (const block of fontFaceBlocks) {
      const declaresTropikal = /font-family\s*:\s*['"]?Tropikal['"]?/i.test(block) || /url\([^)]*Tropikal[^)]*\)/i.test(block);
      ctx.assert(!declaresTropikal, `Obsolete font "Tropikal" is declared in @font-face:\n${block.trim()}`);
    }
  });

  ctx.test('FontAudit: All declared @font-face rules specify font-display: swap', () => {
    for (let i = 0; i < fontFaceBlocks.length; i++) {
      const block = fontFaceBlocks[i];
      const hasFontDisplaySwap = /font-display\s*:\s*swap/i.test(block);
      ctx.assert(
        hasFontDisplaySwap,
        `@font-face block ${i + 1} is missing "font-display: swap" (causes layout shifts / FOIT):\n${block.trim()}`
      );
    }
  });

  ctx.test('FontAudit: Local font asset files referenced in @font-face exist on disk', () => {
    for (const block of fontFaceBlocks) {
      const urlMatch = block.match(/url\(['"]?([^'"()]+)['"]?\)/);
      if (urlMatch) {
        const fontRelPath = urlMatch[1];
        const fontFullPath = path.resolve(ROOT_DIR, fontRelPath);
        ctx.assert(fs.existsSync(fontFullPath), `Font file referenced in CSS does not exist: ${fontRelPath}`);
      }
    }
  });

  // ══════════════════════════════════════════════════════════════════════════
  // SUITE 4: ARIA CONTRACTS (tablist, tab, aria-selected)
  // ══════════════════════════════════════════════════════════════════════════

  const tablists = Array.from(document.querySelectorAll('[role="tablist"]'));

  ctx.test('ARIAContract: Document contains at least one role="tablist" container', () => {
    ctx.assertGreaterOrEqual(tablists.length, 1, 'Document must contain role="tablist" container');
  });

  for (let i = 0; i < tablists.length; i++) {
    const tl = tablists[i];
    const tlIdentifier = tl.id ? `#${tl.id}` : (tl.className ? `.${tl.className}` : `tablist_${i}`);

    ctx.test(`ARIAContract: Container ${tlIdentifier} contains valid role="tab" children`, () => {
      const tabs = Array.from(tl.querySelectorAll('[role="tab"]'));
      ctx.assertGreaterOrEqual(tabs.length, 1, `Container ${tlIdentifier} must contain at least 1 child with role="tab"`);
    });

    ctx.test(`ARIAContract: Container ${tlIdentifier} has valid aria-selected bindings on tabs`, () => {
      const tabs = Array.from(tl.querySelectorAll('[role="tab"]'));
      let selectedCount = 0;

      for (const tab of tabs) {
        const ariaSelected = tab.getAttribute('aria-selected');
        ctx.assert(
          ariaSelected === 'true' || ariaSelected === 'false',
          `Tab in ${tlIdentifier} has invalid or missing aria-selected attribute (found: "${ariaSelected}")`
        );
        if (ariaSelected === 'true') {
          selectedCount++;
        }
      }

      ctx.assertEqual(
        selectedCount,
        1,
        `Container ${tlIdentifier} must have exactly one tab with aria-selected="true" in initial state (found: ${selectedCount})`
      );
    });
  }

  // Dynamic tab switching state verification
  ctx.test('ARIAContract: Dynamic tab switching updates aria-selected attributes in GalleryPresenter', () => {
    const appEnv = loadAppEnvironment();
    try {
      const { document: appDoc, eval: vmEval } = appEnv;
      const presenter = vmEval('galleryPresenter');

      presenter.switchTab('events', false);

      const predebutTab = appDoc.getElementById('tab-predebut');
      const eventsTab = appDoc.getElementById('tab-events');
      const institutionalTab = appDoc.getElementById('tab-institutional');

      ctx.assertEqual(eventsTab.getAttribute('aria-selected'), 'true', '#tab-events must be aria-selected="true" when active');
      ctx.assertEqual(predebutTab.getAttribute('aria-selected'), 'false', '#tab-predebut must be aria-selected="false" when inactive');
      ctx.assertEqual(institutionalTab.getAttribute('aria-selected'), 'false', '#tab-institutional must be aria-selected="false" when inactive');

      presenter.switchTab('institutional', false);
      ctx.assertEqual(institutionalTab.getAttribute('aria-selected'), 'true', '#tab-institutional must be aria-selected="true" when active');
      ctx.assertEqual(eventsTab.getAttribute('aria-selected'), 'false', '#tab-events must be aria-selected="false" when inactive');
    } finally {
      appEnv.teardown();
    }
  });

  // Dynamic lightbox filmstrip tab selection verification
  ctx.test('ARIAContract: Lightbox filmstrip tab updates aria-selected on photo navigation', () => {
    const appEnv = loadAppEnvironment();
    try {
      const { document: appDoc, eval: vmEval } = appEnv;
      const lb = vmEval('lightboxController');
      const repo = vmEval('repository');
      const photos = repo.getPhotos('predebut', 'portrait');

      lb.open(photos, 0);

      const filmstrip = appDoc.getElementById('lightbox-filmstrip');
      ctx.assert(filmstrip !== null, '#lightbox-filmstrip must exist');

      const thumbs = Array.from(filmstrip.querySelectorAll('.filmstrip-thumb'));
      ctx.assertGreaterOrEqual(thumbs.length, 1, 'Filmstrip must be populated with thumbnails');

      // Check first thumb is selected
      ctx.assertEqual(thumbs[0].getAttribute('aria-selected'), 'true', 'First filmstrip thumbnail must have aria-selected="true"');
      for (let i = 1; i < thumbs.length; i++) {
        ctx.assertEqual(thumbs[i].getAttribute('aria-selected'), 'false', `Thumbnail ${i} must have aria-selected="false"`);
      }

      // Step forward to next photo
      lb.navigate(1);
      ctx.assertEqual(thumbs[0].getAttribute('aria-selected'), 'false', 'First thumbnail must become aria-selected="false"');
      ctx.assertEqual(thumbs[1].getAttribute('aria-selected'), 'true', 'Second thumbnail must become aria-selected="true"');

      lb.close();
    } finally {
      appEnv.teardown();
    }
  });

  return ctx;
}

if (require.main === module) {
  const result = runStressTests();
  console.log(`\n======================================================================`);
  console.log(`  ${result.tierName}`);
  console.log(`======================================================================\n`);

  for (const t of result.tests) {
    const icon = t.status === 'PASS' ? '✓' : '✗';
    console.log(`  ${icon} [${t.status}] ${t.name} (${t.duration}ms)`);
    if (t.error) {
      console.log(`      Error: ${t.error}`);
    }
  }

  console.log(`\n──────────────────────────────────────────────────────────────────────`);
  console.log(`  Summary: Passed: ${result.passed}, Failed: ${result.failed}, Total: ${result.tests.length}`);
  console.log(`──────────────────────────────────────────────────────────────────────\n`);

  process.exit(result.failed > 0 ? 1 : 0);
}

module.exports = { runStressTests };
