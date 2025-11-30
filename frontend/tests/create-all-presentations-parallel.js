/**
 * Pitch.com Automation - Create ALL 3 Presentations in Parallel
 *
 * This script creates all 3 presentations (Case Studies, PnL, Angles) simultaneously
 * using ONE browser with 3 tabs running in parallel.
 *
 * Features:
 * - Headless mode (no visible browser)
 * - Parallel execution (all 3 at same time)
 * - Same Chrome profile (Profile 3) for all tabs
 * - Clear logging with progress indicators
 * - Saves final URLs to JSON file
 */

import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const CONFIG = {
  dashboardUrl: 'https://app.pitch.com/app/dashboard/115577da-7857-4831-9fc4-c520aa2009cb/folder/ff01dc0c-13b3-4ac3-90b1-3e05afd2ad81',
  observeDelay: 1000, // Optimized - Pitch.com reacts instantly
  profileDirectory: 'Profile 3',

  slides: [
    { type: 'case_studies', variant: '1slide', name: 'Case Studies (1 Slide)', dataFile: 'slides/case_studies1.txt', index: 1 },
    { type: 'case_studies', variant: '2slides', name: 'Case Studies (2 Slides)', dataFile: 'slides/case_studies2.txt', index: 2 },
    { type: 'case_studies', variant: '4slides', name: 'Case Studies (4 Slides)', dataFile: 'slides/case_studies4.txt', index: 3 },
    { type: 'pnl', variant: 'default', name: 'PnL', dataFile: 'slides/pnl.txt', index: 4 },
    { type: 'angles', variant: 'default', name: 'Angles', dataFile: 'slides/angles.txt', index: 5 }
  ]
};

/**
 * Get user data directory path
 */
function getUserDataPath() {
  const baseUserDataDir = process.platform === 'win32'
    ? path.join(process.env.LOCALAPPDATA, 'Google\\Chrome\\User Data')
    : path.join(process.env.HOME, 'Library/Application Support/Google/Chrome');

  return path.join(baseUserDataDir, CONFIG.profileDirectory);
}

/**
 * Create a single presentation (runs in one tab)
 */
async function createPresentation(page, slideConfig) {
  const { type, variant, name, dataFile, index } = slideConfig;
  const prefix = `[${index}/5 ${name}]`;

  try {
    console.log(`${prefix} 🚀 Starting...`);

    // Navigate to dashboard
    console.log(`${prefix} 📍 Navigating to dashboard...`);
    await page.goto(CONFIG.dashboardUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(500);

    // Check authentication
    const currentUrl = page.url();
    if (currentUrl.includes('login') || currentUrl.includes('auth')) {
      console.log(`${prefix} ⚠️  Not authenticated - please login manually`);
      return { type, name, url: null, error: 'Not authenticated' };
    }
    console.log(`${prefix} ✅ Authenticated`);

    // Stagger button clicks to prevent race conditions on dashboard UI
    const staggerDelay = (index - 1) * 300; // 0ms, 300ms, 600ms, 900ms, 1200ms
    if (staggerDelay > 0) {
      console.log(`${prefix} ⏱️  Staggering click by ${staggerDelay}ms...`);
      await page.waitForTimeout(staggerDelay);
    }

    // Click "Start new presentation"
    console.log(`${prefix} 🎯 Clicking "Start new presentation"...`);
    await page.click('button[data-test-id="dashboard-cta-create-presentation-button"]', { timeout: 10000 });
    await page.waitForTimeout(500);

    // Click "Start from blank"
    console.log(`${prefix} 🎯 Clicking "Start from blank"...`);
    await page.click('button[data-test-id="template-picker-cta-create-blank-presentation-button"]', { timeout: 10000 });
    await page.waitForTimeout(1000);

    // Wait for canvas
    console.log(`${prefix} ⏳ Waiting for canvas...`);
    await page.waitForSelector('.canvas', { timeout: 30000 });

    // Click slide selection helper
    console.log(`${prefix} 🎯 Selecting slide...`);
    await page.click('.selection-helper.slide-selection-helper', { timeout: 10000 });
    await page.waitForTimeout(300);

    // Load EDN data
    console.log(`${prefix} 📋 Loading EDN data...`);
    const ednDataPath = path.join(__dirname, '..', dataFile);
    const ednData = fs.readFileSync(ednDataPath, 'utf-8').trim();
    console.log(`${prefix} ✅ Loaded ${ednData.length} characters`);

    // Focus canvas
    console.log(`${prefix} 🎯 Focusing canvas...`);
    await page.bringToFront();
    await page.click('.canvas');
    await page.waitForTimeout(200);

    // Simulate paste event with DataTransfer API (NO CLIPBOARD - truly parallel!)
    console.log(`${prefix} 🎯 Injecting data with DataTransfer API...`);
    const pasteResult = await page.evaluate((text) => {
      try {
        const canvas = document.querySelector('.canvas');
        if (!canvas) return { success: false, error: 'Canvas not found' };

        // Create DataTransfer with EDN data
        const dataTransfer = new DataTransfer();
        dataTransfer.setData('text/plain', text);
        dataTransfer.setData('application/edn', text);

        // Create and dispatch paste event
        const pasteEvent = new ClipboardEvent('paste', {
          clipboardData: dataTransfer,
          bubbles: true,
          cancelable: true,
          composed: true
        });

        canvas.dispatchEvent(pasteEvent);
        return { success: true, length: text.length };
      } catch (error) {
        return { success: false, error: error.message };
      }
    }, ednData);

    if (!pasteResult.success) {
      throw new Error(`DataTransfer paste failed: ${pasteResult.error}`);
    }

    console.log(`${prefix} ✅ Data injected (${pasteResult.length} characters)`);
    await page.waitForTimeout(300);

    console.log(`${prefix} ⏸️  Waiting for changes to apply...`);
    await page.waitForTimeout(CONFIG.observeDelay);

    // Capture final URL
    const finalUrl = page.url();
    console.log(`${prefix} ✅ COMPLETE!`);
    console.log(`${prefix} 🔗 URL: ${finalUrl}`);

    return { type, variant, name, url: finalUrl, error: null };

  } catch (error) {
    console.error(`${prefix} ❌ ERROR: ${error.message}`);
    return { type, variant, name, url: null, error: error.message };
  }
}

/**
 * Main execution
 */
async function runParallelCreation() {
  console.log('━'.repeat(80));
  console.log('🚀 PARALLEL PRESENTATION CREATION');
  console.log('━'.repeat(80));
  console.log(`📋 Creating: ${CONFIG.slides.map(s => s.name).join(', ')}`);
  console.log(`🔧 Mode: Headless`);
  console.log(`👤 Profile: ${CONFIG.profileDirectory}`);
  console.log('━'.repeat(80));
  console.log('');

  let context;
  const results = [];

  try {
    // Launch browser with persistent context
    const profilePath = getUserDataPath();
    console.log(`📁 Profile: ${profilePath}`);
    console.log('🚀 Launching browser (headless mode)...\n');

    context = await chromium.launchPersistentContext(profilePath, {
      headless: true,
      channel: 'chrome',
      viewport: { width: 1920, height: 1080 },
      permissions: ['clipboard-read', 'clipboard-write'],
      args: ['--disable-blink-features=AutomationControlled']
    });

    console.log('✅ Browser launched!\n');

    // Create 5 pages (tabs)
    console.log('📖 Opening 5 tabs...');
    const page1 = await context.newPage();
    const page2 = await context.newPage();
    const page3 = await context.newPage();
    const page4 = await context.newPage();
    const page5 = await context.newPage();
    console.log('✅ 5 tabs opened\n');

    console.log('━'.repeat(80));
    console.log('🏁 STARTING PARALLEL EXECUTION');
    console.log('━'.repeat(80));
    console.log('');

    // Run all 5 in parallel
    const promises = [
      createPresentation(page1, CONFIG.slides[0]), // Case Studies (1 Slide)
      createPresentation(page2, CONFIG.slides[1]), // Case Studies (2 Slides)
      createPresentation(page3, CONFIG.slides[2]), // Case Studies (4 Slides)
      createPresentation(page4, CONFIG.slides[3]), // PnL
      createPresentation(page5, CONFIG.slides[4])  // Angles
    ];

    const allResults = await Promise.all(promises);
    results.push(...allResults);

    console.log('');
    console.log('━'.repeat(80));
    console.log('✅ ALL PRESENTATIONS CREATED');
    console.log('━'.repeat(80));
    console.log('');

    // Print summary
    console.log('📊 SUMMARY:');
    console.log('');
    results.forEach((result, i) => {
      const status = result.url ? '✅' : '❌';
      console.log(`${status} ${i + 1}. ${result.name}`);
      if (result.url) {
        console.log(`   🔗 ${result.url}`);
      } else {
        console.log(`   ⚠️  Error: ${result.error}`);
      }
      console.log('');
    });

    // Save URLs to JSON file with variant structure
    const outputPath = path.join(__dirname, '..', 'presentation-urls.json');

    // Group results by type, creating variants arrays
    const groupedPresentations = {};
    results.forEach(r => {
      if (!groupedPresentations[r.type]) {
        groupedPresentations[r.type] = {
          variants: [],
          selected: r.type === 'case_studies' ? '4slides' : 'default' // Default selection
        };
      }
      groupedPresentations[r.type].variants.push({
        id: r.variant,
        name: r.name,
        url: r.url,
        error: r.error
      });
    });

    const urlData = {
      timestamp: new Date().toISOString(),
      presentations: groupedPresentations
    };

    fs.writeFileSync(outputPath, JSON.stringify(urlData, null, 2));
    console.log(`💾 URLs saved to: ${outputPath}`);
    console.log('');
    console.log('✅ PRESENTATIONS READY - Frontend polling will detect completion');
    console.log('━'.repeat(80));

  } catch (error) {
    console.error('');
    console.error('━'.repeat(80));
    console.error('❌ FATAL ERROR');
    console.error('━'.repeat(80));
    console.error(error.message);
    console.error('');
  } finally {
    if (context) {
      console.log('🔒 Closing browser...');
      await context.close();
      console.log('✅ Browser closed');
    }
  }

  // Exit
  process.exit(results.every(r => r.url !== null) ? 0 : 1);
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n\n👋 Interrupted - exiting...');
  process.exit(1);
});

// Run
runParallelCreation();
