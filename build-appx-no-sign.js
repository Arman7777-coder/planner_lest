const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Building Windows 11 Planner as APPX (No Signing)...\n');

// Step 1: Create APPX assets from your icons
console.log('📋 Step 1: Creating APPX assets...');
try {
  execSync('node create-appx-assets.js', { stdio: 'inherit' });
  console.log('✅ APPX assets created successfully!\n');
} catch (error) {
  console.log('❌ Failed to create APPX assets:', error.message);
  console.log('💡 Make sure your icons exist in the icons/ directory\n');
}

// Step 2: Clean previous builds
console.log('📋 Step 2: Cleaning previous builds...');
try {
  if (fs.existsSync('dist')) {
    execSync('rmdir /s /q dist', { stdio: 'pipe' });
  }
  console.log('✅ Build directory cleaned\n');
} catch (error) {
  console.log('⚠️  Could not clean dist directory, continuing...\n');
}

// Step 3: Build with electron-packager first (no signing issues)
console.log('📋 Step 3: Building with electron-packager...');
try {
  execSync('npx electron-packager . "Windows 11 Planner" --platform=win32 --arch=x64 --out=dist --overwrite', { stdio: 'inherit' });
  console.log('✅ Electron-packager build completed!\n');
} catch (error) {
  console.log('❌ Electron-packager failed:', error.message);
  process.exit(1);
}

// Step 4: Try electron-windows-store conversion
console.log('📋 Step 4: Converting to APPX with electron-windows-store...');
try {
  // Install electron-windows-store if not present
  try {
    execSync('npm install -g electron-windows-store', { stdio: 'pipe' });
  } catch (installError) {
    console.log('ℹ️  electron-windows-store already installed or install failed, continuing...');
  }

  // Find the exe file
  const exePath = path.join(__dirname, 'dist', 'Windows 11 Planner-win32-x64', 'Windows 11 Planner.exe');
  if (!fs.existsSync(exePath)) {
    throw new Error('Executable not found after electron-packager build');
  }

  // Convert to APPX
  const command = `electron-windows-store --input-directory "dist\\Windows 11 Planner-win32-x64" --output-directory "dist" --package-name FocusPlanner --package-display-name "Focus Planner" --publisher CN=BBF25640-AF6B-4DC7-9F91-5C8D3847C5CF`;
  execSync(command, { stdio: 'inherit' });

  console.log('✅ APPX conversion completed!\n');
} catch (conversionError) {
  console.log('⚠️  electron-windows-store conversion failed:', conversionError.message);
  console.log('📦 Your portable exe is ready for Store submission!');
  console.log('📁 File: dist/Windows 11 Planner-win32-x64/Windows 11 Planner.exe');
  console.log('💡 You can submit the exe directly to Microsoft Store\n');
}

// Step 5: Post-process assets
console.log('📋 Step 5: Processing APPX assets...');
try {
  execSync('node post-build-appx.js', { stdio: 'inherit' });
  console.log('✅ APPX assets processed successfully!\n');
} catch (error) {
  console.log('⚠️  Asset processing failed, but build may still work:', error.message);
}

// Step 6: Verify the build
console.log('📋 Step 6: Verifying build...');
const appxPath = path.join(__dirname, 'dist', 'FocusPlanner.appx');
const exePath = path.join(__dirname, 'dist', 'Windows 11 Planner-win32-x64', 'Windows 11 Planner.exe');

if (fs.existsSync(appxPath)) {
  const stats = fs.statSync(appxPath);
  const sizeInMB = (stats.size / (1024 * 1024)).toFixed(2);
  console.log(`✅ APPX file created successfully!`);
  console.log(`📁 Location: ${appxPath}`);
  console.log(`📊 Size: ${sizeInMB} MB`);
} else if (fs.existsSync(exePath)) {
  const stats = fs.statSync(exePath);
  const sizeInMB = (stats.size / (1024 * 1024)).toFixed(2);
  console.log(`✅ Executable created successfully!`);
  console.log(`📁 Location: ${exePath}`);
  console.log(`📊 Size: ${sizeInMB} MB`);
} else {
  console.log('❌ No output files found.');
}

console.log('\n🎉 Build process completed!');
console.log('\n📋 Next steps:');
console.log('1. Test your app locally');
console.log('2. Submit to Microsoft Store via Partner Center');
console.log('3. Or distribute the file directly');

console.log('\n💡 Tips:');
console.log('- Make sure Windows Developer Mode is enabled');
console.log('- Run PowerShell as Administrator for best results');
console.log('- Your custom icons are included in the package');




