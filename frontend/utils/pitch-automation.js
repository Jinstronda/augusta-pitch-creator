/**
 * Pitch.com Slide Automation - Browser Console Version
 *
 * ⚠️  LIMITATION: This script DOES NOT WORK when pasted into console!
 *
 * WHY: Dispatched keyboard events have isTrusted=false, which Pitch.com ignores
 * for security. Only REAL keyboard input (isTrusted=true) works.
 *
 * SOLUTION: Use Playwright's keyboard API instead:
 *   - See: frontend/tests/run-pitch-existing-browser.js
 *   - Uses: page.keyboard.press('Control+A') - creates REAL input
 *   - Result: isTrusted=true events that Pitch.com accepts
 *
 * This file is kept for reference only.
 */

const delay = ms => new Promise(r => setTimeout(r, ms));

async function overwriteSlide(ednData) {
  console.log('🚀 Overwriting slide...');

  const canvas = document.querySelector('.canvas');
  if (!canvas) throw new Error('❌ Canvas not found');

  canvas.focus();
  await delay(50);

  const isMac = /Mac/.test(navigator.platform);
  const mod = isMac ? 'metaKey' : 'ctrlKey';

  // Ctrl+A / Cmd+A
  canvas.dispatchEvent(new KeyboardEvent('keydown', {
    key: 'a',
    code: 'KeyA',
    [mod]: true,
    bubbles: true,
    cancelable: true,
    composed: true
  }));

  await delay(100);

  // Delete
  canvas.dispatchEvent(new KeyboardEvent('keydown', {
    key: 'Backspace',
    code: 'Backspace',
    bubbles: true,
    cancelable: true,
    composed: true
  }));

  await delay(100);

  // Ctrl+V / Cmd+V with clipboard data
  const dt = new DataTransfer();
  dt.setData('text/plain', ednData.trim());
  dt.setData('application/edn', ednData.trim());

  canvas.dispatchEvent(new ClipboardEvent('paste', {
    clipboardData: dt,
    bubbles: true,
    cancelable: true,
    composed: true
  }));

  console.log('✅ Done! Refresh to verify.');
  return true;
}

console.log('%c✨ Pitch Automation Loaded', 'color: #7c5cff; font-weight: bold');
console.log('Run: overwriteSlide(ednData)');
