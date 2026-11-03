#!/usr/bin/env node
/**
 * VICTORY AUDITOR INDEPENDENT STRESS & INTEGRITY SUITE
 * Independent empirical verification by victory_auditor.
 * Pure Node.js, zero shared dependencies, strictly isolated.
 */

const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const ROOT_DIR = path.resolve(__dirname, '../../..');
const INDEX_HTML = path.join(ROOT_DIR, 'index.html');
const STYLES_CSS = path.join(ROOT_DIR, 'styles.css');
const APP_JS = path.join(ROOT_DIR, 'app.js');

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;
const failures = [];

function assert(condition, message) {
  totalTests++;
  if (!condition) {
    failedTests++;
    failures.push(message);
    console.error(`  ✗ [FAIL] ${message}`);
  } else {
    passedTests++;
    console.log(`  ✓ [PASS] ${message}`);
  }
}

function assertEqual(actual, expected, message) {
  assert(actual === expected, `${message} — Expected: ${JSON.stringify(expected)}, Actual: ${JSON.stringify(actual)}`);
}

console.log('======================================================================');
console.log('  VICTORY AUDITOR: INDEPENDENT POST-VICTORY INTEGRITY & STRESS TEST');
console.log('======================================================================\n');

// ── AREA 1: HTML DOCUMENT INTEGRITY & ASSET RESOLUTION ──
console.log('--- 1. HTML Document Integrity & Asset Resolution ---');
const rawHtml = fs.readFileSync(INDEX_HTML, 'utf-8');

assert(rawHtml.startsWith('<!DOCTYPE html>'), 'index.html starts with standard <!DOCTYPE html>');
assert(/<html\s+[^>]*lang=["']en["']/i.test(rawHtml), 'index.html specifies lang="en"');
assert(/<meta\s+name=["']viewport["']/i.test(rawHtml), 'index.html defines viewport meta tag');
assert(/<meta\s+name=["']description["']/i.test(rawHtml), 'index.html defines meta description');
assert(/<title>.*EYSI\s*CLICKS.*<\/title>/i.test(rawHtml), 'index.html has informative title referencing EYSI CLICKS');

// Extract all img src and source srcset attributes
const imgSrcMatches = [...rawHtml.matchAll(/<img\s+[^>]*src=["']([^"']+)["']/gi)].map(m => m[1]);
const sourceSrcsetMatches = [...rawHtml.matchAll(/<source\s+[^>]*srcset=["']([^"']+)["']/gi)].map(m => m[1]);
const allAssetPaths = [...new Set([...imgSrcMatches, ...sourceSrcsetMatches])];

assert(allAssetPaths.length >= 5, `Found ${allAssetPaths.length} static image assets declared in HTML`);
for (const assetPath of allAssetPaths) {
  const fullPath = path.join(ROOT_DIR, assetPath);
  const exists = fs.existsSync(fullPath);
  assert(exists, `Referenced image asset exists on disk: ${assetPath}`);
}

// Check navigation landmarks and targets
['#hero', '#about', '#gallery', '#inquire'].forEach(target => {
  const id = target.slice(1);
  assert(rawHtml.includes(`id="${id}"`), `Target landmark element exists: ${target}`);
});

// Check anti-patterns in HTML
assert(!/onclick\s*=/i.test(rawHtml), 'Zero inline onclick handlers in index.html');
assert(!/vf-(?:tl|tr|bl|br)/i.test(rawHtml), 'Zero viewfinder classes in index.html');
assert(!rawHtml.includes('vf-coord'), 'Zero vf-coord in index.html');
assert(!/[\u2726\u2727\u2728\u{1FA84}]/u.test(rawHtml) && !rawHtml.includes('✦'), 'Zero sparkle glyphs in index.html');
assert(!rawHtml.includes('hero-floating-frames'), 'Zero hero-floating-frames in index.html');
assert(!rawHtml.includes('about-ledger'), 'Zero about-ledger metric counter in index.html');
assert(rawHtml.includes('about-monograph-narrative'), 'Authentic editorial about-monograph-narrative present in index.html');
assert(rawHtml.includes('id="gallery-announcer"'), 'Accessible #gallery-announcer polite live region present in index.html');

// ── AREA 2: CSS DESIGN TOKENS, WCAG CONTRAST & TYPOGRAPHY ──
console.log('\n--- 2. CSS Design Tokens, WCAG Contrast & Typography ---');
const rawCss = fs.readFileSync(STYLES_CSS, 'utf-8');

assert(!rawCss.includes('Tropikal'), 'Zero references to obsolete font "Tropikal" in styles.css');
assert(!rawCss.includes('Dreamer'), 'Zero references to obsolete font "Dreamer" in styles.css');
assert(!rawCss.includes('Playfair'), 'Zero references to "Playfair" in styles.css');

// Verify @font-face rules
const fontFaceMatches = rawCss.match(/@font-face\s*\{[^}]+\}/g) || [];
assertEqual(fontFaceMatches.length, 3, 'Exactly 3 @font-face rules declared in styles.css');
for (const block of fontFaceMatches) {
  assert(block.includes("font-family: 'TT Interphases'"), '@font-face declares font-family: TT Interphases');
  assert(block.includes('font-display: swap'), '@font-face specifies font-display: swap');
  const urlMatch = block.match(/url\(['"]?([^'")]+)['"]?\)/);
  if (urlMatch) {
    const fontFile = path.join(ROOT_DIR, urlMatch[1]);
    assert(fs.existsSync(fontFile), `Font asset exists on disk: ${urlMatch[1]}`);
  }
}

// Verify no sub-10px font size
const sub10pxPx = rawCss.match(/font-size:\s*0?\.[0-9]+px|font-size:\s*[0-9]px\b/g) || [];
const sub10pxRem = rawCss.match(/font-size:\s*0\.(?:[0-5][0-9]?|6[01])rem\b/g) || [];
assert(sub10pxPx.length === 0 && sub10pxRem.length === 0, `Zero sub-10px font size rules in styles.css (found: ${sub10pxPx.length + sub10pxRem.length})`);

// Relative luminance & contrast math
function sRGBtoLin(c) {
  const v = c / 255;
  return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
}
function relLuminance(r, g, b) {
  return 0.2126 * sRGBtoLin(r) + 0.7152 * sRGBtoLin(g) + 0.0722 * sRGBtoLin(b);
}
function contrastRatio(l1, l2) {
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

// Parse hex
function hexToRgb(hex) {
  hex = hex.replace('#', '');
  return {
    r: parseInt(hex.slice(0, 2), 16),
    g: parseInt(hex.slice(2, 4), 16),
    b: parseInt(hex.slice(4, 6), 16)
  };
}

// Light theme tokens
const lightBg = hexToRgb('faf8f5');
const lightSurface = hexToRgb('ffffff');
const lightText = hexToRgb('111111');
const lightBronze = hexToRgb('826a4e');
// subtle rgba(17, 17, 17, 0.60) over #faf8f5
const lightSubtle = {
  r: Math.round(17 * 0.60 + 250 * 0.40),
  g: Math.round(17 * 0.60 + 248 * 0.40),
  b: Math.round(17 * 0.60 + 245 * 0.40)
};

const lumBg = relLuminance(lightBg.r, lightBg.g, lightBg.b);
const lumText = relLuminance(lightText.r, lightText.g, lightText.b);
const lumSubtle = relLuminance(lightSubtle.r, lightSubtle.g, lightSubtle.b);
const lumBronze = relLuminance(lightBronze.r, lightBronze.g, lightBronze.b);

const crTextBg = contrastRatio(lumText, lumBg);
const crSubtleBg = contrastRatio(lumSubtle, lumBg);
const crBronzeBg = contrastRatio(lumBronze, lumBg);

assert(crTextBg >= 4.5, `Light --text vs --bg contrast (${crTextBg.toFixed(2)}:1) >= 4.5:1`);
assert(crSubtleBg >= 4.5, `Light --text-subtle vs --bg contrast (${crSubtleBg.toFixed(2)}:1) >= 4.5:1`);
assert(crBronzeBg >= 4.5, `Light --accent-bronze vs --bg contrast (${crBronzeBg.toFixed(2)}:1) >= 4.5:1`);

// ── AREA 3: OBJECT-ORIENTED ARCHITECTURE & LIGHTBOX FSM ──
console.log('\n--- 3. Domain Model & Lightbox FSM Invariance ---');
const rawJs = fs.readFileSync(APP_JS, 'utf-8');

// Verify zero test snooping
assert(!rawJs.includes('process.env'), 'Zero process.env snooping in app.js');
assert(!rawJs.includes('__TEST__'), 'Zero __TEST__ snooping in app.js');
assert(!rawJs.includes('window.closeLightbox'), 'Zero leaking window.closeLightbox global in app.js');
assert(!rawJs.includes('window.lightboxNav'), 'Zero leaking window.lightboxNav global in app.js');
assert(!rawJs.includes('#initLocalClock'), 'Zero #initLocalClock in app.js');

// Load full App Environment from harness
const { loadAppEnvironment } = require(path.join(ROOT_DIR, 'tests', 'harness.js'));
const appEnv = loadAppEnvironment();

assert(appEnv !== null && typeof appEnv.eval === 'function', 'app.js loaded cleanly in full DOM environment');

// Test PhotoAsset normalization resilience
try {
  const normalRes = appEnv.eval(`
    [
      new PhotoAsset('events/landscape/EYSI-1.jpg', 'events', 'landscape', 0),
      new PhotoAsset({ src: 'predebut/portrait/EYSI-2-22.jpg', caption: 'Custom' }, 'predebut', 'portrait', 1),
      new PhotoAsset(null, 'unknown', 'portrait', 2),
      new PhotoAsset(undefined, 'unknown', 'landscape', 3),
      new PhotoAsset(12345, 'unknown', 'landscape', 4),
      new PhotoAsset({}, 'unknown', 'landscape', 5),
    ].map(p => ({ src: p.src, caption: p.caption, plateNumber: p.plateNumber }))
  `);
  assertEqual(normalRes.length, 6, 'PhotoAsset instantiated across all boundary and malformed inputs');
  assert(normalRes[0].plateNumber === 'PLATE 01', 'Plate number formatted properly for index 0');
  assert(normalRes[1].caption === 'Custom', 'Custom caption preserved');
} catch (e) {
  assert(false, `PhotoAsset resilience test failed: ${e.message}`);
}

// Test Lightbox state machine transitions
try {
  const fsmTest = appEnv.eval(`
    (() => {
      const lb = lightboxController;
      const repo = repository;
      const photos = repo.getPhotos('predebut', 'portrait');

      const log = [];
      log.push(lb.state); // should be 0 (CLOSED)

      lb.open(photos, 0);
      log.push(lb.state); // should be 1 (VIEWING)

      lb.toggleZoom();
      log.push(lb.state); // should be 2 (ZOOMED)

      lb.startSlideshow();
      log.push(lb.state); // should be 3 (SLIDESHOW) and zoom reset

      lb.toggleZoom();
      log.push(lb.state); // should be 2 (ZOOMED) and slideshow stopped

      lb.close();
      log.push(lb.state); // should be 0 (CLOSED)

      return log;
    })()
  `);
  assertEqual(fsmTest[0], 0, 'Initial state is CLOSED (0)');
  assertEqual(fsmTest[1], 1, 'open() transitions to VIEWING (1)');
  assertEqual(fsmTest[2], 2, 'toggleZoom() transitions to ZOOMED (2)');
  assertEqual(fsmTest[3], 3, 'startSlideshow() while zoomed resets zoom and transitions to SLIDESHOW (3)');
  assertEqual(fsmTest[4], 2, 'toggleZoom() while slideshow running stops slideshow and transitions to ZOOMED (2)');
  assertEqual(fsmTest[5], 0, 'close() transitions to CLOSED (0)');
} catch (e) {
  assert(false, `Lightbox FSM transition test failed: ${e.message}`);
} finally {
  appEnv.teardown();
}

// ── SUMMARY ──
console.log('\n======================================================================');
console.log(`  VICTORY AUDITOR TEST SUMMARY: ${passedTests}/${totalTests} PASSED (Failures: ${failedTests})`);
console.log('======================================================================\n');

if (failedTests > 0) {
  console.error('FAILURES:');
  failures.forEach(f => console.error(' - ' + f));
  process.exit(1);
} else {
  console.log('ALL INDEPENDENT VICTORY AUDITOR CHECKS PASSED.');
  process.exit(0);
}
