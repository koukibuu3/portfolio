import axios from 'axios'

import { Knowledge, QiitaItem } from '~/types'

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
  getAll: async (): Promise<Knowledge[]> => {
    const qiitaItems = await fetch()
    return qiitaItems.map(
      (qiitaItem): Knowledge => ({
        id: qiitaItem.id,
        title: qiitaItem.title,
        body: qiitaItem.body,
        url: qiitaItem.url,
        type: 'qiita',
        created_at: qiitaItem.created_at,
        updated_at: qiitaItem.updated_at,
      }),
    )
  },
}

export default qiitaClient
