import dayjs from 'dayjs'
import type { NextPage, GetStaticProps } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { FaExternalLinkAlt } from 'react-icons/fa'

import Accounts from '../components/Accounts'
import Skills from '../components/Skills'
import { client } from '../libs/client'
import { Portfolio, Qiita } from '../types'

type Props = {
  portfolio: Portfolio
  qiitaData: Qiita[]
}

const Home: NextPage<Props> = ({ portfolio, qiitaData }) => {
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

      <section className="mx-2 my-16">
        <h2 className="text-4xl">Knowledges</h2>
        <div className="text-xl my-2">開発メモ</div>
        <ul className="grid grid-cols-2 gap-4 my-6">
          {qiitaData.map((data, i) => (
            <li className="col-span-2" key={i}>
              <a href={data.url} target="_blank" rel="noreferrer">
                <div className="bg-gray-100 hover:bg-gray-200 rounded-lg h-28 py-4 px-6">
                  <time className="block text-right text-sm">
                    {dayjs(data.created_at).format('YYYY/MM/DD')}
                  </time>
                  <h3 className="text-lg my-1 truncate">{data.title}</h3>
                  <div className="flex items-center text-xs my-2">
                    <div className="h-4 w-4">
                      <Image
                        src="/img/qiita.png"
                        alt="qiita"
                        height={18}
                        width={18}
                      />
                    </div>
                    <div className="h-4">qiita</div>
                    <div className="ml-auto">
                      <FaExternalLinkAlt size="1.3em" />
                    </div>
                  </div>
                </div>
              </a>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const portfolio = await client.get({
    endpoint: 'portfolio',
  })
  const qiitaData = await fetch(
    'https://qiita.com/api/v2/users/koukibuu3/items?page=1&per_page=5'
  ).then((res) => res.json())
  return {
    props: { portfolio, qiitaData },
  }
}

export default Home
