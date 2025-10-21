const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('📦 Creating standalone installer for Focus Planner...\n');

// Create installer directory
const installerDir = path.join(__dirname, 'dist', 'standalone-installer');
const appDir = path.join(installerDir, 'app');

console.log('🧹 Cleaning previous installer...');
if (fs.existsSync(installerDir)) {
  execSync(`rmdir /s /q "${installerDir}"`, { stdio: 'pipe' });
}

fs.mkdirSync(installerDir, { recursive: true });
fs.mkdirSync(appDir, { recursive: true });

console.log('📦 Copying application files...');
const sourceDir = path.join(__dirname, 'dist', 'win-unpacked');
if (!fs.existsSync(sourceDir)) {
  console.log('❌ Source directory not found:', sourceDir);
  process.exit(1);
}

// Copy all files from win-unpacked
execSync(`xcopy "${sourceDir}\\*" "${appDir}\\" /E /I /H /Y`, { stdio: 'inherit' });

console.log('🎨 Copying icons...');
const iconsDir = path.join(installerDir, 'icons');
fs.mkdirSync(iconsDir, { recursive: true });
execSync(`xcopy "icons\\*" "${iconsDir}\\" /Y`, { stdio: 'inherit' });

console.log('📝 Creating installer script...');
const installerScript = `@echo off
echo Installing Focus Planner...
echo.

REM Create desktop shortcut
set "desktop=%USERPROFILE%\\Desktop"
set "appPath=%~dp0app\\Focus Planner.exe"
set "shortcutPath=%desktop%\\Focus Planner.lnk"

REM Create Start Menu shortcut
set "startMenu=%APPDATA%\\Microsoft\\Windows\\Start Menu\\Programs"
set "startMenuShortcut=%startMenu%\\Focus Planner.lnk"

echo Creating shortcuts...
powershell -Command "$WshShell = New-Object -comObject WScript.Shell; $Shortcut = $WshShell.CreateShortcut('%shortcutPath%'); $Shortcut.TargetPath = '%appPath%'; $Shortcut.WorkingDirectory = '%~dp0app'; $Shortcut.IconLocation = '%~dp0icons\\icon-512.png'; $Shortcut.Save()"

powershell -Command "$WshShell = New-Object -comObject WScript.Shell; $Shortcut = $WshShell.CreateShortcut('%startMenuShortcut%'); $Shortcut.TargetPath = '%appPath%'; $Shortcut.WorkingDirectory = '%~dp0app'; $Shortcut.IconLocation = '%~dp0icons\\icon-512.png'; $Shortcut.Save()"

echo.
echo ✅ Focus Planner installed successfully!
echo 📁 App location: %appPath%
echo 🖥️  Desktop shortcut created
echo 📋 Start Menu shortcut created
echo.
echo Click the desktop shortcut to launch Focus Planner
pause
`;

fs.writeFileSync(path.join(installerDir, 'install.bat'), installerScript);

console.log('📝 Creating uninstaller script...');
const uninstallerScript = `@echo off
echo Uninstalling Focus Planner...
echo.

REM Remove shortcuts
set "desktop=%USERPROFILE%\\Desktop"
set "startMenu=%APPDATA%\\Microsoft\\Windows\\Start Menu\\Programs"

if exist "%desktop%\\Focus Planner.lnk" del "%desktop%\\Focus Planner.lnk"
if exist "%startMenu%\\Focus Planner.lnk" del "%startMenu%\\Focus Planner.lnk"

echo.
echo ✅ Focus Planner uninstalled successfully!
echo 📁 App files remain in: %~dp0app
echo 💡 To completely remove, delete the entire Focus Planner folder
pause
`;

fs.writeFileSync(path.join(installerDir, 'uninstall.bat'), uninstallerScript);

console.log('📝 Creating README...');
const readmeContent = `# Focus Planner - Standalone Installer

## Installation
1. Run \`install.bat\` as Administrator
2. Desktop and Start Menu shortcuts will be created
3. Launch from desktop shortcut or Start Menu

## Features
- ✅ 7-day free trial
- ✅ $499/month subscription after trial
- ✅ Unlimited projects/boards
- ✅ Advanced reminders and recurring tasks
- ✅ Custom themes and layouts
- ✅ Priority export (PDF/Excel)

## Uninstallation
1. Run \`uninstall.bat\` to remove shortcuts
2. Delete the entire folder to completely remove

## Troubleshooting
- If the app doesn't start, try running as Administrator
- Make sure Windows Defender doesn't block the executable
- Check that all files are present in the \`app\` folder

## Support
For issues or questions, contact support.
`;

fs.writeFileSync(path.join(installerDir, 'README.txt'), readmeContent);

console.log('✅ Standalone installer created successfully!');
console.log(`📁 Location: ${installerDir}`);
console.log('\n📋 Installation Instructions:');
console.log('1. Copy the entire "standalone-installer" folder to target computer');
console.log('2. Run "install.bat" as Administrator');
console.log('3. Desktop and Start Menu shortcuts will be created');
console.log('4. Launch Focus Planner from shortcuts');

console.log('\n🎉 Standalone installer ready for distribution!');

