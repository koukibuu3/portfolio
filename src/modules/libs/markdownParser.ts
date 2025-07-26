import fs from 'fs/promises'
import path from 'path'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkFrontmatter from 'remark-frontmatter'
import remarkHtml from 'remark-html'
import yaml from 'yaml'
import imageSize from 'image-size'
import { Article } from '~/types'
import { remarkObsidianImage } from './remarkObsidianImage'

interface FrontMatter {
  tags: string[]
  createdAt: string
  publishedAt: string
  id: string
}

interface ParsedMarkdown {
  frontMatter: FrontMatter
  content: string
  htmlContent: string
}

export async function parseMarkdownFile(
  filePath: string,
): Promise<ParsedMarkdown> {
  const fileContent = await fs.readFile(filePath, 'utf-8')

  // フロントマターを抽出
  const frontMatterMatch = fileContent.match(/^---\n([\s\S]*?)\n---/)
  if (!frontMatterMatch) {
    throw new Error(`フロントマターが見つかりません: ${filePath}`)
  }

  const frontMatter = yaml.parse(frontMatterMatch[1]) as FrontMatter
  const content = fileContent.replace(/^---\n[\s\S]*?\n---\n/, '')

  // remarkでHTMLに変換（Obsidian画像記法を処理）
  const processor = unified()
    .use(remarkParse)
    .use(remarkFrontmatter)
    .use(remarkObsidianImage)
    .use(remarkHtml)

  const result = await processor.process(content)
  const htmlContent = result.toString()

  return {
    frontMatter,
    content,
    htmlContent,
  }
}

export async function getArticleFiles(articlesDir: string): Promise<string[]> {
  const files = await fs.readdir(articlesDir)
  return files
    .filter((file) => file.endsWith('.md') && file !== 'README.md')
    .map((file) => path.join(articlesDir, file))
}

export function extractDescription(content: string, maxLength = 100): string {
  // HTMLタグを除去してプレーンテキストを抽出
  const plainText = content.replace(/<[^>]*>/g, '')
  // 改行をスペースに変換して整形
  const normalizedText = plainText.replace(/\n+/g, ' ').trim()
  // 指定された長さで切り取り
  return normalizedText.length > maxLength
    ? normalizedText.slice(0, maxLength) + '...'
    : normalizedText
}

export function extractFirstImage(
  content: string,
): { url: string; alt: string } | null {
  // Obsidian形式の画像を探す
  const obsidianImageMatch = content.match(/!\[\[([^\]]+)\]\]/)
  if (obsidianImageMatch) {
    const [imagePath, altText] = obsidianImageMatch[1].split('|')
    const cleanImagePath = imagePath.trim()
    const cleanAltText = altText?.trim() || cleanImagePath
    return {
      url: `/notes/Article/Assets/${cleanImagePath}`,
      alt: cleanAltText,
    }
  }

  // 通常のMarkdown形式の画像を探す
  const markdownImageMatch = content.match(/!\[([^\]]*)\]\(([^)]+)\)/)
  if (markdownImageMatch) {
    return {
      url: markdownImageMatch[2],
      alt: markdownImageMatch[1] || 'Article image',
    }
  }

  return null
}

export async function getImageDimensions(
  imagePath: string,
): Promise<{ width: number; height: number }> {
  try {
    const dimensions = imageSize(imagePath)
    return {
      width: dimensions.width || 1200,
      height: dimensions.height || 630,
    }
  } catch (error) {
    console.error(`画像サイズの取得に失敗しました: ${imagePath}`, error)
    // デフォルト値を返す
    return { width: 1200, height: 630 }
  }
}
