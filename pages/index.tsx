import type { NextPage, GetStaticProps } from 'next'
import Head from 'next/head'
import Image from 'next/image'

import Accounts from '../components/Accounts'
import Articles from '../components/Articles'
import Skills from '../components/Skills'
import { client } from '../libs/client'
import { qiitaClient } from '../libs/qiitaClient'
import { zennClient } from '../libs/zennClient'
import { Portfolio, Article } from '../types'
import { QiitaItem } from '../types/QiitaItem'
import { ZennItem } from '../types/ZennItem'

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

      <div className="py-8"></div>

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

      <Articles articles={articles} />
    </div>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const portfolio = await client.get<Portfolio>({
    endpoint: 'portfolio',
  })
  const qiitaItems = await qiitaClient
    .get<QiitaItem[]>('items')
    .then((res) => res.data)
  const articles = qiitaItems.map(
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
  articles.push(
    ...zennItems.map(
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
  )

  return {
    props: { portfolio, articles },
  }
}

export default Home
