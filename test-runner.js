#!/usr/bin/env node
/**
 * EYSI CLICKS — Master Opaque-Box E2E Test Runner
 *
 * Runs all four test tiers:
 *   Tier 1: Feature Coverage (Category Tabs, Photo Metadata, Museum Matting, Theme Switching, Lightbox Modal)
 *   Tier 2: Boundary & Corner Cases (Wrap/Clamp, Keyboard Nav, Empty Orientation, Responsive Breakpoints, Image Fallback)
 *   Tier 3: Cross-Feature Interactions (Zoom+Slideshow, Category+Theme, URL Hash Sync, Focus Trapping)
 *   Tier 4: Real-World Acceptance Scenarios (User Journey, WCAG Contrast, ARIA Audit, Anti-Pattern De-Vibing)
 *
 * Usage:
 *   node test-runner.js
 *   node test-runner.js --tier=1
 *   node test-runner.js --quiet
 */

const path = require('node:path');

const { runTier1Tests } = require('./tests/test_tier1_features.js');
const { runTier2Tests } = require('./tests/test_tier2_boundaries.js');
const { runTier3Tests } = require('./tests/test_tier3_combinations.js');
const { runTier4Tests } = require('./tests/test_tier4_acceptance.js');

// ANSI Terminal Colors
const RESET  = '\x1b[0m';
const BOLD   = '\x1b[1m';
const DIM    = '\x1b[2m';
const RED    = '\x1b[31m';
const GREEN  = '\x1b[32m';
const YELLOW = '\x1b[33m';
const CYAN   = '\x1b[36m';
const GRAY   = '\x1b[90m';

function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    tier: null,
    quiet: false,
    bail: false
  };

  for (const arg of args) {
    if (arg.startsWith('--tier=')) {
      options.tier = parseInt(arg.split('=')[1], 10);
    } else if (arg === '--quiet' || arg === '-q') {
      options.quiet = true;
    } else if (arg === '--bail') {
      options.bail = true;
    }
  }
  return options;
}

function main() {
  const options = parseArgs();
  const startTime = Date.now();

  console.log(`\n${BOLD}${CYAN}═══════════════════════════════════════════════════════════════════════════════${RESET}`);
  console.log(`${BOLD}${CYAN}  EYSI CLICKS — Opaque-Box Automated E2E Test Suite${RESET}`);
  console.log(`${GRAY}  Museum Monograph Architecture & Dual-Track Verification Runner${RESET}`);
  console.log(`${BOLD}${CYAN}═══════════════════════════════════════════════════════════════════════════════${RESET}\n`);

  const tiersToRun = [
    { num: 1, name: 'Tier 1: Feature Coverage', runner: runTier1Tests },
    { num: 2, name: 'Tier 2: Boundary & Corner Cases', runner: runTier2Tests },
    { num: 3, name: 'Tier 3: Cross-Feature Interactions', runner: runTier3Tests },
    { num: 4, name: 'Tier 4: Real-World Acceptance Scenarios', runner: runTier4Tests },
  ].filter(t => options.tier === null || t.num === options.tier);

  const suiteResults = [];
  let totalPassed = 0;
  let totalFailed = 0;
  let totalCount  = 0;

  for (const tier of tiersToRun) {
    const tierStart = Date.now();
    let tierResult;

    try {
      tierResult = tier.runner();
    } catch (err) {
      console.error(`${RED}Fatal error running ${tier.name}:${RESET}`, err);
      tierResult = {
        tierName: tier.name,
        tests: [{ name: 'Tier Runner Execution', status: 'FAIL', duration: 0, error: err.message }],
        passed: 0,
        failed: 1
      };
    }

    const tierDuration = Date.now() - tierStart;
    suiteResults.push({ ...tierResult, tierDuration });

    totalPassed += tierResult.passed;
    totalFailed += tierResult.failed;
    totalCount  += tierResult.tests.length;

    // Print Tier output if not quiet
    if (!options.quiet) {
      const tierBadge = tierResult.failed === 0 ? `${GREEN}[PASS]${RESET}` : `${RED}[FAIL]${RESET}`;
      console.log(`${BOLD}${tierBadge} ${tier.name}${RESET} ${GRAY}(${tierResult.passed}/${tierResult.tests.length} passed, ${tierDuration}ms)${RESET}`);

      for (const t of tierResult.tests) {
        if (t.status === 'PASS') {
          console.log(`  ${GREEN}✓${RESET} ${GRAY}${t.name}${RESET} ${DIM}(${t.duration}ms)${RESET}`);
        } else {
          console.log(`  ${RED}✗ ${BOLD}${t.name}${RESET} ${RED}(${t.duration}ms)${RESET}`);
          if (t.error) {
            console.log(`    ${YELLOW}↳ Error:${RESET} ${t.error}`);
          }
        }
      }
      console.log('');
    }

    if (options.bail && tierResult.failed > 0) {
      console.log(`${YELLOW}Bailing early after first tier failure (--bail).${RESET}\n`);
      break;
    }
  }

  const totalDuration = Date.now() - startTime;

  // Summary Table
  console.log(`${BOLD}${CYAN}───────────────────────────────────────────────────────────────────────────────${RESET}`);
  console.log(`${BOLD}  TEST SUITE EXECUTION SUMMARY${RESET}`);
  console.log(`${BOLD}${CYAN}───────────────────────────────────────────────────────────────────────────────${RESET}`);
  console.log(`  ${'Tier Name'.padEnd(46)} ${'Total'.padStart(7)} ${'Pass'.padStart(7)} ${'Fail'.padStart(7)} ${'Time'.padStart(8)}`);
  console.log(`  ${'─'.repeat(46)} ${'─'.repeat(7)} ${'─'.repeat(7)} ${'─'.repeat(7)} ${'─'.repeat(8)}`);

  for (const r of suiteResults) {
    const statusColor = r.failed === 0 ? GREEN : RED;
    console.log(
      `  ${statusColor}${r.tierName.padEnd(46)}${RESET} ` +
      `${String(r.tests.length).padStart(7)} ` +
      `${GREEN}${String(r.passed).padStart(7)}${RESET} ` +
      `${r.failed > 0 ? RED : GRAY}${String(r.failed).padStart(7)}${RESET} ` +
      `${String(r.tierDuration + 'ms').padStart(8)}`
    );
  }

  console.log(`  ${'─'.repeat(46)} ${'─'.repeat(7)} ${'─'.repeat(7)} ${'─'.repeat(7)} ${'─'.repeat(8)}`);
  const finalColor = totalFailed === 0 ? GREEN : RED;
  console.log(
    `  ${BOLD}${'TOTAL'.padEnd(46)}${RESET} ` +
    `${BOLD}${String(totalCount).padStart(7)}${RESET} ` +
    `${BOLD}${GREEN}${String(totalPassed).padStart(7)}${RESET} ` +
    `${BOLD}${totalFailed > 0 ? RED : GREEN}${String(totalFailed).padStart(7)}${RESET} ` +
    `${BOLD}${String(totalDuration + 'ms').padStart(8)}${RESET}`
  );
  console.log(`${BOLD}${CYAN}───────────────────────────────────────────────────────────────────────────────${RESET}\n`);

  if (totalFailed > 0) {
    console.log(`${BOLD}${RED}  OVERALL RESULT: FAIL (${totalFailed} failure${totalFailed > 1 ? 's' : ''} across ${totalCount} tests)${RESET}`);
    console.log(`${GRAY}  Note: Expected during parallel milestones M1/M2 prior to full implementation.${RESET}`);
    console.log(`${GRAY}  Check individual failures above and report in TEST_READY.md / handoff.md.${RESET}\n`);
    process.exit(1);
  } else {
    console.log(`${BOLD}${GREEN}  OVERALL RESULT: ALL TESTS PASSED (${totalPassed}/${totalCount} tests)${RESET}\n`);
    process.exit(0);
  }
}

if (require.main === module) {
  main();
}
