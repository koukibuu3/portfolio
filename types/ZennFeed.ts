import { ZennItem } from './ZennItem'

export type ZennFeed = {
  title: string
  description: string
  link: string
  image: {
    link: string
    url: string
    title: string
  }
  generator: 'zenn.dev'
  lastBuildDate: string
  language: string
  feedUrl: string
  paginationLinks: {
    self: string
  }
  items: ZennItem[]
}
