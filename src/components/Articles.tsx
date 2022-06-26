import dayjs from 'dayjs'
import Image from 'next/image'
import React from 'react'
import { FaExternalLinkAlt } from 'react-icons/fa'

import { Article } from '~/types'

type Props = {
  articles: Article[]
}

const Articles: React.FC<Props> = ({ articles }) => {
  return (
    <section id="articles" className="mt-16">
      <ul className="grid grid-cols-2 gap-4 my-6 lg:mx-5">
        {articles.map((article) => (
          <li className="col-span-2 lg:col-span-1" key={article.id}>
            <a href={article.url} target="_blank" rel="noreferrer">
              <div className="bg-gray-100 hover:bg-gray-200 rounded-lg h-28 py-4 px-6">
                <time className="block h-4 text-gray-500 text-right text-xs my-1">
                  {dayjs(article.created_at).format('YYYY/MM/DD')}
                </time>
                <h3 className="text-lg my-1 truncate">{article.title}</h3>
                <div className="flex items-center text-gray-500 text-xs my-2">
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
