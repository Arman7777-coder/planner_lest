const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔧 Creating APPX package manually from existing executable...\n');

// Check if we have the executable
const exePath = path.join(__dirname, 'dist', 'Windows 11 Planner-win32-x64', 'Windows 11 Planner.exe');
if (!fs.existsSync(exePath)) {
  console.log('❌ Executable not found. Please run npm run build-appx-no-sign first.');
  process.exit(1);
}

console.log('✅ Found executable:', exePath);

// Create APPX structure
const appxDir = path.join(__dirname, 'dist', 'appx-manual');
const appDir = path.join(appxDir, 'app');
const assetsDir = path.join(appxDir, 'assets');

console.log('📁 Creating APPX directory structure...');

// Clean and create directories
if (fs.existsSync(appxDir)) {
  execSync(`rmdir /s /q "${appxDir}"`, { stdio: 'pipe' });
}
fs.mkdirSync(appxDir, { recursive: true });
fs.mkdirSync(appDir, { recursive: true });
fs.mkdirSync(assetsDir, { recursive: true });

// Copy executable and dependencies
console.log('📦 Copying application files...');
execSync(`xcopy "dist\\Windows 11 Planner-win32-x64\\*" "${appDir}\\" /E /I /H /Y`, { stdio: 'inherit' });

// Copy assets
console.log('🎨 Copying assets...');
const iconFiles = [
  'Square44x44Logo.png',
  'Square150x150Logo.png', 
  'Wide310x150Logo.png',
  'StoreLogo.png'
];

iconFiles.forEach(iconFile => {
  const sourcePath = path.join(__dirname, 'icons', 'icon-512.png');
  const targetPath = path.join(assetsDir, iconFile);
  if (fs.existsSync(sourcePath)) {
    fs.copyFileSync(sourcePath, targetPath);
    console.log(`✅ ${iconFile}`);
  }
});

// Create AppXManifest.xml
console.log('📝 Creating AppXManifest.xml...');
const manifestContent = `<?xml version="1.0" encoding="utf-8"?>
<Package
   xmlns="http://schemas.microsoft.com/appx/manifest/foundation/windows10"
   xmlns:uap="http://schemas.microsoft.com/appx/manifest/uap/windows10"
   xmlns:desktop="http://schemas.microsoft.com/appx/manifest/desktop/windows10"
   xmlns:rescap="http://schemas.microsoft.com/appx/manifest/foundation/windows10/restrictedcapabilities">
  <Identity Name="50688NewHope.FocusPlanner"
    ProcessorArchitecture="x64"
    Publisher='CN=BBF25640-AF6B-4DC7-9F91-5C8D3847C5CF'
    Version="1.0.1.0" />
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
    <TargetDeviceFamily Name="Windows.Desktop" MinVersion="10.0.14316.0" MaxVersionTested="10.0.14316.0" />
  </Dependencies>
  <Capabilities>
    <rescap:Capability Name="runFullTrust"/>
  </Capabilities>
  <Applications>
    <Application Id="Planner" Executable="app\\Windows 11 Planner.exe" EntryPoint="Windows.FullTrustApplication">
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

fs.writeFileSync(path.join(appxDir, 'AppXManifest.xml'), manifestContent);

// Try to create APPX using makeappx
console.log('🔨 Creating APPX package...');
try {
  const makeappxPath = 'C:\\Program Files (x86)\\Windows Kits\\10\\bin\\10.0.19041.0\\x64\\makeappx.exe';
  const outputAppx = path.join(__dirname, 'dist', 'FocusPlanner-Manual.appx');
  
  if (fs.existsSync(makeappxPath)) {
    execSync(`"${makeappxPath}" pack /d "${appxDir}" /p "${outputAppx}"`, { stdio: 'inherit' });
    console.log('✅ APPX created successfully!');
    console.log(`📁 Location: ${outputAppx}`);
  } else {
    console.log('⚠️  makeappx.exe not found. Creating portable package instead.');
    console.log('📁 Portable package location:', appxDir);
    console.log('💡 You can manually create APPX using Windows SDK tools or submit the exe to Microsoft Store');
  }
} catch (error) {
  console.log('⚠️  makeappx failed:', error.message);
  console.log('📁 Portable package location:', appxDir);
  console.log('💡 You can manually create APPX using Windows SDK tools or submit the exe to Microsoft Store');
}

console.log('\n🎉 Manual APPX creation completed!');
console.log('\n📋 Your app is ready in multiple formats:');
console.log('1. Portable EXE: dist/Windows 11 Planner-win32-x64/Windows 11 Planner.exe');
console.log('2. APPX Structure: dist/appx-manual/ (ready for manual APPX creation)');
console.log('3. Custom icons included in all formats');

console.log('\n💡 Next steps:');
console.log('- Test the portable exe');
console.log('- Submit to Microsoft Store via Partner Center');
console.log('- Or use Windows SDK to create final APPX from the structure');




