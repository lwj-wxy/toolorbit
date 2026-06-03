#!/usr/bin/env bash
set -Eeuo pipefail

APP_DIR="/var/www/etsy-fee-calculator"
REPO_URL="git@github.com:YOUR_USER/YOUR_REPO.git"
BRANCH="main"
RELEASE_ID="$(date +%Y%m%d%H%M%S)"
SOURCE_DIR="$APP_DIR/sources/$RELEASE_ID"
RELEASE_DIR="$APP_DIR/releases/$RELEASE_ID"
DEPLOY_RETAIN_RELEASES="${DEPLOY_RETAIN_RELEASES:-3}"
DEPLOY_RETAIN_SOURCES="${DEPLOY_RETAIN_SOURCES:-3}"

cleanup_old_dirs() {
  local target_dir="$1"
  local keep_count="$2"
  local label="$3"

  if [ ! -d "$target_dir" ]; then
    return
  fi

  if ! [[ "$keep_count" =~ ^[0-9]+$ ]]; then
    echo "Refusing to clean $label because keep count is not numeric: $keep_count" >&2
    return
  fi

  if [ "$keep_count" -lt 1 ]; then
    echo "Refusing to clean $label because keep count is less than 1: $keep_count" >&2
    return
  fi

  mapfile -t entries < <(find "$target_dir" -mindepth 1 -maxdepth 1 -type d -printf '%f\n' | sort -r)

  if [ "${#entries[@]}" -le "$keep_count" ]; then
    echo "No old $label to clean. Kept ${#entries[@]} item(s)."
    return
  fi

  for ((index = keep_count; index < ${#entries[@]}; index++)); do
    local old_dir="$target_dir/${entries[$index]}"

    case "$old_dir" in
      "$APP_DIR"/releases/*|"$APP_DIR"/sources/*)
        echo "Removing old $label: $old_dir"
        rm -rf -- "$old_dir"
        ;;
      *)
        echo "Refusing to remove unexpected path: $old_dir" >&2
        ;;
    esac
  done
}

mkdir -p "$APP_DIR/sources" "$APP_DIR/releases"

git clone --depth=1 --branch "$BRANCH" "$REPO_URL" "$SOURCE_DIR"

if [ ! -f "$SOURCE_DIR/deploy-release.tar.gz" ]; then
  echo "deploy-release.tar.gz not found. Run npm run deploy:local locally, commit deploy-release.tar.gz, and push first." >&2
  exit 1
fi

mkdir -p "$RELEASE_DIR"
tar -xzf "$SOURCE_DIR/deploy-release.tar.gz" -C "$RELEASE_DIR"
mkdir -p "$RELEASE_DIR/public"

for PUBLIC_ASSET_DIR in images featured-tools; do
  if [ ! -d "$SOURCE_DIR/public/$PUBLIC_ASSET_DIR" ]; then
    echo "Missing public asset directory: $SOURCE_DIR/public/$PUBLIC_ASSET_DIR" >&2
    exit 1
  fi

  cp -a "$SOURCE_DIR/public/$PUBLIC_ASSET_DIR" "$RELEASE_DIR/public/"
done

if [ ! -d "$RELEASE_DIR/.next/server" ] || [ ! -d "$RELEASE_DIR/.next/static" ]; then
  echo ".next server/static output not found after extracting deploy-release.tar.gz." >&2
  exit 1
fi

node "$SOURCE_DIR/scripts/validate-deploy-release.cjs" "$RELEASE_DIR"

cp "$SOURCE_DIR/deploy/ecosystem.config.cjs" "$APP_DIR/ecosystem.config.cjs"

ln -sfn "$RELEASE_DIR" "$APP_DIR/current.new"
mv -Tf "$APP_DIR/current.new" "$APP_DIR/current"

pm2 startOrReload "$APP_DIR/ecosystem.config.cjs" --update-env
pm2 save

cleanup_old_dirs "$APP_DIR/releases" "$DEPLOY_RETAIN_RELEASES" "release"
cleanup_old_dirs "$APP_DIR/sources" "$DEPLOY_RETAIN_SOURCES" "source"

echo "Deploy success: $RELEASE_ID"
