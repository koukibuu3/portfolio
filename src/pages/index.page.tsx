import type { NextPage } from 'next'

import { CustomHead, Footer, Header, Pagination } from '~/components'
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

      <div className="container text-gray-600 mx-auto my-2">
        <Header />
        <ArticleList articles={articles} />
        <Pagination page={page} />
      </div>

      <Footer />
    </>
  )
}

export default IndexPage

export { getStaticProps }
