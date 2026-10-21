import { Feed } from 'feed'
import { articles, articleWithBody } from '~/content/articles'
import { site } from '~/content/site'
export const dynamic = 'force-static'
export async function GET() {
  const feed = new Feed({
    title: "Engineer's Blog | koukibuu3",
    description: site.description,
    id: site.url,
    link: site.url,
    language: 'ja',
    favicon: `${site.url}/favicon.ico`,
    copyright: 'Kouki Akasaka',
    updated: new Date(
      Math.max(...articles.map((article) => Date.parse(article.updatedAt))),
    ),
    feedLinks: { rss2: `${site.url}/api/rss` },
    author: { name: 'koukibuu3', link: site.url },
  })
  for (const article of await Promise.all(articles.map(articleWithBody)))
    feed.addItem({
      title: article.title,
      id: articles.find((saved) => saved.id === article.id)!.rssGuid,
      link: `${site.url}/articles/${article.id}`,
      description: article.description,
      content: article.body.replaceAll(
        'src="/content/',
        `src="${site.url}/content/`,
      ),
      date: new Date(article.publishedAt),
      category: article.tags.map((tag) => ({ name: tag.name })),
      image: `${site.url}${article.mainImage.url}`,
    })
  return new Response(feed.rss2(), {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  })
}
