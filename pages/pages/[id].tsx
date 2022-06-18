import { GetStaticPaths, GetStaticProps, NextPage } from 'next'

import { Articles, Footer, Header } from '../../components'
import { client } from '../../libs'
import { Article } from '../../types'

const PER_PAGE = 10

const Page: NextPage<{ articles: Article[] }> = ({ articles }) => {
  return (
    <div className="container text-gray-600 mx-auto my-2">
      <Header />
      <Articles articles={articles} />
      <Footer />
    </div>
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
  const articles = await client.getArticles()

  const id = Number(context.params?.id)

  return {
    props: {
      articles: articles.slice((id - 1) * PER_PAGE, id * PER_PAGE),
    },
  }
}

export default Page
