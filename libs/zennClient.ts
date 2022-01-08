import Parser from 'rss-parser'

import { ZennFeed } from '../types/ZennFeed'
import { ZennItem } from '../types/ZennItem'

export const zennClient = {
  get: async (): Promise<ZennItem[] & (ZennItem & Parser.Item)[]> => {
    const res = await new Parser<ZennFeed, ZennItem>().parseURL(
      `https://zenn.dev/${process.env.ZENN_USER_ID}/feed`
    )
    return res.items
  },
}
