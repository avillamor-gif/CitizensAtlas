/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['example.com'], // Add any external image domains here
  },
  env: {
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  },
  // Force cache invalidation
  generateBuildId: async () => {
    return `build-${Date.now()}`
  },
}

module.exports = nextConfig