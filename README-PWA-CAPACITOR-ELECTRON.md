# PWA, Capacitor & Electron setup (quick)

<!-- PWA_SCORE_START -->
![PWA score](assets/pwa-badge.svg)
**PWA score:** _not yet measured_

> Hosted badge (after GitHub Pages deploy): `https://<your-username>.github.io/<your-repo>/assets/pwa-badge.svg` — replace `<your-username>` and `<your-repo>` with your account and repository name.
<!-- PWA_SCORE_END -->

## What I added ✅
- Fixed `manifest.json` (display, metadata) and added PNG icon expectations.
- Improved `sw.js` image caching and navigation fallback to `offline.html`.
- Added `package.json` scripts, `capacitor.config.json`, and an Electron `main.js` entry.

---

## Quick local test (PWA)
1. Install http-server: `npm i -g http-server` (or use the `start` script in `package.json`).
2. Serve the folder: `npm start` then open `http://localhost:8080`.
3. In Chrome DevTools → Application: check **Manifest** and **Service Workers**.
4. Run Lighthouse (PWA category) to get improvement suggestions: `npm run pwa:audit`.

## Capacitor (Android / iOS)
1. Install dependencies: `npm install`.
2. Initialize Capacitor: `npm run capacitor:init` (or `npx cap init` with `appName` and `appId`).
3. Add platforms: `npx cap add android` and/or `npx cap add ios`.
4. Build the web app (`npm run build` if you have a build step) or simply ensure files are present, then `npx cap copy` and `npx cap open android`.

Note: iOS builds require macOS and Xcode.

## Electron (desktop)
1. Install: `npm install`.
2. Dev: `npm run electron:dev` (requires `electron` installed).
3. Build: `npm run electron:build` (requires `electron-builder` and proper icon files).

## Notes & next steps
- Replace placeholder icons (`images/icon-192.png`, `images/icon-512.png`) with high-quality PNGs and add adaptive/maskable assets for Android.
- If you want push notifications, I can add the subscription UI and service worker push skeleton (requires a server / VAPID key).
- If you'd like, I can continue and:
  - Add PNG icon files and adaptive icons ✅
  - Add Capacitor automated scaffolding (run `npm install` and `npx cap init` for you) — note: I cannot run those commands here, but I can prepare all files and scripts.
  - Add more advanced SW strategies (workbox or cache versioning)

---

## Icon generation (quick)
I added the source SVG icons in `images/`. Use the following commands to generate PNG/ICO/icns files (ImageMagick / npm sharp):

- ImageMagick (recommended if available):

  magick convert images/icon-512.svg -resize 512x512 build/icon-512.png
  magick convert images/icon-192.svg -resize 192x192 build/icon-192.png
  magick convert build/icon-512.png -background none -resize 256x256 build/icon.icns
  magick convert build/icon-512.png -background none -resize 256x256 build/icon.ico

- Using npm + Node script (Sharp + png-to-ico + png2icons):

  npm i
  npm run generate-icons

This repository now includes `scripts/generate-icons.js` which:
  - renders SVG -> PNG (192, 512) using `sharp`
  - generates `build/icon.ico` using `png-to-ico`
  - generates `build/icon.icns` using `png2icons`
  - copies `images/icon-192.png` and `images/icon-512.png` into your `images/` folder for the web manifest

If you prefer ImageMagick, you can still use that instead. This project now includes a `postinstall` hook in `package.json` that runs `npm run generate-icons` so PNG icons are generated automatically when running `npm install` (failsafe `|| true` prevents CI failures if native deps are missing).

I also added a GitHub Actions workflow at `.github/workflows/pwa-lighthouse.yml` that runs on push/PR to `main`/`master`, generates icons, starts `http-server`, runs Lighthouse (PWA category) and uploads the JSON report as an artifact.

The Lighthouse workflow now includes a PWA score check and will fail the workflow if the PWA score is below a threshold (default 90%). You can trigger the workflow manually (workflow_dispatch) and pass `min_pwa_score` to override the threshold for that run.

I added a Lighthouse history workflow at `.github/workflows/lighthouse-history.yml` which runs on push/PR and stores per-commit PWA scores in a `lighthouse-history` branch under `lhci/history/<commit>.json`. This makes it possible to build a simple graph of scores across commits or PRs.
I removed the placeholder `public/CNAME` to avoid accidentally configuring a custom domain. To enable a custom domain on GitHub Pages, either:
- add a `CNAME` file to `public/` with your domain and push to the `lighthouse-history` branch so the pages deploy picks it up, or
- configure the custom domain in the repository Settings → Pages after the first successful deploy (I can set this for you if you provide the domain).
I also added an Electron release workflow at `.github/workflows/electron-release.yml` which triggers on GitHub Releases (when you publish a release). It will build the Electron artifacts on Linux/Windows/macOS, attach them to the release automatically (and upload artifacts as a backup). To publish Electron binaries to a release:

1. Create a GitHub Release (Tag + Publish)
2. This workflow will run and attach `dist/**` files to the release (if build succeeds)

If you'd like, I can also add automatic badges (PWA score) and a small UI/script to plot `lhci/history` files into a chart served on GitHub Pages. Tell me if you want that.

## Capacitor quick commands
Run these locally to finish mobile scaffolding:

1. npm install
2. npx cap init "SUVATIMI-H" com.suvatimih.app
3. npx cap add android
4. npx cap copy
5. npx cap open android

> Note: iOS requires macOS & Xcode to build.

## Electron quick commands
1. npm install
2. npm run electron:dev
3. Build the app once build icons are generated: `npm run electron:build`

## Vercel (automatic deploy)
This project includes a GitHub Action to deploy to Vercel on push to `main` or by manual dispatch (`.github/workflows/deploy-vercel.yml`). To enable automatic deploys add the following repository secrets in GitHub Settings → Secrets:

- `VERCEL_TOKEN` — your Vercel personal token (create in Vercel Account Settings → Tokens).
- `VERCEL_PROJECT_ID` — (optional but recommended) the id of your Vercel project. Use `vercel projects ls` or check in the Vercel dashboard.
- `VERCEL_ORG_ID` — (optional) your Vercel organization/team id.

Recommended Vercel project settings (already provided by `vercel.json`):
- **Framework Preset:** Other / Static
- **Build Command:** (none required) — optional: `npm run generate-icons` if you want icons generated during build
- **Output Directory:** `public` (the workflow also supports deploying root `index.html`)

This repository now includes a `vercel.json` and `.vercelignore` to pre-fill Vercel settings and exclude build artifacts. If you want to deploy with the Vercel CLI locally:

1. Install Vercel CLI: `npm i -g vercel`
2. Link the project (first time): `vercel link` and follow prompts
3. Deploy to production: `vercel --prod`

After adding the `VERCEL_TOKEN` secret, pushes to `main` will run the deploy workflow and publish the site to Vercel (using `--prod`). You can also trigger the workflow manually in Actions → Deploy to Vercel.

New convenience scripts:
- `npm run vercel:link` — link this repo to a Vercel project interactively (useful first-time setup)
- `npm run vercel:preview` — deploy a preview using Vercel CLI
- `npm run vercel:deploy` — deploy to production using Vercel CLI (`npx vercel --prod`)
- `npm run vercel:setup-project` — create a Vercel project via API (requires `VERCEL_TOKEN` and `VERCEL_PROJECT_NAME` environment variables; `jq` is required on runner)

This repository includes helper scripts to manage secrets and create a Vercel project:

- `scripts/secrets.env.example` — example file format for secrets (DO NOT commit real secrets).
- `scripts/add-secrets.sh` — Bash script to bulk-add secrets via `gh secret set`. Usage: `./scripts/add-secrets.sh path/to/secrets.env [--repo owner/repo]` (make executable with `chmod +x`).
- `scripts/add-secrets.ps1` — PowerShell equivalent: `.\	ools\add-secrets.ps1 -File secrets.env -Repo owner/repo`.
- `scripts/create-vercel-project.sh` — helper to create a Vercel project via API (requires `VERCEL_TOKEN` & `VERCEL_PROJECT_NAME`).

Security notes:
- Do not commit real secrets. Add `secrets.env` to `.gitignore` (already added) and remove the file after use.
- The scripts assume you have `gh` CLI installed and authenticated (`gh auth login`).

If you want, I can also:
- Add a GitHub Action that calls `scripts/create-vercel-project.sh` automatically using `VERCEL_TOKEN` and `VERCEL_PROJECT_NAME` secrets (I can scaffold this but it requires the token in secrets), or
- Add an npm `postinstall` hook that runs `vercel:link` interactively when developers run `npm install` (not recommended for CI).

Tell me which you prefer (or say 'done').