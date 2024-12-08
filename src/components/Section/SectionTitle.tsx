type Props = {
  title: string
  subTitle: string
}

/**
 * セクションタイトル
 */
export const SectionTitle: React.FC<Props> = ({ title, subTitle }) => {
  return (
    <h1 className="text-2xl font-semibold mx-4">
      {title}
      <span className="text-sm pl-2">- {subTitle}</span>
    </h1>
  )
}
