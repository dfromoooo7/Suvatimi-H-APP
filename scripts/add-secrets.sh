#!/usr/bin/env bash
set -euo pipefail

# Usage: ./scripts/add-secrets.sh path/to/secrets.env [--repo owner/repo]
# secrets.env format:
# NAME=VALUE
# NAME=@/path/to/file   (will read file contents)
# NAME=@b64:/path/to/file (will base64-encode file contents)

if ! command -v gh >/dev/null 2>&1; then
  echo "Error: gh CLI not found. Install from https://cli.github.com/"
  exit 1
fi

if [ $# -lt 1 ]; then
  echo "Usage: $0 path/to/secrets.env [--repo owner/repo]"
  exit 1
fi

SECRETS_FILE="$1"
REPO_ARG=""
if [ "${2:-}" = "--repo" ] && [ -n "${3:-}" ]; then
  REPO_ARG="--repo $3"
fi

if [ ! -f "$SECRETS_FILE" ]; then
  echo "Secrets file not found: $SECRETS_FILE"
  exit 1
fi

while IFS= read -r line || [ -n "$line" ]; do
  line="${line%%$'\r'}" # strip CRLF
  # skip comments/empty
  [[ "$line" =~ ^[[:space:]]*$ || "$line" =~ ^# ]] && continue
  name="${line%%=*}"
  value="${line#*=}"
  if [[ "$value" == @b64:* ]]; then
    filepath="${value#@b64:}"
    if [[ ! -f "$filepath" ]]; then echo "File not found: $filepath"; exit 1; fi
    body="$(base64 -w0 "$filepath")"
  elif [[ "$value" == @* ]]; then
    filepath="${value#@}"
    if [[ ! -f "$filepath" ]]; then echo "File not found: $filepath"; exit 1; fi
    body="$(cat "$filepath")"
  else
    body="$value"
  fi

  echo "Setting secret: $name"
  printf "%s" "$body" | gh secret set "$name" $REPO_ARG --body - || { echo "Failed to set $name"; exit 1; }
done < "$SECRETS_FILE"

echo "All secrets set. Remove $SECRETS_FILE when done and keep secrets safe."