const fs = require('fs');
const path = require('path');

console.log('🎨 Copying correct icons to MSIX package...\n');

const sourceIcon = path.join(__dirname, 'icons', 'icon-512.png');
const assetsDir = path.join(__dirname, 'dist', 'msix-from-appx', 'assets');

const iconMappings = [
  { source: 'icon-512.png', target: 'StoreLogo.png' },
  { source: 'icon-512.png', target: 'Square150x150Logo.png' },
  { source: 'icon-512.png', target: 'Square44x44Logo.png' },
  { source: 'icon-512.png', target: 'Wide310x150Logo.png' }
];

iconMappings.forEach(mapping => {
  const sourcePath = path.join(__dirname, 'icons', mapping.source);
  const targetPath = path.join(assetsDir, mapping.target);
  
  if (fs.existsSync(sourcePath)) {
    fs.copyFileSync(sourcePath, targetPath);
    console.log(`✅ Copied ${mapping.source} → ${mapping.target}`);
  } else {
    console.log(`❌ Source not found: ${mapping.source}`);
  }
});

console.log('\n🎉 Icons copied successfully!');
console.log('📋 Now repack the MSIX with correct icons...');

