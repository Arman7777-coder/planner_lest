const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Building Windows 11 Planner as APPX with custom icons...\n');

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

// Step 3: Build APPX with electron-builder
console.log('📋 Step 3: Building APPX package...');
try {
  // Clear environment variables that might cause issues and disable code signing
  const env = {
    ...process.env,
    WIN_CSC_LINK: undefined,
    WIN_CSC_KEY_PASSWORD: undefined,
    CSC_LINK: undefined,
    CSC_KEY_PASSWORD: undefined,
    CSC_IDENTITY_AUTO_DISCOVERY: 'false',
    WIN_CSC_FILE: undefined,
    WIN_CSC_KEY_PASSWORD: undefined,
    CERTIFICATE_FILE: undefined,
    CERTIFICATE_PASSWORD: undefined
  };

  // Use direct electron-builder command with signing disabled
  execSync('npx electron-builder --win --publish never --config.win.sign=false', { stdio: 'inherit', env });
  console.log('✅ APPX build completed successfully!\n');
} catch (error) {
  console.log('❌ APPX build failed:', error.message);
  console.log('\n🔧 Troubleshooting steps:');
  console.log('1. Make sure you have Windows 10/11 with Developer Mode enabled');
  console.log('2. Run PowerShell as Administrator');
  console.log('3. Try: npm run force-clean');
  console.log('4. Then: npm run build-msix');
  process.exit(1);
}

// Step 3.5: Post-build asset processing
console.log('📋 Step 3.5: Processing APPX assets...');
try {
  execSync('node post-build-appx.js', { stdio: 'inherit' });
  console.log('✅ APPX assets processed successfully!\n');
} catch (error) {
  console.log('⚠️  Asset processing failed, but build may still work:', error.message);
}

// Step 4: Verify the build
console.log('📋 Step 4: Verifying APPX build...');
const appxPath = path.join(__dirname, 'dist', 'Windows 11 Planner 1.0.1.appx');
if (fs.existsSync(appxPath)) {
  const stats = fs.statSync(appxPath);
  const sizeInMB = (stats.size / (1024 * 1024)).toFixed(2);
  console.log(`✅ APPX file created successfully!`);
  console.log(`📁 Location: ${appxPath}`);
  console.log(`📊 Size: ${sizeInMB} MB`);
  
  // Check if assets were included
  const assetsPath = path.join(__dirname, 'dist', 'pre-appx', 'assets');
  if (fs.existsSync(assetsPath)) {
    const assets = fs.readdirSync(assetsPath);
    console.log(`🎨 Assets included: ${assets.join(', ')}`);
  }
  
  console.log('\n🎉 Build completed successfully!');
  console.log('\n📋 Next steps:');
  console.log('1. Test the APPX locally: Add-AppxPackage -Path "dist\\Windows 11 Planner 1.0.1.appx"');
  console.log('2. Submit to Microsoft Store via Partner Center');
  console.log('3. Or distribute the APPX file directly');
  
} else {
  console.log('❌ APPX file not found. Build may have failed.');
  console.log('📁 Check dist/ directory for other build outputs');
}

console.log('\n💡 Tips:');
console.log('- Make sure Windows Developer Mode is enabled');
console.log('- Run PowerShell as Administrator for best results');
console.log('- Your custom icons are now included in the APPX package');
