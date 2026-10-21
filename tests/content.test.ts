import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import {
  cleanArticle,
  mergeWriting,
  publicUrl,
  sortWriting,
  validateWriting,
  validatedSource,
  type WritingItem,
} from '../scripts/lib/content'
import { ProjectDetails } from '../src/components/projects/ProjectDetails'
import { articles, articleBody } from '../src/content/articles'
import { projects } from '../src/content/projects'
import { formatDate, jsonLd } from '../src/content/site'
import { GET as getArticles } from '../src/app/api/articles/route'

function item(
  id: string,
  date?: string,
  source: 'qiita' | 'zenn' = 'qiita',
): WritingItem {
  return {
    id: `${source}:${id}`,
    source,
    title: '同じタイトル',
    url: `https://${source === 'qiita' ? 'qiita.com/user/items' : 'zenn.dev/user/articles'}/${id}`,
    ...(date ? { publishedAt: date } : {}),
  }
}

test('partial sync preserves the failed source and articles absent from a feed', () => {
  const old = [
    item('old', '2024-01-01'),
    item('retained', '2025-01-01', 'zenn'),
  ]
  const fresh = [{ ...item('new', '2026-01-01'), title: '新しい記事' }]
  assert.deepEqual(
    mergeWriting(old, fresh).map((article) => article.id),
    ['qiita:new', 'zenn:retained', 'qiita:old'],
  )
  assert.deepEqual(
    mergeWriting(old, fresh, ['qiita:old']).map((article) => article.id),
    ['qiita:new', 'zenn:retained'],
  )
  assert.equal(mergeWriting(old, [])[0].id, 'zenn:retained')
})

test('updates by source ID without collapsing same-title articles', () => {
  const original = item('same', '2025-01-01')
  const next = mergeWriting(
    [original, item('other', '2025-01-01', 'zenn')],
    [{ ...original, title: '更新' }],
  )
  assert.equal(next.length, 2)
  assert.equal(
    next.find((article) => article.id === original.id)?.title,
    '更新',
  )
  const canonical = { ...item('alias', '2024-01-01'), url: original.url }
  assert.equal(mergeWriting([original], [canonical]).length, 1)
})

test('sort uses publication time, stable IDs, then undated items', () => {
  const result = sortWriting([
    item('undated'),
    item('b', '2025-01-01T09:00:00+09:00'),
    item('a', '2025-01-01T00:00:00Z'),
  ])
  assert.deepEqual(
    result.map((article) => article.id),
    ['qiita:a', 'qiita:b', 'qiita:undated'],
  )
})

test('untrusted URLs, duplicate IDs, source mismatches and invalid dates are rejected', () => {
  for (const url of [
    'javascript:alert(1)',
    'http://qiita.com/a',
    'https://qiita.com.evil.test/a',
    'https://user:password@qiita.com/a',
  ])
    assert.throws(() => publicUrl(url, 'qiita.com'))
  assert.equal(
    publicUrl('https://qiita.com/a?utm_source=test&item=1#top'),
    'https://qiita.com/a?item=1',
  )
  assert.throws(() => validateWriting([item('a'), item('a')]))
  assert.throws(() =>
    validateWriting([{ ...item('a'), publishedAt: '2025-02-31' }]),
  )
  assert.throws(() =>
    validateWriting([{ ...item('a'), publishedAt: 'invalid' }]),
  )
  assert.throws(() => validateWriting([{ ...item('a'), source: 'zenn' }]))
  assert.throws(() =>
    validateWriting([
      { ...item('a'), source: 'local', id: 'local:a', url: '//evil.test/a' },
    ]),
  )
})

test('article sanitizer keeps code, tables and anchors while removing executable markup', () => {
  const clean = cleanArticle(
    '<h2 id="heading">見出し</h2><pre><code>&lt;script&gt;</code></pre><table><tr><td>表</td></tr></table><a href="#heading">移動</a><img src="/content/a.png" onerror="alert(1)"><script>alert(1)</script><a href="javascript:alert(1)">危険</a><iframe src="https://evil.test/embed"></iframe>',
  )
  assert.match(clean, /id="heading"/)
  assert.match(clean, /&lt;script&gt;/)
  assert.match(clean, /<table>/)
  assert.match(clean, /href="#heading"/)
  assert.doesNotMatch(clean, /onerror|javascript:|<script>|evil\.test/)
  assert.match(
    cleanArticle(
      '<iframe src="https://koukibuu3.github.io/slides/example/"></iframe>',
    ),
    /src="https:\/\/koukibuu3.github.io/,
  )
})

test('saved legacy export is complete and body links and code survive', async () => {
  const report = JSON.parse(
    await readFile('content/legacy/export-report.json', 'utf8'),
  )
  assert.equal(report.source, 'microCMS public API')
  assert.equal(report.publishedCount, articles.length)
  assert.equal(articles.length, 4)
  for (const article of articles) {
    const body = await articleBody(article)
    assert.ok(body.length > 100)
    assert.doesNotMatch(body, /<script\b|\son\w+=/i)
    await readFile(`public${article.mainImage.url}`)
  }
  assert.match(
    await articleBody(
      articles.find((article) => article.id === '1ipcx2fh69e8')!,
    ),
    /koukibuu3.github.io\/slides/,
  )
})

test('minimal project details contain content without images or empty optional sections', () => {
  const html = renderToStaticMarkup(
    createElement(ProjectDetails, { project: projects[2], titleId: 'title' }),
  )
  assert.match(html, /G.G. Garage/)
  assert.match(html, /共同ゲーム開発/)
  assert.doesNotMatch(html, /<img|<figure|Technology|担当|Coming Soon/)
})

test('article API validates pagination and preserves the legacy array response', async () => {
  for (const query of [
    'page=0',
    'page=-1',
    'page=x',
    'perPage=101',
    'perPage=1.5',
  ]) {
    assert.equal(
      (
        await getArticles(
          new Request(`https://example.test/api/articles?${query}`),
        )
      ).status,
      400,
    )
  }
  const response = await getArticles(
    new Request('https://example.test/api/articles?page=1&perPage=2'),
  )
  const data = await response.json()
  assert.equal(data.length, 2)
  assert.ok(data[0].body)
  assert.equal(data[0].bodyFile, undefined)
  assert.deepEqual(
    await (
      await getArticles(
        new Request('https://example.test/api/articles?page=100'),
      )
    ).json(),
    [],
  )
})

test('dates use Japan time and JSON-LD cannot terminate its script element', () => {
  assert.equal(formatDate('2026-10-20T23:30:00Z'), '2026.10.21')
  assert.doesNotMatch(
    jsonLd({ title: '</script><script>alert(1)</script>' }),
    /</,
  )
})

test('empty or malformed source is isolated before merging successful updates', async () => {
  const old = [item('retained', '2025-01-01', 'zenn')]
  const results = await Promise.allSettled([
    validatedSource(async () => [item('new', '2026-01-01')]),
    validatedSource(async () => [
      { ...item('broken', undefined, 'zenn'), title: '' },
    ]),
  ])
  assert.equal(results[0].status, 'fulfilled')
  assert.equal(results[1].status, 'rejected')
  const fresh = results.flatMap((result) =>
    result.status === 'fulfilled' ? result.value : [],
  )
  assert.deepEqual(
    mergeWriting(old, fresh).map((article) => article.id),
    ['qiita:new', 'zenn:retained'],
  )
  await assert.rejects(validatedSource(async () => []))
})
