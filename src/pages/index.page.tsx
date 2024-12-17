import type { NextPage } from 'next'

import { CustomHead, Pagination } from '~/components'
import { About } from '~/components/About'
import { ArticleList } from '~/components/Article/ArticleList'
import { Copyright } from '~/components/Copyright/Copyright'
import { GlobalNavigation } from '~/components/GlobalNavigation'
import { KnowledgeList } from '~/components/Knowledge/KnowledgeList'
import { Section, SectionTitle } from '~/components/Section'
import { getStaticProps } from '~/pages/index.hook'
import { Knowledge, Page, Profile } from '~/types'

type Props = {
  knowledgeList: Knowledge[]
  page: Page
  environment: string
}

const IndexPage: NextPage<Props> = ({ knowledgeList, page, environment }) => {
  const articles =
    environment !== 'production'
      ? [
          {
            id: '1',
            title: 'とってもかわいいまめちゃんの記事です',
            description:
              'まめちゃんはとってもかわいいです。何が可愛いかというととにかくかわいいんです。かわいいったら可愛いんです。だから、かわいいって言ってんでしょうが。かわいいというのですはね、',
            tags: [
              { id: '1', name: '猫' },
              { id: '2', name: '天使' },
            ],
            mainImageUrl: '/img/sample-thumbnail.jpg',
            publishedAt: '2024-12-14',
          },
          {
            id: '2',
            title: 'とってもかわいいまめちゃんの記事です',
            description:
              'まめちゃんはとってもかわいいです。何が可愛いかというととにかくかわいいんです。かわいいったら可愛いんです。だから、かわいいというのですはね、なんだっけかな、えーっと',
            tags: [],
            mainImageUrl: '/img/sample-thumbnail.jpg',
            publishedAt: '2024-12-14',
          },
          {
            id: '3',
            title: 'とってもかわいいまめちゃんの記事です',
            description:
              'まめちゃんはとってもかわいいです。何が可愛いかというととにかくかわいいんです。かわいいったら可愛いんです。だから、かわいいというのですはね、つまるところ、かわいいんです。',
            tags: [
              { id: '1', name: '猫' },
              { id: '2', name: '天使' },
            ],
            mainImageUrl: '/img/sample-thumbnail.jpg',
            publishedAt: '2024-12-14',
          },
        ]
      : []

  const profile: Profile = {
    name: 'Kouki Akasaka',
    id: 'koukibuu3',
    description: '都内在住Webエンジニア',
    imageUrl: '/img/logo.svg',
    links: [
      { name: 'GitHub', url: 'https://github.com/koukibuu3' },
      { name: 'Twitter', url: 'https://x.com/koukibuu3' },
      { name: 'Qiita', url: 'https://qiita.com/koukibuu3' },
      { name: 'Zenn', url: 'https://zenn.dev/koukibuu3' },
      { name: 'Lapras', url: 'https://lapras.com/public/koukibuu3' },
      { name: 'YOUTRUST', url: 'https://youtrust.jp/users/koukibuu3' },
    ],
  }

  return (
    <>
      <CustomHead />

      <div className="text-gray-600 mx-auto">
        <GlobalNavigation />

        <Section id="article">
          <SectionTitle title="Article" subTitle="記事" />
          <ArticleList articles={articles} />
        </Section>

        <Section id="knowledge">
          <SectionTitle title="Knowledge" subTitle="技術メモ" />
          <KnowledgeList knowledgeList={knowledgeList} />
          <Pagination page={page} />
        </Section>

        <Section id="about">
          <SectionTitle title="About" subTitle="プロフィール" />
          <About profile={profile} />
        </Section>
      </div>

      <Copyright />
    </>
  )
}

export default IndexPage

export { getStaticProps }
