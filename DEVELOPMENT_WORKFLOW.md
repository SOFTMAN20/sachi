# Development Workflow for Sachi App

## 🎯 Two Development Modes

### 1. Development Mode (Expo Go) - FASTEST ⚡

**Use this when:**
- Making code changes
- Testing features quickly
- Iterating on UI/UX
- Fixing bugs

**How it works:**
1. Start dev server on PC
2. Connect phone via Expo Go app
3. Make changes in code
4. **App automatically updates on phone!** ✨

**Setup:**
```bash
# 1. Start development server
npx expo start

# You'll see output like:
# ┌─────────────────────────────────┐
# │                                 │
# │   Metro waiting on exp://...    │
# │                                 │
# │   [QR CODE HERE]                │
# │                                 │
# │   › Press s │ switch to Expo Go │
# │   › Press a │ open Android      │
# │   › Press w │ open web          │
# │                                 │
# └─────────────────────────────────┘
```

**On your phone:**
1. Install **Expo Go** from Google Play Store
2. Open Expo Go
3. Scan the QR code from terminal
4. App loads with your code!

**Make changes:**
1. Edit any file (e.g., `src/app/property/[id].tsx`)
2. Save the file (`Ctrl+S`)
3. App automatically reloads on phone in ~2 seconds! 🎉

**Benefits:**
- ✅ Changes appear in 2 seconds
- ✅ No rebuilding
- ✅ No reinstalling
- ✅ Can see errors in real-time
- ✅ Can test on multiple devices simultaneously

### 2. Production Mode (APK Build) - SLOW 🐌

**Use this when:**
- Creating release builds
- Testing final version before publishing
- Sharing with testers who don't have Expo Go
- Testing app behavior outside development

**How it works:**
1. Make all changes
2. Commit to git
3. Build APK on EAS (15-20 min)
4. Download and install APK

**Build process:**
```bash
# 1. Make all your changes
# 2. Test with Expo Go first!
# 3. When ready, commit
git add .
git commit -m "description of changes"
git push

# 4. Build APK
eas build --platform android --profile preview

# 5. Wait 15-20 minutes...
# 6. Download APK when ready
eas build:download --build-id <BUILD_ID>

# 7. Install on phone
adb.exe install -r path/to/new.apk
```

**Drawbacks:**
- ❌ 15-20 minutes per build
- ❌ Must reinstall every time
- ❌ Can't see changes instantly
- ❌ Wastes time during development

## 🔄 Complete Development Cycle

### Day-to-Day Development:

```bash
# Morning: Start dev server
npx expo start

# Open Expo Go on phone and scan QR code
# App loads

# Throughout the day:
# 1. Make changes in code
# 2. Save file
# 3. See changes on phone in 2 seconds
# 4. Repeat!

# No building, no installing, just code! ✨
```

### Before Release:

```bash
# 1. Test everything with Expo Go
# 2. When ready for release build:
git add .
git commit -m "Ready for v1.0"
git push

# 3. Build production APK
eas build --platform android --profile preview

# 4. Test the APK on real device
# 5. If good, deploy to Play Store
eas submit --platform android
```

## 📱 Expo Go vs APK Comparison

| Feature | Expo Go | APK Build |
|---------|---------|-----------|
| **Update Speed** | 2 seconds ⚡ | 15-20 minutes 🐌 |
| **Installation** | Once | Every build |
| **Code Changes** | Instant | Must rebuild |
| **Testing** | Real-time | After build |
| **Debugging** | Easy | Harder |
| **Best For** | Development | Production |

## 🚀 Quick Start Guide

### First Time Setup:

```bash
# 1. Install Expo Go on phone
# - Open Google Play Store
# - Search "Expo Go"
# - Install

# 2. Start dev server on PC
cd ~/Downloads/project
npx expo start

# 3. Connect phone to same WiFi as PC

# 4. Scan QR code with Expo Go

# 5. Done! Start coding!
```

### Daily Workflow:

```bash
# Morning
npx expo start
# Scan QR code with Expo Go

# Develop
# Edit files → Save → See changes in 2s → Repeat

# Evening
# Ctrl+C to stop server
```

### When to Build APK:

```bash
# Only build APK when:
# 1. Ready to share with non-developers
# 2. Testing release version
# 3. Preparing for Play Store submission
# 4. Need to test without dev server

# Not needed for daily development! ✨
```

## 🔧 Development Server Commands

```bash
# Start server
npx expo start

# Start with cache clear
npx expo start -c

# Start with tunnel (access from anywhere)
npx expo start --tunnel

# Start and open on Android automatically
npx expo start --android

# View logs
# Logs appear in terminal automatically
```

## 📝 Example Development Session

```bash
# 9:00 AM - Start work
$ npx expo start
✔ Metro waiting on exp://192.168.1.100:8081
│ Scan QR code with Expo Go

# Open Expo Go, scan QR → App loads

# 9:15 AM - Fix property details button
# Edit: src/app/property/[id].tsx
# Save → See changes on phone in 2s ✅

# 9:30 AM - Update colors
# Edit: constants/Colors.ts
# Save → See changes on phone in 2s ✅

# 10:00 AM - Test on multiple devices
# Scan QR on second phone → Both show changes ✅

# 12:00 PM - Lunch break
# Leave server running or Ctrl+C to stop

# 1:00 PM - Continue coding
# npx expo start (if stopped)
# Scan QR again

# 5:00 PM - Done for the day
# Ctrl+C to stop server

# No builds needed all day! 🎉
```

## ⚠️ Important Notes

### When Expo Go Works:
- ✅ Most features (camera, location, etc.)
- ✅ All UI changes
- ✅ Business logic changes
- ✅ Navigation changes
- ✅ 99% of development

### When You MUST Build APK:
- ❌ Custom native code (rare)
- ❌ App clips or widgets (iOS)
- ❌ Custom notifications (sometimes)
- ❌ Publishing to store

### The Rule:
**"Develop with Expo Go, Build for Release"**

## 🎯 Summary

**DON'T DO THIS:** ❌
```bash
# Make change → Build APK (20 min) → Install → Test → Repeat
# This wastes HOURS every day!
```

**DO THIS INSTEAD:** ✅
```bash
# Start Expo Go → Make changes → See instantly → Repeat all day
# Build APK only when ready for release!
```

## 🚀 Get Started Now

```bash
# Ready to develop fast?
npx expo start

# Then scan QR code with Expo Go
# Start coding and see changes instantly! ⚡
```

---

**Questions?**
- Expo Go not connecting? Check WiFi (same network)
- QR code not working? Press 's' to switch to Expo Go mode
- Errors? Check terminal output for details

**Remember:** Use Expo Go for development, build APK only for releases!
