import dayjs from 'dayjs'
import type { NextPage, GetStaticProps } from 'next'
import Head from 'next/head'

import { Articles, Footer, Header, Introduce, Skills } from '../components'
import { cmsClient, qiitaClient, zennClient } from '../libs'
import { Article, Portfolio, QiitaItem, ZennItem } from '../types'

type Props = {
  portfolio: Portfolio
  articles: Article[]
}

const Home: NextPage<Props> = ({ portfolio, articles }) => {
  return (
    <>
      <Head>
        <title>Portfolio | {portfolio.title}</title>
      </Head>
      <Header />

      <div className="container text-gray-600 mx-auto my-20">
        <div className="lg:flex lg:flex-row-reverse">
          <Introduce
            portfolio={portfolio}
            classNames="lg:flex-1 lg:pt-16 m-2"
          />
          <Skills skills={portfolio.skills} classNames="lg:flex-1 pt-20 m-2" />
        </div>
        <Articles articles={articles} />
      </div>

      <Footer />
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const portfolio = await cmsClient.get<Portfolio>({
    endpoint: 'portfolio',
  })
  const qiitaItems: QiitaItem[] = await qiitaClient.get()
  const qiitaArticles = qiitaItems.map(
    (qiitaItem): Article => ({
      id: qiitaItem.id,
      title: qiitaItem.title,
      body: qiitaItem.body,
      url: qiitaItem.url,
      type: 'qiita',
      created_at: qiitaItem.created_at,
      updated_at: qiitaItem.updated_at,
    })
  )
  const zennItems: ZennItem[] = await zennClient.get()
  const zennArticles = zennItems.map(
    (zennItem): Article => ({
      id: zennItem.link.replace(/^.+articles\//, ''),
      title: zennItem.title,
      body: zennItem.content,
      url: zennItem.link,
      type: 'zenn',
      created_at: zennItem.pubDate,
      updated_at: zennItem.pubDate,
    })
  )

  const articles = qiitaArticles.concat(zennArticles)
  const sortedArticles = articles
    .sort((a, b) => (dayjs(a.created_at).isAfter(b.created_at) ? -1 : 1))
    .slice(0, 5) // FIXME pagination作るまで仮で5件表示

  return {
    props: { portfolio, articles: sortedArticles },
  }
}

export default Home
