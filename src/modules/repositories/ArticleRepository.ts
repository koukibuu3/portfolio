import { microCmsClient } from '~/libs'
import { Article, ArticleWithoutDescription } from '~/types'

export class ArticleRepository {
  private client: typeof microCmsClient

  constructor(client: typeof microCmsClient) {
    this.client = client
  }

  /**
   * ページネーションで記事を取得する
   * @param page ページ番号
   * @param perPage 1ページあたりの記事数
   * @returns 記事の配列
   */
  async getWithPagination(page: number, perPage: number): Promise<Article[]> {
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

  /**
   * 記事をIDで単体取得する
   * @param id 記事のID
   * @param draftKey ドラフトキー
   * @returns 記事
   */
  async getById(id: string, draftKey?: string): Promise<Article | null> {
    const res = await this.client
      .get<Article>({
        endpoint: 'articles',
        contentId: id,
        queries: { draftKey },
      })
      .catch((error) => null)

    return res
  }
}
