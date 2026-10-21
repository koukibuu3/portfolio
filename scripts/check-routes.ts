import assert from 'node:assert/strict'
import { articles } from '../src/content/articles'

const base = process.env.PORTFOLIO_BASE_URL || 'http://127.0.0.1:4173'
const get = (path: string) => fetch(new URL(path, base), { redirect: 'manual' })
async function main() {
  const home = await get('/')
  assert.equal(home.status, 200)
  const html = await home.text()
  assert.equal((html.match(/<h1\b/g) || []).length, 1)
  assert.match(html, /id="card-gg-garage"/)
  assert.doesNotMatch(html, /<dialog\b|data-project=|href="[^"]*\?project=/)
  if (!process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID)
    assert.doesNotMatch(html, /googletagmanager\.com/)
  for (const article of articles) {
    const response = await get(`/articles/${article.id}`)
    assert.equal(response.status, 200)
    const page = await response.text()
    assert.ok(page.includes(`https://koukibuu3.dev/articles/${article.id}`))
    assert.ok(page.includes('article-body'))
    assert.equal((await get(article.mainImage.url)).status, 200)
  }
  const list = await (await get('/api/articles?page=1&perPage=100')).json()
  assert.equal(list.length, articles.length)
  assert.ok(
    list.every(
      (article: { body: string; bodyFile?: string }) =>
        article.body && !article.bodyFile,
    ),
  )
  assert.equal((await get('/api/articles?page=0')).status, 400)
  assert.equal((await get('/articles/not-an-article')).status, 404)
  assert.equal((await get('/knowledge/pages/0')).status, 404)
  assert.equal((await get('/knowledge/pages/nope')).status, 404)
  for (const [path, target] of [
    ['/projects', '/#projects'],
    ['/writing', '/#writing'],
    ['/about', '/#about'],
    ['/knowledge/pages/1', '/#writing'],
  ]) {
    const response = await get(path)
    assert.equal(response.status, 308, path)
    assert.equal(response.headers.get('location'), target)
  }
  const preview = await get('/api/preview?slug=example')
  assert.equal(preview.status, 410)
  assert.equal(preview.headers.get('cache-control'), 'no-store')
  assert.equal(preview.headers.get('set-cookie'), null)
  const rss = await (await get('/api/rss')).text()
  assert.equal((rss.match(/<item>/g) || []).length, articles.length)
  assert.ok(
    articles.every((article) =>
      rss.includes(`https://koukibuu3.dev/articles/${article.id}`),
    ),
  )
  assert.ok(
    articles.every((article) => rss.includes(article.rssGuid)),
    'Existing RSS GUIDs must be retained',
  )
  const sitemap = await (await get('/sitemap.xml')).text()
  assert.equal((sitemap.match(/<loc>/g) || []).length, articles.length + 1)
  assert.doesNotMatch(sitemap, /koukibuu3\.net|example\.com|\?project/)
  const robots = await (await get('/robots.txt')).text()
  assert.match(robots, /https:\/\/koukibuu3.dev\/sitemap.xml/)
  const og = await get('/opengraph-image')
  assert.equal(og.status, 200)
  assert.match(og.headers.get('content-type') || '', /image\/png/)
  console.log(
    'PASS: home, all 4 articles/images, API, 404s, 308 redirects, retired preview, RSS, sitemap, robots and OGP.',
  )
}
main().catch((error) => {
  console.error(error instanceof Error ? error.message : 'Route check failed')
  process.exitCode = 1
})
