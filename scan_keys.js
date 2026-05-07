const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

const keys = new Set();
const regex = /t\(['"`](.*?)['"`]/g;

walkDir('src', function(filePath) {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
    const content = fs.readFileSync(filePath, 'utf-8');
    let match;
    while ((match = regex.exec(content)) !== null) {
      keys.add(match[1]);
    }
  }
});

console.log(Array.from(keys).sort().join('\n'));
