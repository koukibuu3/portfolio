import { access, readFile } from 'node:fs/promises'
import { articles } from '../src/content/articles'
import { projects } from '../src/content/projects'
import { profile } from '../src/content/profile'
import { writing } from '../src/content/writing'
import { cleanArticle, publicUrl, validateWriting } from './lib/content'
async function main() {
  validateWriting(writing)
  const slugs = new Set<string>()
  for (const project of projects) {
    if (
      !/^[a-z0-9-]+$/.test(project.slug) ||
      slugs.has(project.slug) ||
      !project.name.trim() ||
      !project.summary.trim()
    )
      throw new Error('Invalid project')
    slugs.add(project.slug)
    if (
      !/^\/projects\/[a-z0-9.-]+$/.test(project.image.src) ||
      project.image.width <= 0 ||
      project.image.height <= 0
    )
      throw new Error('Invalid project image')
    await access(`public${project.image.src}`)
    project.links?.forEach((link) => publicUrl(link.url))
  }
  profile.links.forEach((link) => publicUrl(link.url))
  const report = JSON.parse(
    await readFile('content/legacy/export-report.json', 'utf8'),
  )
  if (
    report.exportedCount !== articles.length ||
    report.publishedCount !== articles.length
  )
    throw new Error('Article export count mismatch')
  for (const article of articles) {
    if (
      article.bodyFile !== `${article.id}.html` ||
      !/^\/content\/articles\/[a-z0-9.-]+$/.test(article.mainImage.url)
    )
      throw new Error('Invalid local article path')
    const html = await readFile(
      `content/legacy/bodies/${article.bodyFile}`,
      'utf8',
    )
    if (
      !html ||
      cleanArticle(html) !== html ||
      /src=["']https:\/\/images\.microcms-assets\.io/i.test(html)
    )
      throw new Error('Invalid saved article HTML')
    await access(`public${article.mainImage.url}`)
  }
  console.log(
    `Validated ${projects.length} projects, ${articles.length} saved articles, ${writing.length} writing items.`,
  )
}
main().catch((error) => {
  console.error(
    error instanceof Error ? error.message : 'Content validation failed',
  )
  process.exitCode = 1
})
