/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  images: {
    domains: ['images.microcms-assets.io', 'koukibuu3.github.io'],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/notes/**',
      },
    ],
  },
  pageExtensions: ['ts', 'tsx'],
}
