const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Building Windows 11 Planner for Microsoft Store...');

// Check platform
const isWindows = process.platform === 'win32';
if (!isWindows) {
  console.error('❌ APPX packaging is only supported on Windows 10/11');
  console.log('');
  console.log('To build for Microsoft Store:');
  console.log('1. Copy this project to a Windows 10/11 machine');
  console.log('2. Run: npm install');
  console.log('3. Run: npm run build-msix-script');
  console.log('');
  console.log('Or use electron-windows-store (alternative method):');
  console.log('npm install -g electron-windows-store');
  console.log('electron-windows-store --input-exe dist\\win-unpacked\\My Planner.exe --output-directory dist --package-name Windows11Planner --package-display-name "Windows 11 Planner" --publisher CN=Arman7777-coder');
  process.exit(1);
}

// Check if icons exist
const iconPath = path.join(__dirname, 'icons', 'icon-512.png');
if (!fs.existsSync(iconPath)) {
  console.warn('⚠️  Warning: Icon file not found at icons/icon-512.png');
  console.warn('Please add icon files in various sizes for Store submission');
  console.warn('Required sizes: 16x16, 24x24, 32x32, 48x48, 64x64, 128x128, 256x256, 512x512');
}

// Clear any problematic environment variables
delete process.env.WIN_CSC_LINK;
delete process.env.WIN_CSC_KEY_PASSWORD;
delete process.env.CSC_LINK;
delete process.env.CSC_KEY_PASSWORD;

// Build portable exe first - try electron-packager if electron-builder fails
try {
  console.log('📦 Building portable executable...');
  try {
    // Try electron-builder first
    execSync('npm run build-win', { stdio: 'inherit', env: { ...process.env, WIN_CSC_LINK: undefined, WIN_CSC_KEY_PASSWORD: undefined, CSC_LINK: undefined, CSC_KEY_PASSWORD: undefined } });
  } catch (ebError) {
    console.log('⚠️  electron-builder failed, trying electron-packager...');
    // Fallback to electron-packager
    execSync('npx electron-packager . "My Planner" --platform=win32 --arch=x64 --out=dist --overwrite', { stdio: 'inherit' });
    console.log('✅ Built with electron-packager!');
  }

  console.log('✅ Portable exe built successfully!');
  console.log('📁 Check dist/ for My Planner 1.0.0.exe');
  console.log('');

  // Now try electron-windows-store
  console.log('🔄 Installing electron-windows-store...');
  try {
    execSync('npm install -g electron-windows-store', { stdio: 'inherit' });
  } catch (installError) {
    console.log('⚠️  electron-windows-store already installed or install failed, continuing...');
  }

  console.log('📦 Converting to APPX with electron-windows-store...');
  try {
    // Move exe to a separate folder for electron-windows-store
    execSync('mkdir app-temp', { stdio: 'inherit' });
    // Try both possible paths (electron-builder vs electron-packager)
    try {
      execSync('copy "dist\\My Planner 1.0.0.exe" "app-temp\\"', { stdio: 'inherit' });
    } catch (e) {
      execSync('copy "dist\\My Planner-win32-x64\\My Planner.exe" "app-temp\\"', { stdio: 'inherit' });
    }

    execSync('electron-windows-store --input-directory "app-temp" --output-directory "dist" --package-name Windows11Planner --package-display-name "Windows 11 Planner" --publisher CN=Arman7777-coder', { stdio: 'inherit' });

    // Clean up temp folder
    execSync('rmdir /s /q app-temp', { stdio: 'inherit' });

    console.log('✅ APPX conversion successful!');
    console.log('📁 Check dist/ folder for Windows11Planner.appx');
    console.log('');
    console.log('🚀 Next steps for Microsoft Store submission:');
    console.log('1. Test the APPX package locally');
    console.log('2. Go to Partner Center (https://partner.microsoft.com/)');
    console.log('3. Create a new app submission');
    console.log('4. Upload your .appx file');
    console.log('5. Fill out store listing details');
    console.log('6. Submit for certification');

  } catch (ewsError) {
    console.log('⚠️  electron-windows-store failed, but your exe is ready!');
    console.log('📦 Your portable exe is ready for Store submission!');
    console.log('📁 File: dist/My Planner 1.0.0.exe');
    console.log('');
    console.log('🚀 Microsoft Store submission (exe upload):');
    console.log('1. Go to Partner Center (https://partner.microsoft.com/)');
    console.log('2. Create new app submission');
    console.log('3. Upload your exe file directly');
    console.log('4. Microsoft will handle the packaging and certification');
  }

} catch (error) {
  console.error('❌ Build failed:', error.message);
  console.log('');
  console.log('💡 Troubleshooting:');
  console.log('');

  if (error.message.includes('Access is denied') || error.message.includes('remove')) {
    console.log('🔧 FILE PERMISSION ISSUE DETECTED!');
    console.log('🚀 Auto-running force cleanup...\n');

    try {
      execSync('npm run force-clean', { stdio: 'inherit' });
      console.log('\n🔄 Retrying build after cleanup...\n');
      execSync('npm run build-win', { stdio: 'inherit' });
      console.log('✅ Build succeeded after cleanup!');
      return; // Exit successfully
    } catch (cleanupError) {
      console.log('❌ Auto-cleanup failed, please try manually:');
      console.log('npm run force-clean');
      console.log('Then: npm run build-msix-script');
      process.exit(1);
    }
  }

  console.log('🔧 FIX 1: Clear electron-builder cache');
  console.log('npx electron-builder cache clean');
  console.log('');
  console.log('🔧 FIX 2: Run as Administrator');
  console.log('Right-click Command Prompt/PowerShell → Run as Administrator');
  console.log('');
  console.log('🔧 FIX 3: Manual cleanup and rebuild');
  console.log('rmdir /s /q dist');
  console.log('npm run build-win');
  console.log('');
  console.log('🔧 FIX 4: Check Windows Developer Mode');
  console.log('Settings → Update & Security → For developers → Developer Mode: ON');
  console.log('');
  console.log('🔧 FIX 5: Alternative - skip electron-builder');
  console.log('Use electron-packager directly:');
  console.log('npx electron-packager . "My Planner" --platform=win32 --arch=x64 --out=dist');
  process.exit(1);
}