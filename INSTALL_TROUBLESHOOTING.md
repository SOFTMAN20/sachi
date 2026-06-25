# Can't Install App - Troubleshooting Guide

## What Error Are You Seeing?

### Error 1: "App Not Installed"
**Cause:** Installation blocked or corrupted APK
**Solutions:**
1. Enable "Install from Unknown Sources"
2. Uninstall any previous version
3. Clear download cache
4. Re-download the APK

### Error 2: "Installation Blocked"
**Cause:** Security settings blocking installation
**Solutions:**
1. Go to Settings → Security
2. Enable "Unknown Sources" or "Install Unknown Apps"
3. Allow installation from your browser (Chrome/Firefox)

### Error 3: "Parse Error" or "There was a problem parsing the package"
**Cause:** Incomplete download or incompatible Android version
**Solutions:**
1. Re-download the APK completely
2. Check Android version (need Android 5.0+)
3. Make sure download completed fully

### Error 4: "For security, your phone is not allowed to install unknown apps from this source"
**Cause:** Need to enable permission for specific app
**Solutions:**
1. When you see this message, tap "Settings"
2. Enable "Allow from this source"
3. Go back and try installing again

## Step-by-Step Installation Guide

### Step 1: Enable Unknown Sources

**For Android 8.0 and above:**
1. Open **Settings**
2. Go to **Apps & notifications** (or just **Apps**)
3. Tap **Advanced** (if available)
4. Tap **Special app access**
5. Tap **Install unknown apps**
6. Select your **browser** (Chrome, Firefox, etc.)
7. Enable **Allow from this source**

**For Android 7.0 and below:**
1. Open **Settings**
2. Go to **Security**
3. Enable **Unknown Sources**
4. Confirm "OK"

### Step 2: Download APK

**Option A: Direct Download**
1. Open this link on your Android phone:
   ```
   https://expo.dev/artifacts/eas/TcwM3plqlU-22SPg0o3NBLxrdce1QxTSd6N4L-efhDs.apk
   ```
2. Wait for download to complete (check notification bar)
3. Note: File size should be around 50-80 MB

**Option B: Download on PC, Transfer to Phone**
1. Download on your PC from the link above
2. Connect phone via USB
3. Copy APK file to phone's Download folder
4. Disconnect phone

### Step 3: Install APK

1. **Find the APK file:**
   - Open **Files** or **Downloads** app
   - Look in **Downloads** folder
   - Find file named something like: `TcwM3plqlU-22SPg0o3NBLxrdce1QxTSd6N4L-efhDs.apk`

2. **Tap the APK file**
   - If prompted, allow installation
   - Tap "Install"

3. **Wait for installation**
   - Should take 10-30 seconds
   - Don't interrupt

4. **Open the app**
   - Tap "Open" when installation completes
   - Or find "Sachi" in app drawer

## Alternative: Use Expo Go (Easier!)

Instead of installing APK, you can use Expo Go:

### Step 1: Install Expo Go
1. Open **Google Play Store**
2. Search for **"Expo Go"**
3. Install the app (official Expo app)

### Step 2: Login
1. Open **Expo Go**
2. Tap **Profile** (bottom right)
3. Tap **Log in**
4. Use these credentials:
   - Username: `softman20`
   - Password: [your Expo password]

### Step 3: Load Your App
1. After logging in, go to **Home**
2. Scan the QR code from your terminal
   OR
3. Visit: https://expo.dev/accounts/softman20/projects/sachi/builds/a3eac050-2c2d-473e-81e8-71f9cbc04f98
4. Tap "Open in Expo Go"

## Still Can't Install?

### Check These:

**1. Android Version**
- You need Android 5.0 (Lollipop) or higher
- Check: Settings → About Phone → Android Version

**2. Storage Space**
- Need at least 100 MB free space
- Check: Settings → Storage

**3. Download Complete**
- APK should be 50-80 MB
- If smaller, download was incomplete
- Re-download

**4. Corrupted Download**
- Try different browser (Chrome, Firefox)
- Try downloading on PC then transfer

**5. Phone Restrictions**
- Some phones (Xiaomi, Huawei) have extra security
- Check: Settings → Apps → Special Permissions
- Enable installation for your browser

## Build a New APK (If Still Failing)

If the APK is corrupted, build a fresh one:

```bash
# On your PC terminal
cd C:\Users\alexm\Downloads\project
eas build --platform android --profile development
```

Wait for build to complete, then use the new download link.

## Use Preview Build Instead

Try a preview build (more compatible):

```bash
eas build --platform android --profile preview
```

## Get More Help

**Tell me:**
1. What exact error message do you see?
2. What Android version are you on?
3. What happens when you tap the APK?
4. Does download complete successfully?
5. Can you see the file in Downloads?

**Or try:**
- Use Expo Go app (easier)
- Ask someone else to try installing
- Try on a different Android device
