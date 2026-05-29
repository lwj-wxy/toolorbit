const fs = require('node:fs');
const path = require('node:path');

const releaseDir = path.resolve(process.argv[2] || path.join(__dirname, '..', 'deploy-output'));
const scanRoots = [
  path.join(releaseDir, '.next', 'server'),
  path.join(releaseDir, 'server.js'),
];
const staticPrefix = '/_next/static/';
const assetPattern = /\/_next\/static\/[^"'`\s<>)]+/g;
const escapedAssetPattern = /\\u002F_next\\u002Fstatic\\u002F[^"'`\s<>)]+/g;

const assertPath = (targetPath, message) => {
  if (!fs.existsSync(targetPath)) {
    throw new Error(message);
  }
};

const walkFiles = (targetPath) => {
  if (!fs.existsSync(targetPath)) {
    return [];
  }

  const stat = fs.statSync(targetPath);
  if (stat.isFile()) {
    return [targetPath];
  }

  if (!stat.isDirectory()) {
    return [];
  }

  return fs.readdirSync(targetPath, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(targetPath, entry.name);
    if (entry.isDirectory()) {
      return walkFiles(entryPath);
    }
    return entry.isFile() ? [entryPath] : [];
  });
};

const normalizeAsset = (asset) => {
  const unescaped = asset.replaceAll('\\u002F', '/').replaceAll('&amp;', '&');
  return unescaped.split('?')[0].split('#')[0];
};

assertPath(releaseDir, `Release directory not found: ${releaseDir}`);
assertPath(path.join(releaseDir, 'server.js'), 'Release is missing server.js');
assertPath(path.join(releaseDir, '.next', 'static'), 'Release is missing .next/static');

const scannedFiles = scanRoots
  .flatMap(walkFiles)
  .filter((filePath) => /\.(html|js|json|rsc|txt|meta)$/i.test(filePath));

const assets = new Set();

for (const filePath of scannedFiles) {
  const content = fs.readFileSync(filePath, 'utf8');
  for (const match of content.matchAll(assetPattern)) {
    assets.add(normalizeAsset(match[0]));
  }
  for (const match of content.matchAll(escapedAssetPattern)) {
    assets.add(normalizeAsset(match[0]));
  }
}

const missingAssets = [...assets].filter((assetPath) => {
  if (!assetPath.startsWith(staticPrefix)) {
    return false;
  }

  const filePath = path.join(releaseDir, '.next', 'static', assetPath.slice(staticPrefix.length));
  return !fs.existsSync(filePath);
});

if (missingAssets.length) {
  console.error('Missing static assets referenced by the release:');
  for (const assetPath of missingAssets.slice(0, 50)) {
    console.error(`- ${assetPath}`);
  }
  if (missingAssets.length > 50) {
    console.error(`...and ${missingAssets.length - 50} more`);
  }
  process.exit(1);
}

console.log(`Validated deploy release: ${assets.size} static asset references`);
