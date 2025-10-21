const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🏪 Creating Microsoft Store-ready MSIX package...\n');

// Clean previous attempts
const distDir = path.join(__dirname, 'dist');
const msixDir = path.join(distDir, 'msix-store-ready');
const appDir = path.join(msixDir, 'app');
const assetsDir = path.join(msixDir, 'assets');

console.log('🧹 Cleaning previous builds...');
if (fs.existsSync(msixDir)) {
  execSync(`rmdir /s /q "${msixDir}"`, { stdio: 'pipe' });
}

// Create directory structure
fs.mkdirSync(msixDir, { recursive: true });
fs.mkdirSync(appDir, { recursive: true });
fs.mkdirSync(assetsDir, { recursive: true });

console.log('📦 Copying application files...');
const sourceDir = path.join(distDir, 'win-unpacked');
if (!fs.existsSync(sourceDir)) {
  console.log('❌ Source directory not found:', sourceDir);
  process.exit(1);
}

// Copy all files from win-unpacked
execSync(`xcopy "${sourceDir}\\*" "${appDir}\\" /E /I /H /Y`, { stdio: 'inherit' });

console.log('🎨 Copying Microsoft Store assets...');
const storeAssets = [
  { source: 'icon-512.png', target: 'Square44x44Logo.png' },
  { source: 'icon-512.png', target: 'Square150x150Logo.png' },
  { source: 'icon-512.png', target: 'Wide310x150Logo.png' },
  { source: 'icon-512.png', target: 'StoreLogo.png' }
];

storeAssets.forEach(asset => {
  const sourcePath = path.join(__dirname, 'icons', asset.source);
  const targetPath = path.join(assetsDir, asset.target);
  if (fs.existsSync(sourcePath)) {
    fs.copyFileSync(sourcePath, targetPath);
    console.log(`✅ ${asset.target}`);
  } else {
    console.log(`⚠️  Missing: ${asset.source}`);
  }
});

console.log('📝 Creating Store-compatible AppxManifest.xml...');
const manifestContent = `<?xml version="1.0" encoding="utf-8"?>
<Package
   xmlns="http://schemas.microsoft.com/appx/manifest/foundation/windows10"
   xmlns:uap="http://schemas.microsoft.com/appx/manifest/uap/windows10"
   xmlns:desktop="http://schemas.microsoft.com/appx/manifest/desktop/windows10">
  <Identity Name="50688NewHope.FocusPlanner"
    ProcessorArchitecture="x64"
    Publisher='CN=BBF25640-AF6B-4DC7-9F91-5C8D3847C5CF'
    Version="1.0.5.0" />
  <Properties>
    <DisplayName>Focus Planner</DisplayName>
    <PublisherDisplayName>NewHope</PublisherDisplayName>
    <Description>Windows 11 Style Task Management App with Premium Features</Description>
    <Logo>assets\\StoreLogo.png</Logo>
  </Properties>
  <Resources>
    <Resource Language="en-US" />
  </Resources>
  <Dependencies>
    <TargetDeviceFamily Name="Windows.Desktop" MinVersion="10.0.17763.0" MaxVersionTested="10.0.26100.0" />
  </Dependencies>
  <Capabilities>
    <Capability Name="internetClient" />
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

console.log('🔨 Creating MSIX package...');
try {
  const makeappxPaths = [
    'C:\\Program Files (x86)\\Windows Kits\\10\\bin\\10.0.26100.0\\x64\\makeappx.exe',
    'C:\\Program Files (x86)\\Windows Kits\\10\\bin\\10.0.22621.0\\x64\\makeappx.exe',
    'C:\\Program Files (x86)\\Windows Kits\\10\\bin\\10.0.22000.0\\x64\\makeappx.exe',
    'C:\\Program Files (x86)\\Windows Kits\\10\\bin\\10.0.19041.0\\x64\\makeappx.exe'
  ];
  
  let makeappxPath = null;
  for (const p of makeappxPaths) {
    if (fs.existsSync(p)) {
      makeappxPath = p;
      break;
    }
  }
  
  const outputMsix = path.join(distDir, 'FocusPlanner-Store-Ready-1.0.5.msix');
  
  if (makeappxPath) {
    console.log(`Using makeappx: ${makeappxPath}`);
    execSync(`"${makeappxPath}" pack /d "${msixDir}" /p "${outputMsix}"`, { stdio: 'inherit' });
    console.log('✅ MSIX package created successfully!');
    console.log(`📁 Location: ${outputMsix}`);
    
    const stats = fs.statSync(outputMsix);
    const sizeInMB = (stats.size / (1024 * 1024)).toFixed(2);
    console.log(`📊 Size: ${sizeInMB} MB`);
    
    console.log('\n🎉 Microsoft Store-ready package created!');
    console.log('📋 Upload this file to Microsoft Partner Center:');
    console.log(`   ${outputMsix}`);
    console.log('\n✅ No restricted capabilities - should pass Store validation!');
    
  } else {
    console.log('⚠️  makeappx.exe not found. Creating package structure instead.');
    console.log('📁 Package structure location:', msixDir);
  }
} catch (error) {
  console.log('❌ makeappx failed:', error.message);
  console.log('📁 Package structure location:', msixDir);
}

console.log('\n✅ Store-ready MSIX package creation complete!');

