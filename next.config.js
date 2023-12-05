/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  api: {
    responseLimit: false,
  },
};

module.exports = nextConfig;
