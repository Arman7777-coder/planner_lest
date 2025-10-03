# Publishing to Microsoft Store

To publish the app on Microsoft Store for easy installation by users:

## Prerequisites
- Microsoft Developer Account (free or paid)
- Windows 10/11 PC for testing and submission
- App icons, screenshots, description

## Steps
1. **Build the App Package:**
   - On a Windows machine, clone the project.
   - Install Node.js.
   - Run `npm install`
   - Run `npm run build-win` (now targets appx)

2. **Test the App:**
   - Install Windows App Certification Kit.
   - Run certification tests on the .appx file.

3. **Create Developer Account:**
   - Go to https://developer.microsoft.com/en-us/microsoft-store/register/
   - Register as individual or company.

4. **Submit to Store:**
   - Use Partner Center: https://partner.microsoft.com/
   - Create new app submission.
   - Upload the .appx package.
   - Add app details: name, description, icons, screenshots.
   - Set pricing, categories, etc.
   - Submit for review.

5. **After Approval:**
   - App will be available in Microsoft Store.
   - Users can install directly from Store without commands.

## Notes
- Ensure app complies with Store policies.
- For PWAs, consider using PWABuilder for Store-ready packages.
- Icons must be added to icons/ directory before building.