import axios from 'axios'
import removeMarkdown from 'remove-markdown'

import { Article, QiitaItem } from '~/types'

const fetch = async (): Promise<QiitaItem[]> => {
  const res = await axios
    .create({
      baseURL: `https://qiita.com/api/v2/users/${process.env.QIITA_USER_ID}/`,
      responseType: 'json',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .get<QiitaItem[]>('items')
  return res.data
}

const qiitaClient = {
  getArticles: async (): Promise<Article[]> => {
    const qiitaItems = await fetch()
    return qiitaItems.map(
      (qiitaItem): Article => ({
        id: qiitaItem.id,
        title: qiitaItem.title,
        description: removeMarkdown(qiitaItem.body).slice(0, 100),
        body: qiitaItem.body,
        url: qiitaItem.url,
        type: 'qiita',
        created_at: qiitaItem.created_at,
        updated_at: qiitaItem.updated_at,
      })
    )
  },
}

export default qiitaClient
