import { Timestamps } from './Timestamps'

/**
 * 記事に付与されるタグの型
 */
export type Tag = {
  id: string
  name: string
} & Timestamps
