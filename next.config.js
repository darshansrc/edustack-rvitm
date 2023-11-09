// next.config.js

/** @type {import('next').NextConfig} */

const runtimeCaching = require("next-pwa/cache");
const withPWA = require('next-pwa')({
 dest: 'public', 
 register: true,
 skipWaiting: true,
 runtimeCaching
})

module.exports = withPWA({
 // other congigs
 reactStrictMode: false,
 
 images: {
    domains: ['firebasestorage.googleapis.com'],
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
})