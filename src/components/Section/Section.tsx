type Props = {
  id: string
  children: React.ReactNode
}

/**
 * セクション
 */
export const Section: React.FC<Props> = ({ id, children }) => {
  return (
    <section id={id} className="mt-16 md:mx-8">
      {children}
    </section>
  )
}
