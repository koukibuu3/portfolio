import { TagItem } from './TagItem'

import { Tag } from '~/types'

type Props = {
  tags?: Tag[]
}

export const TagList: React.FC<Props> = ({ tags }) => {
  if (!tags) {
    return null
  }

  // カテゴリ分けのためのタグは除く
  const filteredTags = tags.filter(
    (tag) => tag.name !== 'TECH' && tag.name !== 'POEM',
  )

  return (
    <ul className="flex flex-row gap-1">
      {filteredTags?.map((tag) => (
        <li key={tag.id}>
          <TagItem tag={tag} />
        </li>
      ))}
    </ul>
  )
}
