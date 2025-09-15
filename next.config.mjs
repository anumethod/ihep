import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Force correct repo root selection to avoid monorepo lockfile confusion
  outputFileTracingRoot: path.join(__dirname),
  images: {
    domains: ['images.unsplash.com', 'via.placeholder.com']
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: '/api/:path*'
      }
    ]
  }
}

export default nextConfig;
