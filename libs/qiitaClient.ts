import axios from 'axios'

import { QiitaItem } from '../types/QiitaItem'

export const qiitaClient = {
  get: async (): Promise<QiitaItem[]> => {
    const res = await axios
      .create({
        baseURL: `https://qiita.com/api/v2/users/${process.env.QIITA_USER_ID}/`,
        responseType: 'json',
        headers: {
          'Content-Type': 'application/json',
        },
        params: {
          page: 1,
          per_page: 5,
        },
      })
      .get<QiitaItem[]>('items')
    return res.data
  },
}
