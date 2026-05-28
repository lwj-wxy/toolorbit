# Local Build Deployment

This project is configured for local builds and server-only release switching.

## Local release workflow

Run locally:

```bash
npm run deploy:local
git add next.config.ts package.json .gitignore scripts/prepare-deploy-output.cjs deploy docs/local-build-deploy.md deploy-release.tar.gz
git commit -m "Build deploy output"
git push origin main
```

`npm run deploy:local` runs the production build, prepares `deploy-output/`, then archives it as `deploy-release.tar.gz`.

`deploy-output/` is local generated output and should not be committed directly. The archive contains:

- `.next/standalone`
- `.next/static`
- `public`

The server should not run `npm ci` or `npm run build` during deployment.

## First-time server setup

On the server:

```bash
mkdir -p /var/www/etsy-fee-calculator
cd /var/www/etsy-fee-calculator
```

Copy `deploy/ecosystem.config.cjs` to:

```bash
/var/www/etsy-fee-calculator/ecosystem.config.cjs
```

Copy `deploy/server-deploy-from-github.sh` to:

```bash
/var/www/etsy-fee-calculator/deploy.sh
```

Edit `/var/www/etsy-fee-calculator/deploy.sh` and replace:

```bash
REPO_URL="git@github.com:YOUR_USER/YOUR_REPO.git"
```

Then:

```bash
chmod +x /var/www/etsy-fee-calculator/deploy.sh
```

## Server release workflow

After local build output is pushed to GitHub:

```bash
cd /var/www/etsy-fee-calculator
./deploy.sh
```

The script clones the latest GitHub code into a timestamped source directory, extracts `deploy-release.tar.gz` into a timestamped release directory, switches `current` atomically, and reloads PM2.

Nginx should keep proxying to the PM2 port, for example `http://127.0.0.1:3000`.
