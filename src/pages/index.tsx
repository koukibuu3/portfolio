import dayjs from 'dayjs'
import type { NextPage, GetStaticProps } from 'next'
import Head from 'next/head'

import {
  Articles,
  ContactForm,
  CustomHead,
  Footer,
  Header,
  Introduce,
  Pagination,
  Skills,
} from '~/components'
import { client, cmsClient } from '~/libs'
import { Article, Portfolio, Page } from '~/types'

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
        {/* <div className="lg:flex lg:flex-row-reverse">
          <Introduce
            portfolio={portfolio}
            classNames="lg:flex-1 lg:pt-16 m-2"
          />
          <Skills skills={portfolio.skills} classNames="lg:flex-1 pt-20 m-2" />
        </div> */}
        <Articles articles={articles} />
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
