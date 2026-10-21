import type { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { articleBody, articles, findArticle } from '~/content/articles'
import { formatDate, jsonLd, site } from '~/content/site'

type Props = { params: Promise<{ id: string }> }
export const dynamicParams = false
export const dynamic = 'error'
export function generateStaticParams() {
  return articles.map(({ id }) => ({ id }))
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = findArticle((await params).id)
  if (!article) notFound()
  return {
    title: article.title,
    description: article.description,
    alternates: { canonical: `/articles/${article.id}` },
    openGraph: {
      title: article.title,
      description: article.description,
      type: 'article',
      url: `/articles/${article.id}`,
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt,
      images: [article.mainImage.url],
    },
  }
}
export default async function ArticlePage({ params }: Props) {
  const article = findArticle((await params).id)
  if (!article) notFound()
  const body = await articleBody(article)
  return (
    <main id="main" className="wrap article-page" tabIndex={-1}>
      <a className="article-back textlink" href="/#writing">
        ← Writing
      </a>
      <header className="article-header">
        <h1>{article.title}</h1>
        <div className="article-meta">
          <time dateTime={article.publishedAt}>
            {formatDate(article.publishedAt)}
          </time>
          {article.tags.map((tag) => (
            <span key={tag.id}>{tag.name}</span>
          ))}
        </div>
      </header>
      <Image
        className="article-cover"
        src={article.mainImage.url}
        width={article.mainImage.width}
        height={article.mainImage.height}
        alt={`「${article.title}」のメイン画像`}
        sizes="(min-width: 880px) 800px, 100vw"
        priority
      />
      <article
        className="article-body"
        dangerouslySetInnerHTML={{ __html: body }}
      />
      <a className="textlink article-end" href="/#writing">
        ← Writingへ戻る
      </a>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd({
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: article.title,
            description: article.description,
            datePublished: article.publishedAt,
            dateModified: article.updatedAt,
            url: `${site.url}/articles/${article.id}`,
            image: `${site.url}${article.mainImage.url}`,
            author: { '@type': 'Person', name: 'Kouki Akasaka', url: site.url },
          }),
        }}
      />
    </main>
  )
}
