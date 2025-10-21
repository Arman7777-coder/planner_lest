# Microsoft Store Submission Guide

## What to Submit to Microsoft Store

You have **3 options** for Microsoft Store submission:

### Option 1: Submit the EXE File (Recommended - Easiest)
**File to submit**: `dist/Windows 11 Planner-win32-x64/Windows 11 Planner.exe`
- **Size**: ~156 MB
- **Why this option**: Microsoft will handle the packaging and signing for you
- **Custom icons**: ✅ Already included in the app

### Option 2: Submit the APPX Structure (Manual)
**File to submit**: `dist/appx-manual/` (entire folder)
- **Size**: ~156 MB
- **Why this option**: You have full control over the packaging
- **Custom icons**: ✅ Already included in assets/

### Option 3: Create Final APPX (Advanced)
**File to submit**: Create a final `.appx` file from the structure
- **Tools needed**: Windows SDK or makeappx.exe
- **Custom icons**: ✅ Already included

## Step-by-Step Submission Process

### Step 1: Go to Microsoft Partner Center
1. Visit: https://partner.microsoft.com/
2. Sign in with your Microsoft account
3. Click "Create a new app"

### Step 2: Fill Out App Information
```
App Name: Focus Planner (or your preferred name)
Category: Productivity
Description: Windows 11 Style Task Management App
Keywords: planner, task management, productivity, windows 11
Age Rating: Choose appropriate rating
```

### Step 3: Upload Your App Package

#### For EXE Submission (Recommended):
1. Click "Upload your app package"
2. Select: `dist/Windows 11 Planner-win32-x64/Windows 11 Planner.exe`
3. Microsoft will automatically:
   - Convert to APPX format
   - Handle code signing
   - Validate the package

#### For APPX Structure Submission:
1. Click "Upload your app package"
2. Select the entire `dist/appx-manual/` folder
3. Or create a ZIP file of the folder first

### Step 4: Store Listing Details
```
App Name: Focus Planner
Publisher: NewHope
Category: Productivity
Description: 
A modern Windows 11 style task management application that helps you organize and track your daily tasks with an intuitive interface.

Screenshots: Add screenshots of your app
Store Logo: Your custom icon (already included)
```

### Step 5: Pricing and Availability
- Set your app as **Free** or **Paid**
- Choose countries/regions for distribution
- Set release date

### Step 6: Certification
- Microsoft will review your app (usually 1-3 days)
- They'll check for:
  - Malware/viruses
  - Functionality
  - Store policy compliance
  - Code signing (if needed)

## Your App Details (Use These)

Based on your configuration:
```
App Name: Focus Planner
Publisher: NewHope
Publisher ID: CN=BBF25640-AF6B-4DC7-9F91-5C8D3847C5CF
Identity Name: 50688NewHope.FocusPlanner
Version: 1.0.1
Description: Windows 11 Style Task Management App
```

## Files Ready for Submission

✅ **Ready to submit**: `dist/Windows 11 Planner-win32-x64/Windows 11 Planner.exe`
✅ **Custom icons**: Already included in the app
✅ **App manifest**: Properly configured
✅ **Size**: 156 MB (acceptable for Store)

## Pre-Submission Checklist

- [ ] Test the EXE file runs properly on a clean Windows machine
- [ ] Verify custom icons display correctly
- [ ] Check app functionality (create, edit, delete tasks)
- [ ] Ensure app works without internet connection
- [ ] Test on different screen resolutions
- [ ] Verify app doesn't crash on startup

## Testing Your App

Before submitting, test your app:

```powershell
# Navigate to your app
cd "dist\Windows 11 Planner-win32-x64"

# Run the app
.\"Windows 11 Planner.exe"
```

## What Happens After Submission

1. **Automatic Processing**: Microsoft processes your EXE into APPX format
2. **Code Signing**: Microsoft signs your app with their certificate
3. **Certification**: Manual review by Microsoft team
4. **Approval**: Your app appears in Microsoft Store
5. **Updates**: You can submit updates through Partner Center

## Troubleshooting Submission Issues

If submission fails:

1. **File too large**: Contact Microsoft support (your 156MB is fine)
2. **Code signing issues**: Microsoft handles this automatically
3. **App crashes**: Test thoroughly before submission
4. **Policy violations**: Review Microsoft Store policies

## Success! 🎉

Once approved, your app will be available in the Microsoft Store with:
- ✅ Your custom icons
- ✅ Professional code signing
- ✅ Automatic updates capability
- ✅ Wide distribution reach

## Next Steps After Approval

1. **Monitor downloads** in Partner Center
2. **Respond to reviews** from users
3. **Submit updates** when you add new features
4. **Promote your app** through social media

---

**Recommended**: Start with Option 1 (EXE submission) as it's the easiest and Microsoft handles all the technical details for you!




