import dayjs from 'dayjs'

import { knowledgeClientInterface } from '~/modules/libs/knowledgeClientInterface'
import { Page } from '~/modules/valueObjects'
import { Knowledge } from '~/types'
import { Page as PageType } from '~/types'

export class KnowledgeRepository {
  private clients: Array<knowledgeClientInterface>

  constructor(clients: Array<knowledgeClientInterface>) {
    this.clients = clients
  }

  async getAll(): Promise<Knowledge[]> {
    const knowledges = await Promise.all(
      this.clients.map((client) => client.getAll()),
    )
    return this.sortKnowledges(knowledges.flat())
  }

  async getWithPagination(
    page: number,
    perPage: number,
  ): Promise<[Knowledge[], PageType]> {
    const knowledges = await this.getAll()
    return [
      knowledges.slice((page - 1) * perPage, page * perPage),
      new Page((page - 1) * perPage, perPage, knowledges.length).toObject(),
    ]
  }

  /** 記事を作成日の降順にソートする */
  private sortKnowledges(knowledgeList: Knowledge[]): Knowledge[] {
    return knowledgeList.sort((a, b) =>
      dayjs(a.created_at).isAfter(b.created_at) ? -1 : 1,
    )
  }
}
