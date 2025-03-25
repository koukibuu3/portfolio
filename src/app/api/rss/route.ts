import { Feed } from 'feed'

import { microCmsClient } from '~/modules/libs'
import { ArticleRepository } from '~/modules/repositories/ArticleRepository'
import { Article } from '~/types/Article'

export async function GET() {
  const feed = new Feed({
    title: "Engineer's Blog | koukibuu3",
    description: '',
    id: process.env.SITE_URL ?? '',
    link: process.env.SITE_URL ?? '',
    language: 'ja',
    favicon: `${process.env.SITE_URL}/favicon.ico`,
    copyright: `All rights reserved ${new Date().getFullYear()}, koukibuu3`,
    updated: new Date(),
    generator: 'Feed for Node.js',
    feedLinks: {
      rss2: `${process.env.SITE_URL}/api/rss`,
    },
    author: {
      name: 'koukibuu3',
      email: 'koukibuu3@gmail.com',
      link: process.env.SITE_URL,
    },
  })

  const articles = await new ArticleRepository(
    microCmsClient,
  ).getWithPagination(1, 50)

  articles.forEach((article: Article) => {
    feed.addItem({
      title: article.title,
      id: `${process.env.SITE_URL}/articles/${article.id}`,
      link: `${process.env.SITE_URL}/articles/${article.id}`,
      description: article.description,
      content: article.body,
      date: new Date(article.updatedAt),
      category: article.tags.map((tag) => ({ name: tag.name })),
      image: article.mainImage.url,
    })
  })

  return new Response(feed.rss2(), {
    headers: {
      'Content-Type': 'application/xml',
    },
  })
}
