import type { GetStaticProps } from 'next'

import { client } from '~/libs'

const PER_PAGE = 10

export const getStaticProps: GetStaticProps = async () => {
  const [notes, page] = await client.getAllWithPagination(0, PER_PAGE)

  return {
    props: { notes, page },
  }
}
