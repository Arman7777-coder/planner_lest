# Building the Windows 11 App for Microsoft Store

The app is a PWA wrapped in Electron for Windows Store submission.

## Prerequisites
- Node.js installed
- npm

## Steps
1. Install dependencies: `npm install`
2. Build for Windows: `npm run build-win`
3. The built app will be in `dist/` directory.

For Microsoft Store submission, you can use the generated MSI or convert to MSIX.

Alternatively, use PWABuilder (https://www.pwabuilder.com/) to package the PWA directly for Windows Store.

Upload the PWA URL (http://localhost:8080) to PWABuilder, generate Windows package, and submit to Store.