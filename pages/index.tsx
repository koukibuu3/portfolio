import dayjs from 'dayjs'
import type { NextPage, GetStaticProps } from 'next'
import Head from 'next/head'
import Image from 'next/image'

import { Accounts, Articles, Footer, Header, Skills } from '../components'
import { cmsClient, qiitaClient, zennClient } from '../libs'
import { Article, Portfolio, QiitaItem, ZennItem } from '../types'

type Props = {
  portfolio: Portfolio
  articles: Article[]
}

const Home: NextPage<Props> = ({ portfolio, articles }) => {
  return (
    <div className="container mx-auto my-4 px-4">
      <Head>
        <title>Portfolio</title>
      </Head>

      <Header />

      <div className="mt-20">
        <Image
          alt="メイン画像"
          src={portfolio.mainImage.url}
          width={380}
          height={169}
          priority
        />

        <h1 className="text-5xl py-4 px-2">{portfolio.title}</h1>
        <p className="text-base px-2">{portfolio.detail}</p>
        <Accounts accounts={portfolio.accounts} />

        <Skills skills={portfolio.skills} />
      </div>

      <Articles articles={articles} />

      <Footer />
    </div>
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
