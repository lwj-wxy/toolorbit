const fs = require('node:fs');
const path = require('node:path');

const APP_DIR = '/var/www/etsy-fee-calculator';
const SHARED_ENV_FILE = path.join(APP_DIR, 'shared', '.env.production');

const readSharedEnvironment = (filePath) => {
  if (!fs.existsSync(filePath)) return {};

  const environment = {};
  for (const line of fs.readFileSync(filePath, 'utf8').split(/\r?\n/)) {
    const match = line.match(/^\s*(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
    if (!match) continue;

    let value = match[2];
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    environment[match[1]] = value;
  }

  return environment;
};

module.exports = {
  apps: [
    {
      name: 'etsy-fee-calculator',
      cwd: '/var/www/etsy-fee-calculator/current',
      script: '/var/www/etsy-fee-calculator/node_modules/.bin/next',
      args: 'start -p 3003 -H 127.0.0.1',
      env: {
        ...readSharedEnvironment(SHARED_ENV_FILE),
        NODE_ENV: 'production',
        PORT: '3003',
      },
    },
  ],
};
