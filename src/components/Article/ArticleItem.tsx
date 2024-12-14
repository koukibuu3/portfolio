import { Description } from './Description'
import { Meta } from './Meta'
import { Thumbnail } from './Thumbnail'
import { Title } from './Title'

import type { Article } from '~/types'

type Props = {
  article: Article
}

export const ArticleItem: React.FC<Props> = ({ article }) => {
  return (
    <li key={article.id} className="col-span-2 sm:col-span-1">
      <a href={`/article/${article.id}`} className="flex flex-col gap-2 w-full">
        <Thumbnail url={article.mainImageUrl} alt={article.title} />
        <Title title={article.title} />
        <Meta tags={article.tags} publishedAt={article.publishedAt} />
        <Description description={article.description} />
      </a>
    </li>
  )
}
