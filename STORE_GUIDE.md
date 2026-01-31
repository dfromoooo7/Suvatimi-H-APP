# Publishing Guide — SUVATIMI-H

This guide collects step-by-step instructions for publishing the app across PWA, Android, iOS, and Desktop app stores.

---

## 1) PWA (host + optional store packaging)

Recommended hosts: Vercel, Netlify, GitHub Pages (with HTTPS) or any host with HTTPS.

Checklist:
- Host site on HTTPS. (GitHub Pages / Vercel make this easy.)
- Ensure `manifest.json` is correct and icons (PNG 192 & 512) exist in `images/`.
- Service Worker (`sw.js`) registered and offline page works.
- Run Lighthouse PWA audit (`npm run pwa:audit`) and fix issues until score is acceptable.

Optional:
- Use PWABuilder (https://www.pwabuilder.com) to create platform packages or submit to Microsoft Store.

---

## 2) Android (Capacitor or TWA)

Capacitor (recommended when you need native APIs):
1. `npm install`
2. `npx cap add android` (only required once)
3. `npx cap copy`
4. `npx cap open android` (opens Android Studio)
5. In Android Studio, configure release signing (create a keystore if you don't have one):
   ```
   keytool -genkey -v -keystore my-keystore.jks -alias myalias -keyalg RSA -keysize 2048 -validity 10000
   ```
6. Build a signed AAB (`Build > Generate Signed Bundle/APK`) and upload to Google Play Console.

Trusted alternative (PWA -> Play): use TWA / Bubblewrap to publish a Trusted Web Activity.
- Use `npx @bubblewrap/cli init` and `npx @bubblewrap/cli build` (requires `twa-config.json`).

See `scripts/publish-android.ps1` for a helper script template for building a release bundle (you still sign in Android Studio or configure Gradle signing). 

---

## 3) iOS (Capacitor)

1. `npx cap add ios`
2. `npx cap copy`
3. `npx cap open ios` (opens Xcode)
4. In Xcode: set the bundle identifier, provisioning profile, and signing identity (Apple Developer account required).
5. Archive and upload to App Store Connect.

Notes:
- Apple requires a privacy policy, contact info, icons, and screenshots.

---

## 4) Desktop (Electron)

Local build steps:
1. `npm install`
2. `npm run generate-icons` (or `npm install && npm run generate-icons` runs automatically postinstall)
3. `npm run electron:dev` (for testing)
4. `npm run electron:build` (creates installer/binaries under `dist/`)

Release:
- Publish artifacts to a GitHub Release (we have a workflow that tries to attach `dist/**` on release publish).
- For store publishing:
  - Windows: code-sign (certificate), create installer (NSIS/MSIX), optionally publish in Microsoft Store using Partner Center.
  - macOS: sign and notarize with Apple Developer ID; optionally publish to Mac App Store.

See `scripts/publish-electron.ps1` for helper steps to make a GitHub release using `gh` CLI.

---

## 5) App Store listing assets & metadata
Prepare:
- App name, short description, long description
- High-resolution icons and required sizes
- Screenshots (phone/tablet/desktop where applicable)
- Privacy policy URL (`/privacy-policy.html` is included)
- Support contact email and website
- Category, pricing, and regional availability

---

## 6) Security & signing
- Keep keystore and signing keys secret. Use environment secrets in CI (e.g., `KEYSTORE_PASSWORD`, `KEY_ALIAS`, `GH_TOKEN`).
- Avoid committing keys; instead store them in a secure vault or GitHub Secrets for CI.

---

## Helper scripts
- `scripts/setup-capacitor.ps1` — helps init/add platforms.
- `scripts/publish-android.ps1` — helps run Gradle build for Android release (requires Android SDK & Gradle).
- `scripts/publish-electron.ps1` — helps build Electron and publish to GitHub using the `gh` CLI.

---

If you want, I can:
- Prepare a TWA/Bubblewrap config and CI job to create & sign an Android release automatically (you still need to provide a signing key and secrets). ✅
- Add a more complete Play Store / App Store metadata directory to be used with Fastlane/Play Console APIs. ✅
- Add a sample `fastlane` setup for iOS/Android (requires you to run and configure secrets). ✅

Tell me which of these automation tasks you want me to add next. If you want me to do them all, say `do all` and I'll scaffold everything (docs, config, and CI hooks) — you will still need to run native builds and provide signing secrets locally or in GitHub Actions.