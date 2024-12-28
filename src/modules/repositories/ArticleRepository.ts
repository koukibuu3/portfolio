import { microCmsClient } from '~/libs'
import { Article, ArticleWithoutDescription } from '~/types'

export class ArticleRepository {
  private client: typeof microCmsClient

  constructor(client: typeof microCmsClient) {
    this.client = client
  }

  async get(page: number, perPage: number): Promise<Article[]> {
    if (process.env.ENVIRONMENT === 'production') {
      return [] // 開発中は本番で値を返さない
    }

    const res = await this.client.getList<ArticleWithoutDescription>({
      endpoint: 'articles',
      queries: { offset: page * perPage, limit: perPage },
    })

    return res.contents.map((content) => ({
      ...content,
      description: content.body.replace(/<[^>]*>/g, '').slice(0, 100),
    }))
  }
}
