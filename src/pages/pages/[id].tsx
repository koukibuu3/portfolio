import { GetStaticPaths, GetStaticProps, NextPage } from 'next'

import { Articles, CustomHead, Footer, Header } from '~/components'
import { Pagination } from '~/components'
import { client } from '~/libs'
import { Article, Page } from '~/types'

const PER_PAGE = 10

const Page: NextPage<{ articles: Article[]; page: Page }> = ({
  articles,
  page,
}) => {
  return (
    <>
      <CustomHead page={page.currentPage} />
      <div className="container text-gray-600 mx-auto my-2">
        <Header />
        <Articles articles={articles} />
        <Pagination page={page} />
        <Footer />
      </div>
    </>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const articles = await client.getArticles()

  const range = (start: number, end: number) =>
    [...Array(end - start + 1)].map((_, i) => start + i)

  const paths = range(1, Math.ceil(articles.length / PER_PAGE)).map(
    (i) => `/pages/${i}`
  )

  return { paths, fallback: false }
}

export const getStaticProps: GetStaticProps = async (context) => {
  const id = Number(context.params?.id)
  const [articles, page] = await client.getArticlesWithPagination(
    (id - 1) * PER_PAGE,
    PER_PAGE
  )

  return {
    props: { articles, page },
  }
}

export default Page
