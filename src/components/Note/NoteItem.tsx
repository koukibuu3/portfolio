import dayjs from 'dayjs'
import Image from 'next/image'
import React from 'react'
import { FaExternalLinkAlt } from 'react-icons/fa'

import { Note } from '~/types'

type Props = {
  note: Note
}

export const NoteItem: React.FC<Props> = ({ note }) => {
  return (
    <li className="col-span-2 sm:col-span-1" key={note.id}>
      <a href={note.url} target="_blank" rel="noreferrer">
        <div className="bg-gray-100 hover:bg-gray-200 rounded-lg py-4 px-6">
          <time className="block h-4 text-gray-500 text-right text-xs my-1">
            {dayjs(note.created_at).format('YYYY/MM/DD')}
          </time>
          <h3 className="text-lg h-14 my-2 line-clamp-2">{note.title}</h3>
          <p className="text-xs text-gray-500 h-12 ml-3 my-2 line-clamp-3">
            {note.description}
          </p>
          <div className="flex items-center text-gray-500 text-xs my-1">
            <div className="h-4 w-4">
              <Image
                src={`/img/${note.type}.png`}
                alt={note.type}
                height={18}
                width={18}
              />
            </div>
            <div className="h-4">{note.type}</div>
            <div className="ml-auto">
              <FaExternalLinkAlt size="1.3em" />
            </div>
          </div>
        </div>
      </a>
    </li>
  )
}
