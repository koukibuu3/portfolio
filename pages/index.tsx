import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'

const Home: NextPage = () => {
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

      <h1 className="text-5xl py-4 px-2">Title</h1>
    </div>
  )
}

export default Home
