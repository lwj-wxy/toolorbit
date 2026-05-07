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
// match exactly t('something.something')
const regex = /t\(['"`]([a-zA-Z0-9_.-]+)['"`](?:, *{.*})?\)/g;

walkDir('src', function(filePath) {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
    const content = fs.readFileSync(filePath, 'utf-8');
    let match;
    while ((match = regex.exec(content)) !== null) {
      keys.add(match[1]);
    }
  }
});

function setDeep(obj, pathArr, value) {
  let current = obj;
  for (let i = 0; i < pathArr.length - 1; i++) {
    const p = pathArr[i];
    if (!current[p]) current[p] = {};
    current = current[p];
  }
  const last = pathArr[pathArr.length - 1];
  if (typeof current[last] === 'undefined' || typeof current[last] === 'object') {
    current[last] = value;
  }
}

let existingEn = {};
if (fs.existsSync('src/locales/en.json')) {
  existingEn = JSON.parse(fs.readFileSync('src/locales/en.json', 'utf-8'));
}

let newTree = JSON.parse(JSON.stringify(existingEn));

// Provide some default English values for the collected keys
keys.forEach(k => {
  if (k.includes('t(')) return;
  const parts = k.split('.');
  // fallback to capitalizing the last part
  let defaultVal = parts[parts.length - 1]
                      .replace(/([A-Z])/g, " $1")
                      .replace(/-/g, " ")
                      .trim();
  defaultVal = defaultVal.charAt(0).toUpperCase() + defaultVal.slice(1);
  setDeep(newTree, parts, defaultVal);
});

fs.writeFileSync('src/locales/en.json', JSON.stringify(newTree, null, 2));

console.log('Successfully reconstructed en.json');

