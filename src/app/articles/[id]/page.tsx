import { type Metadata } from 'next'
import { draftMode } from 'next/headers'
import Image from 'next/image'
import { notFound } from 'next/navigation'

import { metadata } from '~/app/layout'
import { Meta } from '~/components/Article/Meta'
import { Body } from '~/components/ArticleDetail/Body'
import { microCmsClient } from '~/modules/libs'
import { ArticleRepository } from '~/modules/repositories/ArticleRepository'

type Props = {
  params: Promise<{ id: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export const generateMetadata = async ({
  params,
  searchParams,
}: Props): Promise<Metadata> => {
  const { id } = await params
  const { draftKey } = await searchParams
  const { isEnabled } = await draftMode()
  const article = await new ArticleRepository(microCmsClient).getById(
    id,
    isEnabled ? (draftKey as string) : undefined,
  )
  if (!article) {
    return notFound()
  }

  const title = `${isEnabled ? '[下書き] ' : ''}${article.title} | ${metadata.title}`

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

const ArticlePage = async ({ params, searchParams }: Props) => {
  const { id } = await params
  const { draftKey } = await searchParams
  const { isEnabled } = await draftMode()
  const article = await new ArticleRepository(microCmsClient).getById(
    id,
    isEnabled ? (draftKey as string) : undefined,
  )

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
        <h1 className="text-3xl font-bold mb-4">{article.title}</h1>
        <Meta tags={article.tags} publishedAt={article.publishedAt} />
      </div>

      <Body article={article} />
    </div>
  )
}

export default ArticlePage
