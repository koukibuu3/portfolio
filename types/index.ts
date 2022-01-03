export type Portfolio = {
  title: string
  detail: string
  mainImage: MainImage
  skills: Skill[]
}

export type MainImage = {
  url: string
  height: number
  width: number
}

export type Skill = {
  name: string
  value: number
}

export type Account = {
  type: [string]
  url: string
}
