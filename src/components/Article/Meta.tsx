import dayjs from 'dayjs'

import { TagList } from '~/components/Tag/TagList'
import { ArticleTag as ArticleTagType } from '~/types/ArticleTag'

type Props = {
  tags?: ArticleTagType[]
  publishedAt: string
}

export const Meta: React.FC<Props> = ({ tags, publishedAt }) => {
  return (
    <div className="flex flex-row justify-between mr-2">
      <TagList tags={tags} />
      <time className="text-sm">{dayjs(publishedAt).format('YYYY/MM/DD')}</time>
    </div>
  )
}
