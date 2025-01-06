import { useState } from 'react'

import { Article } from '~/types'

const PER_PAGE = 6

export const useArticle = (defaultArticles: Article[]) => {
  const [articles, setArticles] = useState<Article[]>(defaultArticles)
  const [hasMore, setHasMore] = useState(defaultArticles.length === PER_PAGE)

  const fetchMore = async () => {
    const res = await fetch(
      `/api/articles?${new URLSearchParams({
        page: (articles.length / PER_PAGE).toString(),
        perPage: PER_PAGE.toString(),
      })}`,
    )
    const newArticles = (await res.json()) as Article[]

    setHasMore(newArticles.length === PER_PAGE)
    setArticles([...articles, ...newArticles])
  }

  return { articles, fetchMore, hasMore }
}
