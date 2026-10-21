import sanitizeHtml from 'sanitize-html'

export type WritingItem = {
  id: string
  source: 'local' | 'zenn' | 'qiita'
  title: string
  url: string
  publishedAt?: string
  updatedAt?: string
  description?: string
}

export function publicUrl(value: string, host?: string) {
  const url = new URL(value)
  if (
    url.protocol !== 'https:' ||
    url.username ||
    url.password ||
    (host && url.hostname !== host)
  ) {
    throw new Error('Invalid public URL')
  }
  url.hash = ''
  for (const key of [...url.searchParams.keys()]) {
    if (key.startsWith('utm_') || key === 'ref') url.searchParams.delete(key)
  }
  return url.href
}

export function sortWriting(items: WritingItem[]) {
  return [...items].sort(
    (a, b) =>
      (b.publishedAt ? Date.parse(b.publishedAt) : -Infinity) -
        (a.publishedAt ? Date.parse(a.publishedAt) : -Infinity) ||
      a.id.localeCompare(b.id),
  )
}

export function validateWriting(items: WritingItem[]) {
  const ids = new Set<string>()
  for (const item of items) {
    if (
      !item.title?.trim() ||
      !/^(local|qiita|zenn):[a-zA-Z0-9_-]+$/.test(item.id) ||
      ids.has(item.id)
    ) {
      throw new Error('Invalid or duplicate writing item')
    }
    ids.add(item.id)
    if (item.source === 'local') {
      if (!/^\/articles\/[a-zA-Z0-9_-]+$/.test(item.url))
        throw new Error('Invalid article path')
    } else {
      publicUrl(item.url, item.source === 'qiita' ? 'qiita.com' : 'zenn.dev')
    }
    if (!item.id.startsWith(item.source + ':'))
      throw new Error('Writing source mismatch')
    for (const date of [item.publishedAt, item.updatedAt]) {
      const calendar = date?.match(/^(\d{4})-(\d{2})-(\d{2})(?:T|$)/)
      const day = calendar
        ? new Date(Date.UTC(+calendar[1], +calendar[2] - 1, +calendar[3]))
        : null
      if (
        date !== undefined &&
        (!calendar ||
          !day ||
          day.toISOString().slice(0, 10) !== date.slice(0, 10) ||
          !Number.isFinite(Date.parse(date)))
      )
        throw new Error('Invalid writing date')
    }
  }
}

export async function validatedSource(load: () => Promise<WritingItem[]>) {
  const items = await load()
  if (!items.length) throw new Error('Empty source')
  validateWriting(items)
  return items
}

export function mergeWriting(
  previous: WritingItem[],
  fresh: WritingItem[],
  excluded: string[] = [],
) {
  validateWriting(previous)
  validateWriting(fresh)
  const byId = new Map(previous.map((item) => [item.id, item]))
  fresh.forEach((item) => byId.set(item.id, item))
  const urls = new Set<string>()
  return sortWriting(
    [...byId.values()].filter((item) => !excluded.includes(item.id)),
  ).filter((item) => {
    if (urls.has(item.url)) return false
    urls.add(item.url)
    return true
  })
}

export function cleanArticle(html: string) {
  return sanitizeHtml(html, {
    allowedTags: [
      ...sanitizeHtml.defaults.allowedTags,
      'img',
      'iframe',
      'figure',
      'figcaption',
      'span',
      's',
      'del',
      'ins',
      'details',
      'summary',
    ],
    allowedAttributes: {
      '*': ['id', 'class'],
      a: ['href', 'title', 'target', 'rel'],
      img: ['src', 'alt', 'width', 'height', 'loading', 'srcset', 'sizes'],
      iframe: [
        'src',
        'title',
        'width',
        'height',
        'allowfullscreen',
        'loading',
        'allow',
        'frameborder',
      ],
      code: ['class'],
      span: ['class', 'style'],
      td: ['colspan', 'rowspan'],
      th: ['colspan', 'rowspan', 'scope'],
    },
    allowedStyles: {
      span: {
        color: [/^#[0-9a-f]{3,8}$/i, /^rgba?\([\d\s.,%]+\)$/i],
        'background-color': [/^#[0-9a-f]{3,8}$/i],
      },
    },
    allowedSchemes: ['https', 'http', 'mailto'],
    allowProtocolRelative: false,
    allowedIframeHostnames: [
      'www.youtube.com',
      'www.youtube-nocookie.com',
      'speakerdeck.com',
      'koukibuu3.github.io',
    ],
    transformTags: {
      a: (_, attrs) => ({
        tagName: 'a',
        attribs: {
          ...attrs,
          ...(attrs.target === '_blank' ? { rel: 'noopener noreferrer' } : {}),
        },
      }),
      img: (_, attrs) => ({
        tagName: 'img',
        attribs: { ...attrs, loading: 'lazy' },
      }),
      iframe: (_, attrs) => ({
        tagName: 'iframe',
        attribs: { ...attrs, loading: 'lazy' },
      }),
    },
  })
}

export async function fetchPublic(
  url: string,
  headers?: Record<string, string>,
) {
  for (let attempt = 0; attempt < 3; attempt++) {
    const response = await fetch(url, {
      headers,
      signal: AbortSignal.timeout(10_000),
    }).catch(() => null)
    if (response?.ok) {
      const reader = response.body?.getReader()
      if (!reader) throw new Error('Empty response')
      const chunks: Uint8Array[] = []
      let size = 0
      while (true) {
        const { value, done } = await reader.read()
        if (done) break
        size += value.length
        if (size > 5_000_000) {
          await reader.cancel()
          throw new Error('Response too large')
        }
        chunks.push(value)
      }
      return Buffer.concat(chunks)
    }
    if (response && response.status !== 429 && response.status < 500)
      throw new Error(`HTTP ${response.status}`)
    if (attempt === 2) throw new Error('Source unavailable after retries')
    const retry = Number(response?.headers.get('retry-after'))
    if (retry > 30) throw new Error('Retry deferred by source')
    await new Promise((resolve) =>
      setTimeout(resolve, Math.max(1, retry || attempt + 1) * 1000),
    )
  }
  throw new Error('Source unavailable')
}
