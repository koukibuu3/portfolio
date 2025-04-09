type Props = {
  title: string
}

export const Title: React.FC<Props> = ({ title }) => {
  return <h2 className="text-xl font-bold text-black">{title}</h2>
}
