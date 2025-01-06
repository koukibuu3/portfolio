type Props = {
  title: string
}

export const Title: React.FC<Props> = ({ title }) => {
  return <h2 className="text-xl font-bold">{title}</h2>
}
