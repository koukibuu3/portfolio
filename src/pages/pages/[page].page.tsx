import { NextPage } from 'next'

import { CustomHead, Footer, Header } from '~/components'
import { Pagination } from '~/components'
import { ArticleList } from '~/components/article'
import { getStaticPaths, getStaticProps } from '~/pages/pages/[page].hook'
import { Article, Page } from '~/types'

type Props = {
  articles: Article[]
  page: Page
}

const PagePage: NextPage<Props> = ({ articles, page }) => {
  return (
    <>
      <CustomHead page={page.currentPage} />
      <div className="container text-gray-600 mx-auto my-2">
        <Header />
        <ArticleList articles={articles} />
        <Pagination page={page} />
        <Footer />
      </div>
    </>
  )
}

export default PagePage

export { getStaticPaths, getStaticProps }
