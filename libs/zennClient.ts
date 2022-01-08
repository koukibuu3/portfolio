import Parser from 'rss-parser'

import { ZennFeed, ZennItem } from '../types'

const zennClient = {
  get: async (): Promise<ZennItem[]> => {
    const res = await new Parser<ZennFeed, ZennItem>().parseURL(
      `https://zenn.dev/${process.env.ZENN_USER_ID}/feed`
    )
    return res.items
  },
}

export default zennClient
