import React from 'react'

import { KnowledgeItem } from './KnowledgeItem'

import { Knowledge } from '~/types'

type Props = {
  knowledgeList: Knowledge[]
}

export const KnowledgeList: React.FC<Props> = ({ knowledgeList }) => {
  return (
    <section id="knowledge" className="mt-16">
      <ul className="grid grid-cols-2 gap-4 my-6 lg:mx-5">
        {knowledgeList.map((knowledge) => (
          <KnowledgeItem key={knowledge.id} knowledge={knowledge} />
        ))}
      </ul>
    </section>
  )
}
