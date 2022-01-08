import { Account, Skill } from '.'

type Portfolio = {
  title: string
  detail: string
  mainImage: {
    url: string
    height: number
    width: number
  }
  accounts: Account[]
  skills: Skill[]
}

export default Portfolio
