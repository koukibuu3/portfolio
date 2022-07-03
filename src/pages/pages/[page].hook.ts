import type { GetStaticPaths, GetStaticProps } from 'next'

import { client } from '~/libs'
import { range } from '~/utils'

const PER_PAGE = 10

export const getStaticPaths: GetStaticPaths = async () => {
  const articles = await client.getArticles()

  const paths = range(1, Math.ceil(articles.length / PER_PAGE)).map(
    (i) => `/pages/${i}`
  )

  return { paths, fallback: false }
}

export const getStaticProps: GetStaticProps = async (context) => {
  const [articles, page] = await client.getArticlesWithPagination(
    (Number(context.params?.page) - 1) * PER_PAGE,
    PER_PAGE
  )

  return {
    props: { articles, page },
  }
}
