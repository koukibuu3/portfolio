type Props = {
  description: string
}

/** 記事の説明文章の最大文字数 */
const MAX_DESCRIPTION_LENGTH = 70

export const Description: React.FC<Props> = ({ description }) => {
  return <p className="text-sm">{trim(description)}</p>
}

const trim = (description: string) => {
  return description.length > MAX_DESCRIPTION_LENGTH
    ? description.substring(0, MAX_DESCRIPTION_LENGTH) + '...'
    : description
}
