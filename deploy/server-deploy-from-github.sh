#!/usr/bin/env bash
set -Eeuo pipefail

APP_DIR="/var/www/etsy-fee-calculator"
REPO_URL="git@github.com:YOUR_USER/YOUR_REPO.git"
BRANCH="main"
RELEASE_ID="$(date +%Y%m%d%H%M%S)"
SOURCE_DIR="$APP_DIR/sources/$RELEASE_ID"
RELEASE_DIR="$APP_DIR/releases/$RELEASE_ID"

mkdir -p "$APP_DIR/sources" "$APP_DIR/releases"

git clone --depth=1 --branch "$BRANCH" "$REPO_URL" "$SOURCE_DIR"

if [ ! -f "$SOURCE_DIR/deploy-release.tar.gz" ]; then
  echo "deploy-release.tar.gz not found. Run npm run deploy:local locally, commit deploy-release.tar.gz, and push first." >&2
  exit 1
fi

mkdir -p "$RELEASE_DIR"
tar -xzf "$SOURCE_DIR/deploy-release.tar.gz" -C "$RELEASE_DIR"

if [ ! -f "$RELEASE_DIR/server.js" ]; then
  echo "server.js not found after extracting deploy-release.tar.gz." >&2
  exit 1
fi

node "$SOURCE_DIR/scripts/validate-deploy-release.cjs" "$RELEASE_DIR"

ln -sfn "$RELEASE_DIR" "$APP_DIR/current.new"
mv -Tf "$APP_DIR/current.new" "$APP_DIR/current"

pm2 startOrReload "$APP_DIR/ecosystem.config.cjs" --update-env
pm2 save

echo "Deploy success: $RELEASE_ID"
