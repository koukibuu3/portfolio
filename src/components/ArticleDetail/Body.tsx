import styles from './Body.module.css'

import { Article } from '~/types'

type Props = {
  article: Article
}

export const Body = ({ article }: Props) => {
  return (
    <article
      className={`${styles.article} mt-16 text-gray-700 prose mx-4 md:mx-auto max-w-screen-md`}
      dangerouslySetInnerHTML={{ __html: article.body }}
    />
  )
}
