import dayjs from 'dayjs'
import Image from 'next/image'
import { FaExternalLinkAlt } from 'react-icons/fa'

import type { Post } from '~/types'

type Props = {
  post: Post
}

const platformLabel: Record<'qiita' | 'zenn', string> = {
  qiita: 'Qiita',
  zenn: 'Zenn',
}

const platformColor: Record<'qiita' | 'zenn', string> = {
  qiita: 'bg-green-500',
  zenn: 'bg-blue-400',
}

export const PostItem: React.FC<Props> = ({ post }) => {
  if (post.source === 'microcms') {
    const article = post.data
    return (
      <li className="col-span-2 sm:col-span-1">
        <a
          href={`/articles/${article.id}`}
          className="flex flex-col gap-2 w-full"
        >
          <h2 className="text-xl font-bold text-black">
            {article.tags?.find((tag) => tag.name === 'TECH') && (
              <span className="bg-blue-500 text-white rounded-full text-sm px-2 py-1 mr-1">
                TECH
              </span>
            )}
            {article.tags?.find((tag) => tag.name === 'POEM') && (
              <span className="bg-pink-400 text-white rounded-full text-sm px-2 py-1 mr-1">
                POEM
              </span>
            )}
            {article.title}
          </h2>
          <div className="flex flex-row justify-between mr-2">
            <span className="text-sm text-gray-500">Blog</span>
            <time className="text-sm">
              {dayjs(article.publishedAt).format('YYYY/MM/DD')}
            </time>
          </div>
          <p className="text-sm">
            {article.description.length > 80
              ? article.description.substring(0, 80) + '...'
              : article.description}
          </p>
        </a>
      </li>
    )
  }

  const knowledge = post.data
  const platform = knowledge.type

  return (
    <li className="col-span-2 sm:col-span-1">
      <a
        href={knowledge.url}
        target="_blank"
        rel="noreferrer"
        className="flex flex-col gap-2 w-full"
      >
        <h2 className="text-xl font-bold text-black">
          <span
            className={`${platformColor[platform]} text-white rounded-full text-sm px-2 py-1 mr-1`}
          >
            {platformLabel[platform]}
          </span>
          {knowledge.title}
        </h2>
        <div className="flex flex-row justify-between items-center mr-2">
          <div className="flex items-center gap-1">
            <Image
              src={`/img/${platform}.png`}
              alt={platform}
              height={16}
              width={16}
            />
            <span className="text-sm text-gray-500">
              {platformLabel[platform]}
            </span>
          </div>
          <time className="text-sm">
            {dayjs(knowledge.created_at).format('YYYY/MM/DD')}
          </time>
        </div>
        <p className="text-sm flex items-center text-blue-500 gap-0.5">
          <FaExternalLinkAlt size="12px" />
          {platformLabel[platform]}で読む
        </p>
      </a>
    </li>
  )
}
