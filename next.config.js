/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['example.com'], // Add any external image domains here
  },
  env: {
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  },
}

module.exports = nextConfig