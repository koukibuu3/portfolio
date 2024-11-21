import dayjs from 'dayjs'

import { zennClient, qiitaClient } from '~/libs'
import { Note, Page as PageType } from '~/types'
import { Page } from '~/valueObjects'

const PER_PAGE = 10

/** 記事を作成日の降順にソートする */
const sortNotes = (notes: Note[]): Note[] => {
  return notes.sort((a, b) =>
    dayjs(a.created_at).isAfter(b.created_at) ? -1 : 1,
  )
}

const client = {
  getAll: async (): Promise<Note[]> => {
    const qiitaNotes = await qiitaClient.getAll()
    const zennNotes = await zennClient.getAll()

    return sortNotes(qiitaNotes.concat(zennNotes))
  },
  getAllWithPagination: async (
    offset = 0,
    limit = 0,
  ): Promise<[Note[], PageType]> => {
    const qiitaNotes = await qiitaClient.getAll()
    const zennNotes = await zennClient.getAll()

    const sortedNotes = sortNotes(qiitaNotes.concat(zennNotes))
    const notes =
      limit === undefined
        ? sortedNotes.slice(offset)
        : sortedNotes.slice(offset, offset + limit)

    const page = new Page(offset, limit, sortedNotes.length).toObject()

    return [notes, page]
  },
}

export default client
