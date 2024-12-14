import { FaTag } from 'react-icons/fa6'

import { ArticleTag } from '~/types'

type Props = {
  tag: ArticleTag
}

export const TagItem: React.FC<Props> = ({ tag }) => {
  return (
    <span className="flex flex-row items-center text-sm">
      <FaTag />
      {tag.name}
    </span>
  )
}
