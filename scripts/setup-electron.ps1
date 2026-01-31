Write-Host "Installing dependencies and opening Electron (dev)" -ForegroundColor Cyan
npm install
Write-Host "Run 'npm run electron:dev' to start the app in development mode." -ForegroundColor Green
Write-Host "To build: generate icons then run 'npm run electron:build'" -ForegroundColor Green