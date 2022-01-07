import axios from 'axios'

export const qiitaClient = axios.create({
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
