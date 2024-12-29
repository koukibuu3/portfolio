import dayjs from 'dayjs'

import { zennClient, qiitaClient } from '~/libs'
import { Knowledge, Page as PageType } from '~/types'
import { Page } from '~/valueObjects'

const PER_PAGE = 9

/** 記事を作成日の降順にソートする */
const sortKnowledges = (knowledgeList: Knowledge[]): Knowledge[] => {
  return knowledgeList.sort((a, b) =>
    dayjs(a.created_at).isAfter(b.created_at) ? -1 : 1,
  )
}

const client = {
  getAll: async (): Promise<Knowledge[]> => {
    const qiitaKnowledges = await qiitaClient.getAll()
    const zennKnowledges = await zennClient.getAll()

    return sortKnowledges(qiitaKnowledges.concat(zennKnowledges))
  },
  getAllWithPagination: async (
    offset = 0,
    limit = 0,
  ): Promise<[Knowledge[], PageType]> => {
    const qiitaKnowledges = await qiitaClient.getAll()
    const zennKnowledges = await zennClient.getAll()

    const sortedKnowledges = sortKnowledges(
      qiitaKnowledges.concat(zennKnowledges),
    )
    const knowledgeList =
      limit === undefined
        ? sortedKnowledges.slice(offset)
        : sortedKnowledges.slice(offset, offset + limit)

    const page = new Page(offset, limit, sortedKnowledges.length).toObject()

    return [knowledgeList, page]
  },
}

export default client
