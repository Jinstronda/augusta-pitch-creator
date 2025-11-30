/**
 * Pitch.com Automation - Using YOUR Existing Browser
 *
 * This script connects to your existing Chrome/Edge browser
 * so you're already logged in with your saved cookies.
 *
 * Usage:
 * 1. Close ALL Chrome/Edge windows first
 * 2. Run one of:
 *    - npm run test:pitch:existing                    (uses data_text.txt)
 *    - node tests/run-pitch-existing-browser.js slides/case_studies.txt
 *    - node tests/run-pitch-existing-browser.js slides/pnl.txt
 *    - node tests/run-pitch-existing-browser.js slides/angles.txt
 * 3. Script will launch YOUR browser with debugging enabled
 * 4. You'll already be logged in!
 */

import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// ES module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get data file from command line argument or use default
const dataFile = process.argv[2] || 'data_text.txt';

// Configuration
const CONFIG = {
  url: 'https://app.pitch.com/app/presentation/115577da-7857-4831-9fc4-c520aa2009cb/c7d769f5-5f0a-4f6e-a217-0e101442a344',
  observeDelay: 8000,

  // Path to the REAL Pitch.com slide EDN data
  ednDataPath: path.join(__dirname, '..', dataFile),

  // Chrome profile to use (where your Pitch.com cookies are saved)
  // This is the profile directory name within Chrome's User Data folder
  profileDirectory: 'Profile 3',
};

/**
 * Get the user data directory path for the specified profile
 */
function getUserDataPath() {
  // Base Chrome User Data directory
  const baseUserDataDir = process.platform === 'win32'
    ? path.join(process.env.LOCALAPPDATA, 'Google\\Chrome\\User Data')
    : path.join(process.env.HOME, 'Library/Application Support/Google/Chrome');

  // Full path to the specific profile
  const profilePath = path.join(baseUserDataDir, CONFIG.profileDirectory);

  return profilePath;
}

/**
 * Main execution function
 */
async function runAutomation() {
  console.log('━'.repeat(60));
  console.log('🚀 Pitch.com Automation - Using YOUR Profile');
  console.log('━'.repeat(60));
  console.log('⚠️  IMPORTANT: Close all Chrome/Edge windows first!');
  console.log('⚠️  Browser will launch with Profile 3 cookies');
  console.log('━'.repeat(60));
  console.log('\nWaiting 3 seconds for you to close browsers...\n');

  await new Promise(resolve => setTimeout(resolve, 3000));

  let context;
  let page;

  try {
    // Get the profile path
    const profilePath = getUserDataPath();
    console.log('📁 Profile location:');
    console.log(`   ${profilePath}`);

    // Launch persistent context (loads your actual profile with cookies!)
    console.log('\n🚀 Launching Chrome with your profile...');
    context = await chromium.launchPersistentContext(profilePath, {
      headless: false,
      slowMo: 1000,
      devtools: true,
      channel: 'chrome', // Use actual Chrome, not Chromium
      viewport: { width: 1920, height: 1080 },
      permissions: ['clipboard-read', 'clipboard-write'], // Grant clipboard permissions
    });
    console.log('   ✅ Browser launched with your profile!');
    console.log('   ✅ All your cookies are loaded');

    // Get or create page
    const pages = context.pages();
    if (pages.length > 0) {
      page = pages[0];
      console.log('   ✅ Using existing tab');
    } else {
      page = await context.newPage();
      console.log('   ✅ Created new tab');
    }

    // Enable console logging from the page
    page.on('console', msg => {
      const type = msg.type();
      const text = msg.text();

      if (type === 'error') {
        console.log(`   ❌ [Browser]: ${text}`);
      } else if (type === 'warning') {
        console.log(`   ⚠️  [Browser]: ${text}`);
      } else {
        console.log(`   🌐 [Browser]: ${text}`);
      }
    });

    // Navigate to presentation
    console.log('\n📍 Navigating to Pitch.com presentation...');
    console.log(`   URL: ${CONFIG.url.substring(0, 60)}...`);
    await page.goto(CONFIG.url, { waitUntil: 'domcontentloaded', timeout: 30000 });

    // Check authentication
    console.log('\n🔐 Checking authentication...');
    await page.waitForTimeout(3000);

    const currentUrl = page.url();
    const isOnLoginPage = currentUrl.includes('login') || currentUrl.includes('auth');

    if (isOnLoginPage) {
      console.log('\n━'.repeat(60));
      console.log('⚠️  Still on login page - cookies may need refresh');
      console.log('━'.repeat(60));
      console.log('\n💡 Please login in the browser tab');
      console.log('   Script will wait 5 minutes...\n');
    } else {
      console.log('   ✅ Already authenticated!');
    }

    // Wait for canvas to load
    console.log('\n⏳ Waiting for canvas to load...');
    try {
      await page.waitForSelector('.canvas', { timeout: 300000 }); // 5 minutes
      console.log('   ✅ Canvas loaded!');
    } catch (e) {
      console.log('   ❌ Timeout waiting for canvas');
      throw e;
    }

    // Load REAL EDN slide data from file
    console.log('\n📋 Loading EDN slide data...');
    console.log(`   File path: ${CONFIG.ednDataPath}`);

    let ednData;
    try {
      ednData = fs.readFileSync(CONFIG.ednDataPath, 'utf-8').trim();
      console.log(`   ✅ Loaded ${ednData.length} characters`);
      console.log(`   Preview: ${ednData.substring(0, 100)}...`);
    } catch (error) {
      console.error(`   ❌ Failed to read file: ${error.message}`);
      throw error;
    }

    if (!ednData || ednData.length === 0) {
      throw new Error('EDN data is empty!');
    }

    // Execute automation with REAL clipboard
    console.log('\n🎬 Executing slide paste...');

    // IMPORTANT: Focus page and canvas first (required for clipboard access)
    console.log('\n🎯 Focusing page and canvas...');
    await page.bringToFront(); // Bring page to front
    await page.click('.canvas'); // Click canvas to focus
    await page.waitForTimeout(500);
    console.log('   ✅ Page and canvas focused');

    // Write EDN data to OS clipboard
    console.log('\n📋 Writing to OS clipboard...');
    await page.evaluate(async (text) => {
      await navigator.clipboard.writeText(text);
    }, ednData);
    console.log('   ✅ Clipboard updated with EDN data');

    // Use Playwright's keyboard API to send REAL keyboard input
    // This creates isTrusted:true events that Pitch.com will respond to
    const isMac = process.platform === 'darwin';
    const mod = isMac ? 'Meta' : 'Control';

    console.log(`\n⌨️  Sending keyboard input (${isMac ? 'Cmd' : 'Ctrl'}+A → Delete → ${isMac ? 'Cmd' : 'Ctrl'}+V)...`);

    // Select All
    console.log(`   📦 ${mod}+A (Select All)...`);
    await page.keyboard.press(`${mod}+A`);
    await page.waitForTimeout(300);

    // Delete
    console.log('   🗑️  Delete...');
    await page.keyboard.press('Backspace');
    await page.waitForTimeout(300);

    // Paste
    console.log(`   📋 ${mod}+V (Paste from clipboard)...`);
    await page.keyboard.press(`${mod}+V`);
    await page.waitForTimeout(500);

    console.log('   ✅ Keyboard input sequence completed!')

    // Wait to observe
    console.log(`\n⏸️  Waiting ${CONFIG.observeDelay / 1000} seconds to observe changes...`);
    await page.waitForTimeout(CONFIG.observeDelay);

    // Take screenshot
    const screenshotPath = 'test-results/pitch-automation-existing-browser.png';
    await page.screenshot({ path: screenshotPath, fullPage: false });
    console.log(`\n📸 Screenshot saved: ${screenshotPath}`);

    // Keep browser open
    console.log('\n━'.repeat(60));
    console.log('✅ Automation complete!');
    console.log('━'.repeat(60));
    console.log('\n🔒 Browser stays open - Press Ctrl+C to exit\n');

    // Wait indefinitely
    await new Promise(() => {});

  } catch (error) {
    console.error('\n❌ Error occurred:');
    console.error(error.message);

    if (page) {
      const screenshotPath = 'test-results/pitch-automation-error.png';
      await page.screenshot({ path: screenshotPath });
      console.log(`📸 Error screenshot saved: ${screenshotPath}`);
    }

    console.log('\n   Browser stays open - Press Ctrl+C to exit\n');
    await new Promise(() => {});
  }
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n\n👋 Shutting down...');
  console.log('   💡 Browser will close');
  process.exit(0);
});

// Run the automation
runAutomation();
