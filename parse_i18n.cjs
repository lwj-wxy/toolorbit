const fs = require('fs');
function findFiles(dir) {
  let results = [];
  try {
    const list = fs.readdirSync(dir);
    list.forEach(file => {
      file = dir + '/' + file;
      const stat = fs.statSync(file);
      if (stat && stat.isDirectory()) { 
        results = results.concat(findFiles(file));
      } else { 
        if (file.endsWith('.tsx') || file.endsWith('.ts')) {
          results.push(file);
        }
      }
    });
  } catch (e) {
  }
  return results;
}

const files = findFiles('src');
let keys = new Set();
const regex = /t\(['"]([^'"]+)['"]/g;

files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  let match;
  while ((match = regex.exec(content)) !== null) {
    keys.add(match[1]);
  }
});

let structure = {};
keys.forEach(key => {
  const parts = key.split('.');
  let current = structure;
  for (let i = 0; i < parts.length; i++) {
    if (i === parts.length - 1) {
      current[parts[i]] = 'TODO: ' + parts[i];
    } else {
      current[parts[i]] = current[parts[i]] || {};
      current = current[parts[i]];
    }
  }
});

fs.writeFileSync('missing_keys.json', JSON.stringify(structure, null, 2));
console.log('done');
