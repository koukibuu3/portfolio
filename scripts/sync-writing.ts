import { readFile, rename, writeFile } from 'node:fs/promises'
import Parser from 'rss-parser'
import {
  fetchPublic,
  mergeWriting,
  publicUrl,
  validatedSource,
  type WritingItem,
} from './lib/content'

async function qiita(): Promise<WritingItem[]> {
  const items: WritingItem[] = []
  for (let page = 1; page <= 100; page++) {
    const data = JSON.parse(
      (
        await fetchPublic(
          `https://qiita.com/api/v2/users/koukibuu3/items?per_page=100&page=${page}`,
        )
      ).toString(),
    )
    if (!Array.isArray(data)) throw new Error('Invalid Qiita response')
    for (const item of data)
      items.push({
        id: `qiita:${item.id}`,
        source: 'qiita',
        title: item.title,
        url: publicUrl(item.url, 'qiita.com'),
        publishedAt: item.created_at,
        updatedAt: item.updated_at,
      })
    if (data.length < 100) return items
  }
  throw new Error('Qiita pagination limit reached')
}

async function zenn(): Promise<WritingItem[]> {
  const feed = await new Parser().parseString(
    (await fetchPublic('https://zenn.dev/koukibuu3/feed?all=1')).toString(),
  )
  return feed.items
    .filter(
      (item) =>
        item.link && /^https:\/\/zenn\.dev\/[^/]+\/articles\//.test(item.link),
    )
    .map((item) => {
      const url = publicUrl(item.link!, 'zenn.dev')
      const id = new URL(url).pathname.split('/articles/')[1].replace(/\/$/, '')
      const date = item.isoDate || item.pubDate
      return {
        id: `zenn:${id}`,
        source: 'zenn',
        title: item.title || '',
        url,
        ...(date ? { publishedAt: new Date(date).toISOString() } : {}),
      }
    })
}

async function main() {
  const file = 'content/generated/writing.json'
  const previous = JSON.parse(await readFile(file, 'utf8')) as {
    version: number
    items: WritingItem[]
  }
  const excluded = JSON.parse(
    await readFile('content/excluded-writing.json', 'utf8'),
  ) as string[]
  const results = await Promise.allSettled([
    validatedSource(qiita),
    validatedSource(zenn),
  ])
  const fresh: WritingItem[] = []
  results.forEach((result, index) => {
    const source = index === 0 ? 'Qiita' : 'Zenn'
    if (result.status === 'fulfilled' && result.value.length) {
      fresh.push(...result.value)
      console.log(`${source}: ${result.value.length} published items`)
    } else {
      console.error(`${source}: sync failed or empty; saved items retained`)
      process.exitCode = 1
    }
  })
  const next =
    JSON.stringify(
      { version: 1, items: mergeWriting(previous.items, fresh, excluded) },
      null,
      2,
    ) + '\n'
  if (next !== (await readFile(file, 'utf8'))) {
    const temporary = `${file}.${process.pid}.tmp`
    await writeFile(temporary, next)
    await rename(temporary, file)
    console.log('Writing snapshot updated')
  } else console.log('Writing snapshot unchanged')
}
main().catch(() => {
  console.error('Writing validation failed; saved snapshot retained')
  process.exitCode = 1
})
