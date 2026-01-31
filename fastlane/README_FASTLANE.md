Fastlane notes

- To upload to Google Play automatically, create a Google Service Account with access to your Play Console and download the JSON credentials. Add it to your CI as a secret `GOOGLE_PLAY_JSON` or commit it to `fastlane/google-play.json` (not recommended).

- Example usage locally:
  GOOGLE_PLAY_JSON_PATH=fastlane/google-play.json fastlane android upload_play

- For iOS distribution, consider using `match` for code signing and `upload_to_testflight` or `deliver` for App Store upload. Store credentials and certificates in secure CI secrets.

Secrets you may provide to CI:
- GOOGLE_PLAY_JSON (base64 or file contents)
- MATCH_PASSWORD (if using match)
- FASTLANE_APPLE_APPLICATION_SPECIFIC_PASSWORD (for some uploads)

Note: Fastlane setup and publishing often require manual steps (first-time provisioning in Xcode and Play Console).