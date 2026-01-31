param([string]$File = "secrets.env", [string]$Repo = "")

if (-not (Get-Command gh -ErrorAction SilentlyContinue)) {
  Write-Error "gh CLI not found. Install: https://cli.github.com/"
  exit 1
}
if (-not (Test-Path $File)) {
  Write-Error "Secrets file not found: $File"
  exit 1
}

Get-Content $File | ForEach-Object {
  $line = $_.Trim()
  if (-not $line -or $line.StartsWith('#')) { return }
  $parts = $line -split '=', 2
  $name = $parts[0].Trim()
  $value = $parts[1].Trim()

  if ($value -like '@b64:*') {
    $path = $value.Substring(5)
    if (-not (Test-Path $path)) { Write-Error "File not found: $path"; exit 1 }
    $bytes = [IO.File]::ReadAllBytes($path)
    $body = [Convert]::ToBase64String($bytes)
  } elseif ($value.StartsWith('@')) {
    $path = $value.Substring(1)
    if (-not (Test-Path $path)) { Write-Error "File not found: $path"; exit 1 }
    $body = Get-Content -Raw -Path $path
  } else {
    $body = $value
  }

  Write-Host "Setting secret: $name"
  if ($Repo -ne "") {
    gh secret set $name --repo $Repo --body $body
  } else {
    gh secret set $name --body $body
  }
}
Write-Host "All secrets set. Remove the secrets file when done."