type Props = {
  title: string
}

export const Title: React.FC<Props> = ({ title }) => {
  return (
    <h2 className="text-xl font-bold text-black">
      <span className="bg-blue-500 text-white rounded-full text-sm px-2 py-1 mr-1">
        TECH
      </span>
      {title}
    </h2>
  )
}
