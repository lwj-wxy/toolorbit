const fs = require('node:fs');
const path = require('node:path');
const { execSync } = require('node:child_process');

const rootDir = path.resolve(__dirname, '..');
const standaloneDir = path.join(rootDir, '.next', 'standalone');
const staticDir = path.join(rootDir, '.next', 'static');
const publicDir = path.join(rootDir, 'public');
const outputDir = path.join(rootDir, 'deploy-output');

const assertDir = (dirPath, message) => {
  if (!fs.existsSync(dirPath) || !fs.statSync(dirPath).isDirectory()) {
    throw new Error(message);
  }
};

const findStandaloneAppDir = (dirPath) => {
  const directServerPath = path.join(dirPath, 'server.js');

  if (fs.existsSync(directServerPath)) {
    return dirPath;
  }

  const entries = fs.readdirSync(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    if (!entry.isDirectory()) {
      continue;
    }

    const childDir = path.join(dirPath, entry.name);
    const appDir = findStandaloneAppDir(childDir);

    if (appDir) {
      return appDir;
    }
  }

  return null;
};

const gitValue = (command) => {
  try {
    return execSync(command, { cwd: rootDir, encoding: 'utf8' }).trim();
  } catch {
    return 'unknown';
  }
};

assertDir(
  standaloneDir,
  'Missing .next/standalone. Run "npm run build" after enabling Next standalone output.',
);
assertDir(staticDir, 'Missing .next/static. Run "npm run build" before packing.');

const standaloneAppDir = findStandaloneAppDir(standaloneDir);

if (!standaloneAppDir) {
  throw new Error('Missing server.js in .next/standalone. Check Next standalone output.');
}

fs.rmSync(outputDir, { recursive: true, force: true });
fs.mkdirSync(outputDir, { recursive: true });

fs.cpSync(standaloneAppDir, outputDir, { recursive: true });
fs.cpSync(staticDir, path.join(outputDir, '.next', 'static'), { recursive: true });

if (fs.existsSync(publicDir)) {
  fs.cpSync(publicDir, path.join(outputDir, 'public'), { recursive: true });
}

const releaseInfo = [
  `commit=${gitValue('git rev-parse HEAD')}`,
  `branch=${gitValue('git branch --show-current')}`,
  `createdAt=${new Date().toISOString()}`,
  '',
].join('\n');

fs.writeFileSync(path.join(outputDir, 'RELEASE.txt'), releaseInfo, 'utf8');

if (!fs.existsSync(path.join(outputDir, 'server.js'))) {
  throw new Error('Packed output is missing server.js. Check Next standalone output.');
}

execSync('node scripts/validate-deploy-release.cjs deploy-output', {
  cwd: rootDir,
  stdio: 'inherit',
});

console.log(`Deploy output prepared at ${path.relative(rootDir, outputDir)}`);
