import React from 'react'

import { KnowledgeItem } from './KnowledgeItem'

import { Knowledge } from '~/types'

type Props = {
  knowledgeList: Knowledge[]
}

export const KnowledgeList: React.FC<Props> = ({ knowledgeList }) => {
  return (
    <section id="knowledge" className="mt-16 mx-4">
      <h1 className="text-2xl font-semibold">
        Knowledge<span className="text-sm pl-2">- 技術メモ</span>
      </h1>
      <ul className="grid grid-cols-2 gap-3 my-4 lg:mx-4">
        {knowledgeList.map((knowledge) => (
          <KnowledgeItem key={knowledge.id} knowledge={knowledge} />
        ))}
      </ul>
    </section>
  )
}
