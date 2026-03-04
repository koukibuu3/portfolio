import { Article } from './Article'
import Knowledge from './Knowledge'

/**
 * 記事一覧で表示する投稿の統合型
 * microCMS記事、Qiita投稿、Zenn投稿を統一的に扱う
 */
export type Post =
  | { source: 'microcms'; data: Article }
  | { source: 'qiita' | 'zenn'; data: Knowledge }
