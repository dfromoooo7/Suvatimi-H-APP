param(
    [string]$tag = '' ,
    [string]$title = '' ,
    [string]$notes = ''
)

Write-Host "Electron publish helper" -ForegroundColor Cyan
Write-Host "Generating icons and building..." -ForegroundColor Green
npm run generate-icons
npm run electron:build

if (-not (Get-Command gh -ErrorAction SilentlyContinue)) {
    Write-Host "The GitHub CLI (gh) is not installed. Install it to enable automatic release uploading, or upload artifacts manually." -ForegroundColor Yellow
    exit 0
}

if (-not $tag) {
    Write-Host "No tag provided. To create a GitHub Release use: gh release create <tag> dist/* -t 'title' -n 'notes'" -ForegroundColor Yellow
    exit 0
}

if ($tag) {
    Write-Host "Creating GitHub release $tag and uploading dist/*" -ForegroundColor Green
    gh release create $tag dist/* -t ($title -or $tag) -n ($notes -or "Release $tag")
    Write-Host "Done. Check the GitHub Release page for attached artifacts." -ForegroundColor Cyan
}