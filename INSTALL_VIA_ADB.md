# Install Sachi APK via ADB

## ✅ Android SDK Setup Complete!

Your Android SDK is now configured at:
`C:\Users\alexm\AppData\Local\Android\Sdk`

## 📱 Install APK via ADB

### Step 1: Enable USB Debugging on Your Phone

1. **Open Settings** on your Android phone
2. **Go to** "About phone"
3. **Tap** "Build number" **7 times** (enables Developer options)
4. **Go back** to Settings
5. **Open** "Developer options"
6. **Enable** "USB debugging"
7. **Connect** phone to PC via USB cable

### Step 2: Verify Connection

```bash
adb.exe devices
```

**Expected output:**
```
List of devices attached
XXXXXXXXXX      device
```

If you see "unauthorized":
- Check your phone screen for a prompt
- Tap "Allow USB debugging"
- Run `adb.exe devices` again

### Step 3: Install the NEW APK

```bash
adb.exe install "C:\Users\alexm\Downloads\sachi-app-new-ui-sdk56.apk"
```

**Expected output:**
```
Performing Streamed Install
Success
```

### Step 4: Launch the App

```bash
adb.exe shell am start -n com.softman20.sachi/.MainActivity
```

Or just tap the Sachi icon on your phone!

## 🔧 Troubleshooting

### Phone not detected?

1. **Check USB cable** - try a different one
2. **Enable USB debugging** - see Step 1 above
3. **Install USB drivers**:
   - Google USB Driver: https://developer.android.com/studio/run/win-usb
4. **Try different USB port** on your PC
5. **Restart ADB server**:
   ```bash
   adb.exe kill-server
   adb.exe start-server
   adb.exe devices
   ```

### "Unauthorized" error?

- Check your phone screen
- Tap "Allow" on the USB debugging prompt
- Check "Always allow from this computer"

### "App not installed" error?

**Uninstall old version first:**
```bash
adb.exe uninstall com.softman20.sachi
```

Then install the new one:
```bash
adb.exe install "C:\Users\alexm\Downloads\sachi-app-new-ui-sdk56.apk"
```

### Install failed - INSTALL_FAILED_INSUFFICIENT_STORAGE?

Free up space on your phone (need ~200 MB)

### Install failed - INSTALL_FAILED_UPDATE_INCOMPATIBLE?

Uninstall the old version completely:
```bash
adb.exe uninstall com.softman20.sachi
```

## 📋 Useful ADB Commands

### Check connected devices:
```bash
adb.exe devices
```

### Install APK:
```bash
adb.exe install path/to/app.apk
```

### Uninstall app:
```bash
adb.exe uninstall com.softman20.sachi
```

### View logs (useful for debugging):
```bash
adb.exe logcat | grep "Sachi"
```

### Take screenshot:
```bash
adb.exe shell screencap -p /sdcard/screenshot.png
adb.exe pull /sdcard/screenshot.png .
```

### Copy APK to phone (alternative):
```bash
adb.exe push "C:\Users\alexm\Downloads\sachi-app-new-ui-sdk56.apk" /sdcard/Download/
```

Then install from phone's file manager.

## 🎯 Quick Install Summary

**If phone is connected:**
```bash
# 1. Check connection
adb.exe devices

# 2. Uninstall old version (if exists)
adb.exe uninstall com.softman20.sachi

# 3. Install new APK
adb.exe install "C:\Users\alexm\Downloads\sachi-app-new-ui-sdk56.apk"

# 4. Done! Open the app on your phone
```

## 📱 Alternative: Manual Installation

If ADB doesn't work:

1. **Copy APK to phone**:
   - Connect via USB
   - Enable "File Transfer" mode
   - Copy `sachi-app-new-ui-sdk56.apk` to Downloads folder

2. **Install from phone**:
   - Open File Manager
   - Go to Downloads
   - Tap the APK file
   - Allow "Install from Unknown Sources"
   - Install

## ✅ Environment Variables

Your `.bashrc` now has:
```bash
export ANDROID_HOME="/c/Users/alexm/AppData/Local/Android/Sdk"
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin
```

**To reload environment:**
```bash
source ~/.bashrc
```

---

**Ready to install? Connect your phone and run:**
```bash
adb.exe install "C:\Users\alexm\Downloads\sachi-app-new-ui-sdk56.apk"
```
