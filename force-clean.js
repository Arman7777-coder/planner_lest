const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🧹 Force cleaning Windows 11 Planner build files...\n');

// Function to forcefully delete directory
function deleteFolderRecursive(folderPath) {
  if (fs.existsSync(folderPath)) {
    console.log(`Deleting ${folderPath}...`);
    try {
      // Try normal deletion first
      fs.rmSync(folderPath, { recursive: true, force: true });
      console.log('✅ Deleted successfully');
    } catch (error) {
      console.log('⚠️  Normal deletion failed, trying alternative methods...');

      // Try using Windows commands
      try {
        if (process.platform === 'win32') {
          execSync(`rd /s /q "${folderPath}"`, { stdio: 'inherit' });
          console.log('✅ Deleted with Windows command');
        }
      } catch (winError) {
        console.log('⚠️  Windows command failed, trying PowerShell...');

        try {
          execSync(`powershell -Command "Remove-Item -Path '${folderPath}' -Recurse -Force"`, { stdio: 'inherit' });
          console.log('✅ Deleted with PowerShell');
        } catch (psError) {
          console.log('❌ All deletion methods failed');
          console.log('Please manually delete the dist folder and try again');
          process.exit(1);
        }
      }
    }
  } else {
    console.log('📁 Dist folder not found, nothing to clean');
  }
}

// Clean dist folder
const distPath = path.join(__dirname, 'dist');
deleteFolderRecursive(distPath);

// Clean app-temp folder
const tempPath = path.join(__dirname, 'app-temp');
deleteFolderRecursive(tempPath);

// Clean electron-builder cache
console.log('\n🧽 Clearing electron-builder cache...');
try {
  execSync('npx electron-builder cache clean', { stdio: 'inherit' });
  console.log('✅ Cache cleared');
} catch (error) {
  console.log('⚠️  Cache cleanup failed, continuing...');
}

// Clean node_modules/.cache if it exists
const cachePath = path.join(__dirname, 'node_modules', '.cache');
deleteFolderRecursive(cachePath);

console.log('\n🎉 Cleanup complete! Now try building:');
console.log('npm run build-msix-script');