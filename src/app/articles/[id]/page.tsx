import { type Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'

import { metadata } from '~/app/layout'
import { Meta } from '~/components/Article/Meta'
import { Body } from '~/components/ArticleDetail/Body'
import { ArticleRepository } from '~/modules/repositories/ArticleRepository'

type Props = {
  params: Promise<{ id: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export const generateMetadata = async ({
  params,
}: Props): Promise<Metadata> => {
  const { id } = await params
  const article = await new ArticleRepository().getById(id)
  if (!article) {
    return notFound()
  }

  const title = `${article.title} | ${metadata.title}`

  return {
    title,
    description: article.description,
    openGraph: {
      title,
      description: article.description,
      images: [article.mainImage.url],
    },
  }
}

const ArticlePage = async ({ params }: Props) => {
  const { id } = await params
  const article = await new ArticleRepository().getById(id)

  if (!article) {
    return notFound()
  }

  return (
    <div className="mx-auto max-w-screen-sm">
      <Image
        src={article.mainImage.url}
        alt={`「${article.title}」のメイン画像`}
        width={article.mainImage.width}
        height={article.mainImage.height}
        className="w-full rounded-none md:rounded-md"
      />

      <div className="m-4 mb-16 mx-4 md:mx-auto">
        <h1 className="text-3xl font-bold mb-4 leading-snug">
          {article.title}
        </h1>
        <Meta tags={article.tags} publishedAt={article.publishedAt} />
      </div>

      <Body article={article} />
    </div>
  )
}

export async function generateStaticParams() {
  const repository = new ArticleRepository()
  // 全記事を取得（ページネーションなし）
  const articles = await repository.getWithPagination(1, 1000)
  
  return articles.map((article) => ({
    id: article.id,
  }))
}

export default ArticlePage
