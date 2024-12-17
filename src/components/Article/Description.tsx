import { IoIosArrowForward } from 'react-icons/io'

type Props = {
  description: string
}

/** 記事の説明文章の最大文字数 */
const MAX_DESCRIPTION_LENGTH = 65

export const Description: React.FC<Props> = ({ description }) => {
  return (
    <p className="text-sm">
      {trim(description)}
      <span className="flex items-center text-blue-500 float-right mr-2 gap-0.5">
        続きを読む
        <IoIosArrowForward />
      </span>
    </p>
  )
}

const trim = (description: string) => {
  return description.length > MAX_DESCRIPTION_LENGTH
    ? description.substring(0, MAX_DESCRIPTION_LENGTH) + '...'
    : description
}
