param(
    [string]$keystorePath = '',
    [string]$keystorePassword = '',
    [string]$keystoreAlias = '',
    [string]$gradleTask = 'bundleRelease'  # or 'assembleRelease'
)

Write-Host "Publish Android helper" -ForegroundColor Cyan
if (!(Test-Path "android/gradlew")) {
    Write-Host "Android project not present. Run 'npx cap add android' first." -ForegroundColor Yellow
    exit 1
}

if ($keystorePath -and $keystorePassword -and $keystoreAlias) {
    Write-Host "Configuring gradle signing properties (temporary)" -ForegroundColor Green
    $gradlePropertiesPath = "android/gradle.properties"
    $props = "RELEASE_STORE_FILE=$keystorePath`nRELEASE_STORE_PASSWORD=$keystorePassword`nRELEASE_KEY_ALIAS=$keystoreAlias`nRELEASE_KEY_PASSWORD=$keystorePassword`n"
    Add-Content -Path $gradlePropertiesPath -Value $props
    Write-Host "Running gradle $gradleTask" -ForegroundColor Cyan
    Push-Location android
    ./gradlew $gradleTask
    Pop-Location
    Write-Host "Build finished. Remove temporary signing properties if needed." -ForegroundColor Green
} else {
    Write-Host "Missing keystore info. Please provide -keystorePath, -keystorePassword and -keystoreAlias to perform an automated build, or open Android Studio and sign there." -ForegroundColor Yellow
    exit 1
}