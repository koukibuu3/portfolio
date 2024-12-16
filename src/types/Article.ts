import { ArticleTag } from './ArticleTag'

export type Article = {
  id: string
  title: string
  description: string
  tags: ArticleTag[]
  mainImageUrl: string
  publishedAt: string
}
