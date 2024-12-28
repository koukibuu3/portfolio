import { FaTag } from 'react-icons/fa6'

import { Tag } from '~/types'

type Props = {
  tag: Tag
}

export const TagItem: React.FC<Props> = ({ tag }) => {
  return (
    <span className="flex flex-row items-center text-sm">
      <FaTag />
      {tag.name}
    </span>
  )
}
