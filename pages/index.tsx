import type { NextPage, GetStaticProps } from 'next'
import Head from 'next/head'
import Image from 'next/image'

import Accounts from '../components/Accounts'
import Articles from '../components/Articles'
import Skills from '../components/Skills'
import { client } from '../libs/client'
import { Portfolio, Article } from '../types'

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
  const portfolio = await client.get({
    endpoint: 'portfolio',
  })
  const articles = await fetch(
    'https://qiita.com/api/v2/users/koukibuu3/items?page=1&per_page=5'
  ).then((res) => res.json())
  return {
    props: { portfolio, articles },
  }
}

export default Home
