export type Project = {
  slug: string
  name: string
  summary: string
  image: { src: string; width: number; height: number; variant: string }
  roles?: string[]
  stack?: string[]
  background?: string
  highlights?: string[]
  links?: { label: string; url: string }[]
}

export const projects: Project[] = [
  {
    slug: 'scrum-workbench',
    name: 'ScrumWorkbench',
    summary: 'スクラムイベントの準備・進行支援',
    image: {
      src: '/projects/scrum-workbench.svg',
      width: 2700,
      height: 650,
      variant: 'scrum',
    },
  },
  {
    slug: 'salestack',
    name: 'Salestack',
    summary: '売上管理Webアプリケーション',
    image: {
      src: '/projects/salestack.svg',
      width: 460,
      height: 320,
      variant: 'illustration',
    },
  },
  {
    slug: 'gg-garage',
    name: 'G.G. Garage',
    summary: '共同ゲーム開発',
    image: {
      src: '/projects/gg-garage-detail.png',
      width: 448,
      height: 280,
      variant: 'detail',
    },
  },
  {
    slug: 'core-uma',
    name: 'Core Uma',
    summary: '食品・飲料の口コミサービス',
    image: {
      src: '/projects/core-uma.png',
      width: 1774,
      height: 470,
      variant: 'core',
    },
  },
]
