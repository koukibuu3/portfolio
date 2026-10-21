import { readFile } from 'node:fs/promises'
import path from 'node:path'
import snapshot from '../../content/legacy/articles.json'

export const articles = [...snapshot.articles].sort(
  (a, b) =>
    Date.parse(b.publishedAt) - Date.parse(a.publishedAt) ||
    a.id.localeCompare(b.id),
)
export type ArticleMetadata = (typeof articles)[number]

export function findArticle(id: string) {
  return articles.find((article) => article.id === id)
}

export async function articleBody(article: ArticleMetadata) {
  return readFile(
    path.join(process.cwd(), 'content/legacy/bodies', article.bodyFile),
    'utf8',
  )
}

export async function articleWithBody(article: ArticleMetadata) {
  const { bodyFile: _, rssGuid: _rssGuid, ...metadata } = article
  return { ...metadata, body: await articleBody(article) }
}
