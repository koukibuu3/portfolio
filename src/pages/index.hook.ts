import type { GetStaticProps } from 'next'

import { client } from '~/libs'

const PER_PAGE = 10

export const getStaticProps: GetStaticProps = async () => {
  const [articles, page] = await client.getArticlesWithPagination(0, PER_PAGE)

  return {
    props: { articles, page },
  }
}
