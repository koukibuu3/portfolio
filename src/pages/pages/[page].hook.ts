import type { GetStaticPaths, GetStaticProps } from 'next'

import { client } from '~/libs'
import { range } from '~/utils'

const PER_PAGE = 10

export const getStaticPaths: GetStaticPaths = async () => {
  const knowledgeList = await client.getAll()

  const paths = range(1, Math.ceil(knowledgeList.length / PER_PAGE)).map(
    (i) => `/pages/${i}`,
  )

  return { paths, fallback: false }
}

export const getStaticProps: GetStaticProps = async (context) => {
  const [knowledgeList, page] = await client.getAllWithPagination(
    (Number(context.params?.page) - 1) * PER_PAGE,
    PER_PAGE,
  )

  return {
    props: { knowledgeList, page },
  }
}
