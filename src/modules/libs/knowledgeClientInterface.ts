import { Knowledge } from '~/types'

export interface knowledgeClientInterface {
  getAll: () => Promise<Knowledge[]>
}
