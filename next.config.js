/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: [],
  },
  // Disable strict mode for better compatibility
  reactStrictMode: false,
}

module.exports = nextConfig 