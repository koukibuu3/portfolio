import type { GetStaticProps } from 'next'

import { client, microCmsClient } from '~/libs'
import { ArticleRepository } from '~/modules/repositories/ArticleRepository'
import { ProfileRepository } from '~/modules/repositories/ProfileRepository'
import { Article, Knowledge, Page, Profile } from '~/types'

const PER_PAGE = 9

export type Props = {
  defaultArticles: Article[]
  knowledgeList: Knowledge[]
  page: Page
  profile: Profile
}

export const getStaticProps: GetStaticProps = async () => {
  const [knowledgeList, page] = await client.getAllWithPagination(0, PER_PAGE)
  const defaultArticles = await new ArticleRepository(
    microCmsClient,
  ).getWithPagination(0, PER_PAGE)
  const profile = await new ProfileRepository(microCmsClient).get()

  return {
    props: {
      defaultArticles,
      knowledgeList,
      page,
      profile,
    },
  }
}
