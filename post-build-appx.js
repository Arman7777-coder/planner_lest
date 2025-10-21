const fs = require('fs');
const path = require('path');

console.log('🔧 Post-processing APPX build with custom assets...');

// Function to copy file
function copyFile(src, dest) {
  try {
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, dest);
      return true;
    }
    return false;
  } catch (error) {
    console.log(`❌ Failed to copy ${src}: ${error.message}`);
    return false;
  }
}

// Function to ensure directory exists
function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

// Source icons directory
const iconDir = path.join(__dirname, 'icons');

// APPX build directories
const appxDirs = [
  path.join(__dirname, 'dist', 'pre-appx', 'assets'),
  path.join(__dirname, 'dist', '__appx-x64', 'assets')
];

// Asset mappings
const assetMappings = [
  {
    source: 'icon-512.png',
    targets: [
      'Square44x44Logo.png',
      'Square150x150Logo.png', 
      'Wide310x150Logo.png',
      'StoreLogo.png'
    ]
  }
];

// Process each APPX directory
appxDirs.forEach(appxDir => {
  if (fs.existsSync(appxDir)) {
    console.log(`📁 Processing: ${appxDir}`);
    
    // Ensure directory exists
    ensureDir(appxDir);
    
    // Copy assets
    assetMappings.forEach(mapping => {
      const sourcePath = path.join(iconDir, mapping.source);
      
      mapping.targets.forEach(target => {
        const targetPath = path.join(appxDir, target);
        if (copyFile(sourcePath, targetPath)) {
          console.log(`✅ ${target}`);
        } else {
          console.log(`⚠️  ${target} - source not found`);
        }
      });
    });
  }
});

// Also copy to any other potential APPX directories
const distDir = path.join(__dirname, 'dist');
if (fs.existsSync(distDir)) {
  const subdirs = fs.readdirSync(distDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);
    
  subdirs.forEach(subdir => {
    if (subdir.includes('appx') || subdir.includes('__appx')) {
      const assetsDir = path.join(distDir, subdir, 'assets');
      if (fs.existsSync(assetsDir)) {
        console.log(`📁 Processing: ${assetsDir}`);
        ensureDir(assetsDir);
        
        assetMappings.forEach(mapping => {
          const sourcePath = path.join(iconDir, mapping.source);
          
          mapping.targets.forEach(target => {
            const targetPath = path.join(assetsDir, target);
            copyFile(sourcePath, targetPath);
          });
        });
      }
    }
  });
}

console.log('✅ Post-build APPX asset processing completed!');
console.log('🎨 Your custom icons are now properly included in the APPX package.');




