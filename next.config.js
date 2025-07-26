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
  webpack: (config, { isServer }) => {
    // Vercelでのdebugモジュール関連の警告を回避
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
      }
    }

    // デバッグモジュールの問題を回避
    config.externals = config.externals || []
    config.externals.push({
      'supports-color': 'supports-color',
    })

    return config
  },
}
