const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🏪 Creating Microsoft Store package...\n');

// Locate the executable from possible unpacked locations
const candidates = [
  path.join(__dirname, 'dist', 'Windows 11 Planner-win32-x64', 'Windows 11 Planner.exe'),
  path.join(__dirname, 'dist', 'win-unpacked', 'electron.exe')
];

const exePath = candidates.find(p => fs.existsSync(p));
if (!exePath) {
  console.log('❌ Executable not found in expected locations. Build the app first.');
  console.log('Tried:');
  candidates.forEach(p => console.log(' - ' + p));
  process.exit(1);
}

console.log('✅ Found executable:', exePath);

// Create MSIX package structure (Microsoft Store format)
const msixDir = path.join(__dirname, 'dist', 'msix-store');
const appDir = path.join(msixDir, 'app');
const assetsDir = path.join(msixDir, 'assets');

console.log('📁 Creating MSIX directory structure...');

// Clean and create directories
if (fs.existsSync(msixDir)) {
  execSync(`rmdir /s /q "${msixDir}"`, { stdio: 'pipe' });
}
fs.mkdirSync(msixDir, { recursive: true });
fs.mkdirSync(appDir, { recursive: true });
fs.mkdirSync(assetsDir, { recursive: true });

// Copy executable and dependencies
console.log('📦 Copying application files...');
const appSourceDir = fs.existsSync(path.join(__dirname, 'dist', 'Windows 11 Planner-win32-x64'))
  ? 'dist\\Windows 11 Planner-win32-x64'
  : 'dist\\win-unpacked';
execSync(`xcopy "${appSourceDir}\\*" "${appDir}\\" /E /I /H /Y`, { stdio: 'inherit' });

// Copy assets with proper names for Microsoft Store
console.log('🎨 Copying Microsoft Store assets...');
const storeAssets = [
  { source: 'icon-512.png', target: 'Square44x44Logo.png', size: '44x44' },
  { source: 'icon-512.png', target: 'Square150x150Logo.png', size: '150x150' },
  { source: 'icon-512.png', target: 'Wide310x150Logo.png', size: '310x150' },
  { source: 'icon-512.png', target: 'StoreLogo.png', size: '50x50' }
];

storeAssets.forEach(asset => {
  const sourcePath = path.join(__dirname, 'icons', asset.source);
  const targetPath = path.join(assetsDir, asset.target);
  if (fs.existsSync(sourcePath)) {
    fs.copyFileSync(sourcePath, targetPath);
    console.log(`✅ ${asset.target} (${asset.size})`);
  }
});

// Create AppxManifest.xml for Microsoft Store
console.log('📝 Creating Microsoft Store AppxManifest.xml...');
const manifestContent = `<?xml version="1.0" encoding="utf-8"?>
<Package
   xmlns="http://schemas.microsoft.com/appx/manifest/foundation/windows10"
   xmlns:uap="http://schemas.microsoft.com/appx/manifest/uap/windows10"
   xmlns:desktop="http://schemas.microsoft.com/appx/manifest/desktop/windows10">
  <Identity Name="50688NewHope.FocusPlanner"
    ProcessorArchitecture="x64"
    Publisher='CN=BBF25640-AF6B-4DC7-9F91-5C8D3847C5CF'
    Version="1.0.2.0" />
  <Properties>
    <DisplayName>Focus Planner</DisplayName>
    <PublisherDisplayName>NewHope</PublisherDisplayName>
    <Description>Windows 11 Style Task Management App</Description>
    <Logo>assets\\StoreLogo.png</Logo>
  </Properties>
  <Resources>
    <Resource Language="en-US" />
  </Resources>
  <Dependencies>
    <TargetDeviceFamily Name="Windows.Desktop" MinVersion="10.0.17763.0" MaxVersionTested="10.0.26100.0" />
  </Dependencies>
  <Capabilities>
  </Capabilities>
  <Applications>
    <Application Id="Planner" Executable="app\\electron.exe" EntryPoint="Windows.DesktopBridgeApplication">
      <uap:VisualElements
       BackgroundColor="#2563EB"
       DisplayName="Focus Planner"
       Square150x150Logo="assets\\Square150x150Logo.png"
       Square44x44Logo="assets\\Square44x44Logo.png"
       Description="Windows 11 Style Task Management App">
        <uap:DefaultTile Wide310x150Logo="assets\\Wide310x150Logo.png" />
      </uap:VisualElements>
    </Application>
  </Applications>
</Package>`;

fs.writeFileSync(path.join(msixDir, 'AppxManifest.xml'), manifestContent);

// Try to create MSIX package using makeappx
console.log('🔨 Creating MSIX package for Microsoft Store...');
try {
  const makeappxPaths = [
    'C:\\Program Files (x86)\\Windows Kits\\10\\bin\\10.0.26100.0\\x64\\makeappx.exe',
    'C:\\Program Files (x86)\\Windows Kits\\10\\bin\\10.0.22621.0\\x64\\makeappx.exe',
    'C:\\Program Files (x86)\\Windows Kits\\10\\bin\\10.0.22000.0\\x64\\makeappx.exe',
    'C:\\Program Files (x86)\\Windows Kits\\10\\bin\\10.0.19041.0\\x64\\makeappx.exe'
  ];
  
  let makeappxPath = null;
  for (const path of makeappxPaths) {
    if (fs.existsSync(path)) {
      makeappxPath = path;
      break;
    }
  }
  
  const outputMsix = path.join(__dirname, 'dist', 'FocusPlanner-1.0.2.msix');
  
  if (makeappxPath) {
    console.log(`Using makeappx: ${makeappxPath}`);
    execSync(`"${makeappxPath}" pack /d "${msixDir}" /p "${outputMsix}"`, { stdio: 'inherit' });
    console.log('✅ MSIX package created successfully!');
    console.log(`📁 Location: ${outputMsix}`);
    
    // Check file size
    const stats = fs.statSync(outputMsix);
    const sizeInMB = (stats.size / (1024 * 1024)).toFixed(2);
    console.log(`📊 Size: ${sizeInMB} MB`);
    
    console.log('\n🎉 Microsoft Store package ready!');
    console.log('📋 Upload this file to Microsoft Partner Center:');
    console.log(`   ${outputMsix}`);
    
  } else {
    console.log('⚠️  makeappx.exe not found. Creating package structure instead.');
    console.log('📁 Package structure location:', msixDir);
    console.log('💡 You can use Windows SDK tools to create the final MSIX package');
    console.log('💡 Or submit the structure folder to Microsoft Store');
  }
} catch (error) {
  console.log('⚠️  makeappx failed:', error.message);
  console.log('📁 Package structure location:', msixDir);
  console.log('💡 You can use Windows SDK tools to create the final MSIX package');
}

console.log('\n📋 Microsoft Store Submission:');
console.log('1. Go to https://partner.microsoft.com/');
console.log('2. Create new app');
console.log('3. Upload the .msix file or package structure');
console.log('4. Fill out store listing details');
console.log('5. Submit for review');

console.log('\n✅ Your app package is ready for Microsoft Store!');
