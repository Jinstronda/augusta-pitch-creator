/**
 * Standalone Playwright Runner for Pitch.com Automation
 *
 * This script provides a simple way to test the pitch-automation.js
 * script in a real browser environment.
 *
 * Usage:
 *   node frontend/tests/run-pitch-automation.js
 *
 * Features:
 * - Authenticates with cookies
 * - Injects automation script
 * - Executes test paste
 * - Keeps browser open for manual testing
 */

import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// ES module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const CONFIG = {
  url: 'https://app.pitch.com/app/presentation/115577da-7857-4831-9fc4-c520aa2009cb/c7d769f5-5f0a-4f6e-a217-0e101442a344',
  scriptPath: path.join(__dirname, '../utils/pitch-automation.js'),
  headless: false, // Browser VISIBLE
  slowMo: 1000,    // 1 second delay between actions (very visible)
  devtools: true,  // Auto-open DevTools to see console logs
  observeDelay: 8000, // Wait 8 seconds after automation to observe results
  testEDN: `{:test "slide" :timestamp "${Date.now()}"}` // Sample EDN data
};

// Cookies for authentication (UPDATED - Fresh cookies)
const COOKIES = [
  {
    "name": "_ga",
    "value": "GA1.2.1938862237.1764205012",
    "domain": ".pitch.com",
    "path": "/",
    "expires": 1799015500.400173,
    "httpOnly": false,
    "secure": false,
    "sameSite": "Lax"
  },
  {
    "name": "_ga_3KLXK377BT",
    "value": "GS2.1.s1764294202$o3$g0$t1764294202$j60$l0$h0",
    "domain": ".pitch.com",
    "path": "/",
    "expires": 1798854202.387566,
    "httpOnly": false,
    "secure": false,
    "sameSite": "Lax"
  },
  {
    "name": "_ga_7T55EQD4M7",
    "value": "GS2.1.s1764453266$o3$g1$t1764454661$j60$l0$h0",
    "domain": ".pitch.com",
    "path": "/",
    "expires": 1799014661.510531,
    "httpOnly": false,
    "secure": false,
    "sameSite": "Lax"
  },
  {
    "name": "_ga_GTW22Q6PSF",
    "value": "GS2.1.s1764453266$o4$g1$t1764455503$j51$l0$h0",
    "domain": ".pitch.com",
    "path": "/",
    "expires": 1799015503.531623,
    "httpOnly": false,
    "secure": false,
    "sameSite": "Lax"
  },
  {
    "name": "_gcl_au",
    "value": "1.1.533740213.1764205012",
    "domain": ".pitch.com",
    "path": "/",
    "expires": 1771981012,
    "httpOnly": false,
    "secure": false,
    "sameSite": "Lax"
  },
  {
    "name": "_gid",
    "value": "GA1.2.1114655173.1764453271",
    "domain": ".pitch.com",
    "path": "/",
    "expires": 1764541900,
    "httpOnly": false,
    "secure": false,
    "sameSite": "Lax"
  },
  {
    "name": "ajs_anonymous_id",
    "value": "280f9af3-bc80-4d4c-a6c0-b5780d98f535",
    "domain": ".pitch.com",
    "path": "/",
    "expires": 1795991505,
    "httpOnly": false,
    "secure": false,
    "sameSite": "Lax"
  },
  {
    "name": "ajs_group_id",
    "value": "115577da-7857-4831-9fc4-c520aa2009cb",
    "domain": ".pitch.com",
    "path": "/",
    "expires": 1795991500,
    "httpOnly": false,
    "secure": false,
    "sameSite": "Lax"
  },
  {
    "name": "ajs_user_id",
    "value": "440593d6-6785-405f-ac0f-ac98cadae0e4",
    "domain": ".pitch.com",
    "path": "/",
    "expires": 1795991505,
    "httpOnly": false,
    "secure": false,
    "sameSite": "Lax"
  },
  {
    "name": "intercom-device-id-alrusdv4",
    "value": "dd5153ac-f941-43ec-a495-f4d8ebce8162",
    "domain": ".pitch.com",
    "path": "/",
    "expires": 1787785501,
    "httpOnly": false,
    "secure": false,
    "sameSite": "Lax"
  },
  {
    "name": "intercom-id-alrusdv4",
    "value": "bd867d46-f3c5-4f74-94fd-5f7c3c3f4938",
    "domain": ".pitch.com",
    "path": "/",
    "expires": 1787609923,
    "httpOnly": false,
    "secure": false,
    "sameSite": "Lax"
  },
  {
    "name": "intercom-session-alrusdv4",
    "value": "Qzd4U3JxWlMyVFBXWVNNV082dGxiaWZhY3ZrY1VQMTRJVFZyZ2VLODJBY3Y3YWd4cjdrSTlUeElVOXdZK1kxZWcvRGZZN0U4K01yQUNKbCtXb2o4TUl4TlAvc3cvRXcyR251b0ZtaldJOG89LS1sVlpSaExJTnc4eFJiUHMxb3RGa1JBPT0=--a9409574473f5310db488599ff31a88cffd533ea",
    "domain": ".pitch.com",
    "path": "/",
    "expires": 1765060302,
    "httpOnly": false,
    "secure": false,
    "sameSite": "Lax"
  },
  {
    "name": "IS_PITCH_USER",
    "value": "true",
    "domain": ".pitch.com",
    "path": "/",
    "expires": 1766699115,
    "httpOnly": false,
    "secure": false,
    "sameSite": "Lax"
  },
  {
    "name": "_dd_s",
    "value": "aid=28258749-19ef-4daa-a8a7-47450a2df8b1&logs=1&id=47da7f9b-b95b-4eb5-bde2-1e48ed97695a&created=1764453265626&expire=1764457430653",
    "domain": "app.pitch.com",
    "path": "/",
    "expires": 1795992530,
    "httpOnly": false,
    "secure": false,
    "sameSite": "Strict"
  },
  {
    "name": "_legacy_auth0.TAZUl8D8OK53lYBIQ5mZo0zu07edCwP0.is.authenticated",
    "value": "true",
    "domain": "app.pitch.com",
    "path": "/",
    "expires": 1764539668,
    "httpOnly": false,
    "secure": true,
    "sameSite": "Lax"
  },
  {
    "name": "auth0.TAZUl8D8OK53lYBIQ5mZo0zu07edCwP0.is.authenticated",
    "value": "true",
    "domain": "app.pitch.com",
    "path": "/",
    "expires": 1764539668,
    "httpOnly": false,
    "secure": true,
    "sameSite": "None"
  }
];

/**
 * Main execution function
 */
async function runAutomation() {
  console.log('━'.repeat(60));
  console.log('🚀 Pitch.com Automation - Playwright Runner');
  console.log('━'.repeat(60));
  console.log('⚠️  BROWSER WILL NEVER CLOSE AUTOMATICALLY');
  console.log('⚠️  ONLY WAY TO EXIT: Press Ctrl+C');
  console.log('━'.repeat(60));

  let browser;
  let context;
  let page;

  try {
    // Launch browser
    console.log('\n📱 Launching browser (visible mode with DevTools)...');
    browser = await chromium.launch({
      headless: CONFIG.headless,
      slowMo: CONFIG.slowMo,
      devtools: CONFIG.devtools  // Auto-open DevTools
    });

    // Create context with clipboard permissions
    context = await browser.newContext({
      viewport: { width: 1920, height: 1080 },
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      permissions: ['clipboard-read', 'clipboard-write']
    });

    // Add fresh cookies for authentication
    console.log('🍪 Adding authentication cookies...');
    await context.addCookies(COOKIES);

    // Create page
    page = await context.newPage();

    // Enable console logging from the page
    page.on('console', msg => {
      const type = msg.type();
      const text = msg.text();

      if (type === 'error') {
        console.log(`   ❌ [Browser Error]: ${text}`);
      } else if (type === 'warning') {
        console.log(`   ⚠️  [Browser Warning]: ${text}`);
      } else {
        console.log(`   🌐 [Browser]: ${text}`);
      }
    });

    // Navigate to presentation
    console.log('\n📍 Navigating to Pitch.com presentation...');
    console.log(`   URL: ${CONFIG.url.substring(0, 60)}...`);
    await page.goto(CONFIG.url, { waitUntil: 'domcontentloaded', timeout: 30000 });

    // Check for authentication issues
    console.log('\n🔐 Checking authentication...');
    await page.waitForTimeout(3000); // Wait for potential redirects

    const currentUrl = page.url();
    const isOnLoginPage = currentUrl.includes('login') || currentUrl.includes('auth');

    if (isOnLoginPage) {
      console.log('\n━'.repeat(60));
      console.log('⚠️  AUTHENTICATION FAILED - Cookies Invalid');
      console.log('━'.repeat(60));
      console.log('\n🔑 Please login manually in the browser window:');
      console.log('   1. The browser window is already open');
      console.log('   2. Complete the login process');
      console.log('   3. Navigate to your presentation');
      console.log('   4. Wait for the canvas to load');
      console.log('\n   💡 Script will auto-detect when you\'re logged in...\n');
    } else {
      console.log('   ✅ Cookies accepted - attempting to load canvas...');
    }

    // Wait for canvas to load (either from cookies or after manual login)
    console.log('\n⏳ Waiting for canvas to load...');
    console.log('   Timeout: 5 minutes (allows time for manual login if needed)\n');

    try {
      // Wait for canvas with generous timeout for manual login
      await page.waitForSelector('.canvas', { timeout: 300000 }); // 5 minutes
      console.log('   ✅ Canvas found - authenticated successfully!');

      // If manual login was required, extract and save working cookies
      if (isOnLoginPage) {
        console.log('\n💾 Extracting working cookies for future use...');
        const workingCookies = await context.cookies();
        const cookiesPath = path.join(__dirname, 'working-cookies.json');
        fs.writeFileSync(cookiesPath, JSON.stringify(workingCookies, null, 2));
        console.log(`   ✅ Cookies saved to: ${cookiesPath}`);
        console.log('   💡 Update COOKIES array in this file with these values for next run');
      }
    } catch (e) {
      console.log('   ❌ Timeout waiting for canvas');
      console.log('   💡 Canvas never loaded - browser will stay open for inspection');
      throw e;
    }

    // Read and inject automation script
    console.log('\n💉 Injecting pitch-automation.js...');
    const automationScript = fs.readFileSync(CONFIG.scriptPath, 'utf-8');
    await page.evaluate(automationScript);

    // Verify script loaded
    const scriptLoaded = await page.evaluate(() => {
      return typeof window.overwriteSlide === 'function';
    });

    if (!scriptLoaded) {
      throw new Error('Script failed to load properly');
    }
    console.log('   ✅ Script injected successfully!');

    // Get environment info
    console.log('\n🔍 Checking environment...');
    const envInfo = await page.evaluate(() => {
      return window.getEnvironmentInfo();
    });

    console.log('   Platform:', envInfo.platform);
    console.log('   Modifier Key:', envInfo.modifierKey);
    console.log('   Canvas Found:', envInfo.canvasFound ? '✅' : '❌');
    console.log('   Read Layer Found:', envInfo.readLayerFound ? '✅' : '❌');

    // Backup current slide
    console.log('\n💾 Backing up current slide...');
    const backup = await page.evaluate(() => {
      return window.extractCurrentSlideData();
    });
    console.log(`   ✅ Backup created (${backup ? backup.length : 0} characters)`);

    // Execute automation with REAL clipboard
    console.log('\n🎬 Executing overwriteSlide...');
    console.log(`   EDN Data: ${CONFIG.testEDN}`);

    // Write EDN data to REAL OS clipboard using Playwright's API
    console.log('📋 Writing to OS clipboard...');
    await page.evaluate((text) => {
      return navigator.clipboard.writeText(text);
    }, CONFIG.testEDN);
    console.log('   ✅ Data written to clipboard');

    // Now trigger the automation (which will paste from real clipboard)
    const result = await page.evaluate(() => {
      // Modified version: Focus → Select All → Delete → Ctrl+V (real paste)
      async function overwriteWithRealClipboard() {
        const canvas = document.querySelector('.canvas');
        if (!canvas) {
          console.error('Canvas not found');
          return false;
        }

        console.log('🚀 Starting slide overwrite with REAL clipboard...');
        console.log('━'.repeat(50));

        // Step 1: Focus canvas
        console.log('🎯 Step 1/4: Focusing canvas...');
        canvas.focus();
        await new Promise(r => setTimeout(r, 500));
        console.log('  ✓ Canvas focused');

        // Step 2: Select all (Ctrl+A)
        console.log('📦 Step 2/4: Selecting all...');
        const selectAllEvent = new KeyboardEvent('keydown', {
          key: 'a',
          code: 'KeyA',
          ctrlKey: true,
          bubbles: true,
          cancelable: true
        });
        canvas.dispatchEvent(selectAllEvent);
        await new Promise(r => setTimeout(r, 300));
        console.log('  ✓ Selection triggered');

        // Step 3: Delete (Backspace)
        console.log('🗑️  Step 3/4: Deleting...');
        const deleteEvent = new KeyboardEvent('keydown', {
          key: 'Backspace',
          code: 'Backspace',
          bubbles: true,
          cancelable: true
        });
        canvas.dispatchEvent(deleteEvent);
        await new Promise(r => setTimeout(r, 300));
        console.log('  ✓ Deletion triggered');

        // Step 4: Paste from REAL clipboard (Ctrl+V)
        console.log('📋 Step 4/4: Pasting from REAL clipboard...');
        const pasteEvent = new KeyboardEvent('keydown', {
          key: 'v',
          code: 'KeyV',
          ctrlKey: true,
          bubbles: true,
          cancelable: true
        });
        canvas.dispatchEvent(pasteEvent);
        await new Promise(r => setTimeout(r, 500));
        console.log('  ✓ Paste triggered (Ctrl+V)');

        console.log('━'.repeat(50));
        console.log('✅ Slide overwrite complete!');
        return true;
      }

      return overwriteWithRealClipboard();
    });

    if (result) {
      console.log('   ✅ Overwrite completed successfully!');
    } else {
      console.log('   ❌ Overwrite failed (check browser console)');
    }

    // Wait to observe
    console.log(`\n⏸️  Waiting ${CONFIG.observeDelay / 1000} seconds to observe changes...`);
    await page.waitForTimeout(CONFIG.observeDelay);

    // Take screenshot
    const screenshotPath = 'test-results/pitch-automation.png';
    await page.screenshot({ path: screenshotPath, fullPage: false });
    console.log(`\n📸 Screenshot saved: ${screenshotPath}`);

    // Keep browser open for manual testing
    console.log('\n━'.repeat(60));
    console.log('✅ Automation complete!');
    console.log('━'.repeat(60));
    console.log('\n🔒 Browser is now LOCKED OPEN - it will NOT close automatically');
    console.log('');
    console.log('💡 You can now:');
    console.log('   - Inspect the slide changes');
    console.log('   - DevTools is already open (see console logs)');
    console.log('   - Run more commands manually in DevTools');
    console.log('   - Test more EDN data: overwriteSlide(`{:new "data"}`)');
    console.log('');
    console.log('⚠️  TO EXIT: Press Ctrl+C in this terminal\n');

    // Wait indefinitely (until user closes)
    await new Promise(() => {}); // Infinite wait

  } catch (error) {
    console.error('\n❌ Error occurred:');
    console.error(error.message);
    console.error(error.stack);

    if (page) {
      const screenshotPath = 'test-results/pitch-automation-error.png';
      await page.screenshot({ path: screenshotPath });
      console.log(`📸 Error screenshot saved: ${screenshotPath}`);
    }

    // Keep browser open even on error
    console.log('\n━'.repeat(60));
    console.log('⚠️  Error occurred, but browser will remain open');
    console.log('━'.repeat(60));
    console.log('\n💡 You can:');
    console.log('   - Inspect what went wrong in the browser');
    console.log('   - Check DevTools console for errors');
    console.log('   - Try running commands manually');
    console.log('\n   Press Ctrl+C to close the browser and exit.\n');

    // Wait indefinitely even on error
    await new Promise(() => {}); // Infinite wait
  }
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n\n👋 Shutting down gracefully...');
  process.exit(0);
});

// Run the automation
runAutomation();
