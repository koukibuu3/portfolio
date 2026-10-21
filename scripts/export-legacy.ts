import { createHash } from 'node:crypto'
import { mkdir, readFile, rename, writeFile } from 'node:fs/promises'
import { extname } from 'node:path'
import Parser from 'rss-parser'
import { cleanArticle, fetchPublic } from './lib/content'

async function main() {
  try {
    process.loadEnvFile('.env')
  } catch {
    /* Public API is available without local credentials. */
  }
  const service = process.env.MICROCMS_API_ID
  const key = process.env.MICROCMS_API_KEY
  const cms = Boolean(service && key)
  if (cms && !/^[a-z0-9-]+$/.test(service!))
    throw new Error('Invalid CMS service identifier')
  const priorFeed = await new Parser().parseString(
    (await fetchPublic('https://koukibuu3.dev/api/rss')).toString(),
  )
  const priorGuids = new Map(
    priorFeed.items.flatMap((item) => {
      const id = item.link?.match(/\/articles\/([a-zA-Z0-9_-]+)$/)?.[1]
      return id && item.guid ? [[id, item.guid] as const] : []
    }),
  )
  const articles: Record<string, unknown>[] = []
  let total = 0
  for (let page = 1; page <= 100; page++) {
    const url = cms
      ? `https://${service}.microcms.io/api/v1/articles?limit=100&offset=${(page - 1) * 100}`
      : `https://koukibuu3.dev/api/articles?page=${page}&perPage=100`
    const response = JSON.parse(
      (
        await fetchPublic(url, cms ? { 'X-MICROCMS-API-KEY': key! } : undefined)
      ).toString(),
    )
    const batch = cms ? response.contents : response
    if (!Array.isArray(batch)) throw new Error('Invalid article response')
    articles.push(...batch)
    total = cms ? response.totalCount : articles.length
    if ((cms && articles.length >= total) || !batch.length) break
    if (page === 100) throw new Error('Article pagination limit reached')
  }
  if (!articles.length || articles.length !== total)
    throw new Error('Article export is incomplete')
  const ids = new Set<string>()
  await mkdir('content/legacy/bodies', { recursive: true })
  await mkdir('public/content/articles', { recursive: true })
  const images = new Map<string, string>()
  const download = async (url: string) => {
    if (images.has(url)) return images.get(url)!
    const parsed = new URL(url)
    if (
      parsed.protocol !== 'https:' ||
      parsed.hostname !== 'images.microcms-assets.io'
    )
      throw new Error('Unexpected CMS image host')
    const extension = extname(parsed.pathname)
    if (!/^\.(png|jpe?g|gif|webp|avif|svg)$/i.test(extension))
      throw new Error('Unknown article image format')
    const filename =
      createHash('sha256').update(url).digest('hex').slice(0, 20) + extension
    const target = `/content/articles/${filename}`
    const bytes = await fetchPublic(url)
    await writeFile(`public${target}`, bytes)
    images.set(url, target)
    return target
  }
  const metadata = []
  for (const raw of articles) {
    const {
      id,
      title,
      publishedAt,
      updatedAt,
      createdAt,
      revisedAt,
      body,
      mainImage,
      tags,
    } = raw as {
      id: string
      title: string
      publishedAt: string
      updatedAt: string
      createdAt: string
      revisedAt: string
      body: string
      mainImage: { url: string; width: number; height: number }
      tags: { id: string; name: string }[]
    }
    if (
      !/^[a-zA-Z0-9_-]+$/.test(id) ||
      ids.has(id) ||
      !title ||
      !publishedAt ||
      !body ||
      !mainImage?.url
    )
      throw new Error('Invalid public article')
    ids.add(id)
    let html = body
    const urls = new Set(
      [
        mainImage.url,
        ...body.matchAll(/https:\/\/images\.microcms-assets\.io\/[^\s"'<>]+/g),
      ]
        .map((value) => (typeof value === 'string' ? value : value[0]))
        .map((url) => url.replaceAll('&amp;', '&')),
    )
    for (const url of urls) {
      const target = await download(url)
      html = html
        .replaceAll(url, target)
        .replaceAll(url.replaceAll('&', '&amp;'), target)
    }
    html = cleanArticle(html)
    const bodyFile = `${id}.html`
    await writeFile(`content/legacy/bodies/${bodyFile}`, html)
    const description = cleanArticle(body)
      .replace(/<[^>]*>/g, '')
      .replace(/\s+/g, ' ')
      .slice(0, 160)
    metadata.push({
      id,
      title,
      description,
      publishedAt,
      updatedAt,
      createdAt,
      revisedAt,
      mainImage: { ...mainImage, url: images.get(mainImage.url)! },
      tags,
      bodyFile,
      rssGuid: priorGuids.get(id) || `https://koukibuu3.dev/articles/${id}`,
    })
  }
  const snapshot = { version: 1, articles: metadata }
  await writeFile(
    'content/legacy/articles.json.tmp',
    JSON.stringify(snapshot, null, 2) + '\n',
  )
  await rename(
    'content/legacy/articles.json.tmp',
    'content/legacy/articles.json',
  )
  await writeFile(
    'content/legacy/export-report.json',
    JSON.stringify(
      {
        source: cms ? 'microCMS public API' : 'published site API',
        publishedCount: total,
        exportedCount: metadata.length,
        images: images.size,
        ids: [...ids],
      },
      null,
      2,
    ) + '\n',
  )
  // Check every saved body before reporting success.
  await Promise.all(
    metadata.map((article) =>
      readFile(`content/legacy/bodies/${article.bodyFile}`, 'utf8'),
    ),
  )
  console.log(
    `Exported ${metadata.length}/${total} public articles and ${images.size} images (${cms ? 'CMS totalCount verified' : 'public listing only'}).`,
  )
}
main().catch(() => {
  console.error(
    'Public article export failed; existing metadata was not replaced unless export completed.',
  )
  process.exitCode = 1
})
