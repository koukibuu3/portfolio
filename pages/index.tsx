import type { NextPage, GetStaticProps } from 'next'
import Head from 'next/head'
import Image from 'next/image'

import { client } from '../libs/client'

type Props = {
  introduction: {
    title: string
    detail: string
  }
}

const Home: NextPage<Props> = ({ introduction }) => {
  return (
    <div className="container mx-auto my-4 px-4">
      <Head>
        <title>Portfolio</title>
      </Head>

      <div className="py-8"></div>

      <Image
        alt="mainimage"
        src="/images/mainimage.png"
        width="380"
        height="169"
      />

      <h1 className="text-5xl py-4 px-2">{introduction.title}</h1>
      <p className="text-base px-2">{introduction.detail}</p>
    </div>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const introduction = await client.get({
    endpoint: 'introduction',
  })
  return {
    props: { introduction },
  }
}

export default Home
