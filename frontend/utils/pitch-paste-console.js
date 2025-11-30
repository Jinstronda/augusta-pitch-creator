/**
 * Pitch.com Slide Paste - Console Version
 *
 * Usage:
 * 1. Open Pitch.com presentation in browser
 * 2. Open DevTools (F12)
 * 3. Copy this entire script
 * 4. Paste into Console and press Enter
 * 5. Call: pasteSlide(`{:your "edn" :data "here"}`)
 */

async function pasteSlide(ednData) {
  console.log('🚀 Pitch.com Slide Paste');
  console.log('━'.repeat(50));

  // Validate input
  if (!ednData || typeof ednData !== 'string' || ednData.trim().length === 0) {
    console.error('❌ Invalid EDN data');
    return false;
  }

  // Find canvas
  const canvas = document.querySelector('.canvas');
  if (!canvas) {
    console.error('❌ Canvas not found - are you on a Pitch presentation?');
    return false;
  }

  console.log(`📋 EDN Data: ${ednData.substring(0, 50)}...`);

  try {
    // Step 1: Write to REAL clipboard
    console.log('\n📝 Step 1/4: Writing to clipboard...');
    await navigator.clipboard.writeText(ednData);
    console.log('   ✅ Data written to OS clipboard');

    // Step 2: Focus canvas
    console.log('🎯 Step 2/4: Focusing canvas...');
    canvas.focus();
    await new Promise(r => setTimeout(r, 300));
    console.log('   ✅ Canvas focused');

    // Step 3: Select all (Ctrl+A)
    console.log('📦 Step 3/4: Selecting all...');
    canvas.dispatchEvent(new KeyboardEvent('keydown', {
      key: 'a',
      code: 'KeyA',
      ctrlKey: true,
      bubbles: true,
      cancelable: true
    }));
    await new Promise(r => setTimeout(r, 300));

    // Delete selection
    canvas.dispatchEvent(new KeyboardEvent('keydown', {
      key: 'Backspace',
      code: 'Backspace',
      bubbles: true,
      cancelable: true
    }));
    await new Promise(r => setTimeout(r, 300));
    console.log('   ✅ Selection deleted');

    // Step 4: Paste from clipboard (Ctrl+V)
    console.log('📋 Step 4/4: Pasting from clipboard...');
    canvas.dispatchEvent(new KeyboardEvent('keydown', {
      key: 'v',
      code: 'KeyV',
      ctrlKey: true,
      bubbles: true,
      cancelable: true
    }));
    await new Promise(r => setTimeout(r, 500));
    console.log('   ✅ Paste triggered');

    console.log('\n━'.repeat(50));
    console.log('✅ Slide paste complete!');
    console.log('💡 Check the slide to verify changes');
    return true;

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error('💡 Make sure clipboard permissions are granted');
    return false;
  }
}

// Usage examples
console.log('\n✅ Script loaded! Usage:');
console.log('  pasteSlide(`{:test "slide" :timestamp "12345"}`)');
console.log('  pasteSlide(`{:your "custom" :edn "data"}`)');
console.log('\n💡 Tip: The script uses your OS clipboard');
