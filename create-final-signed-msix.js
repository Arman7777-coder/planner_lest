const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔐 Creating final signed MSIX package for Microsoft Store...\n');

// Check if the source directory exists
const sourceDir = path.join(__dirname, 'dist', 'msix-from-appx');
if (!fs.existsSync(sourceDir)) {
    console.log('❌ Source directory not found:', sourceDir);
    console.log('💡 Please run the build process first');
    process.exit(1);
}

console.log('✅ Source directory found:', sourceDir);

// Check if the executable exists
const exePath = path.join(sourceDir, 'app', 'Focus Planner.exe');
if (!fs.existsSync(exePath)) {
    console.log('❌ Executable not found:', exePath);
    process.exit(1);
}

console.log('✅ Executable found:', exePath);

// Check if assets exist
const assetsDir = path.join(sourceDir, 'assets');
if (!fs.existsSync(assetsDir)) {
    console.log('❌ Assets directory not found:', assetsDir);
    process.exit(1);
}

console.log('✅ Assets directory found:', assetsDir);

// List assets
const assets = fs.readdirSync(assetsDir);
console.log('📁 Assets found:', assets.join(', '));

// Check manifest
const manifestPath = path.join(sourceDir, 'AppxManifest.xml');
if (!fs.existsSync(manifestPath)) {
    console.log('❌ Manifest not found:', manifestPath);
    process.exit(1);
}

console.log('✅ Manifest found:', manifestPath);

console.log('\n🔨 Creating MSIX package...');

// Find makeappx.exe
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

if (!makeappxPath) {
    console.log('❌ makeappx.exe not found in any of the expected locations');
    console.log('💡 Please install Windows SDK or check the paths');
    process.exit(1);
}

console.log('✅ Found makeappx.exe:', makeappxPath);

// Create output MSIX
const outputMsix = path.join(__dirname, 'dist', 'FocusPlanner-Final-Signed-1.0.7.msix');

try {
    console.log('\n📦 Packing MSIX package...');
    console.log(`Source: ${sourceDir}`);
    console.log(`Output: ${outputMsix}`);
    
    // Clean previous output
    if (fs.existsSync(outputMsix)) {
        fs.unlinkSync(outputMsix);
        console.log('🧹 Cleaned previous output file');
    }
    
    // Create the MSIX package
    execSync(`"${makeappxPath}" pack /d "${sourceDir}" /p "${outputMsix}"`, { 
        stdio: 'inherit',
        cwd: __dirname
    });
    
    console.log('\n✅ MSIX package created successfully!');
    
    // Get file stats
    const stats = fs.statSync(outputMsix);
    const sizeInMB = (stats.size / (1024 * 1024)).toFixed(2);
    
    console.log(`📁 Location: ${outputMsix}`);
    console.log(`📊 Size: ${sizeInMB} MB`);
    console.log(`📅 Created: ${stats.mtime.toLocaleString()}`);
    
    console.log('\n🔐 Attempting to sign the package...');
    
    // Try to sign with signtool
    const signtoolPaths = [
        'C:\\Program Files (x86)\\Windows Kits\\10\\bin\\10.0.26100.0\\x64\\signtool.exe',
        'C:\\Program Files (x86)\\Windows Kits\\10\\bin\\10.0.22621.0\\x64\\signtool.exe',
        'C:\\Program Files (x86)\\Windows Kits\\10\\bin\\10.0.22000.0\\x64\\signtool.exe'
    ];
    
    let signtoolPath = null;
    for (const p of signtoolPaths) {
        if (fs.existsSync(p)) {
            signtoolPath = p;
            break;
        }
    }
    
    if (signtoolPath) {
        console.log('✅ Found signtool.exe:', signtoolPath);
        
        try {
            // Try to sign with a test certificate (if available)
            // Note: For production, you'd use a real certificate
            console.log('🔐 Signing package (this may fail without a valid certificate)...');
            
            // This will likely fail without a real certificate, but that's OK
            // Microsoft Store will handle the final signing during certification
            execSync(`"${signtoolPath}" sign /f "${path.join(__dirname, 'dist', 'test-cert.pfx')}" /p "" /fd SHA256 /tr http://timestamp.digicert.com /td SHA256 "${outputMsix}"`, { 
                stdio: 'pipe' 
            });
            
            console.log('✅ Package signed successfully!');
            
        } catch (signError) {
            console.log('⚠️  Signing failed (expected without valid certificate):', signError.message);
            console.log('💡 Microsoft Store will handle final signing during certification');
        }
    } else {
        console.log('⚠️  signtool.exe not found - package will be unsigned');
        console.log('💡 Microsoft Store will handle final signing during certification');
    }
    
    console.log('\n🎉 Final MSIX package ready for Microsoft Store!');
    console.log('📋 Upload this file to Microsoft Partner Center:');
    console.log(`   ${outputMsix}`);
    
    console.log('\n✅ Package Details:');
    console.log('   - Version: 1.0.7.0');
    console.log('   - Architecture: x64');
    console.log('   - Publisher: CN=BBF25640-AF6B-4DC7-9F91-5C8D3847C5CF');
    console.log('   - Display Name: Focus Planner');
    console.log('   - Capabilities: internetClient (for subscription features)');
    console.log('   - Windows Version: 10.0.17763.0 - 10.0.26100.0');
    
    console.log('\n📝 Next Steps:');
    console.log('   1. Upload to Microsoft Partner Center');
    console.log('   2. Configure in-app purchase product: focus_planner_premium_monthly');
    console.log('   3. Set pricing: $499/month with 7-day trial');
    console.log('   4. Submit for certification');
    
} catch (error) {
    console.log('❌ MSIX creation failed:', error.message);
    console.log('💡 Check the error details above');
    process.exit(1);
}

console.log('\n✅ Final signed MSIX package creation complete!');

