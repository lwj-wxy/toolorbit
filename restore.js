const { execSync } = require('child_process');
try {
  console.log(execSync('git checkout src/locales/en.json').toString());
} catch (e) {
  console.error(e.toString());
}
