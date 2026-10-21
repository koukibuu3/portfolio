import type { MetadataRoute } from 'next'
import { articles } from '~/content/articles'
import { site } from '~/content/site'
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: site.url },
    ...articles.map((article) => ({
      url: `${site.url}/articles/${article.id}`,
      lastModified: article.updatedAt,
    })),
  ]
}
