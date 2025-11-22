/** @type {import('next-pwa').PWAConfig} */
const pwaConfig = {
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: false,
};

module.exports = pwaConfig;
