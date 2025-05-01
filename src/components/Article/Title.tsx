import { Tag } from '~/types'

type Props = {
  title: string
  tags?: Tag[]
}

export const Title: React.FC<Props> = ({ title, tags }) => {
  const techTag = tags?.find((tag) => tag.name === 'TECH')
  const poemTag = tags?.find((tag) => tag.name === 'POEM')

  return (
    <h2 className="text-xl font-bold text-black">
      {techTag && (
        <span className="bg-blue-500 text-white rounded-full text-sm px-2 py-1 mr-1">
          TECH
        </span>
      )}
      {poemTag && (
        <span className="bg-pink-400 text-white rounded-full text-sm px-2 py-1 mr-1">
          POEM
        </span>
      )}
      {title}
    </h2>
  )
}
