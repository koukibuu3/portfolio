import type { NextPage, GetStaticProps } from 'next'

import { CustomHead, Footer, Header, Pagination } from '~/components'
import { ArticleList } from '~/components/article'
import { client } from '~/libs'
import { Article, Page } from '~/types'

const PER_PAGE = 10

type Props = {
  articles: Article[]
  page: Page
}

const Home: NextPage<Props> = ({ articles, page }) => {
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

export const getStaticProps: GetStaticProps = async () => {
  const [articles, page] = await client.getArticlesWithPagination(0, PER_PAGE)

  return {
    props: { articles, page },
  }
}

export default Home
