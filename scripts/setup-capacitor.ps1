param(
    [string]$platform = 'android'  # 'android' or 'ios' or 'both'
)

Write-Host "Running Capacitor setup (platform: $platform)" -ForegroundColor Cyan

# Ensure npm deps
npm install

# Init Capacitor (non-interactive)
npx cap init "SUVATIMI-H" com.suvatimih.app --web-dir=.

if ($platform -in @('android','both')) {
    Write-Host "Adding Android platform..." -ForegroundColor Green
    npx cap add android
}

if ($platform -in @('ios','both')) {
    Write-Host "Adding iOS platform (macOS required)..." -ForegroundColor Green
    npx cap add ios
}

Write-Host "Copying web assets to native projects..." -ForegroundColor Green
npx cap copy

Write-Host "Done. Use 'npx cap open android' or 'npx cap open ios' to open native IDEs." -ForegroundColor Cyan