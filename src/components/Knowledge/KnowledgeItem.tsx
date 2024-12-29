import dayjs from 'dayjs'
import Image from 'next/image'
import React from 'react'
import { FaExternalLinkAlt } from 'react-icons/fa'

import { Knowledge } from '~/types'

type Props = {
  knowledge: Knowledge
}

export const KnowledgeItem: React.FC<Props> = ({ knowledge }) => {
  return (
    <li className="col-span-3 sm:col-span-1" key={knowledge.id}>
      <a href={knowledge.url} target="_blank" rel="noreferrer">
        <div className="bg-gray-100 hover:bg-gray-200 rounded-md py-3 px-6">
          <time className="block h-4 text-right text-xs">
            {dayjs(knowledge.created_at).format('YYYY/MM/DD')}
          </time>
          <h3 className="text-lg font-semibold line-clamp-2 h-14 my-2">
            {knowledge.title}
          </h3>
          <div className="flex items-center text-xs my-1">
            <div className="h-4 w-4">
              <Image
                src={`/img/${knowledge.type}.png`}
                alt={knowledge.type}
                height={18}
                width={18}
              />
            </div>
            <div className="h-4">{knowledge.type}</div>
            <div className="ml-auto">
              <FaExternalLinkAlt size="14px" />
            </div>
          </div>
        </div>
      </a>
    </li>
  )
}
