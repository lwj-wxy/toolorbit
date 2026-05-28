module.exports = {
  apps: [
    {
      name: 'etsy-fee-calculator',
      cwd: '/var/www/etsy-fee-calculator/current',
      script: 'server.js',
      env: {
        NODE_ENV: 'production',
        PORT: '3000',
      },
    },
  ],
};
