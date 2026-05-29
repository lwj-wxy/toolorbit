const fs = require('node:fs');
const path = require('node:path');
const { execSync } = require('node:child_process');

const rootDir = path.resolve(__dirname, '..');
const nextDir = path.join(rootDir, '.next');
const publicDir = path.join(rootDir, 'public');
const outputDir = path.join(rootDir, 'deploy-output');
const externalPublicDirs = new Set(['images', 'featured-tools']);

const assertDir = (dirPath, message) => {
  if (!fs.existsSync(dirPath) || !fs.statSync(dirPath).isDirectory()) {
    throw new Error(message);
  }
};

const gitValue = (command) => {
  try {
    return execSync(command, { cwd: rootDir, encoding: 'utf8' }).trim();
  } catch {
    return 'unknown';
  }
};

assertDir(nextDir, 'Missing .next. Run "npm run build" before packing.');
assertDir(path.join(nextDir, 'static'), 'Missing .next/static. Run "npm run build" before packing.');
assertDir(path.join(nextDir, 'server'), 'Missing .next/server. Run "npm run build" before packing.');

fs.rmSync(outputDir, { recursive: true, force: true });
fs.mkdirSync(outputDir, { recursive: true });

fs.cpSync(nextDir, path.join(outputDir, '.next'), {
  recursive: true,
  filter: (sourcePath) => {
    const relativePath = path.relative(nextDir, sourcePath);
    return relativePath !== 'cache' && !relativePath.startsWith(`cache${path.sep}`);
  },
});

for (const fileName of ['package.json', 'package-lock.json', 'next.config.ts']) {
  const sourcePath = path.join(rootDir, fileName);
  if (fs.existsSync(sourcePath)) {
    fs.copyFileSync(sourcePath, path.join(outputDir, fileName));
  }
}

if (fs.existsSync(publicDir)) {
  const outputPublicDir = path.join(outputDir, 'public');

  fs.cpSync(publicDir, path.join(outputDir, 'public'), {
    recursive: true,
    filter: (sourcePath) => {
      const relativePath = path.relative(publicDir, sourcePath);
      const [topLevelDir] = relativePath.split(path.sep);
      return !externalPublicDirs.has(topLevelDir);
    },
  });

  for (const dirName of externalPublicDirs) {
    fs.rmSync(path.join(outputPublicDir, dirName), { recursive: true, force: true });
  }
}

const releaseInfo = [
  `commit=${gitValue('git rev-parse HEAD')}`,
  `branch=${gitValue('git branch --show-current')}`,
  `createdAt=${new Date().toISOString()}`,
  '',
].join('\n');

fs.writeFileSync(path.join(outputDir, 'RELEASE.txt'), releaseInfo, 'utf8');

execSync('node scripts/validate-deploy-release.cjs deploy-output', {
  cwd: rootDir,
  stdio: 'inherit',
});

console.log(`Deploy output prepared at ${path.relative(rootDir, outputDir)}`);
