import React from 'react'

import { NoteItem } from './NoteItem'

import { Note } from '~/types'

type Props = {
  notes: Note[]
}

export const NoteList: React.FC<Props> = ({ notes }) => {
  return (
    <section id="notes" className="mt-16">
      <ul className="grid grid-cols-2 gap-4 my-6 lg:mx-5">
        {notes.map((note) => (
          <NoteItem key={note.id} note={note} />
        ))}
      </ul>
    </section>
  )
}
