import type { NextPage, GetStaticProps } from 'next'
import Head from 'next/head'
import Image from 'next/image'

import Skills from '../components/Skills'
import { client } from '../libs/client'
import { Portfolio } from '../types'

type Props = {
  portfolio: Portfolio
}

const Home: NextPage<Props> = ({ portfolio }) => {
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

      <Skills skills={portfolio.skills} />
    </div>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const portfolio = await client.get({
    endpoint: 'portfolio',
  })
  return {
    props: { portfolio },
  }
}

export default Home
