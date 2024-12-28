import { ArticleItem } from './ArticleItem'

import { MoreLink } from '~/components/MoreLink'
import { Article } from '~/types'

type Props = {
  articles: Article[]
  fetchMore: () => void
  hasMore: boolean
}

export const ArticleList: React.FC<Props> = ({
  articles,
  fetchMore,
  hasMore,
}) => {
  if (articles.length === 0) {
    return <p className="text-sm mt-6 mx-auto w-32">記事がありません</p>
  }

  return (
    <ul className="grid grid-cols-2 gap-10 m-4">
      {articles.map((article) => (
        <ArticleItem key={article.id} article={article} />
      ))}
      <MoreLink action={fetchMore} disabled={!hasMore} />
    </ul>
  )
}
