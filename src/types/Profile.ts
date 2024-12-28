import { Timestamps } from './Timestamps'

export type Profile = {
  name: string
  handleName: string
  body: string
  mainImage: {
    url: string
    width: number
    height: number
  }
  links: {
    fieldId: string
    name: string
    url: string
  }[]
} & Timestamps
