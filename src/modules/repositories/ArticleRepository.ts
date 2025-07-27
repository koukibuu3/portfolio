import path from 'path'

import {
  parseMarkdownFile,
  getArticleFiles,
  extractDescription,
  extractFirstImage,
  getImageDimensions,
} from '~/modules/libs/markdownParser'
import { Article } from '~/types'

export class ArticleRepository {
  private articlesDir: string

  constructor(articlesDir = path.join(process.cwd(), 'notes', 'Article')) {
    this.articlesDir = articlesDir
  }

  private async checkDirectoryExists(): Promise<boolean> {
    try {
      const stats = await import('fs/promises').then((fs) =>
        fs.stat(this.articlesDir),
      )
      return stats.isDirectory()
    } catch {
      return false
    }
  }

  /**
   * ページネーションで記事を取得する
   * @param page ページ番号
   * @param perPage 1ページあたりの記事数
   * @returns 記事の配列
   */
  async getWithPagination(page: number, perPage: number): Promise<Article[]> {
    const directoryExists = await this.checkDirectoryExists()
    if (!directoryExists) {
      console.warn(`Articles directory does not exist: ${this.articlesDir}`)
      return []
    }

    const files = await getArticleFiles(this.articlesDir)

    // ファイルを並列で読み込み
    const articlePromises = files.map(async (filePath) => {
      const parsed = await parseMarkdownFile(filePath)
      const firstImage = extractFirstImage(parsed.content)

      let mainImage = {
        url: '/default-article-image.png',
        width: 1200,
        height: 630,
      }

      if (firstImage) {
        const imagePath = path.join(
          this.articlesDir,
          'Assets',
          path.basename(firstImage.url),
        )
        const dimensions = await getImageDimensions(imagePath)
        mainImage = {
          url: firstImage.url,
          width: dimensions.width,
          height: dimensions.height,
        }
      }

      const article: Article = {
        id: parsed.frontMatter.id,
        mainImage,
        title: this.extractTitleFromFilename(path.basename(filePath)),
        description: extractDescription(parsed.htmlContent),
        body: parsed.htmlContent,
        tags: parsed.frontMatter.tags.map((tag) => ({
          id: tag,
          name: tag,
          createdAt: parsed.frontMatter.createdAt,
          updatedAt: parsed.frontMatter.createdAt,
          publishedAt: parsed.frontMatter.publishedAt,
          revisedAt: parsed.frontMatter.createdAt,
        })),
        createdAt: parsed.frontMatter.createdAt,
        updatedAt: parsed.frontMatter.createdAt, // 同じ値を使用
        publishedAt: parsed.frontMatter.publishedAt,
        revisedAt: parsed.frontMatter.createdAt,
      }

      return article
    })

    const allArticles = await Promise.all(articlePromises)

    // publishedAtでソート（新しい順）
    allArticles.sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    )

    // ページネーション
    const start = (page - 1) * perPage
    const end = start + perPage

    return allArticles.slice(start, end)
  }

  /**
   * 記事をIDで単体取得する
   * @param id 記事のID
   * @param draftKey ドラフトキー（未使用）
   * @returns 記事
   */
  async getById(id: string): Promise<Article | null> {
    const directoryExists = await this.checkDirectoryExists()
    if (!directoryExists) {
      console.warn(`Articles directory does not exist: ${this.articlesDir}`)
      return null
    }

    const files = await getArticleFiles(this.articlesDir)

    for (const filePath of files) {
      const parsed = await parseMarkdownFile(filePath)

      if (parsed.frontMatter.id === id) {
        const firstImage = extractFirstImage(parsed.content)

        let mainImage = {
          url: '/default-article-image.png',
          width: 1200,
          height: 630,
        }

        if (firstImage) {
          const imagePath = path.join(
            this.articlesDir,
            'Assets',
            path.basename(firstImage.url),
          )
          const dimensions = await getImageDimensions(imagePath)
          mainImage = {
            url: firstImage.url,
            width: dimensions.width,
            height: dimensions.height,
          }
        }

        return {
          id: parsed.frontMatter.id,
          mainImage,
          title: this.extractTitleFromFilename(path.basename(filePath)),
          description: extractDescription(parsed.htmlContent),
          body: parsed.htmlContent,
          tags: parsed.frontMatter.tags.map((tag) => ({
            id: tag,
            name: tag,
            createdAt: parsed.frontMatter.createdAt,
            updatedAt: parsed.frontMatter.createdAt,
            publishedAt: parsed.frontMatter.publishedAt,
            revisedAt: parsed.frontMatter.createdAt,
          })),
          createdAt: parsed.frontMatter.createdAt,
          updatedAt: parsed.frontMatter.createdAt,
          publishedAt: parsed.frontMatter.publishedAt,
          revisedAt: parsed.frontMatter.createdAt,
        }
      }
    }

    return null
  }

  /**
   * ファイル名からタイトルを抽出
   * @param filename ファイル名
   * @returns タイトル
   */
  private extractTitleFromFilename(filename: string): string {
    // 日付とアンダースコアを除去、拡張子を除去
    const match = filename.match(/^\d{4}-\d{2}-\d{2}_(.+)\.md$/)
    return match ? match[1] : filename.replace('.md', '')
  }
}
