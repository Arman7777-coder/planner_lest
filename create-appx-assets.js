const fs = require('fs');
const path = require('path');

console.log('🎨 Creating APPX assets from your icons...');

// Source icon directory
const iconDir = path.join(__dirname, 'icons');
const assetDir = path.join(__dirname, 'dist', 'pre-appx', 'assets');

// Ensure asset directory exists
if (!fs.existsSync(assetDir)) {
  fs.mkdirSync(assetDir, { recursive: true });
}

// Required APPX asset sizes and their source icons
const assetMappings = [
  {
    target: 'Square44x44Logo.png',
    source: 'icon-512.png', // Use largest available
    size: '44x44'
  },
  {
    target: 'Square150x150Logo.png',
    source: 'icon-512.png',
    size: '150x150'
  },
  {
    target: 'Wide310x150Logo.png',
    source: 'icon-512.png',
    size: '310x150'
  },
  {
    target: 'StoreLogo.png',
    source: 'icon-512.png',
    size: '50x50'
  }
];

// Copy and rename icons for APPX
assetMappings.forEach(asset => {
  const sourcePath = path.join(iconDir, asset.source);
  const targetPath = path.join(assetDir, asset.target);
  
  if (fs.existsSync(sourcePath)) {
    try {
      fs.copyFileSync(sourcePath, targetPath);
      console.log(`✅ Created ${asset.target} (${asset.size})`);
    } catch (error) {
      console.log(`❌ Failed to create ${asset.target}: ${error.message}`);
    }
  } else {
    console.log(`⚠️  Source icon not found: ${asset.source}`);
  }
});

// Also create the __appx-x64 assets directory and copy there
const appxAssetDir = path.join(__dirname, 'dist', '__appx-x64', 'assets');
if (!fs.existsSync(appxAssetDir)) {
  fs.mkdirSync(appxAssetDir, { recursive: true });
}

assetMappings.forEach(asset => {
  const sourcePath = path.join(iconDir, asset.source);
  const targetPath = path.join(appxAssetDir, asset.target);
  
  if (fs.existsSync(sourcePath)) {
    try {
      fs.copyFileSync(sourcePath, targetPath);
      console.log(`✅ Created __appx-x64/assets/${asset.target}`);
    } catch (error) {
      console.log(`❌ Failed to create __appx-x64/${asset.target}: ${error.message}`);
    }
  }
});

console.log('\n🎉 APPX assets created successfully!');
console.log('📁 Assets location: dist/pre-appx/assets/');
console.log('📁 Assets location: dist/__appx-x64/assets/');
console.log('\n💡 Note: For best quality, you may want to manually resize these icons');
console.log('   to the exact dimensions using an image editor.');




