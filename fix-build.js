const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing Windows 11 Planner build issues...\n');

// Fix 1: Clear electron-builder cache
try {
  console.log('1️⃣ Clearing electron-builder cache...');
  execSync('npx electron-builder cache clean', { stdio: 'inherit' });
  console.log('✅ Cache cleared\n');
} catch (error) {
  console.log('⚠️  Could not clear cache, continuing...\n');
}

// Fix 2: Check if running as admin (basic check)
try {
  execSync('net session', { stdio: 'pipe' });
  console.log('✅ Running as Administrator\n');
} catch (error) {
  console.log('⚠️  Not running as Administrator - this may cause issues\n');
  console.log('💡 Try: Right-click Command Prompt → Run as Administrator\n');
}

// Fix 3: Check for icons
const iconPath = path.join(__dirname, 'icons', 'icon-512.png');
if (!fs.existsSync(iconPath)) {
  console.log('⚠️  Icon file missing: icons/icon-512.png');
  console.log('💡 Add icon files in various sizes for Store submission\n');
} else {
  console.log('✅ Icon file found\n');
}

// Fix 4: Try alternative build method
console.log('🔄 Trying alternative build method...\n');

try {
  // First build regular exe
  console.log('Building regular executable...');
  execSync('npm run build-win', { stdio: 'inherit' });

  console.log('✅ Regular build successful!');
  console.log('📁 Check dist/ folder for win-unpacked folder\n');

  // Then try electron-windows-store
  console.log('🔄 Installing electron-windows-store...');
  try {
    execSync('npm install -g electron-windows-store', { stdio: 'inherit' });

    console.log('📦 Converting to APPX with electron-windows-store...');
    execSync('electron-windows-store --input-exe "dist\\win-unpacked\\My Planner.exe" --output-directory dist --package-name Windows11Planner --package-display-name "Windows 11 Planner" --publisher CN=Arman7777-coder', { stdio: 'inherit' });

    console.log('✅ APPX conversion successful!');
    console.log('📁 Check dist/ folder for Windows11Planner.appx\n');

  } catch (ewsError) {
    console.log('⚠️  electron-windows-store failed, but regular build succeeded');
    console.log('💡 You can manually convert the exe to appx later\n');
  }

} catch (error) {
  console.error('❌ Build failed:', error.message);
  console.log('\n💡 Last resort options:');
  console.log('1. Try running: npm run build-win (just build exe)');
  console.log('2. Use Windows Store tools manually');
  console.log('3. Check Windows Developer Mode is enabled');
  process.exit(1);
}

console.log('🎉 Build process completed!');
console.log('📋 Next: Test your app and submit to Microsoft Store');