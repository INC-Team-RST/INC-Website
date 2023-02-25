/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com/a/'
      },
      {
        protocol: 'https',
        hostname: 'cdn.pixabay.com'
      },
    ],
    unoptimized: true
  },
}

module.exports = nextConfig
