import type { NextPage } from 'next'

import { CustomHead, Footer, Pagination } from '~/components'
import { GlobalNavigation } from '~/components/GlobalNavigation'
import { ArticleList } from '~/components/article'
import { getStaticProps } from '~/pages/index.hook'
import { Article, Page } from '~/types'

type Props = {
  articles: Article[]
  page: Page
}

const IndexPage: NextPage<Props> = ({ articles, page }) => {
  return (
    <>
      <CustomHead />

      <div className="text-gray-600 mx-auto">
        <GlobalNavigation />
        <ArticleList articles={articles} />
        <Pagination page={page} />
      </div>

      <Footer />
    </>
  )
}

export default IndexPage

export { getStaticProps }
