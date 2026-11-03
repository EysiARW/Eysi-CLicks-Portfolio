const fs = require('node:fs');
const path = require('node:path');

const ROOT_DIR = path.resolve(__dirname, '../../..');
const { createDOMEnvironment, parseCSSFile, calculateContrastRatio } = require(path.join(ROOT_DIR, 'tests/harness.js'));

const INDEX_HTML_PATH = path.join(ROOT_DIR, 'index.html');
const STYLES_CSS_PATH = path.join(ROOT_DIR, 'styles.css');
const APP_JS_PATH = path.join(ROOT_DIR, 'app.js');

console.log('======================================================================');
console.log('  CHALLENGER RECHECK: EMPIRICAL VERIFICATION HARNESS');
console.log('======================================================================\n');

let passCount = 0;
let failCount = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✓ [PASS] ${message}`);
    passCount++;
  } else {
    console.error(`  ✗ [FAIL] ${message}`);
    failCount++;
  }
}

// ──────────────────────────────────────────────────────────────────────
// 1. IMAGE AUDIT (index.html)
// ──────────────────────────────────────────────────────────────────────
console.log('--- 1. Image Audit (index.html) ---');
const { document } = createDOMEnvironment();
const images = Array.from(document.querySelectorAll('img'));
assert(images.length > 0, `Found ${images.length} images in index.html`);

images.forEach((img, idx) => {
  const src = img.getAttribute('src');
  const id = img.id ? `#${img.id}` : '';
  const cls = img.className ? `.${img.className}` : '';
  const label = `${id || cls || src || `img_${idx}`}`;

  const width = img.getAttribute('width');
  const height = img.getAttribute('height');
  const decoding = img.getAttribute('decoding');

  const widthNum = parseInt(width, 10);
  const heightNum = parseInt(height, 10);

  const hasValidWidth = !isNaN(widthNum) && widthNum > 0 && String(widthNum) === (width || '').trim();
  const hasValidHeight = !isNaN(heightNum) && heightNum > 0 && String(heightNum) === (height || '').trim();
  const hasAsyncDecoding = decoding === 'async';

  assert(hasValidWidth, `Image [${label}] width="${width}" is valid positive integer`);
  assert(hasValidHeight, `Image [${label}] height="${height}" is valid positive integer`);
  assert(hasAsyncDecoding, `Image [${label}] decoding="${decoding}" is "async"`);
});

// Also check hero image eager loading and fetchpriority
const heroImg = document.querySelector('#hero img') || document.querySelector('.hero-monument img');
if (heroImg) {
  assert(heroImg.getAttribute('loading') !== 'lazy', 'Hero monument image does not use loading="lazy"');
  assert(heroImg.getAttribute('fetchpriority') === 'high', 'Hero monument image specifies fetchpriority="high"');
} else {
  assert(false, 'Hero monument image not found');
}

// ──────────────────────────────────────────────────────────────────────
// 2. FONT AUDIT & TROPIKAL REMOVAL (styles.css & index.html)
// ──────────────────────────────────────────────────────────────────────
console.log('\n--- 2. Font Audit & Tropikal Removal ---');
const cssContent = fs.readFileSync(STYLES_CSS_PATH, 'utf-8');
const htmlContent = fs.readFileSync(INDEX_HTML_PATH, 'utf-8');

// Check Tropikal completely removed
const tropikalInCSS = /tropikal/i.test(cssContent);
assert(!tropikalInCSS, 'styles.css contains ZERO references to "Tropikal"');

const tropikalInHTML = /tropikal/i.test(htmlContent);
assert(!tropikalInHTML, 'index.html contains ZERO references to "Tropikal"');

// Check Dreamer completely removed
const dreamerInCSS = /dreamer/i.test(cssContent);
assert(!dreamerInCSS, 'styles.css contains ZERO references to "Dreamer"');

// Check Playfair Display completely removed
const playfairInCSS = /playfair/i.test(cssContent);
assert(!playfairInCSS, 'styles.css contains ZERO references to "Playfair"');
const playfairInHTML = /playfair/i.test(htmlContent);
assert(!playfairInHTML, 'index.html Google Fonts link does NOT request "Playfair"');

// Parse @font-face rules
const fontFaceRegex = /@font-face\s*\{([^}]+)\}/gi;
const fontFaceBlocks = [];
let m;
while ((m = fontFaceRegex.exec(cssContent)) !== null) {
  fontFaceBlocks.push(m[1]);
}

assert(fontFaceBlocks.length === 3, `Expected exactly 3 @font-face blocks (TT Interphases 400, 500, 700), found ${fontFaceBlocks.length}`);

fontFaceBlocks.forEach((block, idx) => {
  const familyMatch = block.match(/font-family\s*:\s*['"]?([^'";]+)['"]?/i);
  const family = familyMatch ? familyMatch[1].trim() : 'unknown';
  assert(family === 'TT Interphases', `@font-face block ${idx + 1} family is "TT Interphases" (found: ${family})`);

  const hasSwap = /font-display\s*:\s*swap/i.test(block);
  assert(hasSwap, `@font-face block ${idx + 1} declares "font-display: swap"`);

  const urlMatch = block.match(/url\(['"]?([^'"()]+)['"]?\)/);
  if (urlMatch) {
    const fontPath = path.resolve(ROOT_DIR, urlMatch[1]);
    assert(fs.existsSync(fontPath), `@font-face block ${idx + 1} referenced file exists: ${urlMatch[1]}`);
  } else {
    assert(false, `@font-face block ${idx + 1} has valid url()`);
  }
});

// ──────────────────────────────────────────────────────────────────────
// 3. WCAG 2.2 AA CONTRAST RATIO RE-EVALUATION
// ──────────────────────────────────────────────────────────────────────
console.log('\n--- 3. WCAG 2.2 AA Contrast Ratio Re-Evaluation ---');
const parsedCSS = parseCSSFile();
const lightTokens = parsedCSS.extractTokens('light');
const darkTokens = parsedCSS.extractTokens('dark');

const textTokens = ['--text', '--text-muted', '--text-subtle'];
const bgTokens = ['--bg', '--bg2', '--surface', '--surface-mat'];

console.log('  Light Mode Text Contrast (all >= 4.5:1):');
for (const tt of textTokens) {
  for (const bt of bgTokens) {
    const fg = lightTokens[tt];
    const bg = lightTokens[bt];
    const cr = calculateContrastRatio(fg, bg);
    assert(cr !== null && cr >= 4.5, `Light ${tt} (${fg}) vs ${bt} (${bg}) = ${cr ? cr.toFixed(2) : 'null'}:1 (>= 4.5:1)`);
  }
}

console.log('  Light Mode Bronze Accent Contrast (>= 4.5:1 on main bg/surface, >= 3.0:1 on all):');
const lightBronze = lightTokens['--accent-bronze'];
for (const bt of bgTokens) {
  const bg = lightTokens[bt];
  const cr = calculateContrastRatio(lightBronze, bg);
  assert(cr !== null && cr >= 3.0, `Light --accent-bronze (${lightBronze}) vs ${bt} (${bg}) = ${cr ? cr.toFixed(2) : 'null'}:1 (>= 3.0:1 UI threshold)`);
  if (bt === '--bg' || bt === '--surface' || bt === '--surface-mat') {
    assert(cr >= 4.5, `Light --accent-bronze (${lightBronze}) vs ${bt} (${bg}) = ${cr.toFixed(2)}:1 (>= 4.5:1 normal text threshold)`);
  }
}

console.log('  Dark Mode Text Contrast (all >= 4.5:1):');
for (const tt of textTokens) {
  for (const bt of bgTokens) {
    const fg = darkTokens[tt];
    const bg = darkTokens[bt];
    const cr = calculateContrastRatio(fg, bg);
    assert(cr !== null && cr >= 4.5, `Dark ${tt} (${fg}) vs ${bt} (${bg}) = ${cr ? cr.toFixed(2) : 'null'}:1 (>= 4.5:1)`);
  }
}

console.log('  Dark Mode Bronze Accent Contrast (>= 3.0:1 UI / >= 4.5:1 text):');
const darkBronze = darkTokens['--accent-bronze'];
for (const bt of bgTokens) {
  const bg = darkTokens[bt];
  const cr = calculateContrastRatio(darkBronze, bg);
  assert(cr !== null && cr >= 4.5, `Dark --accent-bronze (${darkBronze}) vs ${bt} (${bg}) = ${cr ? cr.toFixed(2) : 'null'}:1 (>= 4.5:1 AA text)`);
}

// ──────────────────────────────────────────────────────────────────────
// 4. MICRO-TYPOGRAPHY & FACADE AUDIT
// ──────────────────────────────────────────────────────────────────────
console.log('\n--- 4. Micro-Typography & Facade Elimination Audit ---');
const fontSizeMatches = [...cssContent.matchAll(/font-size\s*:\s*([^;]+);/g)];
const sub10px = fontSizeMatches.filter(m => {
  const v = m[1].trim();
  if (v.endsWith('px')) return parseFloat(v) < 10;
  if (v.endsWith('rem')) return parseFloat(v) < 0.625;
  return false;
});
assert(sub10px.length === 0, `Zero sub-10px font-size declarations in styles.css (found: ${sub10px.length})`);

// Check viewfinder corners deconstruction
const appJsContent = fs.readFileSync(APP_JS_PATH, 'utf-8');
const vfInAppJs = appJsContent.includes('vf-c') || appJsContent.includes('.vf-c');
assert(!vfInAppJs, 'app.js contains ZERO runtime generation of ".vf-c" viewfinder corners');

const vfInStyles = cssContent.includes('.photo-item .vf-c');
assert(!vfInStyles, 'styles.css contains ZERO facade suppression rules for ".photo-item .vf-c"');

// ──────────────────────────────────────────────────────────────────────
// SUMMARY
// ──────────────────────────────────────────────────────────────────────
console.log('\n======================================================================');
console.log(`  VERIFICATION RESULTS: Passed: ${passCount}, Failed: ${failCount}, Total: ${passCount + failCount}`);
console.log('======================================================================');

if (failCount > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
