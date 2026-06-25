# How to Download Your Sachi App APK

## The Issue
Your build is an **INTERNAL** distribution, which means it requires authentication to download. This is why you see the "BUILD_NOT_FOUND" error when trying to download directly.

## Solution: Download via Expo Dashboard

### Method 1: Download Through Expo Website (EASIEST)

1. **Open the build page on your phone's browser:**
   https://expo.dev/accounts/softman20/projects/sachi/builds/96e09a12-f0a9-417b-a5b4-825ed7cc23ce

2. **Login to Expo:**
   - Username: `softman20`
   - Password: [your password]

3. **Download the APK:**
   - Once logged in, you'll see a "Download" button
   - Click it to download the APK directly to your phone

4. **Install:**
   - Open the downloaded APK
   - Enable "Install from Unknown Sources" if prompted
   - Install and launch the app

### Method 2: Use EAS CLI to Download (On PC)

If you want to download on PC first:

```bash
# Make sure you're logged in
eas login

# Download the build
eas build:download --id 96e09a12-f0a9-417b-a5b4-825ed7cc23ce --output sachi-app.apk

# Transfer sachi-app.apk to your phone via USB
```

### Method 3: Install Using Expo Go (TEMPORARY TESTING)

1. **Install Expo Go** from Google Play Store
2. **Login** with username: `softman20`
3. **Run on PC:**
   ```bash
   npx expo start --tunnel
   ```
4. **Scan QR code** with Expo Go app
5. App will load in Expo Go for testing

## Why This Happened

The preview build profile was configured with `"distribution": "internal"`, which creates authenticated builds. These are useful for:
- Team testing
- Internal QA
- Controlled distribution

But they require login to download.

## Alternative: Create a Production Build

For a publicly downloadable APK (no login required):

```bash
# Create a production build
eas build --platform android --profile production
```

Production builds:
- ✅ No login required to download
- ✅ Can be shared via direct link
- ✅ Ready for Play Store submission
- ❌ Takes 15-20 minutes to build

## Current Build Information

- **Build ID**: 96e09a12-f0a9-417b-a5b4-825ed7cc23ce
- **Status**: ✅ FINISHED
- **Profile**: preview (internal)
- **Platform**: Android
- **Version**: 1.0.0
- **Expires**: July 9, 2026

## Quick Access Links

- **Build Page (requires login)**: https://expo.dev/accounts/softman20/projects/sachi/builds/96e09a12-f0a9-417b-a5b4-825ed7cc23ce
- **Project Dashboard**: https://expo.dev/accounts/softman20/projects/sachi
- **All Builds**: https://expo.dev/accounts/softman20/projects/sachi/builds

## Need Help?

If you're having trouble:
1. Make sure you can login to https://expo.dev with `softman20` account
2. Try opening the build link in an incognito/private window and login fresh
3. Check your Expo account has access to the `sachi` project
4. Contact me if you need a production build instead
