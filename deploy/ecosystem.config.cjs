module.exports = {
  apps: [
    {
      name: 'etsy-fee-calculator',
      cwd: '/var/www/etsy-fee-calculator/current',
      script: '/var/www/etsy-fee-calculator/node_modules/.bin/next',
      args: 'start -p 3003 -H 127.0.0.1',
      env: {
        NODE_ENV: 'production',
        PORT: '3003',
      },
    },
  ],
};
