export const profile = {
  name: 'Kouki Akasaka',
  role: 'Software Engineer / Scrum Master',
  intro: 'Webアプリケーションの設計・開発と、スクラムチームの支援。',
  summary:
    'バックエンド開発を起点に、Webアプリケーションの設計・開発と複数チームのスクラムマスターを担当。',
  focus: [
    {
      id: 'software-design',
      title: 'Software Design & Architecture',
      body: 'ドメインモデリングやソフトウェア設計を通じて、変更容易性・保守性を意識した開発に取り組む。',
    },
    {
      id: 'team-process',
      title: 'Team & Engineering Process',
      body: 'スクラムや開発プロセスの改善を通じて、チームが継続的に成果を生み出せる環境づくりに取り組む。',
    },
  ],
  links: [
    { name: 'GitHub', url: 'https://github.com/koukibuu3' },
    { name: 'Zenn', url: 'https://zenn.dev/koukibuu3' },
    { name: 'Qiita', url: 'https://qiita.com/koukibuu3' },
    { name: 'X', url: 'https://twitter.com/koukibuu3' },
  ],
}

type Assignment = {
  name: string
  period: string
  description: string
  stack: string
}
type Experience = {
  company: string
  period: string
  role: string
  description: string
  stack?: string
  assignments?: Assignment[]
}
export const experience: Experience[] = [
  {
    company: 'any株式会社',
    period: '2025年5月 – 現在',
    role: 'Software Engineer / Scrum Master · 正社員',
    description: '「Qast」の開発に携わり、複数チームのスクラムマスターを担当。',
  },
  {
    company: '株式会社HOKUTO',
    period: '2024年8月 – 2025年6月',
    role: 'Software Engineer · 副業・業務委託',
    description:
      '臨床支援アプリのWeb版・管理画面を改善。要件整理・仕様調整・開発を担当。',
    stack: 'TypeScript / React / Firebase',
  },
  {
    company: '株式会社アクティブ・ワーク',
    period: '2018年4月 – 2025年4月',
    role: 'Software Engineer · 正社員',
    description:
      'バックエンドを中心に、技術選定・設計・実装、チームリード・技術指導を担当。',
    assignments: [
      {
        name: '弁護士ドットコム株式会社',
        period: '2020年1月 – 2025年3月（複数プロジェクト）',
        description:
          '法律系ポータル・メディアの新規開発・リニューアル・保守。リードエンジニアとして要件調整・技術選定・設計・タスクアサイン・技術指導を担当。',
        stack: 'TypeScript / PHP / React / Next.js / AWS / Docker',
      },
      {
        name: '百貨店向けECサイトの開発',
        period: '2018年11月 – 2019年12月',
        description:
          '百貨店ECサイトの詳細設計・実装・テスト、外部パートナーとの仕様調整。',
        stack: 'JavaScript / Salesforce',
      },
    ],
  },
]
