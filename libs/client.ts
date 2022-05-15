import dayjs from 'dayjs'

import { Article } from '../types'

import { zennClient, qiitaClient } from '.'

/** 記事を作成日の降順にソートする */
const sortArticles = (articles: Article[]): Article[] => {
  return articles.sort((a, b) =>
    dayjs(a.created_at).isAfter(b.created_at) ? -1 : 1
  )
}

const client = {
  getArticles: async (): Promise<Article[]> => {
    const qiitaArticles = await qiitaClient.getArticles()
    const zennArticles = await zennClient.getArticles()

    return sortArticles(qiitaArticles.concat(zennArticles))
  },
}

export default client
