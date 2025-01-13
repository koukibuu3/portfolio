import Parser from 'rss-parser'

import { knowledgeClientInterface } from '~/modules/libs/knowledgeClientInterface'
import { Knowledge, ZennFeed, ZennItem } from '~/types'

const fetch = async (): Promise<ZennItem[]> => {
  const res = await new Parser<ZennFeed, ZennItem>().parseURL(
    `https://zenn.dev/${process.env.ZENN_USER_ID}/feed`,
  )
  return res.items
}

const zennClient: knowledgeClientInterface = {
  getAll: async (): Promise<Knowledge[]> => {
    const zennItems = await fetch()
    return zennItems.map(
      (zennItem): Knowledge => ({
        id: zennItem.link.replace(/^.+articles\//, ''),
        title: zennItem.title,
        body: zennItem.content,
        url: zennItem.link,
        type: 'zenn',
        created_at: zennItem.pubDate,
        updated_at: zennItem.pubDate,
      }),
    )
  },
}

export default zennClient
