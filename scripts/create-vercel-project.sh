#!/usr/bin/env bash
set -e

# Helper to create a Vercel project via API.
# Requires the following environment variables:
# - VERCEL_TOKEN (personal token)
# - VERCEL_PROJECT_NAME (desired name)
# - optionally: VERCEL_ORG_ID (team id)

if [ -z "$VERCEL_TOKEN" ]; then
  echo "ERROR: VERCEL_TOKEN not set"
  exit 1
fi

if [ -z "$VERCEL_PROJECT_NAME" ]; then
  echo "ERROR: VERCEL_PROJECT_NAME not set"
  exit 1
fi

API_URL="https://api.vercel.com/v9/projects"

DATA=$(jq -n --arg name "$VERCEL_PROJECT_NAME" '{name: $name, framework: "other", rootDirectory: "/"}')

if [ -n "$VERCEL_ORG_ID" ]; then
  DATA=$(jq -n --arg name "$VERCEL_PROJECT_NAME" --arg teamId "$VERCEL_ORG_ID" '{name: $name, framework: "other", rootDirectory: "/", teamId: $teamId}')
fi

echo "Creating project '$VERCEL_PROJECT_NAME'..."

RESPONSE=$(curl -s -X POST "$API_URL" \
  -H "Authorization: Bearer $VERCEL_TOKEN" \
  -H "Content-Type: application/json" \
  -d "$DATA")

echo "Response from Vercel:"
echo "$RESPONSE" | jq '.'

if echo "$RESPONSE" | jq -e '.error' >/dev/null; then
  echo "Vercel API returned an error. See response above."
  exit 1
fi

echo "Project created. If you want to set project envs, use the Vercel dashboard or the Vercel CLI."

exit 0
