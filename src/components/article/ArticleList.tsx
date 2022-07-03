import React from 'react'

import { ArticleItem } from '~/components/article'
import { Article } from '~/types'

type Props = {
  articles: Article[]
}

const ArticleList: React.FC<Props> = ({ articles }) => {
  return (
    <section id="articles" className="mt-16">
      <ul className="grid grid-cols-2 gap-4 my-6 lg:mx-5">
        {articles.map((article) => (
          <ArticleItem key={article.id} article={article} />
        ))}
      </ul>
    </section>
  )
}

export default ArticleList
