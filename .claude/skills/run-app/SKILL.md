---
name: run-app
description: Launch and verify the Sachi Expo app (SDK 54) — start the Metro dev server, connect Expo Go, and confirm the bundle compiles. Use when asked to run, start, preview, or smoke-test the app.
---

# Run the Sachi app (Expo SDK 54)

Sachi is an **Expo / React Native** app (SDK 54, Expo Router, root at `src/app`).
The primary target is **native via Expo Go**; web is the fallback.

## 1. Start the dev server

The `npm run dev` script uses a bash-style env prefix that does **not** work in
PowerShell on Windows. Set the env var the PowerShell way and call the CLI directly:

```powershell
$env:EXPO_NO_TELEMETRY = "1"; npx expo start
```

- Add `-c` to clear the Metro cache (do this after dependency/SDK changes).
- Metro serves on **port 8081**. Wait for the line `Waiting on http://localhost:8081`.
- Prefer the **preview tool** (`mcp__Claude_Preview__preview_start` with the
  `Expo (Metro) — native` config in `.claude/launch.json`) over a raw shell when
  available. Metro needs port 8081 specifically, so that config sets `autoPort: false`.

If port 8081 is already held, free it first:

```powershell
Get-NetTCPConnection -LocalPort 8081 -State Listen -ErrorAction SilentlyContinue |
  ForEach-Object { Stop-Process -Id $_.OwningProcess -Force }
```

## 2. Connect a phone (Expo Go)

1. Install/update **Expo Go** — it must support **SDK 54** (an outdated Expo Go
   throws "this version of Expo Go is incompatible"; update it from the store).
2. Phone and PC on the **same Wi-Fi**.
3. In Expo Go, enter the LAN URL: `exp://<LAN-IP>:8081`. Find the IP with:

```powershell
(Get-NetIPAddress -AddressFamily IPv4 |
  Where-Object { $_.IPAddress -notlike "127.*" -and $_.IPAddress -notlike "169.*" -and $_.PrefixOrigin -ne "WellKnown" } |
  Select-Object -First 1).IPAddress
```

If LAN connection fails (network isolation), restart with `npx expo start --tunnel`.

## 3. Verify it actually runs (don't just launch it)

Booting Metro only proves the server started. Confirm the **app bundles** by
requesting the real Expo Router entry bundle — a 200 with a multi-MB body means
the whole app compiled:

```powershell
$m = Invoke-WebRequest -Uri "http://localhost:8081/" -Headers @{ "expo-platform"="android"; "Accept"="application/expo+json,application/json" } -UseBasicParsing
$u = ([System.Text.Encoding]::UTF8.GetString($m.Content) | ConvertFrom-Json).launchAsset.url
$r = Invoke-WebRequest -Uri $u -UseBasicParsing -TimeoutSec 300
"BUNDLE: status=$($r.StatusCode) bytes=$($r.RawContentLength)"
```

Note: the bundle path is `node_modules/expo-router/entry.bundle?...` (NOT
`/index.bundle` — `main` is `expo-router/entry`, so requesting `./index` 404s).

## 4. Other run modes
- **Web fallback:** `npx expo start --web` (also via the `Expo Web` launch config).
- **Backend:** the app's live data depends on Supabase — see the `supabase-local` skill.

## SDK version note
This project was deliberately pinned to **SDK 54** for Expo Go compatibility
(SDK 56 caused "incompatible Expo Go" on installed clients). If you change the SDK,
run `npx expo install --fix` to realign React, React Native, and every `expo-*`
package, then re-run the bundle check above.
