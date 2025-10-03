# Microsoft Store Submission Guide

## Prerequisites
- ✅ Microsoft Developer Account ($19 one-time fee)
- ✅ App built and tested locally

## Current Status
Your app is now configured for Microsoft Store submission with:
- MSIX packaging configuration
- Proper app identity and publisher info
- Security enhancements for Store compliance

## Next Steps

### 1. Add Required Icons
You need icon files in the `icons/` directory with these sizes:
- 16x16.png
- 24x24.png
- 32x32.png
- 48x48.png
- 64x64.png
- 128x128.png
- 256x256.png
- 512x512.png (main icon)

**Tools to create icons:**
- Use online icon generators
- Export from design tools like Figma/Photoshop
- Use ImageMagick: `convert source.png -resize 512x512 icons/icon-512.png`

### 2. Build APPX Package (Windows Only)
**Important**: APPX/MSIX packaging can only be done on Windows 10/11.

If you're on Windows:
```bash
# Try the automated fix first (recommended)
npm run fix-build

# Or try the original method
npm run build-msix-script
```
This will create a `.appx` file in the `dist/` folder.

If you're on Linux/macOS, transfer your project to a Windows machine and run the build command there.

### Troubleshooting Build Issues
If you get symbolic link errors:
1. **Run as Administrator**: Right-click Command Prompt → Run as Administrator
2. **Clear cache**: `npx electron-builder cache clean`
3. **Enable Developer Mode**: Settings → Update & Security → For developers → Developer Mode: ON
4. **Use fix script**: `npm run fix-build` (tries alternative methods)

### 3. Test the Package Locally
Install the MSIX file on your Windows machine to ensure it works correctly.

### 4. Create Store Listing in Partner Center

#### App Identity
- **App name**: Windows 11 Planner
- **Package family name**: Will be auto-generated

#### Store Listing
- **Description**: A modern task management app with Windows 11 design
- **Screenshots**: At least 4 screenshots showing different views
- **App icon**: 300x300 PNG
- **Promotional images**: Optional
- **App features**: List key features
- **Additional info**: Support contact, privacy policy URL

#### Properties
- **Category**: Productivity
- **Age rating**: 3+ (General)
- **System requirements**: Windows 10 version 1903 or higher

### 5. Pricing and Distribution
- **Price**: Free or set a price
- **Markets**: Select target markets
- **Visibility**: Public or private

### 6. Submit for Certification
- Upload your MSIX package
- Fill out all required information
- Submit for Microsoft certification
- Wait 1-3 days for approval

## Troubleshooting

### Common Issues
1. **Missing icons**: Ensure all required icon sizes are present
2. **Publisher certificate**: The build script handles this automatically
3. **App identity conflicts**: Change the `applicationId` in package.json if needed

### Testing Your MSIX
```bash
# Install MSIX (requires admin privileges)
Add-AppxPackage -Path "dist\YourApp.msix"

# Uninstall if needed
Get-AppxPackage *Windows11Planner* | Remove-AppxPackage
```

## Resources
- [Microsoft Store Documentation](https://docs.microsoft.com/en-us/windows/uwp/publish/)
- [MSIX Packaging Guide](https://docs.microsoft.com/en-us/windows/msix/)
- [Partner Center Help](https://support.microsoft.com/en-us/topic/windows-developer-program-6f9f2f8e-4b2a-4c6e-8f9e-4b2a4c6e8f9e)

## Support
If you encounter issues, check the Electron Builder documentation or Microsoft Developer forums.