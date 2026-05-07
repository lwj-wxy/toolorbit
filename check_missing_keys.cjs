const fs = require('fs');
const path = require('path');

const keys = new Set();
const regex1 = /t\(\s*['"]([^'"]+)['"]/g;
const regex2 = /t\(\s*`([^`]+)`/g;

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    if(fs.statSync(dirPath).isDirectory()) {
       walkDir(dirPath, callback);
    } else {
       callback(dirPath);
    }
  });
}

walkDir('src', function(filePath) {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
    const content = fs.readFileSync(filePath, 'utf-8');
    let match;
    while ((match = regex1.exec(content)) !== null) {
      keys.add(match[1]);
    }
    while ((match = regex2.exec(content)) !== null) {
      keys.add(match[1]);
    }
  }
});

let zh = JSON.parse(fs.readFileSync('src/locales/zh.json', 'utf8'));

function getNested(obj, pathStr) {
  let cur = obj;
  let parts = pathStr.split('.');
  for(let i=0; i<parts.length; i++) {
    if(!cur) return undefined;
    cur = cur[parts[i]];
  }
  return cur;
}

let missing = [];
keys.forEach(k => {
  if (k.includes('${')) return; // ignore dynamic
  if (getNested(zh, k) === undefined) {
      missing.push(k);
  }
});

console.log('Missing static keys:', missing);

// Let's also check dynamic ones and expand them based on what they are
let dynamicPatterns = [];
keys.forEach(k => {
  if (k.includes('${')) dynamicPatterns.push(k);
});

console.log('Dynamic patterns to manually test:', dynamicPatterns);
