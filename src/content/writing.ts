import external from '../../content/generated/writing.json'
import { articles } from './articles'
import { mergeWriting, type WritingItem } from '../../scripts/lib/content'

export const writing = mergeWriting(
  external.items as WritingItem[],
  articles.map((article) => ({
    id: `local:${article.id}`,
    source: 'local',
    title: article.title,
    url: `/articles/${article.id}`,
    publishedAt: article.publishedAt,
    updatedAt: article.updatedAt,
    description: article.description,
  })),
)
export const sourceLabels = {
  local: 'koukibuu3.dev',
  zenn: 'Zenn',
  qiita: 'Qiita',
}
