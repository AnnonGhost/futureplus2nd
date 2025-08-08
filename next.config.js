/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'server',
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client']
  },
  // Skip API route static generation
  generateStaticParams: false,
  // Disable trailing slash redirect
  trailingSlash: false,
  // Configure webpack to handle Prisma properly
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Don't include Prisma on the client side
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
      }
    }
    return config
  },
  // Disable static optimization for API routes
  generateBuildId: async () => {
    return 'future-plus-build'
  },
  // Handle API routes differently
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: '/api/:path*',
      },
    ]
  },
}

module.exports = nextConfig