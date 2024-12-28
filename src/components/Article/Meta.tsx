import dayjs from 'dayjs'

import { TagList } from '~/components/Tag/TagList'
import { Tag as TagType } from '~/types/Tag'

type Props = {
  tags?: TagType[]
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
