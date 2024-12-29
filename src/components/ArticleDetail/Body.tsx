import styles from './Body.module.css'

import { Article } from '~/types'

type Props = {
  article: Article
}

export const Body = ({ article }: Props) => {
  return (
    <article
      className={`${styles.article} mt-16 mx-4 text-gray-700 prose`}
      dangerouslySetInnerHTML={{ __html: article.body }}
    />
  )
}
