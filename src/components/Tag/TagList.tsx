import { TagItem } from './TagItem'

import { Tag } from '~/types'

type Props = {
  tags?: Tag[]
}

export const TagList: React.FC<Props> = ({ tags }) => {
  if (!tags) {
    return null
  }

  return (
    <ul className="flex flex-row gap-1">
      {tags?.map((tag) => (
        <li key={tag.id}>
          <TagItem tag={tag} />
        </li>
      ))}
    </ul>
  )
}
