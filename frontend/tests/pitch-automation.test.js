/**
 * Playwright Test for Pitch.com Automation
 *
 * This script tests the pitch-automation.js script by:
 * 1. Authenticating with cookies
 * 2. Navigating to a Pitch.com presentation
 * 3. Injecting the automation script
 * 4. Executing the overwriteSlide function
 *
 * Usage:
 *   npx playwright test frontend/tests/pitch-automation.test.js --headed
 */

import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// ES module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Test configuration
const PITCH_URL = 'https://app.pitch.com/app/presentation/115577da-7857-4831-9fc4-c520aa2009cb/c7d769f5-5f0a-4f6e-a217-0e101442a344';
const SCRIPT_PATH = path.join(__dirname, '../utils/pitch-automation.js');

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
    "name": "_gat_UA-112932961-3",
    "value": "1",
    "domain": ".pitch.com",
    "path": "/",
    "expires": 1764455554,
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

test.describe('Pitch.com Automation Tests', () => {

  test.beforeEach(async ({ context }) => {
    // Add cookies to the browser context
    await context.addCookies(COOKIES);
  });

  test('should inject automation script and execute overwriteSlide', async ({ page }) => {
    console.log('🚀 Starting Pitch.com automation test...');

    // Navigate to the presentation
    console.log('📍 Navigating to Pitch.com presentation...');
    await page.goto(PITCH_URL, { waitUntil: 'networkidle' });

    // Wait for the canvas to load
    console.log('⏳ Waiting for canvas to load...');
    await page.waitForSelector('.canvas', { timeout: 10000 });

    // Read the automation script
    const automationScript = fs.readFileSync(SCRIPT_PATH, 'utf-8');

    // Inject the script into the page
    console.log('💉 Injecting pitch-automation.js...');
    await page.evaluate(automationScript);

    // Verify script loaded
    const scriptLoaded = await page.evaluate(() => {
      return typeof window.overwriteSlide === 'function';
    });

    expect(scriptLoaded).toBe(true);
    console.log('✅ Script injected successfully');

    // Get environment info
    console.log('🔍 Checking environment...');
    const envInfo = await page.evaluate(() => {
      return window.getEnvironmentInfo();
    });
    console.log('Environment info:', envInfo);

    // Test with sample EDN data
    console.log('📋 Testing overwriteSlide function...');
    const testEDN = `{:test "slide" :timestamp "${Date.now()}"}`;

    // Execute the overwrite function and capture console logs
    const result = await page.evaluate((ednData) => {
      return window.overwriteSlide(ednData);
    }, testEDN);

    console.log('Result:', result);

    // Wait to observe the changes
    console.log('⏸️  Waiting 3 seconds to observe changes...');
    await page.waitForTimeout(3000);

    // Take a screenshot
    await page.screenshot({ path: 'test-results/pitch-automation-test.png' });
    console.log('📸 Screenshot saved to test-results/pitch-automation-test.png');

    console.log('✅ Test complete!');
  });

  test('should backup current slide before overwriting', async ({ page }) => {
    console.log('🚀 Testing backup functionality...');

    await page.goto(PITCH_URL, { waitUntil: 'networkidle' });
    await page.waitForSelector('.canvas', { timeout: 10000 });

    const automationScript = fs.readFileSync(SCRIPT_PATH, 'utf-8');
    await page.evaluate(automationScript);

    // Extract current slide data
    const backup = await page.evaluate(() => {
      return window.extractCurrentSlideData();
    });

    console.log('Backup length:', backup ? backup.length : 0);
    expect(backup).toBeTruthy();

    console.log('✅ Backup test complete!');
  });

  test('should handle invalid EDN gracefully', async ({ page }) => {
    console.log('🚀 Testing error handling...');

    await page.goto(PITCH_URL, { waitUntil: 'networkidle' });
    await page.waitForSelector('.canvas', { timeout: 10000 });

    const automationScript = fs.readFileSync(SCRIPT_PATH, 'utf-8');
    await page.evaluate(automationScript);

    // Test with empty string
    const result = await page.evaluate(() => {
      return window.overwriteSlide('');
    });

    expect(result).toBe(false);
    console.log('✅ Error handling test complete!');
  });
});
