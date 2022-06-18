import dayjs from 'dayjs'
import type { NextPage, GetStaticProps } from 'next'
import Head from 'next/head'

import {
  Articles,
  ContactForm,
  Footer,
  Header,
  Introduce,
  Skills,
} from '../components'
import { client, cmsClient } from '../libs'
import { Article, Portfolio } from '../types'

const PER_PAGE = 10

type Props = {
  portfolio: Portfolio
  articles: Article[]
}

const Home: NextPage<Props> = ({ portfolio, articles }) => {
  return (
    <>
      <Head>
        <title>Engineer&lsquo;s Blog | {portfolio.title}</title>
      </Head>

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
        {/* <ContactForm /> */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2442796377236015"
          crossOrigin="anonymous"
        ></script>
        <ins
          className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-format="autorelaxed"
          data-ad-client="ca-pub-2442796377236015"
          data-ad-slot="7530960298"
        ></ins>
        <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
      </div>

      <Footer />
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const portfolio = await cmsClient.get<Portfolio>({
    endpoint: 'portfolio',
  })
  const articles = await client.getArticles()

  return {
    props: {
      portfolio,
      articles: articles.slice(0, PER_PAGE),
    },
  }
}

export default Home
