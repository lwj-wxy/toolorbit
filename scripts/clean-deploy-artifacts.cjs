const fs = require('node:fs');
const path = require('node:path');

const rootDir = path.resolve(__dirname, '..');
const nextDir = path.join(rootDir, '.next');
const targets = ['deploy-output', 'deploy-release.tar.gz'];

const removePath = (targetPath) => {
  fs.rmSync(targetPath, {
    recursive: true,
    force: true,
    maxRetries: 5,
    retryDelay: 200,
  });
};

const normalizePath = (targetPath) => targetPath.replace(/\\/g, '/');

const isLockedNextDevCache = (error) => {
  const errorPath = typeof error?.path === 'string' ? normalizePath(error.path) : '';
  return error?.code === 'EPERM' && errorPath.includes('/.next/dev/cache/turbopack/');
};

const removeNextDir = () => {
  try {
    removePath(nextDir);
    return;
  } catch (error) {
    if (!isLockedNextDevCache(error)) {
      throw error;
    }
  }

  console.warn('Skipped locked .next/dev Turbopack cache. Close any running Next dev server to remove it completely.');

  if (!fs.existsSync(nextDir)) {
    return;
  }

  for (const entry of fs.readdirSync(nextDir)) {
    if (entry === 'dev') {
      continue;
    }

    removePath(path.join(nextDir, entry));
  }
};

removeNextDir();

for (const target of targets) {
  removePath(path.join(rootDir, target));
}

console.log('Cleaned deploy artifacts');
