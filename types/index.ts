export type Portfolio = {
  title: string
  detail: string
  mainImage: MainImage
  accounts: Account[]
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

export type Article = {
  id: string
  title: string
  body: string
  url: string
  type: 'qiita' | 'zenn'
  created_at: string
  updated_at: string
}
