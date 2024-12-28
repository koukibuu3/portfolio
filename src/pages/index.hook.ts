import type { GetStaticProps } from 'next'

import { client, microCmsClient } from '~/libs'
import { ArticleRepository } from '~/modules/repositories/ArticleRepository'
import { Article, Knowledge, Page } from '~/types'

const PER_PAGE = 3

export type Props = {
  defaultArticles: Article[]
  knowledgeList: Knowledge[]
  page: Page
}

export const getStaticProps: GetStaticProps = async () => {
  const [knowledgeList, page] = await client.getAllWithPagination(0, PER_PAGE)
  const defaultArticles = await new ArticleRepository(microCmsClient).get(
    0,
    PER_PAGE,
  )

  return {
    props: {
      defaultArticles,
      knowledgeList,
      page,
    },
  }
}
