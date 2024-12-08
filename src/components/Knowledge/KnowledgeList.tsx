import React from 'react'

import { KnowledgeItem } from './KnowledgeItem'

import { Knowledge } from '~/types'

type Props = {
  knowledgeList: Knowledge[]
}

export const KnowledgeList: React.FC<Props> = ({ knowledgeList }) => {
  return (
    <ul className="grid grid-cols-2 gap-3 m-4">
      {knowledgeList.map((knowledge) => (
        <KnowledgeItem key={knowledge.id} knowledge={knowledge} />
      ))}
    </ul>
  )
}
