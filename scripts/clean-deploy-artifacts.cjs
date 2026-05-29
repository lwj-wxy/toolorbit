const fs = require('node:fs');
const path = require('node:path');

const rootDir = path.resolve(__dirname, '..');
const targets = [
  '.next',
  'deploy-output',
  'deploy-release.tar.gz',
];

for (const target of targets) {
  fs.rmSync(path.join(rootDir, target), { recursive: true, force: true });
}

console.log('Cleaned deploy artifacts');
