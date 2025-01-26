import { Slide } from '~/types'

const ghPagesClient = {
  getAll: async (): Promise<Slide[]> => {
    const res = await fetch('https://koukibuu3.github.io/slides/', {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const json = await res.json()
    return json.map((slide: Slide) => ({
      title: slide.title,
      url: slide.url,
      mainImagePath: slide.mainImagePath,
    }))
  },
}

export default ghPagesClient
