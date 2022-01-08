import dayjs from 'dayjs'
import Image from 'next/image'
import React from 'react'
import { FaExternalLinkAlt } from 'react-icons/fa'

import { Article } from '../types'

type Props = {
  articles: Article[]
}

const Articles: React.VFC<Props> = ({ articles }) => {
  return (
    <section className="mx-2 my-16">
      <h2 className="text-4xl">Articles</h2>
      <div className="text-xl my-2">開発メモ</div>
      <ul className="grid grid-cols-2 gap-4 my-6">
        {articles.map((article) => (
          <li className="col-span-2" key={article.id}>
            <a href={article.url} target="_blank" rel="noreferrer">
              <div className="bg-gray-100 hover:bg-gray-200 rounded-lg h-28 py-4 px-6">
                <time className="block text-right text-sm">
                  {dayjs(article.created_at).format('YYYY/MM/DD')}
                </time>
                <h3 className="text-lg my-1 truncate">{article.title}</h3>
                <div className="flex items-center text-xs my-2">
                  <div className="h-4 w-4">
                    <Image
                      src={`/img/${article.type}.png`}
                      alt={article.type}
                      height={18}
                      width={18}
                    />
                  </div>
                  <div className="h-4">{article.type}</div>
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
  )
}

export default Articles
