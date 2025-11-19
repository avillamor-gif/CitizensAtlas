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
    return `build-${Date.now()}-${Math.random().toString(36).substring(2)}`
  },
  // Add cache control headers
  async headers() {
    return [
      {
        source: '/_next/static/chunks/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate',
          },
        ],
      },
      {
        source: '/_next/static/js/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig