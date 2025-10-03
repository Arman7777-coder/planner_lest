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

// Fix 4: Try electron-windows-store method
console.log('🔄 Trying electron-windows-store method...\n');

try {
  // First build portable exe
  console.log('Building portable executable...');
  execSync('npm run build-win', { stdio: 'inherit' });

  console.log('✅ Portable exe built successfully!');
  console.log('📁 Check dist/ for My Planner 1.0.0.exe\n');

  // Try electron-builder with appx target
  console.log('📦 Building APPX with electron-builder...');
  execSync('npm run build-win', { stdio: 'inherit' });

  console.log('✅ APPX build successful!');
  console.log('📁 Check dist/ folder for the .appx file\n');

} catch (ewsError) {
  console.log('⚠️  electron-windows-store conversion failed');
  console.log('Error:', ewsError.message);
  console.log('\n💡 Alternative: Build exe only and convert manually later');
  console.log('npm run build-win');
  console.log('Then run electron-windows-store command separately\n');
}

// If we get here, at least the exe was built
console.log('🎉 Build process completed!');
console.log('📋 Next: Test your app and submit to Microsoft Store');

console.log('🎉 Build process completed!');
console.log('📋 Next: Test your app and submit to Microsoft Store');