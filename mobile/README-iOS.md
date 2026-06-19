# Querious on iPhone / iPad (Capacitor)

This wraps the **same offline web app** into a native iOS app. The web core,
config, and bundled runtimes are ready here — you finish the build in Xcode
(which can't be done from a headless environment, so these are the exact steps).

## One-time setup on your Mac
1. Install **Xcode** (free, Mac App Store). Open it once to finish installation.
2. Install **CocoaPods**: `brew install cocoapods` (or `sudo gem install cocoapods`).
3. Node **18+** (you're on 20 — fine). Capacitor is pinned to v6 to match.

## Build & run
From this `mobile/` folder:

```bash
npm install            # if you haven't already
npm run copyweb        # refresh www/ from the offline desktop build (../desktop/app)
npx cap add ios        # generates the native Xcode project (runs pod install)
npx cap sync ios       # copies the web assets + plugins into the iOS project
npx cap open ios       # opens it in Xcode
```

In Xcode:
4. Select the **App** target → **Signing & Capabilities** → set **Team** to your
   Apple ID (a free personal team is enough to run on your *own* device).
5. Pick your iPhone (or a Simulator) as the run target and press **▶ Run**.
   - First run on a real device: on the iPhone, **Settings → General → VPN &
     Device Management** → trust your developer certificate.

## Updating later
After changing the web app: `npm run copyweb && npx cap sync ios`, then Run again.

## Notes / honest caveats
- The app **bundles everything for offline use** (SQL + Python + pandas), so the
  iOS app is ~50 MB of web assets plus the native shell.
- **SQL** runs great on iPhone. **Python / pandas (Pyodide)** is heavy on iOS — it
  *loads*, but can be slow and memory-hungry on older devices. Test it on your
  phone; if it's too much, we can make the iOS build SQL-only or load Python on
  demand.
- Running on **your own device** is free with an Apple ID. **App Store**
  distribution needs a paid Apple Developer account ($99/yr).
- Android works too: `npm i @capacitor/android && npx cap add android` (needs
  Android Studio).
