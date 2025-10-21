# APPX Build Troubleshooting Guide

## Common Issues and Solutions

### 1. "Can't convert EXE to APPX with icons"

**Problem**: Your APPX package is missing custom icons or using generic sample assets.

**Solution**: 
```bash
npm run create-assets
npm run build-appx
```

### 2. Build Fails with Permission Errors

**Problem**: `Access is denied` or file permission errors.

**Solutions**:
1. Run PowerShell as Administrator
2. Enable Windows Developer Mode:
   - Settings → Update & Security → For developers → Developer Mode: ON
3. Clear electron-builder cache:
   ```bash
   npx electron-builder cache clean
   ```

### 3. Missing APPX Assets

**Problem**: APPX package has generic "SampleAppx" icons instead of your custom ones.

**Solution**: 
```bash
# Create proper APPX assets
npm run create-assets

# Rebuild with assets
npm run build-appx
```

### 4. Electron-Builder Fails

**Problem**: electron-builder crashes or fails to build.

**Solutions**:
1. Force clean and rebuild:
   ```bash
   npm run force-clean
   npm run build-appx
   ```

2. Alternative: Use electron-packager first:
   ```bash
   npx electron-packager . "Windows 11 Planner" --platform=win32 --arch=x64 --out=dist
   ```

### 5. APPX Installation Issues

**Problem**: Can't install the generated APPX file.

**Solutions**:
1. Enable Developer Mode (see above)
2. Install via PowerShell:
   ```powershell
   Add-AppxPackage -Path "dist\Windows 11 Planner 1.0.1.appx"
   ```

### 6. Icon Quality Issues

**Problem**: Icons appear blurry or incorrectly sized.

**Solution**: 
1. Create properly sized icons (44x44, 150x150, 310x150, 50x50)
2. Place them in the `icons/` directory
3. Run: `npm run create-assets`

## Build Commands

| Command | Purpose |
|---------|---------|
| `npm run build-appx` | Complete APPX build with icons |
| `npm run create-assets` | Generate APPX assets from icons |
| `npm run build-msix` | Standard electron-builder APPX |
| `npm run force-clean` | Clean build artifacts |
| `npm run fix-build` | Auto-fix common build issues |

## File Structure After Build

```
dist/
├── Windows 11 Planner 1.0.1.appx  ← Your final APPX package
├── pre-appx/
│   ├── assets/                     ← APPX icons
│   │   ├── Square44x44Logo.png
│   │   ├── Square150x150Logo.png
│   │   ├── Wide310x150Logo.png
│   │   └── StoreLogo.png
│   └── AppXManifest.xml
└── __appx-x64/
    ├── assets/                     ← Duplicate assets
    └── AppxManifest.xml
```

## Microsoft Store Submission

1. Test your APPX locally first
2. Go to [Partner Center](https://partner.microsoft.com/)
3. Create new app submission
4. Upload your `.appx` file
5. Fill out store listing details
6. Submit for certification

## Still Having Issues?

1. Check Windows version (Windows 10/11 required)
2. Ensure you have Node.js and npm installed
3. Try building on a clean Windows machine
4. Check the build logs for specific error messages




