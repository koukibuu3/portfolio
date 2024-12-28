import { Tag } from './Tag'
import { Timestamps } from './Timestamps'

/**
 * 記事の型
 */
export type Article = {
  id: string
  mainImage: {
    url: string
    height: number
    width: number
  }
  title: string
  description: string
  body: string
  tags: Tag[]
} & Timestamps

/**
 * 記事の説明を省いた型
 * CMSから取得したときは description がないのでこの型を使用する
 */
export type ArticleWithoutDescription = Omit<Article, 'description'>
