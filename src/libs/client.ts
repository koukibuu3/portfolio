import dayjs from 'dayjs'

import { zennClient, qiitaClient } from '~/libs'
import { Article, Page as PageType } from '~/types'
import { Page } from '~/valueObjects'

const PER_PAGE = 10

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
  getArticlesWithPagination: async (
    offset = 0,
    limit = 0
  ): Promise<[Article[], PageType]> => {
    const qiitaArticles = await qiitaClient.getArticles()
    const zennArticles = await zennClient.getArticles()

    const sortedArticles = sortArticles(qiitaArticles.concat(zennArticles))
    const articles =
      limit === undefined
        ? sortedArticles.slice(offset)
        : sortedArticles.slice(offset, offset + limit)

    const page = new Page(offset, limit, sortedArticles.length).toObject()

    return [articles, page]
  },
}

export default client
