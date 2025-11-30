/**
 * Pitch.com Automation - Create Combined Presentation with Selected Variants
 *
 * Creates ONE presentation containing all 3 slides sequentially using selected variants:
 * - Slide 1: Case Studies (variant selected by user)
 * - Slide 2: PnL
 * - Slide 3: Angles
 *
 * Features:
 * - Headless mode
 * - Sequential slide addition
 * - Uses "Add slide" button between each slide
 * - Returns final presentation URL
 * - Accepts data file paths as command-line arguments
 *
 * Usage: node create-combined-with-variants.js <case_studies_file> <pnl_file> <angles_file>
 */

import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get data file paths from command-line arguments
const caseStudiesFile = process.argv[2] || 'slides/case_studies4.txt';
const pnlFile = process.argv[3] || 'slides/pnl.txt';
const anglesFile = process.argv[4] || 'slides/angles.txt';

console.log('📋 Using variant files:');
console.log(`   Case Studies: ${caseStudiesFile}`);
console.log(`   PnL: ${pnlFile}`);
console.log(`   Angles: ${anglesFile}`);
console.log('');

// Configuration
const CONFIG = {
  dashboardUrl: 'https://app.pitch.com/app/dashboard/115577da-7857-4831-9fc4-c520aa2009cb/folder/ff01dc0c-13b3-4ac3-90b1-3e05afd2ad81',
  profileDirectory: 'Profile 3',

  slides: [
    { name: 'Case Studies', dataFile: caseStudiesFile },
    { name: 'PnL', dataFile: pnlFile },
    { name: 'Angles', dataFile: anglesFile }
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
 * Main execution
 */
async function createCombinedPresentation() {
  console.log('━'.repeat(80));
  console.log('🎯 CREATING COMBINED PRESENTATION');
  console.log('━'.repeat(80));
  console.log('📊 Slides: Case Studies → PnL → Angles');
  console.log('🔧 Mode: Headless');
  console.log('━'.repeat(80));
  console.log('');

  let context;
  let page;

  try {
    // Launch browser
    const profilePath = getUserDataPath();
    console.log(`📁 Profile: ${profilePath}`);
    console.log('🚀 Launching browser...\n');

    context = await chromium.launchPersistentContext(profilePath, {
      headless: true,
      channel: 'chrome',
      viewport: { width: 1920, height: 1080 },
      permissions: ['clipboard-read', 'clipboard-write'],
      args: ['--disable-blink-features=AutomationControlled']
    });

    page = await context.newPage();
    console.log('✅ Browser launched!\n');

    // Navigate to dashboard
    console.log('📍 Navigating to dashboard...');
    await page.goto(CONFIG.dashboardUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(500);

    // Check authentication
    const currentUrl = page.url();
    if (currentUrl.includes('login') || currentUrl.includes('auth')) {
      throw new Error('Not authenticated - please login manually');
    }
    console.log('✅ Authenticated\n');

    // Create blank presentation
    console.log('🎯 Creating blank presentation...');
    await page.click('button[data-test-id="dashboard-cta-create-presentation-button"]', { timeout: 10000 });
    await page.waitForTimeout(500);
    await page.click('button[data-test-id="template-picker-cta-create-blank-presentation-button"]', { timeout: 10000 });
    await page.waitForTimeout(1000);

    // Wait for canvas
    console.log('⏳ Waiting for canvas...');
    await page.waitForSelector('.canvas', { timeout: 30000 });
    await page.click('.selection-helper.slide-selection-helper', { timeout: 10000 });
    await page.waitForTimeout(300);
    console.log('✅ Canvas ready\n');

    const isMac = process.platform === 'darwin';
    const mod = isMac ? 'Meta' : 'Control';

    // Add all 3 slides sequentially
    for (let i = 0; i < CONFIG.slides.length; i++) {
      const slide = CONFIG.slides[i];
      const slideNum = i + 1;

      console.log('━'.repeat(80));
      console.log(`📄 SLIDE ${slideNum}/3: ${slide.name}`);
      console.log('━'.repeat(80));

      // Load EDN data
      console.log(`📋 Loading ${slide.name} data...`);
      const ednDataPath = path.join(__dirname, '..', slide.dataFile);
      const ednData = fs.readFileSync(ednDataPath, 'utf-8').trim();
      console.log(`✅ Loaded ${ednData.length} characters`);

      // Focus canvas
      console.log('🎯 Focusing canvas...');
      await page.bringToFront();
      await page.click('.canvas');
      await page.waitForTimeout(200);

      // Simulate paste event with DataTransfer API (NO CLIPBOARD!)
      console.log(`🎯 Injecting slide ${slideNum} data with DataTransfer API...`);
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

      console.log(`✅ Slide ${slideNum} data injected (${pasteResult.length} characters)`);
      await page.waitForTimeout(500);

      console.log(`✅ Slide ${slideNum} pasted!\n`);

      // Add next slide (if not last)
      if (i < CONFIG.slides.length - 1) {
        console.log('➕ Adding new slide...');
        await page.click('button[data-test-id="add-slide-btn"]', { timeout: 10000 });
        console.log('⏳ Waiting for template picker to load...');
        await page.waitForTimeout(1000); // Wait for template picker

        console.log('🎯 Looking for blank slide template...');

        // Click the FIRST template button (data-idx="0" = blank slide)
        const blankSlideButton = await page.waitForSelector('button.slide-picker-preview-card[data-idx="0"]', { timeout: 10000 });
        console.log('✅ Found blank slide template button');

        await blankSlideButton.click();
        console.log('🎯 Clicked blank slide template');

        // Wait for slide to be added and canvas to be ready
        await page.waitForTimeout(1000);
        await page.waitForSelector('.canvas', { timeout: 10000 });
        console.log('✅ New slide canvas ready\n');
      }
    }

    // Capture final URL
    const finalUrl = page.url();
    console.log('');
    console.log('━'.repeat(80));
    console.log('✅ COMBINED PRESENTATION CREATED');
    console.log('━'.repeat(80));
    console.log(`🔗 URL: ${finalUrl}`);
    console.log('');

    // Save URL to JSON file
    const outputPath = path.join(__dirname, '..', 'combined-presentation-url.json');
    const urlData = {
      timestamp: new Date().toISOString(),
      url: finalUrl,
      slides: CONFIG.slides.map(s => s.name)
    };

    fs.writeFileSync(outputPath, JSON.stringify(urlData, null, 2));
    console.log(`💾 URL saved to: ${outputPath}`);
    console.log('');
    console.log('━'.repeat(80));

  } catch (error) {
    console.error('');
    console.error('━'.repeat(80));
    console.error('❌ ERROR');
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

  process.exit(0);
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n\n👋 Interrupted - exiting...');
  process.exit(1);
});

// Run
createCombinedPresentation();
