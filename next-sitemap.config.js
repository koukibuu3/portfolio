/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://example.com',
  changefreq: 'weekly',
  generateRobotsTxt: true,
  additionalPaths: async (config) => [
    {
      loc: '/api/rss',
      changefreq: 'daily',
      priority: 0.7,
      lastmod: new Date().toISOString(),
    },
  ],
}
