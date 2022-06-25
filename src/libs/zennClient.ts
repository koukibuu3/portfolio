import Parser from 'rss-parser'

import { Article, ZennFeed, ZennItem } from '../types'

const fetch = async (): Promise<ZennItem[]> => {
  const res = await new Parser<ZennFeed, ZennItem>().parseURL(
    `https://zenn.dev/${process.env.ZENN_USER_ID}/feed`
  )
  return res.items
}

const zennClient = {
  getArticles: async (): Promise<Article[]> => {
    const zennItems = await fetch()
    return zennItems.map(
      (zennItem): Article => ({
        id: zennItem.link.replace(/^.+articles\//, ''),
        title: zennItem.title,
        body: zennItem.content,
        url: zennItem.link,
        type: 'zenn',
        created_at: zennItem.pubDate,
        updated_at: zennItem.pubDate,
      })
    )
  },
}

export default zennClient
