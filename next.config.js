/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  poweredByHeader: false,
  turbopack: { root: __dirname },
  outputFileTracingIncludes: {
    '/api/articles': ['./content/legacy/bodies/*.html'],
  },
  async redirects() {
    return ['projects', 'writing', 'about'].map((section) => ({
      source: `/${section}`,
      destination: `/#${section}`,
      permanent: true,
    }))
  },
}
