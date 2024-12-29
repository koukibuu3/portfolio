import type { GetStaticPaths, GetStaticProps } from 'next'

import { microCmsClient } from '~/libs'
import { ArticleRepository } from '~/modules/repositories/ArticleRepository'

export const getStaticPaths: GetStaticPaths = async () => {
  const articles = await new ArticleRepository(
    microCmsClient,
  ).getWithPagination(0, 100)

  const paths = articles.map((article) => `/articles/${article.id}`)

  return { paths, fallback: true }
}

export const getStaticProps: GetStaticProps = async (context) => {
  if (!context.params?.id || typeof context.params.id !== 'string') {
    return {
      notFound: true,
    }
  }

  const article = await new ArticleRepository(microCmsClient).getById(
    context.params.id,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    context.previewData?.draftKey,
  )

  return {
    props: { article },
  }
}
